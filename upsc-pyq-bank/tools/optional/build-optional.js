// Tags every past optional question with the syllabus topics it covers and writes the result into
// page/index.html as <script id="d-anthro">. Run after adding new papers to the question bank:
//     node upsc-pyq-bank/tools/optional/build-optional.js [--check]
// --check only prints the report and writes nothing.
const fs = require("fs"), path = require("path");
const PAGE = path.join(__dirname, "../../page/index.html");
const topics = require("./anthropology.topics.js");
const check = process.argv.indexOf("--check") >= 0;
let html = fs.readFileSync(PAGE, "utf8");
const bm = html.match(/<script type="application\/json" id="d-bank">(.*?)<\/script>/s);
const bank = JSON.parse(bm[1]).filter(function(p){ return p.exam === "optional" && /^Anthropology/.test(p.paper); });
const P2_START = topics.findIndex(function(t){ return t.g === "Evolution of Indian culture and civilisation"; });
const comp = topics.map(function(t, i){ return {i:i, id:"an"+(i<9?"0":"")+(i+1), pp:i>=P2_START?2:1, p:t.p||0, g:t.g, t:t.t, re:new RegExp(t.re, "i"), re2:t.re2?new RegExp(t.re2, "i"):null, ex:t.ex?new RegExp(t.ex, "i"):null, q:[]}; });
const unmatched = [], perQ = [];
let total = 0;
bank.forEach(function(p){
  const paper = /II$/.test(p.paper) ? 2 : 1;
  p.questions.forEach(function(q){
    total++;
    const txt = q.text.replace(/\s+/g, " ");
    const ref = p.year + "|" + paper + "|" + q.qno;
    let hit = 0;
    comp.forEach(function(c){
      if(c.p && c.p !== paper) return;
      const re = (paper === 2 && c.re2) ? c.re2 : c.re;
      if(!re.test(txt)) return;
      if(c.ex && c.ex.test(txt)) return;
      c.q.push(ref); hit++;
    });
    perQ.push({ref:ref, n:hit, txt:txt});
    if(!hit) unmatched.push(ref + "  " + txt.slice(0, 150));
  });
});
const years = Array.from(new Set(bank.map(function(p){ return p.year; }))).sort();
console.log("questions:", total, "| papers:", bank.length, "| years:", years[0] + "-" + years[years.length-1], "(" + years.length + ")");
console.log("topics:", comp.length, "| unmatched questions:", unmatched.length);
unmatched.forEach(function(u){ console.log("  UNMATCHED", u); });
const empty = comp.filter(function(c){ return !c.q.length; });
console.log("topics with no past question:", empty.length); empty.forEach(function(c){ console.log("  EMPTY", c.id, c.t); });
const multi = perQ.filter(function(x){ return x.n >= 4; });
console.log("questions filed under 4+ topics:", multi.length);
multi.slice(0, 40).forEach(function(x){ console.log("  MULTI", x.n, x.ref, x.txt.slice(0, 110)); });
if(process.argv.indexOf("--topics") >= 0) comp.forEach(function(c){ const ys = new Set(c.q.map(function(r){ return r.split("|")[0]; })); console.log(c.id, "P"+c.pp, String(c.q.length).padStart(3), String(ys.size).padStart(2), c.t); });
if(process.argv.indexOf("--q") >= 0){ const id = process.argv[process.argv.indexOf("--q")+1]; const c = comp.filter(function(x){ return x.id === id; })[0]; const set = {}; c.q.forEach(function(r){ set[r] = 1; }); perQ.filter(function(x){ return set[x.ref]; }).forEach(function(x){ console.log("  ", x.ref, x.txt.slice(0, 130)); }); }
if(check) process.exit(0);
const out = {v:1, subject:"Anthropology", years:years, topics:comp.map(function(c){ return {id:c.id, pp:c.pp, g:c.g, t:c.t, q:c.q}; })};
const json = JSON.stringify(out).replace(/</g, "\\u003c");
const tag = '<script type="application/json" id="d-anthro">' + json + '</script>';
if(/id="d-anthro"/.test(html)) html = html.replace(/<script type="application\/json" id="d-anthro">.*?<\/script>/s, function(){ return tag; });
else html = html.replace(bm[0], function(){ return bm[0] + "\n" + tag; });
fs.writeFileSync(PAGE, html);
console.log("written d-anthro:", json.length, "bytes");
