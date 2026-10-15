// The official UPSC Management syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I has items 1-6 (Managerial function and process ... Marketing management) and Paper II has items 1-6
// (Quantitative techniques ... International business), so the ids are I-1 ... I-6 and II-1 ... II-6.
// Source text: ../../syllabus/official-2026/management.txt (the file holds Management only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own heading, then the topic list).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/management.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*MANAGEMENT\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|HISTORY|LAW\b/.test(raw)) throw new Error("management syllabus file must hold Management only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const SHORT = {
  1: ["Managerial function and process", "Organisational behaviour and design", "Human resource management", "Accounting for managers", "Financial management", "Marketing management"],
  2: ["Quantitative techniques in decision-making", "Production and operations management", "Management information system", "Government business interface", "Strategic cost management", "International business"]
};
const p2 = lines.findIndex(function(l){ return /^\s*PAPER-II\s*$/.test(l); });
if(p2 < 0) throw new Error("management syllabus: Paper II heading not found");
const items = [];
[[1, lines.findIndex(function(l){ return /^\s*PAPER I\s*$/.test(l); }), p2], [2, p2, lines.length]].forEach(function(sec){
  const pp = sec[0], a = sec[1], b = sec[2], got = [];
  if(a < 0) throw new Error("management syllabus: Paper " + pp + " heading not found");
  lines.slice(a + 1, b).forEach(function(l){
    const m = /^\s*(\d)\.\s+(.*)$/.exec(l);
    if(m && +m[1] === got.length + 1) got.push(m[2]); else if(got.length && l.trim()) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== 6) throw new Error("management syllabus: Paper " + pp + " has " + got.length + " items, expected 6");
  got.forEach(function(txt, k){ items.push({id:(pp === 1 ? "I-" : "II-") + (k + 1), pp:pp, t:SHORT[pp][k], full:txt.replace(/\s+/g, " ").trim()}); });
});
if(items.length !== 12) throw new Error("management syllabus items: " + items.length + " (expected 12)");
module.exports.items = items;
