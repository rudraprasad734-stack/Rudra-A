// The official UPSC History syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers the topics itself: Paper I has 1-24 and Paper II has 1-27, so the ids are I-1 ... I-24 and II-1 ... II-27.
// Source text: ../../syllabus/official-2026/history.txt (the file holds History only).
// `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
let raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/history.txt"), "utf8").replace(/\x0c/g, "");
if(!/^\s*HISTORY\b/.test(raw) || /GEOGRAPHY|GEOLOGY|ECONOMICS/.test(raw)) throw new Error("history syllabus file must hold History only");
raw = raw.split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); }).join("\n").replace(/\s+/g, " ").trim();
const cut2 = raw.search(/PAPER-II/); if(cut2 < 0) throw new Error("history syllabus: Paper II marker not found");
const T1 = ["Sources", "Pre-history and proto-history", "Indus Valley Civilization", "Megalithic cultures", "Aryans and Vedic period", "Period of Mahajanapadas", "Mauryan Empire",
  "Post-Mauryan period", "Early state and society in Eastern India, Deccan and South India", "Guptas, Vakatakas and Vardhanas", "Regional states during the Gupta era",
  "Themes in early Indian cultural history", "Early medieval India, 750-1200", "Cultural traditions in India, 750-1200", "The thirteenth century", "The fourteenth century",
  "Society, culture and economy in the thirteenth and fourteenth centuries", "The fifteenth and early sixteenth century: political developments and economy",
  "The fifteenth and early sixteenth century: society and culture", "Akbar", "Mughal Empire in the seventeenth century", "Economy and society in the sixteenth and seventeenth centuries",
  "Culture during the Mughal Empire", "The eighteenth century"];
const T2 = ["European penetration into India", "British expansion in India", "Early structure of the British Raj", "Economic impact of British colonial rule", "Social and cultural developments",
  "Social and religious reform movements", "Indian response to British rule", "Birth of Indian nationalism", "Rise of Gandhi", "Constitutional developments, 1858-1935",
  "Other strands in the national movement", "Politics of separatism", "Consolidation as a nation", "Caste and ethnicity after 1947", "Economic development and political change",
  "Enlightenment and modern ideas", "Origins of modern politics", "Industrialization", "Nation-state system", "Imperialism and colonialism", "Revolution and counter-revolution",
  "World wars", "The world after World War II", "Liberation from colonial rule", "Decolonization and underdevelopment", "Unification of Europe",
  "Disintegration of the Soviet Union and the rise of the unipolar world"];
const items = [];
function add(text, titles, prefix, pp){
  let at = 0; const pos = [];
  titles.forEach(function(t, k){
    const m = new RegExp("(?:^|\\s)" + (k + 1) + "\\.\\s+(?=[A-Z(])").exec(text.slice(at));
    if(!m) throw new Error("history syllabus: item not found: " + prefix + (k + 1) + " " + t);
    pos.push(at + m.index + m[0].search(/\S/)); at = pos[k] + 2;
  });
  titles.forEach(function(t, k){
    const body = text.slice(pos[k], k + 1 < titles.length ? pos[k + 1] : text.length).replace(/^\d+\.\s+/, "").trim();
    items.push({id:prefix + (k + 1), pp:pp, t:t, full:body});
  });
}
add(raw.slice(raw.indexOf("PAPER I") + 7, cut2), T1, "I-", 1);
add(raw.slice(cut2 + 8), T2, "II-", 2);
if(items.length !== 51) throw new Error("history syllabus items: " + items.length + " (expected 24 + 27)");
module.exports.items = items;
