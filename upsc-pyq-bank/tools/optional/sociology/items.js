// The official UPSC Sociology syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// Paper I (Fundamentals of Sociology) has items 1-10. Paper II (Indian Society: Structure and Change) is printed in three
// parts, A (Introducing Indian Society), B (Social Structure) and C (Social Changes in India), each made of roman-numbered
// sections; those 15 sections are numbered here in print order. The ids are I-1 ... I-10 and II-1 ... II-15.
// Source text: ../../syllabus/official-2026/sociology.txt (the file holds Sociology only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own words, typing slips of the printed notice corrected).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/sociology.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*SOCIOLOGY\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|MATHEMATICS|PHILOSOPHY|PSYCHOLOGY|PUBLIC ADMINISTRATION/.test(raw)) throw new Error("sociology syllabus file must hold Sociology only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const p1 = lines.findIndex(function(l){ return /^\s*PAPER.{1,3}\s*I\s*$/.test(l); }), p2 = lines.findIndex(function(l){ return /^\s*PAPER.{1,3}\s*II\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("sociology syllabus: paper headings not found");
const SHORT = {
  "I-1": "Sociology - the discipline", "I-2": "Sociology as science", "I-3": "Research methods and analysis", "I-4": "Sociological thinkers", "I-5": "Stratification and mobility",
  "I-6": "Work and economic life", "I-7": "Politics and society", "I-8": "Religion and society", "I-9": "Systems of kinship", "I-10": "Social change in modern society",
  "II-1": "Perspectives on the study of Indian society", "II-2": "Impact of colonial rule on Indian society", "II-3": "Rural and agrarian social structure", "II-4": "Caste system",
  "II-5": "Tribal communities in India", "II-6": "Social classes in India", "II-7": "Systems of kinship in India", "II-8": "Religion and society (India)",
  "II-9": "Visions of social change in India", "II-10": "Rural and agrarian transformation", "II-11": "Industrialisation and urbanisation", "II-12": "Politics and society (India)",
  "II-13": "Social movements in modern India", "II-14": "Population dynamics", "II-15": "Challenges of social transformation"
};
const FIX = function(s){ return s.replace(/\s+/g, " ").replace(/Durkhteim/, "Durkheim").replace(/Talcolt/, "Talcott").replace(/func tionalist/, "functionalist").replace(/\( e\)/g, "(e)").replace(/\(c \)/g, "(c)").replace(/Contem\s+porary/, "Contemporary").replace(/fundamen\s+talism/, "fundamentalism").replace(/Ghure\b/, "Ghurye").replace(/oflabour/, "of labour").replace(/\s+\./g, ".").trim(); };
function join(a){ return FIX(a.join(" ")); }
// Paper I: "1. Heading:" followed by (a) ... lines
const items = [];
(function(){
  let cur = null;
  lines.slice(p1 + 1, p2).forEach(function(l){
    if(/FUNDAMENTALS OF SOCIOLOGY/.test(l) || !l.trim()) return;
    const m = /^\s*(\d{1,2})\.\s*(\S.*)$/.exec(l);
    if(m && +m[1] === items.length + 1){ cur = {id:"I-" + m[1], pp:1, parts:[m[2]]}; items.push(cur); return; }
    if(cur) cur.parts.push(l.trim());
  });
})();
if(items.length !== 10) throw new Error("sociology syllabus Paper I: " + items.length + " items, expected 10");
// Paper II: roman-numbered sections (i)...(vii) under the parts A, B, C
const ROMAN = {i:1, ii:2, iii:3, iv:4, v:5, vi:6, vii:7};
(function(){
  let cur = null, n = 0, expect = 0;
  lines.slice(p2 + 1).forEach(function(l){
    if(!l.trim() || /INDIAN SOCIETY\s*:\s*STRUCTURE AND CHANGE/.test(l)) return;
    if(/^\s*[ABC]\.\s+\S/.test(l)){ cur = null; expect = 0; return; }
    const m = /^\s*\((i|ii|iii|iv|v|vi|vii)\)\s*(\S.*)$/.exec(l);
    if(m && ROMAN[m[1]] === expect + 1){ expect++; n++; cur = {id:"II-" + n, pp:2, parts:[m[2]]}; items.push(cur); return; }
    if(cur) cur.parts.push(l.trim());
  });
})();
if(items.length !== 25) throw new Error("sociology syllabus items: " + items.length + " (expected 25)");
items.forEach(function(it){ it.t = SHORT[it.id]; if(!it.t) throw new Error("sociology: no short heading for " + it.id); it.full = join(it.parts); delete it.parts; });
module.exports.items = items;
