// The official UPSC Medical Science syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I has items 1-7 (Human Anatomy ... Forensic Medicine and Toxicology) and Paper II has items 1-6
// (General Medicine ... Community Medicine), so the ids are I-1 ... I-7 and II-1 ... II-6.
// Source text: ../../syllabus/official-2026/medical-science.txt (the file holds Medical Science only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own heading, then the topic list).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/medical-science.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*MEDICAL SCIENCE\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|HISTORY|MANAGEMENT|MATHEMATICS|LAW\b/.test(raw)) throw new Error("medical science syllabus file must hold Medical Science only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const SHORT = {
  1: ["Human Anatomy", "Human Physiology", "Biochemistry", "Pathology", "Microbiology", "Pharmacology", "Forensic Medicine and Toxicology"],
  2: ["General Medicine", "Paediatrics", "Dermatology", "General Surgery", "Obstetrics and Gynaecology including Family Planning", "Community Medicine (Preventive and Social Medicine)"]
};
const N = {1: 7, 2: 6};
const p1 = lines.findIndex(function(l){ return /^\s*PAPER\s*I\s*$/.test(l); }), p2 = lines.findIndex(function(l){ return /^\s*PAPER[\s-]*II\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("medical science syllabus: paper headings not found");
const items = [];
[[1, p1, p2], [2, p2, lines.length]].forEach(function(sec){
  const pp = sec[0], got = [];
  lines.slice(sec[1] + 1, sec[2]).forEach(function(l){
    const top = /^\s*(\d)\.\s*([A-Z][A-Za-z ,()\/&-]*?)\s*:?\s*$/.exec(l);
    if(top && +top[1] === got.length + 1){ got.push(top[2]); return; }
    if(got.length && l.trim()) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== N[pp]) throw new Error("medical science syllabus: Paper " + pp + " has " + got.length + " items, expected " + N[pp]);
  got.forEach(function(txt, k){ items.push({id:(pp === 1 ? "I-" : "II-") + (k + 1), pp:pp, t:SHORT[pp][k], full:txt.replace(/\s+/g, " ").trim()}); });
});
if(items.length !== 13) throw new Error("medical science syllabus items: " + items.length + " (expected 13)");
module.exports.items = items;
