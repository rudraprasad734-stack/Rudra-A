// Agriculture optional: (1) files every question of questions.txt in the question bank (d-bank) and
// (2) tags each question with the syllabus topics it covers (d-agri). Run after adding papers to questions.txt:
//     node upsc-pyq-bank/tools/optional/agriculture/build-agriculture.js [--check] [--topics] [--q ag012]
// --check prints the report and writes nothing.
const fs = require("fs"), path = require("path");
const PAGE = path.join(__dirname, "../../../page/index.html");
const topics = require("./topics.js"), SY = require("./items.js");
const check = process.argv.indexOf("--check") >= 0;
const DEFAULT_PREFIX = "Answer the following questions in about 150 words each:";
let html = fs.readFileSync(PAGE, "utf8");

// ---- read questions.txt
const prefixOv = {}, rows = [];
fs.readFileSync(path.join(__dirname, "questions.txt"), "utf8").split("\n").forEach(function(l){
  if(l.indexOf("#PREFIX|") === 0){ const a = l.split("|"); prefixOv[a[1] + "|" + a[2] + "|" + a[3]] = a.slice(4).join("|"); return; }
  if(!/^\d{4}\|/.test(l)) return;
  const a = l.split("|"); rows.push({y:+a[0], p:+a[1], qno:a[2], marks:+a[3], text:a.slice(4).join("|").trim()});
});
// every question carries the instruction printed above it (Q1 and Q5 always; others where the paper has one)
function prefixFor(r){
  const q = r.qno.match(/^(\d)/)[1], k = r.y + "|" + r.p + "|" + q;
  if(k in prefixOv) return prefixOv[k];
  return (q === "1" || q === "5") ? DEFAULT_PREFIX : "";
}
// ---- sanity: 8 questions per paper, each 50 marks
const sums = {}; rows.forEach(function(r){ const k = r.y + "|" + r.p + "|" + r.qno.match(/^(\d)/)[1]; sums[k] = (sums[k] || 0) + r.marks; });
const badSum = Object.keys(sums).filter(function(k){ return Math.abs(sums[k] - 50) > 1e-9; });
const papers = {}; rows.forEach(function(r){ (papers[r.y + "|" + r.p] = papers[r.y + "|" + r.p] || {}).__ = 1; papers[r.y + "|" + r.p][r.qno.match(/^(\d)/)[1]] = 1; });
const badPaper = Object.keys(papers).filter(function(k){ return Object.keys(papers[k]).length !== 9; });
if(badSum.length || badPaper.length){ console.log("MARKS DO NOT ADD UP TO 50:", badSum.join(", "), "| PAPERS WITHOUT 8 QUESTIONS:", badPaper.join(", ")); process.exit(1); }

// ---- tag topics
const itemIds = {}; SY.items.forEach(function(it){ itemIds[it.id] = it; });
const comp = topics.map(function(t, i){ if(!itemIds[t.s]) throw new Error("unknown item " + t.s + " for " + t.t); return {i:i, id:"ag" + String(i + 1).padStart(3, "0"), s:t.s, pp:itemIds[t.s].pp, p:t.p || 0, t:t.t, re:new RegExp(t.re, "i"), ex:t.ex ? new RegExp(t.ex, "i") : null, q:[]}; });
const unmatched = [], perQ = []; let total = 0;
rows.forEach(function(r){
  total++;
  const ref = r.y + "|" + r.p + "|" + r.qno, txt = r.text.replace(/\s+/g, " ");
  let hit = 0;
  comp.forEach(function(c){
    if(c.p && c.p !== r.p) return;
    if(!c.re.test(txt)) return;
    if(c.ex && c.ex.test(txt)) return;
    c.q.push(ref); hit++;
  });
  perQ.push({ref:ref, n:hit, txt:txt});
  if(!hit) unmatched.push(ref + "  " + txt.slice(0, 150));
});
const years = Array.from(new Set(rows.map(function(r){ return r.y; }))).sort();
console.log("questions:", total, "| papers:", Object.keys(papers).length, "| years:", years[0] + "-" + years[years.length - 1], "(" + years.length + ")");
console.log("topics:", comp.length, "| unmatched questions:", unmatched.length);
unmatched.forEach(function(u){ console.log("  UNMATCHED", u); });
const empty = comp.filter(function(c){ return !c.q.length; });
console.log("topics with no past question:", empty.length); empty.forEach(function(c){ console.log("  EMPTY", c.id, c.s, c.t); });
const multi = perQ.filter(function(x){ return x.n >= 5; });
console.log("questions filed under 5+ topics:", multi.length);
multi.slice(0, 40).forEach(function(x){ console.log("  MULTI", x.n, x.ref, x.txt.slice(0, 110)); });
if(process.argv.indexOf("--topics") >= 0) comp.forEach(function(c){ const ys = new Set(c.q.map(function(r){ return r.split("|")[0]; })); console.log(c.id, c.s.padEnd(5), String(c.q.length).padStart(3), String(ys.size).padStart(2) + "y", c.t.slice(0, 80)); });
if(process.argv.indexOf("--q") >= 0){ const id = process.argv[process.argv.indexOf("--q") + 1]; const c = comp.filter(function(x){ return x.id === id; })[0]; const set = {}; c.q.forEach(function(r){ set[r] = 1; }); console.log(c.t); perQ.filter(function(x){ return set[x.ref]; }).forEach(function(x){ console.log("  ", x.ref, x.txt.slice(0, 130)); }); }
const emptyItems = SY.items.filter(function(it){ return !comp.some(function(c){ return c.s === it.id; }); });
console.log("official items:", SY.items.length, "| items with no sub-topic:", emptyItems.length); emptyItems.forEach(function(it){ console.log("  NO SUBTOPIC", it.id, it.t); });
if(check) process.exit(0);
if(unmatched.length){ console.log("Not writing: every question must belong to at least one topic."); process.exit(1); }

// ---- d-bank: replace the Agriculture papers
const bm = html.match(/<script type="application\/json" id="d-bank">(.*?)<\/script>/s);
const bank = JSON.parse(bm[1]).filter(function(d){ return !(d.exam === "optional" && /^Agriculture/.test(d.paper)); });
Object.keys(papers).sort().forEach(function(k){
  const y = +k.split("|")[0], p = +k.split("|")[1];
  const qs = rows.filter(function(r){ return r.y === y && r.p === p; }).map(function(r){ const pre = prefixFor(r); return {qno:r.qno, text:(pre ? pre + " " : "") + r.text, marks:r.marks}; });
  bank.push({exam:"optional", paper:"Agriculture Paper " + (p === 1 ? "I" : "II"), year:y, complete:true, source:"Question text copied from the official paper (English version), read from the scanned PDF and checked against the page images.", count:qs.length, questions:qs, id:"optional-" + y + "-agri" + p});
});
const j = function(o){ return JSON.stringify(o).replace(/</g, "\\u003c"); };
html = html.replace(bm[0], function(){ return '<script type="application/json" id="d-bank">' + j(bank) + '</script>'; });

// ---- d-agri
const out = {v:1, subject:"Agriculture", source:"UPSC Examination Notice 05/2026-CSE, Appendix I, Section III (Agriculture)", years:years, items:SY.items.map(function(it){ return {id:it.id, pp:it.pp, t:it.t, full:it.full}; }), topics:comp.map(function(c){ return {id:c.id, s:c.s, pp:c.pp, t:c.t, q:c.q}; })};
const tag = '<script type="application/json" id="d-agri">' + j(out) + '</script>';
if(/id="d-agri"/.test(html)) html = html.replace(/<script type="application\/json" id="d-agri">.*?<\/script>/s, function(){ return tag; });
else html = html.replace(/(<script type="application\/json" id="d-anthro">.*?<\/script>)/s, function(m){ return m + "\n" + tag; });
fs.writeFileSync(PAGE, html);
console.log("written d-bank (" + Object.keys(papers).length + " Agriculture papers) and d-agri:", tag.length, "bytes");
