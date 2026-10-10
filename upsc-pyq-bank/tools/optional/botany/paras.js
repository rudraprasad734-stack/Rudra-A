// Splits the official Botany syllabus text into its paragraphs (section headings such as "1. Cell Biology :" are dropped).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/botany.txt"), "utf8").replace(/\x0c/g, "");
const cut = raw.indexOf("PAPER-II");
function paras(seg){
  const lines = seg.split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); }), out = []; let cur = [];
  const flush = function(){ if(cur.length){ out.push(cur.join(" ").replace(/\s+/g, " ").trim()); cur = []; } };
  lines.forEach(function(l){ if(!l.trim()){ flush(); return; } cur.push(l.trim()); });
  flush();
  return out.filter(function(t){ return t && !/^BOTANY$/.test(t) && !/^PAPER-I+$/.test(t) && !/^\d\.\s+[A-Za-z ,]+:$/.test(t); });
}
module.exports = {p1: paras(raw.slice(0, cut)), p2: paras(raw.slice(cut))};
if(require.main === module){ const r = module.exports; ["p1", "p2"].forEach(function(k){ console.log(k, r[k].length); r[k].forEach(function(t, i){ console.log(" ", i, t.slice(0, 110)); }); }); }
