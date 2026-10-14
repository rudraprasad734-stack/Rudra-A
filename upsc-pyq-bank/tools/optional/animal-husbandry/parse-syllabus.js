// Reads the official AHVS syllabus text and returns {1:[{num,text}], 2:[...]} (numbered paragraphs, headings without text dropped).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/animal-husbandry-and-veterinary-science.txt"), "utf8").replace(/\x0c/g, "");
const cut = raw.indexOf("PAPER-II");
function parse(seg){
  const out = []; let cur = null;
  seg.split("\n").forEach(function(l){
    if(/^\s*\d{1,3}\s*$/.test(l) || /^\s*PAPER-I/.test(l) || /^\s*ANIMAL HUSBANDRY AND VETERINARY SCIENCE\s*$/.test(l)) return;
    const m = l.match(/^\s*(\d+(?:\.\d+){0,2})\.?\s{1,}(\S.*)$/);
    if(m && (/^\s{0,8}\d/.test(l)) && !/^\s{10,}/.test(l)){ cur = {num:m[1], text:m[2].trim()}; out.push(cur); return; }
    if(cur && l.trim()) cur.text += " " + l.trim();
  });
  return out.map(function(b){ b.text = b.text.replace(/\s+/g, " ").trim(); return b; });
}
function items(seg){
  const all = parse(seg), res = [];
  all.forEach(function(b, i){
    const heading = /:\s*$/.test(b.text) || /^(Meat Hygiene|Meat Technology)$/.test(b.text);
    const hasKids = all.some(function(c){ return c.num.indexOf(b.num + ".") === 0; });
    if(heading && hasKids) return;               // pure heading with numbered paragraphs below it
    if(heading && !hasKids) return;               // heading line alone (its paragraph is read as the next block below)
    res.push(b);
  });
  return res;
}
module.exports = {p1: parse(raw.slice(0, cut)), p2: parse(raw.slice(cut)), raw: raw, cut: cut};
if(require.main === module){ const r = module.exports; r.p1.concat(r.p2).forEach(function(b){ console.log(b.num.padEnd(6), b.text.slice(0, 90)); }); console.log(r.p1.length, r.p2.length); }
