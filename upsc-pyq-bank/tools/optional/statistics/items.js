// The official UPSC Statistics syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I has items 1-4 (Probability; Statistical Inference; Linear Inference and Multivariate Analysis;
// Sampling Theory and Design of Experiments) and Paper II has items 1-4 (Industrial Statistics; Optimization Techniques;
// Quantitative Economics and Official Statistics; Demography and Psychometry). The ids are I-1 ... I-4 and II-1 ... II-4.
// Source text: ../../syllabus/official-2026/statistics.txt (the file holds Statistics only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own words, typing slips of the printed notice corrected).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/statistics.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*STATISTICS\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS\b(?! and Official)|MATHEMATICS|PHILOSOPHY|PSYCHOLOGY|SOCIOLOGY|PUBLIC ADMINISTRATION/.test(raw.replace(/Quantitative Economics/g, ""))) throw new Error("statistics syllabus file must hold Statistics only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const p1 = lines.findIndex(function(l){ return /^\s*PAPER.{1,3}I\s*$/.test(l); }), p2 = lines.findIndex(function(l){ return /^\s*PAPER\s+II\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("statistics syllabus: paper headings not found");
const SHORT = {
  "I-1": "Probability", "I-2": "Statistical inference", "I-3": "Linear inference and multivariate analysis", "I-4": "Sampling theory and design of experiments",
  "II-1": "Industrial statistics", "II-2": "Optimization techniques", "II-3": "Quantitative economics and official statistics", "II-4": "Demography and psychometry"
};
const FIX = function(s){ return s.replace(/\s+/g, " ").replace(/Linderberg/, "Lindeberg").replace(/Kolmogoroffs/, "Kolmogorov's").replace(/propability/, "probability").replace(/\s+([:,.])/g, "$1").replace(/metbod/, "method").replace(/^(Industrial Statistics) Process/, "$1: Process").replace(/transpotation/, "transportation").replace(/sauare/, "square").replace(/paramet likelihood/, "parameter, likelihood").replace(/fore-casting/, "forecasting").replace(/\bfot\b/, "for").replace(/cham-base/, "chain-base").trim(); };
function read(from, to, prefix, n){
  const items = [];
  lines.slice(from, to).forEach(function(l){
    if(!l.trim()) return;
    const m = /^(\d)\.\s*(.+)$/.exec(l.trim());
    if(m && +m[1] === items.length + 1){ items.push({id:prefix + m[1], parts:[m[2]]}); return; }
    if(items.length) items[items.length - 1].parts.push(l.trim());
  });
  if(items.length !== n) throw new Error("statistics syllabus " + prefix + ": " + items.length + " items, expected " + n);
  return items;
}
const items = [];
read(p1 + 1, p2, "I-", 4).forEach(function(x){ items.push({id:x.id, pp:1, t:SHORT[x.id], full:FIX(x.parts.join(" "))}); });
read(p2 + 1, lines.length, "II-", 4).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:FIX(x.parts.join(" "))}); });
module.exports.items = items;
