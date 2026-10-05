// Writes the Planner's Anthropology chapter list (CURR_OPT["Anthropology"]) and the chapter -> official item lookup (ANTHRO_LEAF) in page/index.html
// from the 55 official items in anthropology.items.js. One Planner chapter = one official item.
//   node upsc-pyq-bank/tools/optional/build-planner.js
const fs = require("fs"), path = require("path");
const PAGE = path.join(__dirname, "../../page/index.html"), ITEMS = require("./anthropology.items.js").items;
let html = fs.readFileSync(PAGE, "utf8");
const TOPIC = {   // section number -> Planner topic name (the official syllabus numbers its items; these headings only group them)
  1:{1:"Anthropology, human evolution and prehistory", 2:"Culture, society, marriage, family and kinship", 3:"Economic organisation", 4:"Political organisation and social control", 5:"Religion", 6:"Anthropological theories", 7:"Culture, language and communication", 8:"Research methods in anthropology", 9:"Human genetics, race, ecology and epidemiology", 10:"Human growth and development", 11:"Demography and fertility", 12:"Applications of anthropology"},
  2:{1:"Indian culture and civilisation", 2:"Demographic profile of India", 3:"Traditional Indian social system, caste and religion", 4:"Anthropology in India", 5:"Village, minorities and social change", 6:"Tribal situation and problems", 7:"Weaker sections, tribal change and ethnicity", 8:"Religion and the nation state", 9:"Tribal policy and applied anthropology"}
};
const tree = {"Paper I":{}, "Paper II":{}}, leaf = {};
ITEMS.forEach(function(it){
  const num = it.id.replace("II-", ""), sec = +num.split(".")[0], grp = it.pp === 1 ? "Paper I" : "Paper II", topic = TOPIC[it.pp][sec];
  if(!topic) throw new Error("no topic for " + it.id);
  const unit = num + "  " + it.t.split(":")[0].trim();
  (tree[grp][topic] = tree[grp][topic] || []).push(unit);
  leaf[topic + "|" + unit] = [it.id];
});
const cur = '  "Anthropology": ' + JSON.stringify(tree, null, 2).replace(/\n/g, "\n  ") + ',\n';
const a = html.indexOf('  "Anthropology": CT({'), b = html.indexOf('  "Geography": CT({', a);
if(a < 0 || b < 0){ const a2 = html.indexOf('  "Anthropology": {\n    "Paper I"'); if(a2 < 0) throw new Error("CURR_OPT block not found"); html = html.slice(0, a2) + cur + html.slice(html.indexOf('  "Geography": CT({', a2)); }
else html = html.slice(0, a) + cur + html.slice(b);
const la = html.indexOf("var ANTHRO_LEAF = {"), lb = html.indexOf("\nvar anthroLeafMemo", la);
html = html.slice(0, la) + "var ANTHRO_LEAF = " + JSON.stringify(leaf, null, 1) + ";" + html.slice(lb);
fs.writeFileSync(PAGE, html);
console.log("chapters:", Object.keys(leaf).length, "| Paper I topics:", Object.keys(tree["Paper I"]).length, "| Paper II topics:", Object.keys(tree["Paper II"]).length);
