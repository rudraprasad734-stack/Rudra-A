// Embeds tools/gs/qmap.json as <script id="d-qmap"> in page/index.html.
//   node upsc-pyq-bank/tools/gs/build-qmap.js
// qmap.json: "exam|year|first 40 characters of the question" -> chapter ids ("Subject|Group|Unit").
// These are General Studies questions the keyword matcher cannot place (short stems, case studies, one-line quotations),
// filed by hand under the chapter(s) of their own paper. pyqForLeaf adds them to the keyword matches.
const fs = require("fs"), path = require("path");
const PAGE = path.join(__dirname, "../../page/index.html");
let html = fs.readFileSync(PAGE, "utf8");
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "qmap.json"), "utf8"));
const out = '<script type="application/json" id="d-qmap">' + JSON.stringify(map) + '</script>';
if(!/id="d-olmap"/.test(html)) throw new Error("d-olmap not found; nothing written");
html = /id="d-qmap"/.test(html) ? html.replace(/<script type="application\/json" id="d-qmap">.*?<\/script>/s, function(){ return out; })
  : html.replace(/(<script type="application\/json" id="d-olmap">.*?<\/script>)/s, function(m){ return m + "\n" + out; });
fs.writeFileSync(PAGE, html); console.log("d-qmap written:", Object.keys(map).length, "questions");
