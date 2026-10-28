// The official UPSC Political Science and International Relations syllabus (Examination Notice 05/2026-CSE, Appendix I), item by item.
// UPSC numbers the items itself: Paper I has Section A (Political Theory and Indian Politics, items 1-10) and Section B (Indian Government and Politics, items 1-11);
// Paper II has Section A (Comparative Political Analysis and International Politics, items 1-11) and Section B (India and the World, items 1-8).
// The ids are I-A1 ... I-A10, I-B1 ... I-B11, II-A1 ... II-A11, II-B1 ... II-B8.
// Source text: ../../syllabus/official-2026/political-science-and-international-relations.txt (the file holds this subject only).
// `t` is a short heading for lists; `full` is the official wording (UPSC's own words, copied as printed, typing slips of the printed notice corrected).
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/political-science-and-international-relations.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*POLITICAL SCIENCE AND INTERNATIONAL\s*RELATIONS\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|MANAGEMENT|MATHEMATICS|PSYCHOLOGY|SOCIOLOGY|PHILOSOPHY/.test(raw)) throw new Error("political science syllabus file must hold Political Science and International Relations only");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
function find(re, from){ const i = lines.findIndex(function(l, k){ return k >= (from || 0) && re.test(l); }); if(i < 0) throw new Error("political science syllabus: heading not found " + re); return i; }
const p1 = find(/^\s*PAPER-\s*I\s*$/), b1 = find(/^\s*Indian Government and Politics\s*$/, p1), p2 = find(/^\s*PAPER-II\s*$/, b1), b2 = find(/^\s*India and the World\s*$/, p2);
const SHORT = {
  "I-A1": "Political theory: meaning and approaches", "I-A2": "Theories of the state", "I-A3": "Justice: Rawls and his communitarian critics", "I-A4": "Equality, equality and freedom, affirmative action",
  "I-A5": "Rights and human rights", "I-A6": "Democracy: classical and contemporary theories, models", "I-A7": "Power: hegemony, ideology, legitimacy", "I-A8": "Political ideologies",
  "I-A9": "Indian political thought", "I-A10": "Western political thought",
  "I-B1": "Indian nationalism and perspectives on the national movement", "I-B2": "Making of the Indian Constitution", "I-B3": "Salient features of the Constitution", "I-B4": "Principal organs of the Union and State governments",
  "I-B5": "Grassroots democracy: Panchayati Raj and municipal government", "I-B6": "Statutory institutions and commissions", "I-B7": "Federalism", "I-B8": "Planning and economic development",
  "I-B9": "Caste, religion and ethnicity in politics", "I-B10": "Party system, pressure groups, electoral behaviour", "I-B11": "Social movements",
  "II-A1": "Comparative politics: approaches and limitations", "II-A2": "The state in comparative perspective", "II-A3": "Politics of representation and participation", "II-A4": "Globalisation",
  "II-A5": "Approaches to the study of International Relations", "II-A6": "Key concepts in International Relations", "II-A7": "Changing international political order", "II-A8": "Evolution of the international economic system",
  "II-A9": "United Nations", "II-A10": "Regionalisation of world politics", "II-A11": "Contemporary global concerns",
  "II-B1": "Indian foreign policy", "II-B2": "India and the Non-Alignment Movement", "II-B3": "India and South Asia", "II-B4": "India and the Global South",
  "II-B5": "India and the global centres of power", "II-B6": "India and the UN system", "II-B7": "India and the nuclear question", "II-B8": "Recent developments in Indian foreign policy"
};
function read(from, to, prefix, n){
  const got = [];
  lines.slice(from, to).forEach(function(l){
    const m = /^\s*(\d{1,2})\.\s+(\S.*)$/.exec(l);
    if(m && +m[1] === got.length + 1){ got.push(m[2]); return; }
    if(got.length && l.trim() && !/^\s*(PAPER|Comparative Politics and International|Comparative Political Analysis|Political Theory and Indian Politics|Indian Government and Politics|India and the World\s*$)/.test(l)) got[got.length - 1] += " " + l.trim();
  });
  if(got.length !== n) throw new Error("political science syllabus " + prefix + ": " + got.length + " items, expected " + n);
  return got.map(function(txt, k){ return {id:prefix + (k + 1), txt:txt.replace(/\s+/g, " ").replace(/Pluiralist/, "Pluralist").replace(/Rawl’s/, "Rawls’").replace(/Non-\s+cooperation/, "Non-cooperation").replace(/Transational/, "Transnational").replace(/Brettonwoods/, "Bretton Woods").replace(/APEC, AARC/, "APEC, SAARC").trim()}; });
}
const items = [];
read(p1 + 1, b1, "I-A", 10).forEach(function(x){ items.push({id:x.id, pp:1, t:SHORT[x.id], full:x.txt}); });
read(b1 + 1, p2, "I-B", 11).forEach(function(x){ items.push({id:x.id, pp:1, t:SHORT[x.id], full:x.txt}); });
read(p2 + 1, b2, "II-A", 11).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:x.txt}); });
read(b2 + 1, lines.length, "II-B", 8).forEach(function(x){ items.push({id:x.id, pp:2, t:SHORT[x.id], full:x.txt}); });
items.forEach(function(it){ if(!it.t) throw new Error("political science: no short heading for " + it.id); });
if(items.length !== 40) throw new Error("political science syllabus items: " + items.length + " (expected 40)");
module.exports.items = items;
