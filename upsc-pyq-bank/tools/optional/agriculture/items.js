// The official UPSC Agriculture syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), paragraph by paragraph.
// Source text: ../../syllabus/official-2026/agriculture.txt. UPSC does not number the paragraphs; they are numbered I-1.. and II-1.. here in the order printed.
// `t` is a short heading for lists; `full` (the official wording, word for word) is read from the text file.
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/agriculture.txt"), "utf8").replace(/\x0c/g, "");
const cut = raw.indexOf("PAPER-II");
function paras(seg){
  return seg.split(/\n\s*\n/).map(function(b){ return b.split("\n").map(function(l){ return l.trim(); }).filter(function(l){ return l && !/^\d{1,3}$/.test(l) && !/^PAPER/.test(l) && l !== "AGRICULTURE"; }).join(" ").replace(/\s+/g, " ").trim(); }).filter(Boolean);
}
const p1 = paras(raw.slice(0, cut)), p2 = paras(raw.slice(cut));
const T1 = ["Ecology, environment and climate change", "Cropping patterns, farming systems and crop production", "Forestry and agro-forestry", "Weeds and weed control", "Soil, soil fertility and nutrient management", "Soil conservation, watershed and dryland agriculture", "Water use, irrigation and drainage", "Farm management, marketing, price policy and insurance", "Agricultural extension and rural development"];
const T2 = ["Cell biology, genetics and cytogenetics", "Plant breeding and crop improvement", "Seed production, certification, IPR and WTO", "Plant nutrition and water relations", "Plant physiology and metabolism", "Horticulture, protected cultivation and post-harvest technology", "Crop pests, diseases and their management", "Food production, food security and nutrition"];
if(p1.length !== T1.length || p2.length !== T2.length) throw new Error("agriculture.txt paragraphs: " + p1.length + " + " + p2.length + " (expected 9 + 8)");
module.exports.items = p1.map(function(f, i){ return {id:"I-" + (i + 1), pp:1, t:T1[i], full:f}; }).concat(p2.map(function(f, i){ return {id:"II-" + (i + 1), pp:2, t:T2[i], full:f}; }));
