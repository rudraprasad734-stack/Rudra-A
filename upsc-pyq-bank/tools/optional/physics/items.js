// The official UPSC Physics syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers Paper I itself: 1(a)-(d), 2(a)-(e), 3(a)-(b), 4, 5(a)-(b); each lettered sub-heading, and each heading without sub-headings, is one item.
// Paper II has four numbered headings; 3 and 4 hold two paragraphs each, taken as separate items (3a nuclear / 3b particle, 4a solid state / 4b devices and electronics).
// So the ids are I-1a ... I-5b and II-1, II-2, II-3a, II-3b, II-4a, II-4b.
// Source text: ../../syllabus/official-2026/physics.txt (the file holds Physics only). `t` is a short heading for lists; `full` is the official wording (UPSC's own heading, then the topic list).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/physics.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*PHYSICS\b/.test(raw) || /CHEMISTRY|GEOLOGY|ECONOMICS|HISTORY|MANAGEMENT|MATHEMATICS/.test(raw)) throw new Error("physics syllabus file must hold Physics only");
// the PDF text joins a few words; put them back (the wording is otherwise untouched)
const FIX = [["Potentialand", "Potential and"], ["torqueon", "torque on"], ["dielectricspheres", "dielectric spheres"], ["Focusingof", "Focusing of"], ["Wave equations in\n", "Wave equations in\n"]];
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{3}\s*$/.test(l); });
const p2 = lines.findIndex(function(l){ return /^\s*PAPER-II\s*$/.test(l); }), p1 = lines.findIndex(function(l){ return /^\s*PAPER-I\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("physics syllabus: paper headings not found");
function clean(s){ FIX.forEach(function(f){ s = s.split(f[0]).join(f[1]); }); return s.replace(/\s+/g, " ").trim(); }
// Paper I: [id, short heading, line pattern that starts the item]
const P1 = [
  ["I-1a", "Mechanics of particles", /^\s*1\.\s*\(a\)\s*Mechanics of Particles/],
  ["I-1b", "Mechanics of rigid bodies", /^\s*\(b\)\s*Mechanics of Rigid Bodies/],
  ["I-1c", "Mechanics of continuous media", /^\s*\(c\)\s*Mechanics of Continuous Media/],
  ["I-1d", "Special relativity", /^\s*\(d\)\s*Special Relativity/],
  ["I-2a", "Waves", /^\s*\(a\)\s*Waves\s*:/],
  ["I-2b", "Geometrical optics", /^\s*\(b\)\s*Geometrial Optics/],
  ["I-2c", "Interference", /^\s*\(c\)\s*Interference/],
  ["I-2d", "Diffraction", /^\s*\(d\)\s*Diffraction/],
  ["I-2e", "Polarisation and modern optics", /^\s*\(e\)\s*Polarisation and Modern Optics/],
  ["I-3a", "Electrostatics and magnetostatics", /^\s*\(a\)\s*Electrostatics and Magnetostatics/],
  ["I-3b", "Current electricity", /^\s*\(b\)\s*Current Electricity/],
  ["I-4", "Electromagnetic waves and blackbody radiation", /^\s*4\.\s*Electromagnetic Waves and Blackbody Radiation/],
  ["I-5a", "Thermodynamics", /^\s*\(a\)\s*Thermodynamics/],
  ["I-5b", "Statistical physics", /^\s*\(b\)\s*Statistical Physics/]
];
const items = [];
(function(){
  const seg = lines.slice(p1 + 1, p2), idx = [];
  let from = 0;
  P1.forEach(function(it){
    let k = -1; for(let i = from; i < seg.length; i++){ if(it[2].test(seg[i])){ k = i; break; } }
    if(k < 0) throw new Error("physics syllabus: heading not found for " + it[0]);
    idx.push(k); from = k + 1;
  });
  P1.forEach(function(it, n){
    // an item runs up to the next item's heading, but a numbered group heading ("2. Waves and Optics :" , "3. ...", "5. ...") that sits between them is left out
    let end = n + 1 < P1.length ? idx[n + 1] : seg.length, body = seg.slice(idx[n], end);
    body = body.filter(function(l){ return !/^\s*[235]\.\s+(Waves and Optics|Electricity and Magnetism|Thermal and Statistical Physics)\s*:?\s*$/.test(l); });
    items.push({id:it[0], pp:1, t:it[1], full:clean(body.join("\n")).replace(/^\d\.\s*(?=\()/, "").replace(/^4\.\s*/, "")});
  });
})();
(function(){
  const seg = lines.slice(p2 + 1);
  const H = [/^\s*1\.\s*Quantum Mechanics/, /^\s*2\.\s*Atomic and Molecular Physics/, /^\s*3\.\s*Nuclear and Particle Physics/, /^\s*4\.\s*Solid State Physics, Devices and Electronics/];
  const at = H.map(function(re){ const k = seg.findIndex(function(l){ return re.test(l); }); if(k < 0) throw new Error("physics syllabus: Paper II heading not found: " + re); return k; });
  function block(n){ return seg.slice(at[n], n + 1 < at.length ? at[n + 1] : seg.length); }
  function paras(n){   // paragraphs of a heading, split at the blank line between them
    const b = block(n), out = [[]];
    b.forEach(function(l, i){ if(i === 0) return; if(!l.trim()){ if(out[out.length - 1].length) out.push([]); } else out[out.length - 1].push(l); });
    // a page break (page number line removed) can split a paragraph: join a paragraph that does not end with a full stop to the next one
    const merged = [];
    out.filter(function(p){ return p.length; }).forEach(function(p){
      const prev = merged[merged.length - 1];
      if(prev && !/[.]\s*$/.test(prev[prev.length - 1])) prev.push.apply(prev, p); else merged.push(p.slice());
    });
    return merged.map(function(p){ return p.join("\n"); });
  }
  items.push({id:"II-1", pp:2, t:"Quantum mechanics", full:clean(block(0).join("\n")).replace(/^1\.\s*/, "")});
  items.push({id:"II-2", pp:2, t:"Atomic and molecular physics", full:clean(block(1).join("\n")).replace(/^2\.\s*/, "")});
  const p3 = paras(2), p4 = paras(3);
  if(p3.length !== 2 || p4.length !== 2) throw new Error("physics syllabus: Paper II headings 3 and 4 should hold two paragraphs each, found " + p3.length + " and " + p4.length);
  items.push({id:"II-3a", pp:2, t:"Nuclear physics", full:"Nuclear and Particle Physics : " + clean(p3[0])});
  items.push({id:"II-3b", pp:2, t:"Particle physics", full:"Nuclear and Particle Physics : " + clean(p3[1])});
  items.push({id:"II-4a", pp:2, t:"Solid state physics", full:"Solid State Physics, Devices and Electronics : " + clean(p4[0])});
  items.push({id:"II-4b", pp:2, t:"Devices and electronics", full:"Solid State Physics, Devices and Electronics : " + clean(p4[1])});
})();
if(items.length !== 20) throw new Error("physics syllabus items: " + items.length + " (expected 20)");
module.exports.items = items;
