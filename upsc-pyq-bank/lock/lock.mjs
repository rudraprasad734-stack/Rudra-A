// Turns the full app page (index.src.html, with all the question-bank data inside) into:
//   <out>/index.html        the app with the data taken out and a start-up gate added
//   <out>/data/<id>.<hash>.bin   each data block: gzip, then AES-256-GCM (file = 12-byte IV + ciphertext + tag)
// usage: node lock.mjs <source.html> <outDir> <contentMasterHex> [keyVersion]
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const [src, out, master, kvArg] = process.argv.slice(2);
if (!src || !out || !/^[0-9a-f]{64}$/i.test(master || "")) { console.error("usage: node lock.mjs <source.html> <outDir> <64-hex master key> [keyVersion]"); process.exit(1); }
const kv = parseInt(kvArg, 10) || 1;
const here = path.dirname(fileURLToPath(import.meta.url));

// same derivation as the server (cloudflare/src/content.js)
const key = Buffer.from(crypto.hkdfSync("sha256", Buffer.from(master, "hex"), Buffer.alloc(32), "cse-content-v" + kv, 32));

let html = fs.readFileSync(src, "utf8");
const man = {}, files = {};
html = html.replace(/<script type="application\/json" id="(d-[\w-]+)">([\s\S]*?)<\/script>\n?/g, (_, id, body) => {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([iv, c.update(zlib.gzipSync(Buffer.from(body, "utf8"), { level: 9 })), c.final(), c.getAuthTag()]);
  const h = crypto.createHash("sha256").update(enc).digest("hex").slice(0, 10);
  man[id] = id + "." + h + ".bin"; files[man[id]] = enc;
  return "";
});
if (!Object.keys(man).length) throw new Error("no data blocks found");

// settings the gate shares with the app
const grab = (re, what) => { const m = re.exec(html); if (!m) throw new Error("could not find " + what); return m[1]; };
const api = grab(/var API_BASE = "([^"]+)"/, "API_BASE");
const fbBlock = grab(/var FIREBASE_CONFIG = window\.__FIREBASE_CONFIG__ \|\| (\{[\s\S]*?\});/, "FIREBASE_CONFIG");
const fb = Function("return (" + fbBlock + ")")();
const ver = grab(/var FB_VER = "([^"]+)"/, "FB_VER");

// the app scripts wait until the gate has unlocked the data
let n = 0;
html = html.replace(/<script>([\s\S]*?)<\/script>/g, (all, body) => {
  const head = body.trim().slice(0, 140);
  if (head.startsWith("// Safety net. If the app never starts")) return all;                                  // repair script: runs at once
  if (head.startsWith("(function(){\n  var s = document.getElementById(\"splash\")")) return all;            // splash screen: runs at once
  n++; return '<script type="text/x-cse">' + body + "</script>";
});
if (n !== 3) throw new Error("expected exactly 3 app scripts (start-up helpers, the app, the offline cache setup), found " + n);

// the repair script must not fire while the person is on the sign-in screen
const patches = [
  ['if(!window.__cseLoaded) repair(false); }, 2000)', 'if(!window.__cseLoaded && !window.__cseGate) repair(false); }, 2000)'],
  ['setTimeout(function(){ if(!window.__cseReadyAt) repair(false); }, 12000)', 'setTimeout(function(){ if(!window.__cseReadyAt && !window.__cseGate) repair(false); }, 12000)'],
  ['setTimeout(function(){ if(!window.__cseReadyAt) repair(false); }, 40000);', 'setTimeout(function(){ if(!window.__cseReadyAt && !window.__cseGate) repair(false); }, 40000);']
];
for (const [a, b] of patches) { if (!html.includes(a)) throw new Error("repair script changed, update lock.mjs: " + a); html = html.replace(a, b); }

const boot = fs.readFileSync(path.join(here, "boot.js"), "utf8").replace("__CFG__", JSON.stringify({ api, fb, ver, man, kv }));
if (!html.includes("</body>")) throw new Error("no </body>");
html = html.replace(/<\/body>/, () => "<script>\n" + boot + "\n</script>\n</body>");

// the daily, quiz and Crux files are locked the same way (same names, .bin instead of .json)
const root = path.dirname(src); let nContent = 0;
const seal = (text) => { const iv = crypto.randomBytes(12); const c = crypto.createCipheriv("aes-256-gcm", key, iv); return Buffer.concat([iv, c.update(zlib.gzipSync(Buffer.from(text, "utf8"), { level: 9 })), c.final(), c.getAuthTag()]); };
for (const d of ["daily", "quiz", "crux"]) {
  if (!fs.existsSync(path.join(root, d))) continue;
  fs.mkdirSync(path.join(out, d), { recursive: true });
  for (const f of fs.readdirSync(path.join(out, d))) if (/\.(json|bin)$/.test(f)) fs.unlinkSync(path.join(out, d, f));
  for (const f of fs.readdirSync(path.join(root, d))) {
    if (!f.endsWith(".json")) continue;
    fs.writeFileSync(path.join(out, d, f.replace(/\.json$/, ".bin")), seal(fs.readFileSync(path.join(root, d, f), "utf8"))); nContent++;
  }
}
// the offline cache list names the locked files
const swSrc = path.join(root, "sw.js");
if (fs.existsSync(swSrc)) fs.writeFileSync(path.join(out, "sw.js"), fs.readFileSync(swSrc, "utf8").replace(/"\.\/(quiz|crux|daily)\/([^"\/]+)\.json"/g, '"./$1/$2.bin"'));
fs.mkdirSync(path.join(out, "data"), { recursive: true });
for (const f of fs.readdirSync(path.join(out, "data"))) if (f.endsWith(".bin")) fs.unlinkSync(path.join(out, "data", f));
for (const [f, buf] of Object.entries(files)) fs.writeFileSync(path.join(out, "data", f), buf);
fs.writeFileSync(path.join(out, "index.html"), html);
const total = Object.values(files).reduce((s, b) => s + b.length, 0);
console.log("locked " + Object.keys(man).length + " data blocks and " + nContent + " daily/quiz/crux files: " + (total / 1e6).toFixed(2) + " MB encrypted; page " + (html.length / 1e6).toFixed(2) + " MB (was " + (fs.statSync(src).size / 1e6).toFixed(2) + " MB)");
