// The official UPSC Mechanical Engineering syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the syllabus 1.1, 1.2, 2, 3, 4.1, 4.2 in Paper I and 1.1 ... 5.2 in Paper II. A numbered sub-heading is one item and a heading without
// sub-headings is one item, so Paper I has 6 items and Paper II has 16. They are numbered I-1 ... I-6 and II-1 ... II-16 here, in the printed order;
// `t` carries UPSC's own number in brackets.
// Source text: ../../syllabus/official-2026/mechanical-engineering.txt (the file holds Mechanical Engineering only).
// `full` is the official wording (UPSC's own heading, then the topic list).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/mechanical-engineering.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*MECHANICAL ENGINEERING\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|HISTORY|MANAGEMENT|MATHEMATICS/.test(raw)) throw new Error("mechanical syllabus file must hold Mechanical Engineering only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const SHORT = {
  1: ["Mechanics of rigid bodies (1.1)", "Mechanics of deformable bodies (1.2)", "Engineering materials (2)", "Theory of machines (3)", "Manufacturing process (4.1)", "Manufacturing management (4.2)"],
  2: ["First and second law of thermodynamics, entropy and availability (1.1)", "Fluid flow, compressible flow and shocks (1.2)", "Fans, blowers, compressors and gas turbines (1.3)",
      "Conduction heat transfer (2.1)", "Convection heat transfer (2.2)", "Black body radiation (2.3)", "Heat exchangers (2.4)",
      "Engine classification, cycles and performance (3.1)", "Combustion in SI and CI engines (3.2)", "IC engine systems and alternate fuels (3.3)",
      "Steam generation and steam turbines (4.1)", "Steam nozzles (4.2)", "Rankine cycle, reheating, regeneration and governing (4.3)", "Steam power plants and co-generation (4.4)",
      "Vapour compression refrigeration (5.1)", "Psychrometry and air-conditioning (5.2)"]
};
const N = {1: 6, 2: 16};
const p2 = lines.findIndex(function(l){ return /^\s*PAPER II\s*$/.test(l); }), p1 = lines.findIndex(function(l){ return /^\s*PAPER I\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("mechanical syllabus: paper headings not found");
const items = [];
[[1, p1, p2], [2, p2, lines.length]].forEach(function(sec){
  const pp = sec[0], got = [];
  // a segment starts at "x.y text" (a sub-heading) or at "x. Heading" when no "x.1" follows it (a heading that is itself an item)
  const body = lines.slice(sec[1] + 1, sec[2]);
  body.forEach(function(l, i){
    const sub = /^\s*(\d)\.(\d)\s+(.*)$/.exec(l), top = /^\s*(\d)\.\s*([A-Z].*)$/.exec(l);
    if(sub){ got.push(sub[3]); return; }
    if(top){
      const nxt = body.slice(i + 1).find(function(x){ return x.trim(); }) || "";
      if(/^\s*\d\.1\s/.test(nxt)) return;   // parent heading of x.1, x.2 ... : the items below carry the text
      got.push(top[2]); return;
    }
    if(got.length && l.trim()) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== N[pp]) throw new Error("mechanical syllabus: Paper " + pp + " has " + got.length + " items, expected " + N[pp]);
  got.forEach(function(txt, k){ items.push({id:(pp === 1 ? "I-" : "II-") + (k + 1), pp:pp, t:SHORT[pp][k], full:txt.replace(/\s+/g, " ").trim()}); });
});
if(items.length !== 22) throw new Error("mechanical syllabus items: " + items.length + " (expected 22)");
module.exports.items = items;
