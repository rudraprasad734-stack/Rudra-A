// The official UPSC Zoology syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I has items 1-6 (Non-chordata and Chordata; Ecology; Ethology; Economic Zoology; Biostatistics;
// Instrumentation methods) and Paper II has items 1-7 (Cell Biology; Genetics; Evolution; Systematics; Biochemistry; Physiology;
// Developmental Biology). The ids are I-1 ... I-6 and II-1 ... II-7.
// Source text: ../../syllabus/official-2026/zoology.txt (the file holds Zoology and, after it, Appendix II, which is ignored here).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own words, typing slips of the printed notice corrected).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/zoology.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*ZOOLOGY\b/.test(raw)) throw new Error("zoology syllabus file must start with Zoology");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{3}\s*$/.test(l); });
const end = lines.findIndex(function(l){ return /APPENDIX/.test(l); });
const p1 = lines.findIndex(function(l){ return /^\s*PAPER.{1,3}I\s*$/.test(l); }), p2 = lines.findIndex(function(l){ return /^\s*PAPER\s+II\s*$/.test(l); });
if(p1 < 0 || p2 < 0 || end < 0) throw new Error("zoology syllabus: paper headings not found");
const SHORT = {
  "I-1": "Non-chordata and Chordata", "I-2": "Ecology", "I-3": "Ethology", "I-4": "Economic zoology", "I-5": "Biostatistics", "I-6": "Instrumentation methods",
  "II-1": "Cell biology", "II-2": "Genetics", "II-3": "Evolution", "II-4": "Systematics", "II-5": "Biochemistry", "II-6": "Physiology", "II-7": "Developmental biology"
};
const FIX = function(s){ return s.replace(/\s+/g, " ").replace(/\s+([:,.;])/g, "$1").replace(/ploytene and lambrush/, "polytene and lampbrush").replace(/Paramaecium/, "Paramecium").replace(/leach/, "leech").replace(/socialbehaviour ofApis/, "social behaviour of Apis").replace(/gestulation/, "gastrulation").replace(/blastogeneis/, "blastogenesis").replace(/protomics/, "proteomics").replace(/AFLF/, "AFLP").replace(/cycl cyclic/, "cyclic").replace(/ \. /g, ". ").replace(/their-Pathogenic/, "their pathogenic").replace(/Acoelomate and Coelomate,\s*\d*\s*Protostomes/, "Acoelomate and Coelomate, Protostomes").replace(/metamorphosisin/, "metamorphosis in").replace(/Reptilia;/, "Reptilia:").trim(); };
function read(from, to, prefix, n){
  const items = [];
  lines.slice(from, to).forEach(function(l){
    if(!l.trim()) return;
    const m = /^(\d)\.\s*(.+)$/.exec(l.trim());
    if(m && +m[1] === items.length + 1){ items.push({id:prefix + m[1], parts:[m[2]]}); return; }
    if(items.length) items[items.length - 1].parts.push(l.trim());
  });
  if(items.length !== n) throw new Error("zoology syllabus " + prefix + ": " + items.length + " items, expected " + n);
  return items;
}
const items = [];
read(p1 + 1, p2, "I-", 6).forEach(function(x){ items.push({id:x.id, pp:1, t:SHORT[x.id], full:FIX(x.parts.join(" "))}); });
read(p2 + 1, end, "II-", 7).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:FIX(x.parts.join(" "))}); });
module.exports.items = items;
