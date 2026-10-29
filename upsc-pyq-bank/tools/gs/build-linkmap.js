// Embeds tools/gs/linkmap.json as <script id="d-linkmap"> in page/index.html.
//   node upsc-pyq-bank/tools/gs/build-linkmap.js
// "__ca" is not a chapter: it lists current-affairs questions that fit no syllabus chapter (shown under the PYQ bank "Current affairs" filter).
// linkmap.json: { leafId: { qmapKeyLong(question): "x" | "c" | "i,j" } }
//   x = the keyword matcher put the question on this chapter wrongly (drop it)
//   c = belongs to the chapter but no single sub-topic
//   i,j = sub-topic indices of the chapter it belongs to
// Keys are hashed (same hash as linkHash() in index.html) to keep the embedded copy small.
const fs = require('fs'), path = require('path');
const PAGE = path.join(__dirname, '../../page/index.html');
const src = JSON.parse(fs.readFileSync(path.join(__dirname, 'linkmap.json'), 'utf8'));
function linkHash(s){ var h = 5381; for(var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }
const map = {};
for (const id in src) { map[id] = {}; for (const k in src[id]) map[id][linkHash(k)] = src[id][k]; }
const out = '<script type="application/json" id="d-linkmap">' + JSON.stringify(map) + '</script>';
let html = fs.readFileSync(PAGE, 'utf8');
html = /id="d-linkmap"/.test(html) ? html.replace(/<script type="application\/json" id="d-linkmap">.*?<\/script>/s, () => out)
  : html.replace(/(<script type="application\/json" id="d-qmap">.*?<\/script>)/s, (m) => m + '\n' + out);
fs.writeFileSync(PAGE, html); console.log('d-linkmap written:', Object.keys(map).length, 'chapters');
