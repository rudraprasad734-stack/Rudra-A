// The official UPSC Law syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers the items itself inside six headings: Paper I has Constitutional and administrative law (1-16) and International law (1-15);
// Paper II has Law of crimes (1-16), Law of torts (1-13), Law of contracts and mercantile law (1-13) and Contemporary legal developments (1-8).
// So the ids are CA-1 ... CA-16, IL-1 ... IL-15 (Paper I) and LC-1 ... LC-16, LT-1 ... LT-13, LK-1 ... LK-13, CD-1 ... CD-8 (Paper II).
// Source text: ../../syllabus/official-2026/law.txt (the file holds Law only; it is cut before the literature note).
// `t` is a short heading for lists; `full` is the official wording (sub-parts (a), (b) ... stay inside their item).
const fs = require("fs"), path = require("path");
let raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/law.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*LAW\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS|HISTORY/.test(raw)) throw new Error("law syllabus file must hold Law only");
const end = raw.search(/Literature of the following languages/); if(end < 0) throw new Error("law syllabus: literature note not found");
const lines = raw.slice(0, end).split("\n").filter(function(l){ return !/^\s*\d{2,3}\s*$/.test(l); });
const SECTIONS = [   // heading regex, id prefix, paper, number of items, short headings
  {re:/^\s*Constitutional and administrative Law/i, p:"CA", pp:1, n:16, t:["Constitution and constitutionalism", "Fundamental rights, PIL and legal aid", "Fundamental rights, directive principles and fundamental duties", "President and the Council of Ministers", "Governor and his powers", "Supreme Court and the High Courts", "Centre, States and local bodies", "Legislative powers, privileges and immunities", "Services, public service commissions and Election Commission", "Emergency provisions", "Amendment of the Constitution", "Principles of natural justice", "Delegated legislation", "Separation of powers and constitutional governance", "Judicial review of administrative action", "Ombudsman: Lokayukta and Lokpal"]},
  {re:/^\s*International Law\s*:/i, p:"IL", pp:1, n:15, t:["Nature and definition of international law", "International law and municipal law", "State recognition and State succession", "Law of the sea", "Individuals: nationality, statelessness and human rights", "Territorial jurisdiction, extradition and asylum", "Treaties", "United Nations", "Peaceful settlement of disputes", "Lawful recourse to force", "International humanitarian law", "Nuclear weapons and non-proliferation", "International terrorism and the International Criminal Court", "New International Economic Order and monetary law", "Protection of the human environment"]},
  {re:/^\s*Law of Crimes/i, p:"LC", pp:2, n:16, t:["General principles of criminal liability", "Kinds of punishment and capital punishment", "Preparation and criminal attempt", "General exceptions", "Joint and constructive liability", "Abetment", "Criminal conspiracy", "Offences against the State", "Offences against public tranquility", "Offences against the human body", "Offences against property", "Offences against women", "Defamation", "Prevention of Corruption Act, 1988", "Protection of Civil Rights Act, 1955", "Plea bargaining"]},
  {re:/^\s*Law of Torts/i, p:"LT", pp:2, n:13, t:["Nature and definition of tort", "Fault, strict liability and absolute liability", "Vicarious liability and State liability", "General defences", "Joint tortfeasors", "Remedies", "Negligence", "Defamation", "Nuisance", "Conspiracy", "False imprisonment", "Malicious prosecution", "Consumer Protection Act"]},
  {re:/^\s*Law of Contracts and Mercantile Law/i, p:"LK", pp:2, n:13, t:["Nature and formation of contract and e-contract", "Factors vitiating free consent", "Void, voidable, illegal and unenforceable agreements", "Performance and discharge of contracts", "Quasi-contracts", "Consequences of breach of contract", "Indemnity, guarantee and insurance", "Contract of agency", "Sale of goods and hire purchase", "Partnership", "Negotiable Instruments Act, 1881", "Arbitration and Conciliation Act, 1996", "Standard form contracts"]},
  {re:/^\s*Contemporary Legal Developments/i, p:"CD", pp:2, n:8, t:["Public interest litigation", "Intellectual property rights", "Information technology and cyber law", "Competition law", "Alternative dispute resolution", "Major statutes of environmental law", "Right to Information Act", "Trial by media"]},
];
const items = [];
SECTIONS.forEach(function(S, si){
  const a = lines.findIndex(function(l){ return S.re.test(l); });
  if(a < 0) throw new Error("law syllabus: heading not found: " + S.p);
  const nextS = SECTIONS[si + 1], b = nextS ? lines.findIndex(function(l, i){ return i > a && nextS.re.test(l); }) : lines.length;
  if(b < 0) throw new Error("law syllabus: next heading not found after " + S.p);
  const body = lines.slice(a + 1, b), got = [];
  body.forEach(function(l){ const m = /^\s*(\d{1,2})\.\s+(.*)$/.exec(l); if(m && +m[1] === got.length + 1) got.push(m[2]); else if(got.length && l.trim()) got[got.length - 1] += " " + l.trim(); });
  if(got.length !== S.n) throw new Error("law syllabus: " + S.p + " has " + got.length + " items, expected " + S.n);
  got.forEach(function(txt, k){ items.push({id:S.p + "-" + (k + 1), pp:S.pp, t:S.t[k], full:lines[a].replace(/[:—\-\s]+$/, "").trim() + " : " + txt.replace(/\s+/g, " ").trim()}); });
});
if(items.length !== 81) throw new Error("law syllabus items: " + items.length + " (expected 31 + 50)");
module.exports.items = items;
