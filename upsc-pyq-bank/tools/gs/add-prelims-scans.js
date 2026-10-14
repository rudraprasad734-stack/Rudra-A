// Adds the Prelims GS Paper I question papers of 2016-2019 (read from scanned PDFs by OCR) to the question bank (d-bank).
//   node upsc-pyq-bank/tools/gs/add-prelims-scans.js
// Source: tools/gs/prelims-2016-2019.json {year: [{qno, text, options}]}. A question the scan could not give is simply absent,
// so these papers are marked complete:false. Answers are not part of the scans.
const fs = require("fs"), path = require("path");
const PAGE = path.join(__dirname, "../../page/index.html");
let html = fs.readFileSync(PAGE, "utf8");
const src = JSON.parse(fs.readFileSync(path.join(__dirname, "prelims-2016-2019.json"), "utf8"));
const bm = html.match(/<script type="application\/json" id="d-bank">(.*?)<\/script>/s);
if(!bm) throw new Error("d-bank not found; nothing written");
const bank = JSON.parse(bm[1]).filter(function(p){ return !/^prelims-(2016|2017|2018|2019)-gs1$/.test(p.id); });
Object.keys(src).forEach(function(y){
  const qs = src[y].filter(function(q){ return q.text && q.text.length > 15; }).map(function(q){ return {qno:"", text:q.text, options:q.options}; });   // the scan mixes the Hindi column into the first pages, so the printed numbers are not kept
  bank.push({exam:"prelims", paper:"GS Paper I", year:+y, complete:false,
    source:"Read by OCR from the scanned UPSC paper (English). A few words may be misread and " + (100 - qs.length) + " question" + (100 - qs.length === 1 ? "" : "s") + " could not be read. No answer key.",
    count:qs.length, id:"prelims-" + y + "-gs1", questions:qs});
});
bank.sort(function(a, b){ return a.year - b.year || (a.exam < b.exam ? -1 : 1) || (a.id < b.id ? -1 : 1); });
html = html.replace(bm[0], function(){ return '<script type="application/json" id="d-bank">' + JSON.stringify(bank).replace(/</g, "\\u003c") + '</script>'; });
fs.writeFileSync(PAGE, html); console.log("d-bank:", bank.length, "papers");
