// The official UPSC Chemistry syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers the items itself (Paper I: 1-15, with 13 split into (i)-(iv); Paper II: 1-7, with 2 split into (i)-(vi),
// 4 into (i)-(ii) and 7 into (i)-(v)), so the ids are I-<number>[(part)] and II-<number>[(part)].
// Source text: ../../syllabus/official-2026/chemistry.txt.  `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/chemistry.txt"), "utf8").replace(/\x0c/g, "");
const cut = raw.search(/PAPER-II/);
if(cut < 0) throw new Error("chemistry syllabus: Paper II marker not found");
const clean = function(seg){ return seg.split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); }); };
function blocks(lines){
  const out = []; let cur = null;
  lines.forEach(function(l){
    const m = l.match(/^\s{0,3}(\d{1,2})\.\s{2,}(.*)$/);
    if(m){ cur = {num:m[1], lines:[m[2]]}; out.push(cur); }
    else if(cur) cur.lines.push(l);
  });
  return out.map(function(b){ return {num:b.num, text:b.lines.join(" ").replace(/\s+/g, " ").trim()}; });
}
const T1 = {"1":"Atomic structure", "2":"Chemical bonding", "3":"Solid state", "4":"Gaseous state and transport phenomena", "5":"Liquid state", "6":"Thermodynamics",
  "7":"Phase equilibria and solutions", "8":"Electrochemistry", "9":"Chemical kinetics", "10":"Photochemistry", "11":"Surface phenomena and catalysis",
  "12":"Bio-inorganic chemistry", "13(i)":"Coordination chemistry: bonding, crystal field theory, magnetism and electronic spectra", "13(ii)":"Coordination chemistry: isomerism, nomenclature, stereochemistry, trans effect, stability",
  "13(iii)":"Coordination chemistry: EAN rule, metal carbonyls and nitrosyls", "13(iv)":"Coordination chemistry: organometallic complexes, oxidative addition, fluxional molecules, clusters",
  "14":"Main group chemistry", "15":"f-block elements"};
const T2 = {"1":"Delocalised covalent bonding: aromaticity", "2(i)":"Reaction mechanisms: methods of study, kinetic and thermodynamic control", "2(ii)":"Reactive intermediates",
  "2(iii)":"Substitution reactions", "2(iv)":"Elimination reactions", "2(v)":"Addition reactions", "2(vi)":"Reactions and rearrangements",
  "3":"Pericyclic reactions", "4(i)":"Polymers", "4(ii)":"Biopolymers: proteins, DNA and RNA", "5":"Synthetic uses of reagents", "6":"Photochemistry (organic)",
  "7(i)":"Rotational spectroscopy", "7(ii)":"Vibrational spectroscopy", "7(iii)":"Electronic spectroscopy", "7(iv)":"Proton NMR spectroscopy", "7(v)":"Mass spectrometry"};
const items = [];
function add(list, pp, T){
  list.forEach(function(b){
    const parts = b.text.split(/\s\((i|ii|iii|iv|v|vi)\)\s+/);          // [head, id, text, id, text ...]
    if(parts.length === 1 && !/^[^(]*\(i\)/.test(b.text)){
      const k = b.num; if(!T[k]) throw new Error("chemistry syllabus: no title for " + pp + "-" + k);
      items.push({id:(pp === 1 ? "I-" : "II-") + k, pp:pp, t:T[k], full:b.text}); return;
    }
    const sp = b.text.replace(/^(\S.*?)\s*\(i\)\s+/, "$1 (i) ").split(/\s?\((i|ii|iii|iv|v|vi)\)\s+/);
    for(let i = 1; i < sp.length; i += 2){
      const k = b.num + "(" + sp[i] + ")"; if(!T[k]) throw new Error("chemistry syllabus: no title for " + pp + "-" + k);
      items.push({id:(pp === 1 ? "I-" : "II-") + k, pp:pp, t:T[k], full:(sp[0] ? sp[0].replace(/\s*:?$/, "") + " : " : "") + "(" + sp[i] + ") " + sp[i + 1].trim()});
    }
  });
}
add(blocks(clean(raw.slice(0, cut))), 1, T1); add(blocks(clean(raw.slice(cut))), 2, T2);
const n1 = items.filter(function(i){ return i.pp === 1; }).length, n2 = items.filter(function(i){ return i.pp === 2; }).length;
if(n1 !== 18 || n2 !== 17) throw new Error("chemistry syllabus items: " + n1 + " + " + n2 + " (expected 18 + 17)");
module.exports.items = items;
