// The official UPSC Psychology syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I (Foundations of Psychology) has items 1-14 and Paper II (Psychology: Issues and applications) has items 1-14.
// The ids are I-1 ... I-14 and II-1 ... II-14.
// Source text: ../../syllabus/official-2026/psychology.txt (the file holds Psychology only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own words, typing slips of the printed notice corrected).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/psychology.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*PSYCHOLOGY\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|MANAGEMENT|MATHEMATICS|SOCIOLOGY|PHILOSOPHY/.test(raw)) throw new Error("psychology syllabus file must hold Psychology only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const p1 = lines.findIndex(function(l){ return /^\s*PAPER-I\s*$/.test(l); }), p2 = lines.findIndex(function(l){ return /^\s*PAPER-II\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("psychology syllabus: paper headings not found");
const SHORT = {
  "I-1": "Introduction: definition, history, scientific methods", "I-2": "Methods of psychology", "I-3": "Research methods and statistics", "I-4": "Development of human behaviour",
  "I-5": "Sensation, attention and perception", "I-6": "Learning", "I-7": "Memory", "I-8": "Thinking and problem solving", "I-9": "Motivation and emotion",
  "I-10": "Intelligence and aptitude", "I-11": "Personality", "I-12": "Attitudes, values and interests", "I-13": "Language and communication", "I-14": "Issues and perspectives in modern psychology",
  "II-1": "Psychological measurement of individual differences", "II-2": "Psychological well-being and mental disorders", "II-3": "Therapeutic approaches", "II-4": "Work psychology and organisational behaviour",
  "II-5": "Application of psychology to education", "II-6": "Community psychology", "II-7": "Rehabilitation psychology", "II-8": "Application of psychology to disadvantaged groups",
  "II-9": "Psychological problems of social integration", "II-10": "Psychology in information technology and mass media", "II-11": "Psychology and economic development",
  "II-12": "Psychology of environment, population and technology", "II-13": "Psychology in other fields: military, sports, media, terrorism", "II-14": "Psychology of gender"
};
function read(from, to, prefix, n){
  const got = [];
  lines.slice(from, to).forEach(function(l){
    const m = /^\s*(\d{1,2})\.\s*(\S.*)$/.exec(l);
    if(m && +m[1] === got.length + 1){ got.push(m[2]); return; }
    if(got.length && l.trim() && !/^\s*(PAPER|Foundations of Psychology|Psychology : Issues and applications)/.test(l)) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== n) throw new Error("psychology syllabus " + prefix + ": " + got.length + " items, expected " + n);
  return got.map(function(txt, k){ return {id:prefix + (k + 1), txt:txt.replace(/\s+/g, " ").replace(/Shot-term/, "Short-term").replace(/Gulford/, "Guilford").replace(/predispotion/, "predisposition").replace(/commu-\s*nication/, "communication").replace(/consciousnessleep-wak/, "consciousness, sleep-wake").replace(/casual factores/, "causal factors").replace(/Casual factors/, "Causal factors").replace(/leadersip/, "leadership").replace(/Senitivity/, "Sensitivity").replace(/entreprenures/, "entrepreneurs").replace(/psycological/, "psychological").replace(/Gestaltalist/, "Gestaltist").trim()}; });
}
const items = [];
read(p1 + 1, p2, "I-", 14).forEach(function(x){ items.push({id:x.id, pp:1, t:SHORT[x.id], full:x.txt}); });
read(p2 + 1, lines.length, "II-", 14).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:x.txt}); });
items.forEach(function(it){ if(!it.t) throw new Error("psychology: no short heading for " + it.id); });
if(items.length !== 28) throw new Error("psychology syllabus items: " + items.length + " (expected 28)");
module.exports.items = items;
