// The official UPSC Public Administration syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I (Administration Theory) has items 1-12 and Paper II (Indian Administration) has items 1-14.
// The ids are I-1 ... I-12 and II-1 ... II-14.
// Source text: ../../syllabus/official-2026/public-administration.txt (the file holds Public Administration only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own words, typing slips of the printed notice corrected).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/public-administration.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*PUBLIC ADMINISTRATION\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|MANAGEMENT|MATHEMATICS|SOCIOLOGY|PHILOSOPHY|PSYCHOLOGY/.test(raw.replace(/Management aid|Financial Management|development management|Management\b/g, ""))) throw new Error("public administration syllabus file must hold Public Administration only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const p1 = lines.findIndex(function(l){ return /^\s*PAPER-I\s*$/.test(l); }), p2 = lines.findIndex(function(l){ return /^\s*PAPER-II\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("public administration syllabus: paper headings not found");
const SHORT = {
  "I-1": "Introduction: Wilson, New Public Administration, Good Governance, NPM", "I-2": "Administrative thought", "I-3": "Administrative behaviour", "I-4": "Organisations: structure and forms",
  "I-5": "Accountability and control", "I-6": "Administrative law", "I-7": "Comparative public administration", "I-8": "Development dynamics", "I-9": "Personnel administration",
  "I-10": "Public policy", "I-11": "Techniques of administrative improvement", "I-12": "Financial administration",
  "II-1": "Evolution of Indian administration", "II-2": "Philosophical and constitutional framework of government", "II-3": "Public sector undertakings", "II-4": "Union government and administration",
  "II-5": "Plans and priorities", "II-6": "State government and administration", "II-7": "District administration since Independence", "II-8": "Civil services",
  "II-9": "Financial management", "II-10": "Administrative reforms since Independence", "II-11": "Rural development", "II-12": "Urban local government",
  "II-13": "Law and order administration", "II-14": "Significant issues in Indian administration"
};
// the official file prints the item heading on one line and its text on the lines below it
const FIX = function(s){ return s.replace(/\s+/g, " ").replace(/Adminstrative/, "Administrative").replace(/Modem\b/, "Modern").replace(/\s+\./g, ".").replace(/\.\s*\.$/, ".").replace(/Public Administration, Wilson’s/, "Public Administration, Wilson’s").trim(); };
function read(from, to, prefix, n){
  const got = [];
  lines.slice(from, to).forEach(function(l){
    const m = /^\s*(\d{1,2})\.\s*(\S.*)$/.exec(l);
    if(m && +m[1] === got.length + 1){ got.push(m[2]); return; }
    if(got.length && l.trim() && !/^\s*(PAPER|Administration Theory|Indian Administration\s*$)/.test(l)) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== n) throw new Error("public administration syllabus " + prefix + ": " + got.length + " items, expected " + n);
  return got.map(function(txt, k){ return {id:prefix + (k + 1), txt:FIX(txt)}; });
}
const items = [];
read(p1 + 1, p2, "I-", 12).forEach(function(x){ items.push({id:x.id, pp:1, t:SHORT[x.id], full:x.txt}); });
read(p2 + 1, lines.length, "II-", 14).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:x.txt}); });
items.forEach(function(it){ if(!it.t) throw new Error("public administration: no short heading for " + it.id); });
if(items.length !== 26) throw new Error("public administration syllabus items: " + items.length + " (expected 26)");
module.exports.items = items;
