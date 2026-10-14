// The official UPSC Geology syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers the sections itself: Paper I has 1-6 and Paper II has 1-6, so the ids are I-1 ... I-6 and II-1 ... II-6.
// Source text: ../../syllabus/official-2026/geology.txt (the file holds Geology only).
// `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
let raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/geology.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*GEOLOGY\b/.test(raw) || /ECONOMICS|GEOGRAPHY|HISTORY\s+PAPER/.test(raw)) throw new Error("geology syllabus file must hold Geology only");
raw = raw.split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); }).join("\n").replace(/\s+/g, " ").trim();
const cut2 = raw.indexOf("PAPER II"); if(cut2 < 0) throw new Error("geology syllabus: Paper II marker not found");
const T = {"I-1":"General geology", "I-2":"Geomorphology and remote sensing", "I-3":"Structural geology", "I-4":"Paleontology", "I-5":"Indian stratigraphy", "I-6":"Hydrogeology and engineering geology",
  "II-1":"Mineralogy", "II-2":"Igneous and metamorphic petrology", "II-3":"Sedimentary petrology", "II-4":"Economic geology", "II-5":"Mining geology", "II-6":"Geochemistry and environmental geology"};
const H1 = ["General Geology :", "Geomorphology and Remote Sensing :", "Structural Geology :", "Paleontology :", "Indian Stratigraphy :", "Hydrogeology and Engineering Geology :"];
const H2 = ["Mineralogy :", "Igneous and Metamorphic Petrology :", "Sedimentary Petrology :", "Economic Geology :", "Mining Geology :", "Geochemistry and Environmental Geology :"];
const items = [];
function add(text, heads, prefix, pp){
  let at = 0; const pos = [];
  heads.forEach(function(h, k){ const m = new RegExp((k + 1) + "\\.\\s+" + h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").exec(text.slice(at)); if(!m) throw new Error("geology syllabus: not found: " + prefix + (k + 1) + " " + h); pos.push(at + m.index); at += m.index + m[0].length; });
  heads.forEach(function(h, k){
    const body = text.slice(pos[k], k + 1 < heads.length ? pos[k + 1] : text.length).replace(/^\d+\.\s+/, "").trim();
    const id = prefix + (k + 1); items.push({id:id, pp:pp, t:T[id], full:body});
  });
}
add(raw.slice(0, cut2), H1, "I-", 1);
add(raw.slice(cut2), H2, "II-", 2);
if(items.length !== 12) throw new Error("geology syllabus items: " + items.length + " (expected 6 + 6)");
module.exports.items = items;
