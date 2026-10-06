// Rebuilds the Syllabus screen on the OFFICIAL UPSC wording and the PYQ frequency of each official line.
//   node upsc-pyq-bank/tools/gs/build-gs.js [--check] [--unmatched GS\ Paper\ II] [--line "GS Paper I" 3]
// Inputs : tools/gs/official-gs.json (verbatim syllabus lines), tools/gs/gs.rules.js (keywords), the question bank and d-anthro in page/index.html.
// Outputs: <script id="d-syllabus"> and <script id="d-freq"> in page/index.html.
const fs = require("fs"), path = require("path");
const PAGE = path.join(__dirname, "../../page/index.html");
const OFF = require("./official-gs.json"), RULES = require("./gs.rules.js");
let html = fs.readFileSync(PAGE, "utf8");
const bm = html.match(/<script type="application\/json" id="d-bank">(.*?)<\/script>/s);
const bank = JSON.parse(bm[1]);
const args = process.argv.slice(2), check = args.indexOf("--check") >= 0;
const INSTR = /^(Write|Answer)( short)?( notes)?( on)? the following in (about )?\d+ words each\s*:\s*/i;
const stats = {};
function distinct(re, txt){ const g = new RegExp(re.source, re.flags.indexOf("g") >= 0 ? re.flags : re.flags + "g"); const set = {}; let m; while((m = g.exec(txt))){ set[m[0].toLowerCase()] = 1; if(m[0].length === 0) g.lastIndex++; } return Object.keys(set).length; }
const out = {};
["GS Paper I","GS Paper II","GS Paper III","GS Paper IV"].forEach(function(paper){
  const o = OFF.mains.filter(function(m){ return m.paper === paper; })[0], rules = RULES[paper];
  const lines = o.bullets.map(function(b, i){ return {i:i, text:b, hits:[], years:{}, txts:[]}; });
  const un = [];
  bank.filter(function(d){ return d.exam === "mains" && d.paper === paper; }).forEach(function(d){
    d.questions.forEach(function(q){
      const txt = q.text.replace(/\s+/g, " ").replace(INSTR, "").replace(/\(\d+ words\)/g, "");
      const score = rules.map(function(re, i){ return re ? distinct(re, txt) : 0; });
      // GS IV case studies: the long "You are ... / As ..." scenarios
      if(paper === "GS Paper IV" && (txt.length > 420 || /^(you|as |in your|suppose|imagine|a (senior|young|district|newly)|an? (honest|upright|sincere))/i.test(txt) || (q.marks >= 20 && /what (would|will) you do|options? (available|before)|course of action|your (decision|response|action)/i.test(txt)))) score[rules.length - 1] = 99;
      let max = Math.max.apply(null, score);
      const ov = (RULES.overrides[paper] || {})[d.year + "/" + q.qno]; if(ov){ ov.forEach(function(i){ lines[i].txts.push(d.year + "/" + q.qno + " " + txt.slice(0, 120)); lines[i].hits.push(d.year + "/" + q.qno); lines[i].years[d.year] = (lines[i].years[d.year] || 0) + 1; }); return; }
      if(!max){ const dflt = {"GS Paper IV":0}[paper]; if(dflt === undefined){ un.push(d.year + "/" + q.qno + " " + txt.slice(0, 130)); return; } score[dflt] = 1; }
      max = Math.max.apply(null, score);
      let pick = [];
      score.forEach(function(sc, i){ if(sc === max) pick.push(i); });
      if(pick.length > 3) pick = pick.slice(0, 3);
      pick.forEach(function(i){ lines[i].txts.push(d.year + "/" + q.qno + " " + txt.slice(0, 120)); lines[i].hits.push(d.year + "/" + q.qno); lines[i].years[d.year] = (lines[i].years[d.year] || 0) + 1; });
    });
  });
  out[paper] = {lines:lines, unmatched:un};
});
const total = {};
Object.keys(out).forEach(function(p){ const n = bank.filter(function(d){ return d.exam === "mains" && d.paper === p; }).reduce(function(a, d){ return a + d.questions.length; }, 0); console.log(p, "questions", n, "| unmatched", out[p].unmatched.length); out[p].lines.forEach(function(l){ console.log("   ", String(l.i).padStart(2), String(l.hits.length).padStart(3), "q", String(Object.keys(l.years).length).padStart(2), "yrs", l.text.slice(0, 80)); }); });
const wantL = args.indexOf("--line"); if(wantL >= 0){ const L = out[args[wantL + 1]].lines[+args[wantL + 2]]; L.txts.forEach(function(x){ console.log("  *", x); }); }
const wantU = args.indexOf("--unmatched"); if(wantU >= 0){ const k = args[wantU + 1]; (out[k] ? out[k].unmatched : []).forEach(function(x){ console.log("  UNMATCHED", x); }); }


// ---------------------------------------------------------------- write the Syllabus data
function tiers(counts){   // tier 1..4 by rank inside the paper: top quarter = 1 ... none asked = 4
  const sorted = counts.slice().sort(function(a, b){ return b - a; });
  return counts.map(function(c){ if(!c) return 4; const r = sorted.indexOf(c) / sorted.length; return r < .25 ? 1 : (r < .5 ? 2 : (r < .75 ? 3 : 4)); });
}
const dsM = html.match(/<script type="application\/json" id="d-syllabus">(.*?)<\/script>/s), dfM = html.match(/<script type="application\/json" id="d-freq">(.*?)<\/script>/s);
const oldS = JSON.parse(dsM[1]), oldF = JSON.parse(dfM[1]);
const syl = {prelims:[], mains:[], anthropology:{}}, freq = {essay:oldF.essay, gs:{}, anthropology:{}};
OFF.prelims.forEach(function(p){ syl.prelims.push({paper:p.paper, note:p.note, sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:p.bullets}]}); });
const essayOff = OFF.mains.filter(function(m){ return m.paper === "Essay"; })[0];
syl.mains.push({paper:"Essay", marks:250, note:essayOff.intro + " (UPSC lists no topics for the Essay; the themes below group the essay topics asked so far.)", topics:oldS.mains[0].topics});
["GS Paper I","GS Paper II","GS Paper III","GS Paper IV"].forEach(function(paper, pi){
  const o = OFF.mains.filter(function(m){ return m.paper === paper; })[0], L = out[paper].lines, tr = tiers(L.map(function(l){ return l.hits.length; })), map = {};
  L.forEach(function(l, i){ const ys = Object.keys(l.years).map(Number).sort(); map[l.text] = {count:l.hits.length, years:ys, tier:tr[i], recent:ys.length ? ys[ys.length - 1] : 0}; });
  freq.gs["GS" + (pi + 1)] = map;
  syl.mains.push({paper:paper, marks:250, note:paper === "GS Paper IV" ? o.intro : o.head.replace(/^General Studies-?\s*[IV]+:\s*/, "").replace(/\.$/, ""), topics:o.bullets});
});
// Anthropology: the official items, word for word, with how often each was asked (from d-anthro)
const A = JSON.parse(html.match(/<script type="application\/json" id="d-anthro">(.*?)<\/script>/s)[1]);
const aText = fs.readFileSync(path.join(__dirname, "../syllabus/official-2026/anthropology.txt"), "utf8").replace(/\x0c/g, "");
function parseAnthro(seg, prefix){
  const items = []; let cur = null;
  seg.split("\n").forEach(function(ln){
    const s = ln.trim(); if(!s || /^\d{1,3}$/.test(s) || /^PAPER/.test(s) || s === "ANTHROPOLOGY") return;
    const m = s.match(/^(\d+(?:\.\d+)?)\s*\\?\.?\s+(.*)$/);
    if(m && !/^\(/.test(s)){ cur = {id:prefix + m[1].replace(/\.$/, ""), text:m[2]}; items.push(cur); } else if(cur) cur.text += " " + s;
  });
  items.forEach(function(it){ it.text = it.text.replace(/\s+/g, " ").trim(); });
  return items;
}
const cut = aText.indexOf("PAPER-II"), aItems = [parseAnthro(aText.slice(0, cut), ""), parseAnthro(aText.slice(cut), "II-")];
const byItem = {}; A.topics.forEach(function(t){ (byItem[t.s] = byItem[t.s] || {})[""] = 1; (byItem[t.s].refs = byItem[t.s].refs || {}); t.q.forEach(function(r){ byItem[t.s].refs[r] = 1; }); });
aItems.forEach(function(list, pi){
  const counts = list.map(function(it){ return Object.keys((byItem[it.id] || {refs:{}}).refs).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace("II-", "") + "  " + it.text, refs = Object.keys((byItem[it.id] || {refs:{}}).refs), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl.anthropology["paper" + (pi + 1)] = {title:"Anthropology Optional — Paper " + (pi ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq.anthropology["paper" + (pi + 1)] = map;
});
// Agriculture: the 17 official paragraphs, word for word, with how often each was asked (from d-agri)
const G = JSON.parse(html.match(/<script type="application\/json" id="d-agri">(.*?)<\/script>/s)[1]);
syl.agriculture = {}; freq.agriculture = {};
[1, 2].forEach(function(pn){
  const list = G.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; G.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl.agriculture["paper" + pn] = {title:"Agriculture Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq.agriculture["paper" + pn] = map;
});
console.log("agriculture items:", G.items.filter(function(i){ return i.pp === 1; }).length, "+", G.items.filter(function(i){ return i.pp === 2; }).length);
console.log("anthropology items:", aItems[0].length, "+", aItems[1].length);
if(check) process.exit(0);
// every frequency map carries the number of exam years it covers, so the Syllabus badges can use the same tier rule as the Tiers pages
freq.essay.__ny = 10; Object.keys(freq.gs).forEach(function(k){ freq.gs[k].__ny = 13; });
Object.keys(freq.anthropology).forEach(function(k){ freq.anthropology[k].__ny = A.years.length; }); Object.keys(freq.agriculture).forEach(function(k){ freq.agriculture[k].__ny = G.years.length; });
const j = function(o){ return JSON.stringify(o).replace(/</g, "\\u003c"); };
html = html.replace(dsM[0], function(){ return '<script type="application/json" id="d-syllabus">' + j(syl) + '</script>'; });
html = html.replace(dfM[0], function(){ return '<script type="application/json" id="d-freq">' + j(freq) + '</script>'; });
fs.writeFileSync(PAGE, html);
console.log("written d-syllabus and d-freq");
