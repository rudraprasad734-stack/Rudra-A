#!/usr/bin/env node
// Precomputes the "how often was this chapter asked" counts (the tier cache) and ships them inside page/index.html
// as <script type="application/json" id="d-tiercache">, so a brand-new install does not spend seconds computing them.
//
// Run whenever the question bank or syllabus data in index.html changes:
//     node tools/perf/build-tiercache.js           (needs Playwright + Chromium)
// If the data changes and this is NOT re-run, the app still works: the stored fingerprint no longer matches, so the app
// falls back to computing the counts itself (slower first launch only).
const fs = require("fs"), path = require("path");
let chromium; try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright")); }
const FILE = path.resolve(__dirname, "../../page/index.html");
(async () => {
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const ctx = await b.newContext(); await ctx.addInitScript('localStorage.setItem("dossier.guides.off","1")');
  const p = await ctx.newPage();
  // load a copy without any shipped seed so the page computes the counts itself
  let html = fs.readFileSync(FILE, "utf8");
  html = html.replace(/<script type="application\/json" id="d-tiercache">[\s\S]*?<\/script>\n?/, "").replace(/<script type="application\/json" id="d-tdcache">[\s\S]*?<\/script>\n?/, "");
  const tmp = path.join(path.dirname(FILE), ".tiercache-build.html"); fs.writeFileSync(tmp, html);
  try {
    await p.goto("file://" + tmp);
    await p.waitForFunction(() => !!localStorage.getItem("dossier.tierCache.v1"), null, { timeout: 120000 });
    const tc = await p.evaluate(() => localStorage.getItem("dossier.tierCache.v1"));
    const obj = JSON.parse(tc); if (!obj.fp || !obj.c) throw new Error("unexpected cache shape");
    // the Today's-plan table (tier and Pre/Mains counts for every chapter), so the timer dropdown needs no live counting
    const td = await p.evaluate(() => window.__tdBuild());
    const block = '<script type="application/json" id="d-tiercache">' + JSON.stringify(obj) + "</script>\n" +
      '<script type="application/json" id="d-tdcache">' + JSON.stringify(td) + "</script>\n";
    let out = fs.readFileSync(FILE, "utf8").replace(/<script type="application\/json" id="d-tiercache">[\s\S]*?<\/script>\n?/, "").replace(/<script type="application\/json" id="d-tdcache">[\s\S]*?<\/script>\n?/, "");
    if (!out.includes('<script type="application/json" id="d-extra">')) throw new Error("anchor d-extra not found");
    out = out.replace('<script type="application/json" id="d-extra">', block + '<script type="application/json" id="d-extra">');
    fs.writeFileSync(FILE, out);
    console.log("tier cache written:", Object.keys(obj.c).length, "chapters,", tc.length, "bytes, fp =", obj.fp);
    console.log("Today's-plan table written:", Object.keys(td.c).length, "chapters,", JSON.stringify(td).length, "bytes");
  } finally { try { fs.unlinkSync(tmp); } catch (e) {} await b.close(); }
})().catch(e => { console.error(e); process.exit(1); });
