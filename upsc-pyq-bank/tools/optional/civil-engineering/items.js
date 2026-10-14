// The official UPSC Civil Engineering syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers the items itself (Paper I: 1.1-1.3, 2.1-2.2, 3.1-3.6, 4; Paper II: 1.1-1.3, 2.1-2.3, 3.1-3.4(i)-(viii), 4.1-4.6, 5),
// so the ids are I-<number> and II-<number>. Source text: ../../syllabus/official-2026/civil-engineering.txt.
// `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/civil-engineering.txt"), "utf8").replace(/\x0c/g, "");
const cut = raw.search(/PAPER\s*[—-]\s*II/);
if(cut < 0) throw new Error("civil syllabus: Paper II marker not found");
const clean = function(seg){
  return seg.split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); });
};
// cut a paper into numbered blocks: a line that starts with "n.m" (or "n.") and the lines after it up to the next such line
function blocks(lines){
  const out = []; let cur = null;
  lines.forEach(function(l){
    const m = l.match(/^\s{0,3}(\d)\.(\d)?\s{2,}(.*)$/);
    if(m){ cur = {num: m[2] ? m[1] + "." + m[2] : m[1], lines:[m[3]]}; out.push(cur); }
    else if(cur) cur.lines.push(l);
  });
  return out.map(function(b){ return {num:b.num, text:b.lines.join(" ").replace(/\s+/g, " ").trim()}; });
}
const b1 = blocks(clean(raw.slice(0, cut))), b2 = blocks(clean(raw.slice(cut)));
const T1 = {"1.1":"Engineering mechanics: statics, friction, kinematics and kinetics", "1.2":"Strength of materials: stress, bending, shear, deflection, torsion, columns",
  "1.3":"Structural analysis: energy methods, influence lines, arches, matrix and plastic analysis", "2.1":"Structural steel design: connections, members, plate and gantry girders",
  "2.2":"Design of concrete and masonry structures, water tanks and prestressed concrete", "3.1":"Fluid mechanics: fluid statics, kinematics and dynamics, pipe flow, weirs",
  "3.2":"Dimensional analysis and similitude", "3.3":"Laminar flow", "3.4":"Boundary layer and turbulent flow through pipes", "3.5":"Open channel flow",
  "3.6":"Hydraulic machines and hydropower", "4":"Geotechnical engineering"};
const T2 = {"1.1":"Construction technology: engineering materials", "1.2":"Construction: masonry, finishes, estimating, valuation and equipment",
  "1.3":"Construction planning and management: CPM, PERT, economics and BOOT", "2.1":"Surveying, photogrammetry and remote sensing", "2.2":"Railway engineering",
  "2.3":"Highway engineering", "3.1":"Hydrology", "3.2":"Ground water flow", "3.3":"Water resources engineering", "4.1":"Water supply", "4.2":"Water treatment",
  "4.3":"Sewerage systems", "4.4":"Sewage characterisation", "4.5":"Sewage treatment", "4.6":"Solid waste", "5":"Environmental pollution"};
const T34 = {"i":"Irrigation: water requirements of crops, duty and delta", "ii":"Irrigation: canals, lined canals and regime theory", "iii":"Irrigation: water logging and salinity",
  "iv":"Irrigation: canal structures", "v":"Irrigation: diversion headworks, weirs and Khosla's theory", "vi":"Irrigation: storage works and dams",
  "vii":"Irrigation: spillways and energy dissipation", "viii":"Irrigation: river training"};
const items = [];
function add(list, pp, T){
  list.forEach(function(b){
    if(pp === 2 && b.num === "3.4"){
      // 3.4 is written as (i) ... (viii); split it
      const parts = b.text.split(/\((i|ii|iii|iv|v|vi|vii|viii)\)\s+/); // [head, id, text, id, text ...]
      for(let i = 1; i < parts.length; i += 2){
        if(!T34[parts[i]]) throw new Error("civil syllabus 3.4 part " + parts[i]);
        items.push({id:"II-3.4(" + parts[i] + ")", pp:2, t:T34[parts[i]], full:"Irrigation Engineering : (" + parts[i] + ") " + parts[i + 1].trim()});
      }
      return;
    }
    if(!T[b.num]) return;                                   // headings such as "1.  Engineering Mechanics, ..." carry no text of their own
    items.push({id:(pp === 1 ? "I-" : "II-") + b.num, pp:pp, t:T[b.num], full:b.text});
  });
}
add(b1, 1, T1); add(b2, 2, T2);
const n1 = items.filter(function(i){ return i.pp === 1; }).length, n2 = items.filter(function(i){ return i.pp === 2; }).length;
if(n1 !== 12 || n2 !== 24) throw new Error("civil syllabus items: " + n1 + " + " + n2 + " (expected 12 + 24)");
module.exports.items = items;
