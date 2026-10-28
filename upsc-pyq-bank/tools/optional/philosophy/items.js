// The official UPSC Philosophy syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I has items 1-20 (History and Problems of Philosophy); Paper II has two headings with items 1-10 each,
// Socio-Political Philosophy and Philosophy of Religion. The ids are I-1 ... I-20, II-S1 ... II-S10 (Socio-Political) and II-R1 ... II-R10 (Religion).
// Source text: ../../syllabus/official-2026/philosophy.txt (the file holds Philosophy only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own words, copied as printed).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/philosophy.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*PHILOSOPHY\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|HISTORY|MANAGEMENT|MATHEMATICS|PSYCHOLOGY|SOCIOLOGY/.test(raw)) throw new Error("philosophy syllabus file must hold Philosophy only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const p1 = lines.findIndex(function(l){ return /^\s*PAPER-I\s*$/.test(l); }), p2 = lines.findIndex(function(l){ return /^\s*PAPER-II\s*$/.test(l); });
if(p1 < 0 || p2 < 0) throw new Error("philosophy syllabus: paper headings not found");
const SHORT = {
  "I-1": "Plato and Aristotle", "I-2": "Rationalism: Descartes, Spinoza, Leibniz", "I-3": "Empiricism: Locke, Berkeley, Hume", "I-4": "Kant",
  "I-5": "Hegel", "I-6": "Moore, Russell and early Wittgenstein", "I-7": "Logical Positivism", "I-8": "Later Wittgenstein", "I-9": "Phenomenology (Husserl)",
  "I-10": "Existentialism: Kierkegaard, Sartre, Heidegger", "I-11": "Quine and Strawson", "I-12": "Carvaka", "I-13": "Jainism", "I-14": "Schools of Buddhism",
  "I-15": "Nyaya-Vaisesika", "I-16": "Samkhya", "I-17": "Yoga", "I-18": "Mimamsa", "I-19": "Schools of Vedanta", "I-20": "Aurobindo",
  "II-S1": "Social and political ideals: equality, justice, liberty", "II-S2": "Sovereignty: Austin, Bodin, Laski, Kautilya", "II-S3": "Individual and State: rights, duties, accountability",
  "II-S4": "Forms of government: monarchy, theocracy, democracy", "II-S5": "Political ideologies: anarchism, Marxism, socialism", "II-S6": "Humanism, secularism, multi-culturalism",
  "II-S7": "Crime and punishment", "II-S8": "Development and social progress", "II-S9": "Gender discrimination", "II-S10": "Caste discrimination: Gandhi and Ambedkar",
  "II-R1": "Notions of God", "II-R2": "Proofs for the existence of God", "II-R3": "Problem of evil", "II-R4": "Soul: immortality, rebirth, liberation", "II-R5": "Reason, revelation and faith",
  "II-R6": "Religious experience", "II-R7": "Religion without God", "II-R8": "Religion and morality", "II-R9": "Religious pluralism and absolute truth", "II-R10": "Nature of religious language"
};
function read(from, to, prefix, n){
  const got = [];
  lines.slice(from, to).forEach(function(l){
    const m = /^\s*(\d{1,2})\.\s+(\S.*)$/.exec(l);
    if(m && +m[1] === got.length + 1){ got.push(m[2]); return; }
    if(got.length && l.trim() && !/^\s*(PAPER|History and Problems|Socio-Political Philosophy|Philosophy of Religion)/.test(l)) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== n) throw new Error("philosophy syllabus " + prefix + ": " + got.length + " items, expected " + n);
  return got.map(function(txt, k){ return {id:prefix + (k + 1), txt:txt.replace(/\s+/g, " ").replace(/\bldeals\b/, "Ideals").trim()}; });
}
const pr = lines.findIndex(function(l, i){ return i > p2 && /^\s*Philosophy of Religion\s*$/.test(l); });
const ss = lines.findIndex(function(l, i){ return i > p2 && /^\s*Socio-Political Philosophy\s*$/.test(l); });
if(pr < 0 || ss < 0) throw new Error("philosophy syllabus: Paper II headings not found");
const items = [];
read(p1 + 1, p2, "I-", 20).forEach(function(x){ items.push({id:x.id, pp:1, t:SHORT[x.id], full:x.txt}); });
read(ss + 1, pr, "II-S", 10).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:x.txt}); });
read(pr + 1, lines.length, "II-R", 10).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:x.txt}); });
items.forEach(function(it){ if(!it.t) throw new Error("philosophy: no short heading for " + it.id); });
if(items.length !== 40) throw new Error("philosophy syllabus items: " + items.length + " (expected 40)");
module.exports.items = items;
