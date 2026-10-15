// The official UPSC Mathematics syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I has items (1)-(6) (Linear algebra ... Vector analysis) and Paper II has items (1)-(7)
// (Algebra ... Mechanics and fluid dynamics), so the ids are I-1 ... I-6 and II-1 ... II-7.
// Source text: ../../syllabus/official-2026/mathematics.txt (the file holds Mathematics only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own heading, then the topic list).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/mathematics.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*MATHEMATICS\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|HISTORY|MANAGEMENT/.test(raw)) throw new Error("mathematics syllabus file must hold Mathematics only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const SHORT = {
  1: ["Linear algebra", "Calculus", "Analytic geometry", "Ordinary differential equations", "Dynamics and statics", "Vector analysis"],
  2: ["Algebra", "Real analysis", "Complex analysis", "Linear programming", "Partial differential equations", "Numerical analysis and computer programming", "Mechanics and fluid dynamics"]
};
const N = {1: 6, 2: 7};
const p2 = lines.findIndex(function(l){ return /^\s*PAPER II\s*$/.test(l); }), p1 = lines.findIndex(function(l){ return /^\s*PAPER I\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("mathematics syllabus: paper headings not found");
const items = [];
[[1, p1, p2], [2, p2, lines.length]].forEach(function(sec){
  const pp = sec[0], got = [];
  lines.slice(sec[1] + 1, sec[2]).forEach(function(l){
    const m = /^\s*\((\d)\)\s+(.*)$/.exec(l);
    if(m && +m[1] === got.length + 1) got.push(m[2]); else if(got.length && l.trim()) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== N[pp]) throw new Error("mathematics syllabus: Paper " + pp + " has " + got.length + " items, expected " + N[pp]);
  got.forEach(function(txt, k){ items.push({id:(pp === 1 ? "I-" : "II-") + (k + 1), pp:pp, t:SHORT[pp][k], full:txt.replace(/\s+/g, " ").trim()}); });
});
if(items.length !== 13) throw new Error("mathematics syllabus items: " + items.length + " (expected 13)");
module.exports.items = items;
