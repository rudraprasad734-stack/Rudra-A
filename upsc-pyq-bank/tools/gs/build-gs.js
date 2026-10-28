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
// Animal Husbandry and Veterinary Science: the 50 numbered official paragraphs (25 per paper), with how often each was asked (from d-ahvs)
const AH = JSON.parse(html.match(/<script type="application\/json" id="d-ahvs">(.*?)<\/script>/s)[1]), AHK = "animal husbandry and veterinary science";
syl[AHK] = {}; freq[AHK] = {};
[1, 2].forEach(function(pn){
  const list = AH.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; AH.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[AHK]["paper" + pn] = {title:"Animal Husbandry and Veterinary Science Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[AHK]["paper" + pn] = map;
});
// Botany: the 17 grouped syllabus items (10 + 7), with how often each was asked (from d-botany)
const BT = JSON.parse(html.match(/<script type="application\/json" id="d-botany">(.*?)<\/script>/s)[1]), BTK = "botany";
syl[BTK] = {}; freq[BTK] = {};
[1, 2].forEach(function(pn){
  const list = BT.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; BT.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[BTK]["paper" + pn] = {title:"Botany Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[BTK]["paper" + pn] = map;
});
console.log("botany items:", BT.items.filter(function(i){ return i.pp === 1; }).length, "+", BT.items.filter(function(i){ return i.pp === 2; }).length);
// Civil Engineering: the 36 syllabus items (12 + 24), with how often each was asked (from d-civil)
const CV = JSON.parse(html.match(/<script type="application\/json" id="d-civil">(.*?)<\/script>/s)[1]), CVK = "civil engineering";
syl[CVK] = {}; freq[CVK] = {};
[1, 2].forEach(function(pn){
  const list = CV.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; CV.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[CVK]["paper" + pn] = {title:"Civil Engineering Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[CVK]["paper" + pn] = map;
});
console.log("civil engineering items:", CV.items.filter(function(i){ return i.pp === 1; }).length, "+", CV.items.filter(function(i){ return i.pp === 2; }).length);
// Chemistry: the 35 syllabus items (18 + 17), with how often each was asked (from d-chem)
const CH = JSON.parse(html.match(/<script type="application\/json" id="d-chem">(.*?)<\/script>/s)[1]), CHK = "chemistry";
syl[CHK] = {}; freq[CHK] = {};
[1, 2].forEach(function(pn){
  const list = CH.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; CH.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[CHK]["paper" + pn] = {title:"Chemistry Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[CHK]["paper" + pn] = map;
});
console.log("chemistry items:", CH.items.filter(function(i){ return i.pp === 1; }).length, "+", CH.items.filter(function(i){ return i.pp === 2; }).length);
// Commerce and Accountancy: the 45 syllabus paragraphs, with how often each was asked (from d-comm)
const CM = JSON.parse(html.match(/<script type="application\/json" id="d-comm">(.*?)<\/script>/s)[1]), CMK = "commerce and accountancy";
syl[CMK] = {}; freq[CMK] = {};
[1, 2].forEach(function(pn){
  const list = CM.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; CM.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[CMK]["paper" + pn] = {title:"Commerce and Accountancy Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[CMK]["paper" + pn] = map;
});
console.log("commerce and accountancy items:", CM.items.filter(function(i){ return i.pp === 1; }).length, "+", CM.items.filter(function(i){ return i.pp === 2; }).length);
// Economics: the 45 syllabus items (31 + 14), with how often each was asked (from d-econ)
const EC = JSON.parse(html.match(/<script type="application\/json" id="d-econ">(.*?)<\/script>/s)[1]), ECK = "economics";
syl[ECK] = {}; freq[ECK] = {};
[1, 2].forEach(function(pn){
  const list = EC.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; EC.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[ECK]["paper" + pn] = {title:"Economics Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[ECK]["paper" + pn] = map;
});
console.log("economics items:", EC.items.filter(function(i){ return i.pp === 1; }).length, "+", EC.items.filter(function(i){ return i.pp === 2; }).length);
// Geography: the 20 syllabus items (10 + 10), with how often each was asked (from d-geog)
const GG = JSON.parse(html.match(/<script type="application\/json" id="d-geog">(.*?)<\/script>/s)[1]), GGK = "geography";
syl[GGK] = {}; freq[GGK] = {};
[1, 2].forEach(function(pn){
  const list = GG.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; GG.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[GGK]["paper" + pn] = {title:"Geography Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[GGK]["paper" + pn] = map;
});
console.log("geography items:", GG.items.filter(function(i){ return i.pp === 1; }).length, "+", GG.items.filter(function(i){ return i.pp === 2; }).length);
// Electrical Engineering: the 14 syllabus items (8 + 6), with how often each was asked (from d-elec)
const EL = JSON.parse(html.match(/<script type="application\/json" id="d-elec">(.*?)<\/script>/s)[1]), ELK = "electrical engineering";
syl[ELK] = {}; freq[ELK] = {};
[1, 2].forEach(function(pn){
  const list = EL.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; EL.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[ELK]["paper" + pn] = {title:"Electrical Engineering Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[ELK]["paper" + pn] = map;
});
console.log("electrical engineering items:", EL.items.filter(function(i){ return i.pp === 1; }).length, "+", EL.items.filter(function(i){ return i.pp === 2; }).length);
// Geology: the 12 syllabus items (6 + 6), with how often each was asked (from d-geol)
const GL = JSON.parse(html.match(/<script type="application\/json" id="d-geol">(.*?)<\/script>/s)[1]), GLK = "geology";
syl[GLK] = {}; freq[GLK] = {};
[1, 2].forEach(function(pn){
  const list = GL.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; GL.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[GLK]["paper" + pn] = {title:"Geology Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[GLK]["paper" + pn] = map;
});
console.log("geology items:", GL.items.filter(function(i){ return i.pp === 1; }).length, "+", GL.items.filter(function(i){ return i.pp === 2; }).length);
// History: the 51 syllabus items (24 + 27), with how often each was asked (from d-hist)
const HS = JSON.parse(html.match(/<script type="application\/json" id="d-hist">(.*?)<\/script>/s)[1]), HSK = "history";
syl[HSK] = {}; freq[HSK] = {};
[1, 2].forEach(function(pn){
  const list = HS.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; HS.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id.replace(/^I+-/, "") + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[HSK]["paper" + pn] = {title:"History Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[HSK]["paper" + pn] = map;
});
console.log("history items:", HS.items.filter(function(i){ return i.pp === 1; }).length, "+", HS.items.filter(function(i){ return i.pp === 2; }).length);
// Law: the 81 syllabus items (31 + 50), with how often each was asked (from d-law)
const LW = JSON.parse(html.match(/<script type="application\/json" id="d-law">(.*?)<\/script>/s)[1]), LWK = "law";
syl[LWK] = {}; freq[LWK] = {};
[1, 2].forEach(function(pn){
  const list = LW.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; LW.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[LWK]["paper" + pn] = {title:"Law Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[LWK]["paper" + pn] = map;
});
console.log("law items:", LW.items.filter(function(i){ return i.pp === 1; }).length, "+", LW.items.filter(function(i){ return i.pp === 2; }).length);
// Management: the 12 syllabus items (6 + 6), with how often each was asked (from d-management)
const MG = JSON.parse(html.match(/<script type="application\/json" id="d-management">(.*?)<\/script>/s)[1]), MGK = "management";
syl[MGK] = {}; freq[MGK] = {};
[1, 2].forEach(function(pn){
  const list = MG.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; MG.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[MGK]["paper" + pn] = {title:"Management Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[MGK]["paper" + pn] = map;
});
console.log("management items:", MG.items.filter(function(i){ return i.pp === 1; }).length, "+", MG.items.filter(function(i){ return i.pp === 2; }).length);
// Mathematics: the 13 syllabus items (6 + 7), with how often each was asked (from d-mathematics)
const MA = JSON.parse(html.match(/<script type="application\/json" id="d-mathematics">(.*?)<\/script>/s)[1]), MAK = "mathematics";
syl[MAK] = {}; freq[MAK] = {};
[1, 2].forEach(function(pn){
  const list = MA.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; MA.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[MAK]["paper" + pn] = {title:"Mathematics Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[MAK]["paper" + pn] = map;
});
console.log("mathematics items:", MA.items.filter(function(i){ return i.pp === 1; }).length, "+", MA.items.filter(function(i){ return i.pp === 2; }).length);
// Mechanical Engineering: the 22 syllabus items (6 + 16), with how often each was asked (from d-mechanical)
const ME = JSON.parse(html.match(/<script type="application\/json" id="d-mechanical">(.*?)<\/script>/s)[1]), MEK = "mechanical engineering";
syl[MEK] = {}; freq[MEK] = {};
[1, 2].forEach(function(pn){
  const list = ME.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; ME.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[MEK]["paper" + pn] = {title:"Mechanical Engineering Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[MEK]["paper" + pn] = map;
});
console.log("mechanical engineering items:", ME.items.filter(function(i){ return i.pp === 1; }).length, "+", ME.items.filter(function(i){ return i.pp === 2; }).length);
// Medical Science: the 13 syllabus items (7 + 6), with how often each was asked (from d-medical)
const MD = JSON.parse(html.match(/<script type="application\/json" id="d-medical">(.*?)<\/script>/s)[1]), MDK = "medical science";
syl[MDK] = {}; freq[MDK] = {};
[1, 2].forEach(function(pn){
  const list = MD.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; MD.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[MDK]["paper" + pn] = {title:"Medical Science Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[MDK]["paper" + pn] = map;
});
console.log("medical science items:", MD.items.filter(function(i){ return i.pp === 1; }).length, "+", MD.items.filter(function(i){ return i.pp === 2; }).length);
// Philosophy: the syllabus items, with how often each was asked (from d-philosophy)
const PH = JSON.parse(html.match(/<script type="application\/json" id="d-philosophy">(.*?)<\/script>/s)[1]), PHK = "philosophy";
syl[PHK] = {}; freq[PHK] = {};
[1, 2].forEach(function(pn){
  const list = PH.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; PH.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[PHK]["paper" + pn] = {title:"Philosophy Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[PHK]["paper" + pn] = map;
});
console.log("philosophy items:", PH.items.filter(function(i){ return i.pp === 1; }).length, "+", PH.items.filter(function(i){ return i.pp === 2; }).length);
// Physics: the syllabus items, with how often each was asked (from d-physics)
const PY = JSON.parse(html.match(/<script type="application\/json" id="d-physics">(.*?)<\/script>/s)[1]), PYK = "physics";
syl[PYK] = {}; freq[PYK] = {};
[1, 2].forEach(function(pn){
  const list = PY.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; PY.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[PYK]["paper" + pn] = {title:"Physics Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[PYK]["paper" + pn] = map;
});
console.log("physics items:", PY.items.filter(function(i){ return i.pp === 1; }).length, "+", PY.items.filter(function(i){ return i.pp === 2; }).length);
// Political Science and International Relations: the syllabus items, with how often each was asked (from d-political-science)
const PS = JSON.parse(html.match(/<script type="application\/json" id="d-political-science">(.*?)<\/script>/s)[1]), PSK = "political science and international relations";
syl[PSK] = {}; freq[PSK] = {};
[1, 2].forEach(function(pn){
  const list = PS.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; PS.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[PSK]["paper" + pn] = {title:"Political Science and International Relations Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[PSK]["paper" + pn] = map;
});
console.log("political science items:", PS.items.filter(function(i){ return i.pp === 1; }).length, "+", PS.items.filter(function(i){ return i.pp === 2; }).length);
// Psychology: the syllabus items, with how often each was asked (from d-psychology)
const PSY = JSON.parse(html.match(/<script type="application\/json" id="d-psychology">(.*?)<\/script>/s)[1]), PYK2 = "psychology";
syl[PYK2] = {}; freq[PYK2] = {};
[1, 2].forEach(function(pn){
  const list = PSY.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; PSY.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[PYK2]["paper" + pn] = {title:"Psychology Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[PYK2]["paper" + pn] = map;
});
console.log("psychology items:", PSY.items.filter(function(i){ return i.pp === 1; }).length, "+", PSY.items.filter(function(i){ return i.pp === 2; }).length);
// Public Administration: the syllabus items, with how often each was asked (from d-public-admin)
const PAD = JSON.parse(html.match(/<script type="application\/json" id="d-public-admin">(.*?)<\/script>/s)[1]), PAK = "public administration";
syl[PAK] = {}; freq[PAK] = {};
[1, 2].forEach(function(pn){
  const list = PAD.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; PAD.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[PAK]["paper" + pn] = {title:"Public Administration Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[PAK]["paper" + pn] = map;
});
console.log("public administration items:", PAD.items.filter(function(i){ return i.pp === 1; }).length, "+", PAD.items.filter(function(i){ return i.pp === 2; }).length);
// Sociology: the syllabus items, with how often each was asked (from d-sociology)
const SOD = JSON.parse(html.match(/<script type="application\/json" id="d-sociology">(.*?)<\/script>/s)[1]), SOK = "sociology";
syl[SOK] = {}; freq[SOK] = {};
[1, 2].forEach(function(pn){
  const list = SOD.items.filter(function(it){ return it.pp === pn; });
  const refsBy = {}; SOD.topics.forEach(function(t){ (refsBy[t.s] = refsBy[t.s] || {}); t.q.forEach(function(r){ refsBy[t.s][r] = 1; }); });
  const counts = list.map(function(it){ return Object.keys(refsBy[it.id] || {}).length; }), tr = tiers(counts), map = {}, topics = [];
  list.forEach(function(it, i){
    const label = it.id + "  " + it.full, refs = Object.keys(refsBy[it.id] || {}), ys = {};
    refs.forEach(function(r){ ys[r.split("|")[0]] = 1; });
    const yl = Object.keys(ys).map(Number).sort();
    topics.push(label); map[label] = {count:refs.length, years:yl, tier:tr[i], recent:yl.length ? yl[yl.length - 1] : 0};
  });
  syl[SOK]["paper" + pn] = {title:"Sociology Optional \u2014 Paper " + (pn === 2 ? "II" : "I"), sections:[{heading:"Official syllabus (UPSC Examination Notice 2026)", topics:topics}]};
  freq[SOK]["paper" + pn] = map;
});
console.log("sociology items:", SOD.items.filter(function(i){ return i.pp === 1; }).length, "+", SOD.items.filter(function(i){ return i.pp === 2; }).length);
console.log("animal husbandry items:", AH.items.filter(function(i){ return i.pp === 1; }).length, "+", AH.items.filter(function(i){ return i.pp === 2; }).length);
console.log("agriculture items:", G.items.filter(function(i){ return i.pp === 1; }).length, "+", G.items.filter(function(i){ return i.pp === 2; }).length);
console.log("anthropology items:", aItems[0].length, "+", aItems[1].length);
if(check) process.exit(0);
// every frequency map carries the number of exam years it covers, so the Syllabus badges can use the same tier rule as the Tiers pages
freq.essay.__ny = 10; Object.keys(freq.gs).forEach(function(k){ freq.gs[k].__ny = 13; });
Object.keys(freq.anthropology).forEach(function(k){ freq.anthropology[k].__ny = A.years.length; }); Object.keys(freq.agriculture).forEach(function(k){ freq.agriculture[k].__ny = G.years.length; }); Object.keys(freq[AHK]).forEach(function(k){ freq[AHK][k].__ny = AH.years.length; }); Object.keys(freq[BTK]).forEach(function(k){ freq[BTK][k].__ny = BT.years.length; }); Object.keys(freq[CHK]).forEach(function(k){ freq[CHK][k].__ny = CH.years.length; }); Object.keys(freq[CMK]).forEach(function(k){ freq[CMK][k].__ny = CM.years.length; }); Object.keys(freq[ECK]).forEach(function(k){ freq[ECK][k].__ny = EC.years.length; }); Object.keys(freq[GGK]).forEach(function(k){ freq[GGK][k].__ny = GG.years.length; });  Object.keys(freq[ELK]).forEach(function(k){ freq[ELK][k].__ny = EL.years.length; });  Object.keys(freq[GLK]).forEach(function(k){ freq[GLK][k].__ny = GL.years.length; }); Object.keys(freq[HSK]).forEach(function(k){ freq[HSK][k].__ny = HS.years.length; }); Object.keys(freq[LWK]).forEach(function(k){ freq[LWK][k].__ny = LW.years.length; }); Object.keys(freq[MGK]).forEach(function(k){ freq[MGK][k].__ny = MG.years.length; }); Object.keys(freq[MAK]).forEach(function(k){ freq[MAK][k].__ny = MA.years.length; }); Object.keys(freq[MEK]).forEach(function(k){ freq[MEK][k].__ny = ME.years.length; }); Object.keys(freq[MDK]).forEach(function(k){ freq[MDK][k].__ny = MD.years.length; });
const j = function(o){ return JSON.stringify(o).replace(/</g, "\\u003c"); };
html = html.replace(dsM[0], function(){ return '<script type="application/json" id="d-syllabus">' + j(syl) + '</script>'; });
html = html.replace(dfM[0], function(){ return '<script type="application/json" id="d-freq">' + j(freq) + '</script>'; });
fs.writeFileSync(PAGE, html);
console.log("written d-syllabus and d-freq");
