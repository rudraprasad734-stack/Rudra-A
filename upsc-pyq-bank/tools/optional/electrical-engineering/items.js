// The official UPSC Electrical Engineering syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers the sections itself: Paper I has 1-8 and Paper II has 1-6, so the ids are I-1 ... I-8 and II-1 ... II-6.
// Source text: ../../syllabus/official-2026/economics.txt (the Electrical Engineering syllabus follows the Economics syllabus in that file).
// `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
let raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/economics.txt"), "utf8").replace(/\x0c/g, "");
const a = raw.search(/ELECTRICAL\s+ENGINEERING/); if(a < 0) throw new Error("electrical syllabus: heading not found");
raw = raw.slice(a);
raw = raw.split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); }).join("\n").replace(/\s+/g, " ").trim();
const cut2 = raw.indexOf("PAPER II"); if(cut2 < 0) throw new Error("electrical syllabus: Paper II marker not found");
const T = {"I-1":"Circuits: theory", "I-2":"Signals and systems", "I-3":"E.M. theory", "I-4":"Analog electronics", "I-5":"Digital electronics", "I-6":"Energy conversion",
  "I-7":"Power electronics and electric drives", "I-8":"Analog communication",
  "II-1":"Control systems", "II-2":"Microprocessors and microcomputers", "II-3":"Measurement and instrumentation", "II-4":"Power systems: analysis and control",
  "II-5":"Power system protection", "II-6":"Digital communication"};
const H1 = ["Circuits—Theory :", "Signals and Systems :", "E.M. Theory :", "Analog Electronics :", "Digital Electronics :", "Energy Conversion :", "Power Electronics and Electric Drives :", "Analog Communication :"];
const H2 = ["Control Systems :", "Microprocessors and Microcomputers :", "Measurement and Instrumentation :", "Power Systems: Analysis and Control :", "Power System Protection :", "Digital Communication :"];
const items = [];
function add(text, heads, prefix, pp){
  let at = 0; const pos = [];
  heads.forEach(function(h, k){ const m = new RegExp((k + 1) + "\\.\\s+" + h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").exec(text.slice(at)); if(!m) throw new Error("electrical syllabus: not found: " + prefix + (k + 1) + " " + h); pos.push(at + m.index); at += m.index + m[0].length; });
  heads.forEach(function(h, k){
    const body = text.slice(pos[k], k + 1 < heads.length ? pos[k + 1] : text.length).replace(/^\d+\.\s+/, "").trim();
    const id = prefix + (k + 1); items.push({id:id, pp:pp, t:T[id], full:body});
  });
}
add(raw.slice(0, cut2), H1, "I-", 1);
add(raw.slice(cut2), H2, "II-", 2);
if(items.length !== 14) throw new Error("electrical syllabus items: " + items.length + " (expected 8 + 6)");
module.exports.items = items;
