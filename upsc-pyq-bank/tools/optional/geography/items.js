// The official UPSC Geography syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers the sections itself. Paper I has Physical Geography (1-5) and Human Geography (1-5); Paper II has Geography of India (1-10).
// So the ids are I-P1 ... I-P5 (Physical Geography), I-H1 ... I-H5 (Human Geography) and II-1 ... II-10.
// Source text: ../../syllabus/official-2026/geography.txt (the file also holds the start of the next subject and is cut after the map-question note).
// `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
let raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/geography.txt"), "utf8").replace(/\x0c/g, "");
const end = raw.search(/NOTE\s*:\s*Candidates will be required/); if(end < 0) throw new Error("geography syllabus: map-question note not found");
raw = raw.slice(0, end).split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); }).join("\n").replace(/\s+/g, " ").trim();
const cutH = raw.indexOf("Human Geography :"), cut2 = raw.indexOf("PAPER II");
if(cutH < 0 || cut2 < 0) throw new Error("geography syllabus: section markers not found");
const P1 = ["Geomorphology", "Climatology", "Oceanography", "Biogeography", "Environmental Geography"];
const H1 = ["Perspectives in Human Geography", "Economic Geography", "Population and Settlement Geography", "regional Planning", "Models, Theories and Laws in Human Geography"];
const T = {"I-P1":"Geomorphology", "I-P2":"Climatology", "I-P3":"Oceanography", "I-P4":"Biogeography", "I-P5":"Environmental geography",
  "I-H1":"Perspectives in human geography", "I-H2":"Economic geography", "I-H3":"Population and settlement geography", "I-H4":"Regional planning", "I-H5":"Models, theories and laws in human geography",
  "II-1":"Physical setting", "II-2":"Resources", "II-3":"Agriculture", "II-4":"Industry", "II-5":"Transport, communication and trade", "II-6":"Cultural setting",
  "II-7":"Settlements", "II-8":"Regional development and planning", "II-9":"Political aspects", "II-10":"Contemporary issues"};
const items = [];
function add(text, heads, prefix, numbered, pp, label){
  let at = 0; const pos = [];
  heads.forEach(function(h, k){ const m = new RegExp((numbered ? String(k + 1) + "\\.\\s+" : "") + h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").exec(text.slice(at)); if(!m) throw new Error("geography syllabus: not found: " + prefix + (k + 1) + " " + h); pos.push(at + m.index); at += m.index + m[0].length; });
  heads.forEach(function(h, k){
    const body = text.slice(pos[k], k + 1 < heads.length ? pos[k + 1] : text.length).replace(/^\d+\.\s+/, "").trim();
    const id = prefix + (k + 1); items.push({id:id, pp:pp, t:T[id], full:(label ? label + " : " : "") + body});
  });
}
add(raw.slice(0, cutH), P1, "I-P", true, 1, "Physical Geography");
add(raw.slice(cutH, cut2), H1, "I-H", true, 1, "Human Geography");
const p2 = raw.slice(cut2).replace(/^PAPER II GEOGRAPHY OF INDIA\s*/, "");
add(p2, ["Physical Setting", "Resources", "Agriculture", "Industry", "Transport, Communication and Trade", "Cultural Setting", "Settlements", "Regional Development and Planning", "Political Aspects", "Contemporary Issues"], "II-", true, 2, "");
const n1 = items.filter(function(i){ return i.pp === 1; }).length, n2 = items.filter(function(i){ return i.pp === 2; }).length;
if(n1 !== 10 || n2 !== 10) throw new Error("geography syllabus items: " + n1 + " + " + n2 + " (expected 10 + 10)");
module.exports.items = items;
