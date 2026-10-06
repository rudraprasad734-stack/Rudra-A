// Writes the Planner's chapter lists for the optionals that have a question analysis, in page/index.html:
//   CURR_OPT["Anthropology"] + ANTHRO_LEAF : one chapter per official item (55) from anthropology.items.js
//   CURR_OPT["Agriculture"]  + AGRI_LEAF   : one chapter per syllabus sub-topic (105) from <script id="d-agri"> (run agriculture/build-agriculture.js first)
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
const la = html.indexOf("var ANTHRO_LEAF = {"), lb = html.indexOf("\nvar AGRI_LEAF = {", la) >= 0 ? html.indexOf("\nvar AGRI_LEAF = {", la) : html.indexOf("\nvar optLeafMemo", la);
if(la < 0 || lb < 0) throw new Error("build-planner: ANTHRO_LEAF block not found, nothing written");
html = html.slice(0, la) + "var ANTHRO_LEAF = " + JSON.stringify(leaf, null, 1) + ";" + html.slice(lb);
fs.writeFileSync(PAGE, html);
console.log("chapters:", Object.keys(leaf).length, "| Paper I topics:", Object.keys(tree["Paper I"]).length, "| Paper II topics:", Object.keys(tree["Paper II"]).length);

// ---------------------------------------------------------------- Agriculture
const ag = JSON.parse(html.match(/<script type="application\/json" id="d-agri">(.*?)<\/script>/s)[1]);
const agTree = {"Paper I":{}, "Paper II":{}}, agLeaf = {}, perItem = {};
ag.topics.forEach(function(t){
  const it = ag.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
  perItem[it.id] = (perItem[it.id] || 0) + 1;
  const topic = it.id + "  " + it.t, unit = it.id + "." + perItem[it.id] + "  " + t.t;
  (agTree[grp][topic] = agTree[grp][topic] || []).push(unit);
  agLeaf[topic + "|" + unit] = [t.id];
});
{
  let h2 = fs.readFileSync(PAGE, "utf8");
  const cur2 = '  "Agriculture": ' + JSON.stringify(agTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a2 = h2.indexOf('  "Agriculture": {\n    "Paper I"');
  if(a2 >= 0){ const e2 = h2.indexOf('\n  "', a2 + 20); let b2 = a2; const re = /\n  "[A-Z]/g; re.lastIndex = a2 + 20; const m = re.exec(h2); b2 = m.index + 1; h2 = h2.slice(0, a2) + cur2 + h2.slice(b2); }
  else { const g = h2.indexOf('  "Geography": CT({'); h2 = h2.slice(0, g) + cur2 + h2.slice(g); }
  const la2 = h2.indexOf("var AGRI_LEAF = {");
  const leafTxt = "var AGRI_LEAF = " + JSON.stringify(agLeaf, null, 1) + ";";
  if(la2 >= 0){ const e2b = h2.indexOf("\n};", la2); if(e2b < 0) throw new Error("build-planner: AGRI_LEAF block not closed, nothing written"); const lb2 = h2.indexOf("\n", e2b + 1); h2 = h2.slice(0, la2) + leafTxt + h2.slice(lb2); }
  else { const lb = h2.indexOf("\n// Optional subjects that have a question analysis"); if(lb < 0) throw new Error("build-planner: insertion point not found, nothing written"); h2 = h2.slice(0, lb) + "\n" + leafTxt + h2.slice(lb); }
  fs.writeFileSync(PAGE, h2);
  console.log("Agriculture chapters:", Object.keys(agLeaf).length, "| Paper I topics:", Object.keys(agTree["Paper I"]).length, "| Paper II topics:", Object.keys(agTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Animal Husbandry and Veterinary Science (one chapter per syllabus sub-topic)
{
  const NAME = "Animal Husbandry and Veterinary Science";
  let h3 = fs.readFileSync(PAGE, "utf8");
  const m3 = h3.match(/<script type="application\/json" id="d-ahvs">(.*?)<\/script>/s);
  if(!m3) throw new Error("build-planner: d-ahvs not found (run animal-husbandry/build-ahvs.js first), nothing written");
  const ah = JSON.parse(m3[1]);
  const ahTree = {"Paper I":{}, "Paper II":{}}, ahLeaf = {}, per = {};
  ah.topics.forEach(function(t){
    const it = ah.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per[it.id] = (per[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per[it.id] + "  " + t.t;
    (ahTree[grp][topic] = ahTree[grp][topic] || []).push(unit);
    ahLeaf[topic + "|" + unit] = [t.id];
  });
  const cur3 = '  "' + NAME + '": ' + JSON.stringify(ahTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a3 = h3.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a3 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a3 + 20; const m = re.exec(h3); if(!m) throw new Error("build-planner: end of AHVS block not found, nothing written"); h3 = h3.slice(0, a3) + cur3 + h3.slice(m.index + 1); }
  else { const g = h3.indexOf('  "Geography": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h3 = h3.slice(0, g) + cur3 + h3.slice(g); }
  const la3 = h3.indexOf("var AHVS_LEAF = {"), leafTxt3 = "var AHVS_LEAF = " + JSON.stringify(ahLeaf, null, 1) + ";";
  if(la3 >= 0){ const e3 = h3.indexOf("\n};", la3); if(e3 < 0) throw new Error("build-planner: AHVS_LEAF block not closed, nothing written"); h3 = h3.slice(0, la3) + leafTxt3 + h3.slice(h3.indexOf("\n", e3 + 1)); }
  else { const lb = h3.indexOf("\n// Optional subjects that have a question analysis"); if(lb < 0) throw new Error("build-planner: insertion point not found, nothing written"); h3 = h3.slice(0, lb) + "\n" + leafTxt3 + h3.slice(lb); }
  fs.writeFileSync(PAGE, h3);
  console.log(NAME + " chapters:", Object.keys(ahLeaf).length, "| Paper I topics:", Object.keys(ahTree["Paper I"]).length, "| Paper II topics:", Object.keys(ahTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Botany (one chapter per syllabus sub-topic)
{
  const NAME = "Botany";
  let h4 = fs.readFileSync(PAGE, "utf8");
  const m4 = h4.match(/<script type="application\/json" id="d-botany">(.*?)<\/script>/s);
  if(!m4) throw new Error("build-planner: d-botany not found (run botany/build-botany.js first), nothing written");
  const bt = JSON.parse(m4[1]);
  const btTree = {"Paper I":{}, "Paper II":{}}, btLeaf = {}, per = {};
  bt.topics.forEach(function(t){
    const it = bt.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per[it.id] = (per[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per[it.id] + "  " + t.t;
    (btTree[grp][topic] = btTree[grp][topic] || []).push(unit);
    btLeaf[topic + "|" + unit] = [t.id];
  });
  const cur4 = '  "' + NAME + '": ' + JSON.stringify(btTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a4 = h4.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a4 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a4 + 20; const m = re.exec(h4); if(!m) throw new Error("build-planner: end of Botany block not found, nothing written"); h4 = h4.slice(0, a4) + cur4 + h4.slice(m.index + 1); }
  else { const g = h4.indexOf('  "Geography": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h4 = h4.slice(0, g) + cur4 + h4.slice(g); }
  const la4 = h4.indexOf("var BOTANY_LEAF = {"), leafTxt4 = "var BOTANY_LEAF = " + JSON.stringify(btLeaf, null, 1) + ";";
  if(la4 >= 0){ const e4 = h4.indexOf("\n};", la4); if(e4 < 0) throw new Error("build-planner: BOTANY_LEAF block not closed, nothing written"); h4 = h4.slice(0, la4) + leafTxt4 + h4.slice(h4.indexOf("\n", e4 + 1)); }
  else { const lb = h4.indexOf("\n// Optional subjects that have a question analysis"); if(lb < 0) throw new Error("build-planner: insertion point not found, nothing written"); h4 = h4.slice(0, lb) + "\n" + leafTxt4 + h4.slice(lb); }
  fs.writeFileSync(PAGE, h4);
  console.log(NAME + " chapters:", Object.keys(btLeaf).length, "| Paper I topics:", Object.keys(btTree["Paper I"]).length, "| Paper II topics:", Object.keys(btTree["Paper II"]).length);
}
