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

// ---------------------------------------------------------------- Civil Engineering (one chapter per syllabus sub-topic)
{
  const NAME = "Civil Engineering";
  let h5 = fs.readFileSync(PAGE, "utf8");
  const m5 = h5.match(/<script type="application\/json" id="d-civil">(.*?)<\/script>/s);
  if(!m5) throw new Error("build-planner: d-civil not found (run botany/build-civil.js first), nothing written");
  const cv = JSON.parse(m5[1]);
  const cvTree = {"Paper I":{}, "Paper II":{}}, cvLeaf = {}, per = {};
  cv.topics.forEach(function(t){
    const it = cv.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per[it.id] = (per[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per[it.id] + "  " + t.t;
    (cvTree[grp][topic] = cvTree[grp][topic] || []).push(unit);
    cvLeaf[topic + "|" + unit] = [t.id];
  });
  const cur5 = '  "' + NAME + '": ' + JSON.stringify(cvTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a5 = h5.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a5 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a5 + 20; const m = re.exec(h5); if(!m) throw new Error("build-planner: end of Civil Engineering block not found, nothing written"); h5 = h5.slice(0, a5) + cur5 + h5.slice(m.index + 1); }
  else { const g = h5.indexOf('  "Geography": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h5 = h5.slice(0, g) + cur5 + h5.slice(g); }
  const la5 = h5.indexOf("var CIVIL_LEAF = {"), leafTxt5 = "var CIVIL_LEAF = " + JSON.stringify(cvLeaf, null, 1) + ";";
  if(la5 >= 0){ const e5 = h5.indexOf("\n};", la5); if(e5 < 0) throw new Error("build-planner: CIVIL_LEAF block not closed, nothing written"); h5 = h5.slice(0, la5) + leafTxt5 + h5.slice(h5.indexOf("\n", e5 + 1)); }
  else { const lb = h5.indexOf("\n// Optional subjects that have a question analysis"); if(lb < 0) throw new Error("build-planner: insertion point not found, nothing written"); h5 = h5.slice(0, lb) + "\n" + leafTxt5 + h5.slice(lb); }
  fs.writeFileSync(PAGE, h5);
  console.log(NAME + " chapters:", Object.keys(cvLeaf).length, "| Paper I topics:", Object.keys(cvTree["Paper I"]).length, "| Paper II topics:", Object.keys(cvTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Chemistry (one chapter per syllabus sub-topic)
{
  const NAME = "Chemistry";
  let h6 = fs.readFileSync(PAGE, "utf8");
  const m6 = h6.match(/<script type="application\/json" id="d-chem">(.*?)<\/script>/s);
  if(!m6) throw new Error("build-planner: d-chem not found (run chemistry/build-chemistry.js first), nothing written");
  const ch = JSON.parse(m6[1]);
  const chTree = {"Paper I":{}, "Paper II":{}}, chLeaf = {}, per6 = {};
  ch.topics.forEach(function(t){
    const it = ch.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per6[it.id] = (per6[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per6[it.id] + "  " + t.t;
    (chTree[grp][topic] = chTree[grp][topic] || []).push(unit);
    chLeaf[topic + "|" + unit] = [t.id];
  });
  const cur6 = '  "' + NAME + '": ' + JSON.stringify(chTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a6 = h6.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a6 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a6 + 20; const m = re.exec(h6); if(!m) throw new Error("build-planner: end of Chemistry block not found, nothing written"); h6 = h6.slice(0, a6) + cur6 + h6.slice(m.index + 1); }
  else { const g = h6.indexOf('  "Geography": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h6 = h6.slice(0, g) + cur6 + h6.slice(g); }
  const la6 = h6.indexOf("var CHEM_LEAF = {"), leafTxt6 = "var CHEM_LEAF = " + JSON.stringify(chLeaf, null, 1) + ";";
  if(la6 >= 0){ const e6 = h6.indexOf("\n};", la6); if(e6 < 0) throw new Error("build-planner: CHEM_LEAF block not closed, nothing written"); h6 = h6.slice(0, la6) + leafTxt6 + h6.slice(h6.indexOf("\n", e6 + 1)); }
  else { const lb6 = h6.indexOf("\n// Optional subjects that have a question analysis"); if(lb6 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h6 = h6.slice(0, lb6) + "\n" + leafTxt6 + h6.slice(lb6); }
  fs.writeFileSync(PAGE, h6);
  console.log(NAME + " chapters:", Object.keys(chLeaf).length, "| Paper I topics:", Object.keys(chTree["Paper I"]).length, "| Paper II topics:", Object.keys(chTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Commerce and Accountancy (one chapter per syllabus sub-topic)
{
  const NAME = "Commerce and Accountancy";
  let h7 = fs.readFileSync(PAGE, "utf8");
  const m7 = h7.match(/<script type="application\/json" id="d-comm">(.*?)<\/script>/s);
  if(!m7) throw new Error("build-planner: d-comm not found (run chemistry/build-commistry.js first), nothing written");
  const cm = JSON.parse(m7[1]);
  const cmTree = {"Paper I":{}, "Paper II":{}}, cmLeaf = {}, per7 = {};
  cm.topics.forEach(function(t){
    const it = cm.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per7[it.id] = (per7[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per7[it.id] + "  " + t.t;
    (cmTree[grp][topic] = cmTree[grp][topic] || []).push(unit);
    cmLeaf[topic + "|" + unit] = [t.id];
  });
  const cur7 = '  "' + NAME + '": ' + JSON.stringify(cmTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a7 = h7.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a7 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a7 + 20; const m = re.exec(h7); if(!m) throw new Error("build-planner: end of Commerce and Accountancy block not found, nothing written"); h7 = h7.slice(0, a7) + cur7 + h7.slice(m.index + 1); }
  else { const g = h7.indexOf('  "Geography": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h7 = h7.slice(0, g) + cur7 + h7.slice(g); }
  const la7 = h7.indexOf("var COMM_LEAF = {"), leafTxt7 = "var COMM_LEAF = " + JSON.stringify(cmLeaf, null, 1) + ";";
  if(la7 >= 0){ const e7 = h7.indexOf("\n};", la7); if(e7 < 0) throw new Error("build-planner: COMM_LEAF block not closed, nothing written"); h7 = h7.slice(0, la7) + leafTxt7 + h7.slice(h7.indexOf("\n", e7 + 1)); }
  else { const lb7 = h7.indexOf("\n// Optional subjects that have a question analysis"); if(lb7 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h7 = h7.slice(0, lb7) + "\n" + leafTxt7 + h7.slice(lb7); }
  fs.writeFileSync(PAGE, h7);
  console.log(NAME + " chapters:", Object.keys(cmLeaf).length, "| Paper I topics:", Object.keys(cmTree["Paper I"]).length, "| Paper II topics:", Object.keys(cmTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Economics (one chapter per syllabus sub-topic)
{
  const NAME = "Economics";
  let h8 = fs.readFileSync(PAGE, "utf8");
  const m8 = h8.match(/<script type="application\/json" id="d-econ">(.*?)<\/script>/s);
  if(!m8) throw new Error("build-planner: d-econ not found (run chemistry/build-econistry.js first), nothing written");
  const ec = JSON.parse(m8[1]);
  const ecTree = {"Paper I":{}, "Paper II":{}}, ecLeaf = {}, per8 = {};
  ec.topics.forEach(function(t){
    const it = ec.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per8[it.id] = (per8[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per8[it.id] + "  " + t.t;
    (ecTree[grp][topic] = ecTree[grp][topic] || []).push(unit);
    ecLeaf[topic + "|" + unit] = [t.id];
  });
  const cur8 = '  "' + NAME + '": ' + JSON.stringify(ecTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a8 = h8.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a8 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a8 + 20; const m = re.exec(h8); if(!m) throw new Error("build-planner: end of Economics block not found, nothing written"); h8 = h8.slice(0, a8) + cur8 + h8.slice(m.index + 1); }
  else { const g = h8.indexOf('  "Geography": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h8 = h8.slice(0, g) + cur8 + h8.slice(g); }
  const la8 = h8.indexOf("var ECON_LEAF = {"), leafTxt8 = "var ECON_LEAF = " + JSON.stringify(ecLeaf, null, 1) + ";";
  if(la8 >= 0){ const e8 = h8.indexOf("\n};", la8); if(e8 < 0) throw new Error("build-planner: ECON_LEAF block not closed, nothing written"); h8 = h8.slice(0, la8) + leafTxt8 + h8.slice(h8.indexOf("\n", e8 + 1)); }
  else { const lb8 = h8.indexOf("\n// Optional subjects that have a question analysis"); if(lb8 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h8 = h8.slice(0, lb8) + "\n" + leafTxt8 + h8.slice(lb8); }
  fs.writeFileSync(PAGE, h8);
  console.log(NAME + " chapters:", Object.keys(ecLeaf).length, "| Paper I topics:", Object.keys(ecTree["Paper I"]).length, "| Paper II topics:", Object.keys(ecTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Geography (one chapter per syllabus sub-topic)
{
  const NAME = "Geography";
  let h9 = fs.readFileSync(PAGE, "utf8");
  const m9 = h9.match(/<script type="application\/json" id="d-geog">(.*?)<\/script>/s);
  if(!m9) throw new Error("build-planner: d-geog not found (run chemistry/build-geogistry.js first), nothing written");
  const gg = JSON.parse(m9[1]);
  const ggTree = {"Paper I":{}, "Paper II":{}}, ggLeaf = {}, per9 = {};
  gg.topics.forEach(function(t){
    const it = gg.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per9[it.id] = (per9[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per9[it.id] + "  " + t.t;
    (ggTree[grp][topic] = ggTree[grp][topic] || []).push(unit);
    ggLeaf[topic + "|" + unit] = [t.id];
  });
  const cur9 = '  "' + NAME + '": ' + JSON.stringify(ggTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a9 = h9.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a9 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a9 + 20; const m = re.exec(h9); if(!m) throw new Error("build-planner: end of Geography block not found, nothing written"); h9 = h9.slice(0, a9) + cur9 + h9.slice(m.index + 1); }
  else { const g = h9.indexOf('  "Geography": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); const ge = h9.indexOf('\n  }),\n', g); if(ge < 0) throw new Error("build-planner: old Geography outline not closed, nothing written"); h9 = h9.slice(0, g) + cur9 + h9.slice(ge + '\n  }),\n'.length); }
  const la9 = h9.indexOf("var GEOG_LEAF = {"), leafTxt9 = "var GEOG_LEAF = " + JSON.stringify(ggLeaf, null, 1) + ";";
  if(la9 >= 0){ const e9 = h9.indexOf("\n};", la9); if(e9 < 0) throw new Error("build-planner: GEOG_LEAF block not closed, nothing written"); h9 = h9.slice(0, la9) + leafTxt9 + h9.slice(h9.indexOf("\n", e9 + 1)); }
  else { const lb9 = h9.indexOf("\n// Optional subjects that have a question analysis"); if(lb9 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h9 = h9.slice(0, lb9) + "\n" + leafTxt9 + h9.slice(lb9); }
  fs.writeFileSync(PAGE, h9);
  console.log(NAME + " chapters:", Object.keys(ggLeaf).length, "| Paper I topics:", Object.keys(ggTree["Paper I"]).length, "| Paper II topics:", Object.keys(ggTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Electrical Engineering (one chapter per syllabus sub-topic)
{
  const NAME = "Electrical Engineering";
  let h10 = fs.readFileSync(PAGE, "utf8");
  const m10 = h10.match(/<script type="application\/json" id="d-elec">(.*?)<\/script>/s);
  if(!m10) throw new Error("build-planner: d-elec not found (run electrical-engineering/build-electrical.js first), nothing written");
  const el = JSON.parse(m10[1]);
  const elTree = {"Paper I":{}, "Paper II":{}}, elLeaf = {}, per10 = {};
  el.topics.forEach(function(t){
    const it = el.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per10[it.id] = (per10[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per10[it.id] + "  " + t.t;
    (elTree[grp][topic] = elTree[grp][topic] || []).push(unit);
    elLeaf[topic + "|" + unit] = [t.id];
  });
  const cur10 = '  "' + NAME + '": ' + JSON.stringify(elTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a10 = h10.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a10 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a10 + 20; const m = re.exec(h10); if(!m) throw new Error("build-planner: end of Electrical Engineering block not found, nothing written"); h10 = h10.slice(0, a10) + cur10 + h10.slice(m.index + 1); }
  else { const g = h10.indexOf('  "Geography": {\n    "Paper I"'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h10 = h10.slice(0, g) + cur10 + h10.slice(g); }
  const la10 = h10.indexOf("var ELEC_LEAF = {"), leafTxt10 = "var ELEC_LEAF = " + JSON.stringify(elLeaf, null, 1) + ";";
  if(la10 >= 0){ const e10 = h10.indexOf("\n};", la10); if(e10 < 0) throw new Error("build-planner: ELEC_LEAF block not closed, nothing written"); h10 = h10.slice(0, la10) + leafTxt10 + h10.slice(h10.indexOf("\n", e10 + 1)); }
  else { const lb10 = h10.indexOf("\n// Optional subjects that have a question analysis"); if(lb10 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h10 = h10.slice(0, lb10) + "\n" + leafTxt10 + h10.slice(lb10); }
  fs.writeFileSync(PAGE, h10);
  console.log(NAME + " chapters:", Object.keys(elLeaf).length, "| Paper I topics:", Object.keys(elTree["Paper I"]).length, "| Paper II topics:", Object.keys(elTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Geology (one chapter per syllabus sub-topic)
{
  const NAME = "Geology";
  let h11 = fs.readFileSync(PAGE, "utf8");
  const m11 = h11.match(/<script type="application\/json" id="d-geol">(.*?)<\/script>/s);
  if(!m11) throw new Error("build-planner: d-geol not found (run geology/build-geology.js first), nothing written");
  const gl = JSON.parse(m11[1]);
  const glTree = {"Paper I":{}, "Paper II":{}}, glLeaf = {}, per11 = {};
  gl.topics.forEach(function(t){
    const it = gl.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per11[it.id] = (per11[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per11[it.id] + "  " + t.t;
    (glTree[grp][topic] = glTree[grp][topic] || []).push(unit);
    glLeaf[topic + "|" + unit] = [t.id];
  });
  const cur11 = '  "' + NAME + '": ' + JSON.stringify(glTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a11 = h11.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a11 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a11 + 20; const m = re.exec(h11); if(!m) throw new Error("build-planner: end of Geology block not found, nothing written"); h11 = h11.slice(0, a11) + cur11 + h11.slice(m.index + 1); }
  else { const g = h11.indexOf('  "Sociology": CT({'); if(g < 0) throw new Error("build-planner: insertion point not found, nothing written"); h11 = h11.slice(0, g) + cur11 + h11.slice(g); }
  const la11 = h11.indexOf("var GEOL_LEAF = {"), leafTxt11 = "var GEOL_LEAF = " + JSON.stringify(glLeaf, null, 1) + ";";
  if(la11 >= 0){ const e11 = h11.indexOf("\n};", la11); if(e11 < 0) throw new Error("build-planner: GEOL_LEAF block not closed, nothing written"); h11 = h11.slice(0, la11) + leafTxt11 + h11.slice(h11.indexOf("\n", e11 + 1)); }
  else { const lb11 = h11.indexOf("\n// Optional subjects that have a question analysis"); if(lb11 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h11 = h11.slice(0, lb11) + "\n" + leafTxt11 + h11.slice(lb11); }
  fs.writeFileSync(PAGE, h11);
  console.log(NAME + " chapters:", Object.keys(glLeaf).length, "| Paper I topics:", Object.keys(glTree["Paper I"]).length, "| Paper II topics:", Object.keys(glTree["Paper II"]).length);
}

// ---------------------------------------------------------------- History (one chapter per syllabus sub-topic)
{
  const NAME = "History";
  let h12 = fs.readFileSync(PAGE, "utf8");
  const m12 = h12.match(/<script type="application\/json" id="d-hist">(.*?)<\/script>/s);
  if(!m12) throw new Error("build-planner: d-hist not found (run history/build-history.js first), nothing written");
  const hs = JSON.parse(m12[1]);
  const hsTree = {"Paper I":{}, "Paper II":{}}, hsLeaf = {}, per12 = {};
  hs.topics.forEach(function(t){
    const it = hs.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per12[it.id] = (per12[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per12[it.id] + "  " + t.t;
    (hsTree[grp][topic] = hsTree[grp][topic] || []).push(unit);
    hsLeaf[topic + "|" + unit] = [t.id];
  });
  const cur12 = '  "' + NAME + '": ' + JSON.stringify(hsTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a12 = h12.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a12 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a12 + 20; const m = re.exec(h12); if(!m) throw new Error("build-planner: end of History block not found, nothing written"); h12 = h12.slice(0, a12) + cur12 + h12.slice(m.index + 1); }
  else { const g = h12.indexOf('  "History": CT({'); if(g < 0) throw new Error("build-planner: History placeholder not found, nothing written"); const ge = h12.indexOf('\n  })\n', g); if(ge < 0) throw new Error("build-planner: History placeholder not closed, nothing written"); h12 = h12.slice(0, g) + h12.slice(ge + '\n  })\n'.length); const so = h12.indexOf('  "Sociology": CT({'); if(so < 0) throw new Error("build-planner: insertion point not found, nothing written"); h12 = h12.slice(0, so) + cur12 + h12.slice(so); }
  const la12 = h12.indexOf("var HIST_LEAF = {"), leafTxt12 = "var HIST_LEAF = " + JSON.stringify(hsLeaf, null, 1) + ";";
  if(la12 >= 0){ const e12 = h12.indexOf("\n};", la12); if(e12 < 0) throw new Error("build-planner: HIST_LEAF block not closed, nothing written"); h12 = h12.slice(0, la12) + leafTxt12 + h12.slice(h12.indexOf("\n", e12 + 1)); }
  else { const lb12 = h12.indexOf("\n// Optional subjects that have a question analysis"); if(lb12 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h12 = h12.slice(0, lb12) + "\n" + leafTxt12 + h12.slice(lb12); }
  fs.writeFileSync(PAGE, h12);
  console.log(NAME + " chapters:", Object.keys(hsLeaf).length, "| Paper I topics:", Object.keys(hsTree["Paper I"]).length, "| Paper II topics:", Object.keys(hsTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Law (one chapter per syllabus sub-topic)
{
  const NAME = "Law";
  let h13 = fs.readFileSync(PAGE, "utf8");
  const m13 = h13.match(/<script type="application\/json" id="d-law">(.*?)<\/script>/s);
  if(!m13) throw new Error("build-planner: d-law not found (run history/build-lawory.js first), nothing written");
  const lw = JSON.parse(m13[1]);
  const lwTree = {"Paper I":{}, "Paper II":{}}, lwLeaf = {}, per13 = {};
  lw.topics.forEach(function(t){
    const it = lw.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per13[it.id] = (per13[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per13[it.id] + "  " + t.t;
    (lwTree[grp][topic] = lwTree[grp][topic] || []).push(unit);
    lwLeaf[topic + "|" + unit] = [t.id];
  });
  const cur13 = '  "' + NAME + '": ' + JSON.stringify(lwTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a13 = h13.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a13 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a13 + 20; const m = re.exec(h13); if(!m) throw new Error("build-planner: end of Law block not found, nothing written"); h13 = h13.slice(0, a13) + cur13 + h13.slice(m.index + 1); }
  else { const so = h13.indexOf('  "Sociology": CT({'); if(so < 0) throw new Error("build-planner: insertion point not found, nothing written"); h13 = h13.slice(0, so) + cur13 + h13.slice(so); }
  const la13 = h13.indexOf("var LAW_LEAF = {"), leafTxt13 = "var LAW_LEAF = " + JSON.stringify(lwLeaf, null, 1) + ";";
  if(la13 >= 0){ const e13 = h13.indexOf("\n};", la13); if(e13 < 0) throw new Error("build-planner: LAW_LEAF block not closed, nothing written"); h13 = h13.slice(0, la13) + leafTxt13 + h13.slice(h13.indexOf("\n", e13 + 1)); }
  else { const lb13 = h13.indexOf("\n// Optional subjects that have a question analysis"); if(lb13 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h13 = h13.slice(0, lb13) + "\n" + leafTxt13 + h13.slice(lb13); }
  fs.writeFileSync(PAGE, h13);
  console.log(NAME + " chapters:", Object.keys(lwLeaf).length, "| Paper I topics:", Object.keys(lwTree["Paper I"]).length, "| Paper II topics:", Object.keys(lwTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Management (one chapter per syllabus sub-topic)
{
  const NAME = "Management";
  let h14 = fs.readFileSync(PAGE, "utf8");
  const m14 = h14.match(/<script type="application\/json" id="d-management">(.*?)<\/script>/s);
  if(!m14) throw new Error("build-planner: d-management not found (run management/build-management.js first), nothing written");
  const mgm = JSON.parse(m14[1]);
  const mgTree = {"Paper I":{}, "Paper II":{}}, mgLeaf = {}, per14 = {};
  mgm.topics.forEach(function(t){
    const it = mgm.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per14[it.id] = (per14[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per14[it.id] + "  " + t.t;
    (mgTree[grp][topic] = mgTree[grp][topic] || []).push(unit);
    mgLeaf[topic + "|" + unit] = [t.id];
  });
  const cur14 = '  "' + NAME + '": ' + JSON.stringify(mgTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a14 = h14.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a14 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a14 + 20; const m = re.exec(h14); if(!m) throw new Error("build-planner: end of Management block not found, nothing written"); h14 = h14.slice(0, a14) + cur14 + h14.slice(m.index + 1); }
  else { const so = h14.indexOf('  "Sociology": CT({'); if(so < 0) throw new Error("build-planner: insertion point not found, nothing written"); h14 = h14.slice(0, so) + cur14 + h14.slice(so); }
  const la14 = h14.indexOf("var MGMT_LEAF = {"), leafTxt14 = "var MGMT_LEAF = " + JSON.stringify(mgLeaf, null, 1) + ";";
  if(la14 >= 0){ const e14 = h14.indexOf("\n};", la14); if(e14 < 0) throw new Error("build-planner: MGMT_LEAF block not closed, nothing written"); h14 = h14.slice(0, la14) + leafTxt14 + h14.slice(h14.indexOf("\n", e14 + 1)); }
  else { const lb14 = h14.indexOf("\n// Optional subjects that have a question analysis"); if(lb14 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h14 = h14.slice(0, lb14) + "\n" + leafTxt14 + h14.slice(lb14); }
  fs.writeFileSync(PAGE, h14);
  console.log(NAME + " chapters:", Object.keys(mgLeaf).length, "| Paper I topics:", Object.keys(mgTree["Paper I"]).length, "| Paper II topics:", Object.keys(mgTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Mathematics (one chapter per syllabus sub-topic)
{
  const NAME = "Mathematics";
  let h15 = fs.readFileSync(PAGE, "utf8");
  const m15 = h15.match(/<script type="application\/json" id="d-mathematics">(.*?)<\/script>/s);
  if(!m15) throw new Error("build-planner: d-mathematics not found (run management/build-mathematics.js first), nothing written");
  const mtm = JSON.parse(m15[1]);
  const mtTree = {"Paper I":{}, "Paper II":{}}, mtLeaf = {}, per15 = {};
  mtm.topics.forEach(function(t){
    const it = mtm.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per15[it.id] = (per15[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per15[it.id] + "  " + t.t;
    (mtTree[grp][topic] = mtTree[grp][topic] || []).push(unit);
    mtLeaf[topic + "|" + unit] = [t.id];
  });
  const cur15 = '  "' + NAME + '": ' + JSON.stringify(mtTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a15 = h15.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a15 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a15 + 20; const m = re.exec(h15); if(!m) throw new Error("build-planner: end of Mathematics block not found, nothing written"); h15 = h15.slice(0, a15) + cur15 + h15.slice(m.index + 1); }
  else { const so2 = h15.indexOf('  "Sociology": CT({'); if(so2 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h15 = h15.slice(0, so2) + cur15 + h15.slice(so2); }
  const la15 = h15.indexOf("var MATH_LEAF = {"), leafTxt15 = "var MATH_LEAF = " + JSON.stringify(mtLeaf, null, 1) + ";";
  if(la15 >= 0){ const e15 = h15.indexOf("\n};", la15); if(e15 < 0) throw new Error("build-planner: MATH_LEAF block not closed, nothing written"); h15 = h15.slice(0, la15) + leafTxt15 + h15.slice(h15.indexOf("\n", e15 + 1)); }
  else { const lb15 = h15.indexOf("\n// Optional subjects that have a question analysis"); if(lb15 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h15 = h15.slice(0, lb15) + "\n" + leafTxt15 + h15.slice(lb15); }
  fs.writeFileSync(PAGE, h15);
  console.log(NAME + " chapters:", Object.keys(mtLeaf).length, "| Paper I topics:", Object.keys(mtTree["Paper I"]).length, "| Paper II topics:", Object.keys(mtTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Mechanical Engineering (one chapter per syllabus sub-topic)
{
  const NAME = "Mechanical Engineering";
  let h16 = fs.readFileSync(PAGE, "utf8");
  const m16 = h16.match(/<script type="application\/json" id="d-mechanical">(.*?)<\/script>/s);
  if(!m16) throw new Error("build-planner: d-mechanical not found (run management/build-mechanical.js first), nothing written");
  const mem = JSON.parse(m16[1]);
  const meTree = {"Paper I":{}, "Paper II":{}}, meLeaf = {}, per16 = {};
  mem.topics.forEach(function(t){
    const it = mem.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per16[it.id] = (per16[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per16[it.id] + "  " + t.t;
    (meTree[grp][topic] = meTree[grp][topic] || []).push(unit);
    meLeaf[topic + "|" + unit] = [t.id];
  });
  const cur16 = '  "' + NAME + '": ' + JSON.stringify(meTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a16 = h16.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a16 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a16 + 20; const m = re.exec(h16); if(!m) throw new Error("build-planner: end of Mechanical Engineering block not found, nothing written"); h16 = h16.slice(0, a16) + cur16 + h16.slice(m.index + 1); }
  else { const so3 = h16.indexOf('  "Sociology": CT({'); if(so3 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h16 = h16.slice(0, so3) + cur16 + h16.slice(so3); }
  const la16 = h16.indexOf("var MECH_LEAF = {"), leafTxt16 = "var MECH_LEAF = " + JSON.stringify(meLeaf, null, 1) + ";";
  if(la16 >= 0){ const e16 = h16.indexOf("\n};", la16); if(e16 < 0) throw new Error("build-planner: MECH_LEAF block not closed, nothing written"); h16 = h16.slice(0, la16) + leafTxt16 + h16.slice(h16.indexOf("\n", e16 + 1)); }
  else { const lb16 = h16.indexOf("\n// Optional subjects that have a question analysis"); if(lb16 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h16 = h16.slice(0, lb16) + "\n" + leafTxt16 + h16.slice(lb16); }
  fs.writeFileSync(PAGE, h16);
  console.log(NAME + " chapters:", Object.keys(meLeaf).length, "| Paper I topics:", Object.keys(meTree["Paper I"]).length, "| Paper II topics:", Object.keys(meTree["Paper II"]).length);
}
// ---------------------------------------------------------------- Medical Science (one chapter per syllabus sub-topic)
{
  const NAME = "Medical Science";
  let h17 = fs.readFileSync(PAGE, "utf8");
  const m17 = h17.match(/<script type="application\/json" id="d-medical">(.*?)<\/script>/s);
  if(!m17) throw new Error("build-planner: d-medical not found (run medical-science/build-medical.js first), nothing written");
  const mdm = JSON.parse(m17[1]);
  const mdTree = {"Paper I":{}, "Paper II":{}}, mdLeaf = {}, per17 = {};
  mdm.topics.forEach(function(t){
    const it = mdm.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per17[it.id] = (per17[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per17[it.id] + "  " + t.t;
    (mdTree[grp][topic] = mdTree[grp][topic] || []).push(unit);
    mdLeaf[topic + "|" + unit] = [t.id];
  });
  const cur17 = '  "' + NAME + '": ' + JSON.stringify(mdTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a17 = h17.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a17 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a17 + 20; const m = re.exec(h17); if(!m) throw new Error("build-planner: end of Medical Science block not found, nothing written"); h17 = h17.slice(0, a17) + cur17 + h17.slice(m.index + 1); }
  else { const so4 = h17.indexOf('  "Sociology": CT({'); if(so4 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h17 = h17.slice(0, so4) + cur17 + h17.slice(so4); }
  const la17 = h17.indexOf("var MED_LEAF = {"), leafTxt17 = "var MED_LEAF = " + JSON.stringify(mdLeaf, null, 1) + ";";
  if(la17 >= 0){ const e17 = h17.indexOf("\n};", la17); if(e17 < 0) throw new Error("build-planner: MED_LEAF block not closed, nothing written"); h17 = h17.slice(0, la17) + leafTxt17 + h17.slice(h17.indexOf("\n", e17 + 1)); }
  else { const lb17 = h17.indexOf("\n// Optional subjects that have a question analysis"); if(lb17 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h17 = h17.slice(0, lb17) + "\n" + leafTxt17 + h17.slice(lb17); }
  fs.writeFileSync(PAGE, h17);
  console.log(NAME + " chapters:", Object.keys(mdLeaf).length, "| Paper I topics:", Object.keys(mdTree["Paper I"]).length, "| Paper II topics:", Object.keys(mdTree["Paper II"]).length);
}
// ---------------------------------------------------------------- Philosophy (one chapter per syllabus sub-topic)
{
  const NAME = "Philosophy";
  let h18 = fs.readFileSync(PAGE, "utf8");
  const m18 = h18.match(/<script type="application\/json" id="d-philosophy">(.*?)<\/script>/s);
  if(!m18) throw new Error("build-planner: d-philosophy not found (run medical-science/build-philosophy.js first), nothing written");
  const phm = JSON.parse(m18[1]);
  const phTree = {"Paper I":{}, "Paper II":{}}, phLeaf = {}, per18 = {};
  phm.topics.forEach(function(t){
    const it = phm.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per18[it.id] = (per18[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per18[it.id] + "  " + t.t;
    (phTree[grp][topic] = phTree[grp][topic] || []).push(unit);
    phLeaf[topic + "|" + unit] = [t.id];
  });
  { const ph = h18.indexOf('CURR_OPT["Philosophy"] = CT({'); if(ph >= 0){ const pe = h18.indexOf('\n});\n', ph); if(pe < 0) throw new Error('build-planner: old Philosophy placeholder not closed, nothing written'); h18 = h18.slice(0, ph) + h18.slice(pe + 5); } }
  const cur18 = '  "' + NAME + '": ' + JSON.stringify(phTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a18 = h18.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a18 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a18 + 20; const m = re.exec(h18); if(!m) throw new Error("build-planner: end of Philosophy block not found, nothing written"); h18 = h18.slice(0, a18) + cur18 + h18.slice(m.index + 1); }
  else { const so5 = h18.indexOf('  "Sociology": CT({'); if(so5 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h18 = h18.slice(0, so5) + cur18 + h18.slice(so5); }
  const la18 = h18.indexOf("var PHIL_LEAF = {"), leafTxt18 = "var PHIL_LEAF = " + JSON.stringify(phLeaf, null, 1) + ";";
  if(la18 >= 0){ const e18 = h18.indexOf("\n};", la18); if(e18 < 0) throw new Error("build-planner: PHIL_LEAF block not closed, nothing written"); h18 = h18.slice(0, la18) + leafTxt18 + h18.slice(h18.indexOf("\n", e18 + 1)); }
  else { const lb18 = h18.indexOf("\n// Optional subjects that have a question analysis"); if(lb18 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h18 = h18.slice(0, lb18) + "\n" + leafTxt18 + h18.slice(lb18); }
  fs.writeFileSync(PAGE, h18);
  console.log(NAME + " chapters:", Object.keys(phLeaf).length, "| Paper I topics:", Object.keys(phTree["Paper I"]).length, "| Paper II topics:", Object.keys(phTree["Paper II"]).length);
}
// ---------------------------------------------------------------- Physics (one chapter per syllabus sub-topic)
{
  const NAME = "Physics";
  let h19 = fs.readFileSync(PAGE, "utf8");
  const m19 = h19.match(/<script type="application\/json" id="d-physics">(.*?)<\/script>/s);
  if(!m19) throw new Error("build-planner: d-physics not found (run medical-science/build-physics.js first), nothing written");
  const pym = JSON.parse(m19[1]);
  const pyTree = {"Paper I":{}, "Paper II":{}}, pyLeaf = {}, per19 = {};
  pym.topics.forEach(function(t){
    const it = pym.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per19[it.id] = (per19[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per19[it.id] + "  " + t.t;
    (pyTree[grp][topic] = pyTree[grp][topic] || []).push(unit);
    pyLeaf[topic + "|" + unit] = [t.id];
  });
  const cur19 = '  "' + NAME + '": ' + JSON.stringify(pyTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a19 = h19.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a19 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a19 + 20; const m = re.exec(h19); if(!m) throw new Error("build-planner: end of Physics block not found, nothing written"); h19 = h19.slice(0, a19) + cur19 + h19.slice(m.index + 1); }
  else { const so6 = h19.indexOf('  "Sociology": CT({'); if(so6 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h19 = h19.slice(0, so6) + cur19 + h19.slice(so6); }
  const la19 = h19.indexOf("var PHYS_LEAF = {"), leafTxt19 = "var PHYS_LEAF = " + JSON.stringify(pyLeaf, null, 1) + ";";
  if(la19 >= 0){ const e19 = h19.indexOf("\n};", la19); if(e19 < 0) throw new Error("build-planner: PHYS_LEAF block not closed, nothing written"); h19 = h19.slice(0, la19) + leafTxt19 + h19.slice(h19.indexOf("\n", e19 + 1)); }
  else { const lb19 = h19.indexOf("\n// Optional subjects that have a question analysis"); if(lb19 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h19 = h19.slice(0, lb19) + "\n" + leafTxt19 + h19.slice(lb19); }
  fs.writeFileSync(PAGE, h19);
  console.log(NAME + " chapters:", Object.keys(pyLeaf).length, "| Paper I topics:", Object.keys(pyTree["Paper I"]).length, "| Paper II topics:", Object.keys(pyTree["Paper II"]).length);
}
// ---------------------------------------------------------------- Political Science and International Relations (one chapter per syllabus sub-topic)
{
  const NAME = "Political Science & IR";
  let h20 = fs.readFileSync(PAGE, "utf8");
  const m20 = h20.match(/<script type="application\/json" id="d-political-science">(.*?)<\/script>/s);
  if(!m20) throw new Error("build-planner: d-political-science not found (run political-science/build-political-science.js first), nothing written");
  const psm = JSON.parse(m20[1]);
  const psTree = {"Paper I":{}, "Paper II":{}}, psLeaf = {}, per20 = {};
  psm.topics.forEach(function(t){
    const it = psm.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per20[it.id] = (per20[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per20[it.id] + "  " + t.t;
    (psTree[grp][topic] = psTree[grp][topic] || []).push(unit);
    psLeaf[topic + "|" + unit] = [t.id];
  });
  { const ph = h20.indexOf('  "' + NAME + '": CT({'); if(ph >= 0){ const pe = h20.indexOf('\n  }),\n', ph); if(pe < 0) throw new Error("build-planner: old Political Science placeholder not closed, nothing written"); h20 = h20.slice(0, ph) + h20.slice(pe + 7); } }
  const cur20 = '  "' + NAME + '": ' + JSON.stringify(psTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a20 = h20.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a20 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a20 + 20; const m = re.exec(h20); if(!m) throw new Error("build-planner: end of Political Science block not found, nothing written"); h20 = h20.slice(0, a20) + cur20 + h20.slice(m.index + 1); }
  else { const so7 = h20.indexOf('  "Sociology": CT({'); if(so7 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h20 = h20.slice(0, so7) + cur20 + h20.slice(so7); }
  const la20 = h20.indexOf("var PSIR_LEAF = {"), leafTxt20 = "var PSIR_LEAF = " + JSON.stringify(psLeaf, null, 1) + ";";
  if(la20 >= 0){ const e20 = h20.indexOf("\n};", la20); if(e20 < 0) throw new Error("build-planner: PSIR_LEAF block not closed, nothing written"); h20 = h20.slice(0, la20) + leafTxt20 + h20.slice(h20.indexOf("\n", e20 + 1)); }
  else { const lb20 = h20.indexOf("\n// Optional subjects that have a question analysis"); if(lb20 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h20 = h20.slice(0, lb20) + "\n" + leafTxt20 + h20.slice(lb20); }
  fs.writeFileSync(PAGE, h20);
  console.log(NAME + " chapters:", Object.keys(psLeaf).length, "| Paper I topics:", Object.keys(psTree["Paper I"]).length, "| Paper II topics:", Object.keys(psTree["Paper II"]).length);
}
// ---------------------------------------------------------------- Psychology (one chapter per syllabus sub-topic)
{
  const NAME = "Psychology";
  let h21 = fs.readFileSync(PAGE, "utf8");
  const m21 = h21.match(/<script type="application\/json" id="d-psychology">(.*?)<\/script>/s);
  if(!m21) throw new Error("build-planner: d-psychology not found (run psychology/build-psychology.js first), nothing written");
  const psym = JSON.parse(m21[1]);
  const psyTree = {"Paper I":{}, "Paper II":{}}, psyLeaf = {}, per21 = {};
  psym.topics.forEach(function(t){
    const it = psym.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per21[it.id] = (per21[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per21[it.id] + "  " + t.t;
    (psyTree[grp][topic] = psyTree[grp][topic] || []).push(unit);
    psyLeaf[topic + "|" + unit] = [t.id];
  });
  { const pq = h21.indexOf('CURR_OPT["Psychology"] = CT({'); if(pq >= 0){ const pe = h21.indexOf('\n});\n', pq); if(pe < 0) throw new Error('build-planner: old Psychology placeholder not closed, nothing written'); h21 = h21.slice(0, pq) + h21.slice(pe + 5); } }
  const cur21 = '  "' + NAME + '": ' + JSON.stringify(psyTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a21 = h21.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a21 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a21 + 20; const m = re.exec(h21); if(!m) throw new Error("build-planner: end of Psychology block not found, nothing written"); h21 = h21.slice(0, a21) + cur21 + h21.slice(m.index + 1); }
  else { const so8 = h21.indexOf('  "Sociology": CT({'); if(so8 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h21 = h21.slice(0, so8) + cur21 + h21.slice(so8); }
  const la21 = h21.indexOf("var PSY_LEAF = {"), leafTxt21 = "var PSY_LEAF = " + JSON.stringify(psyLeaf, null, 1) + ";";
  if(la21 >= 0){ const e21 = h21.indexOf("\n};", la21); if(e21 < 0) throw new Error("build-planner: PSY_LEAF block not closed, nothing written"); h21 = h21.slice(0, la21) + leafTxt21 + h21.slice(h21.indexOf("\n", e21 + 1)); }
  else { const lb21 = h21.indexOf("\n// Optional subjects that have a question analysis"); if(lb21 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h21 = h21.slice(0, lb21) + "\n" + leafTxt21 + h21.slice(lb21); }
  fs.writeFileSync(PAGE, h21);
  console.log(NAME + " chapters:", Object.keys(psyLeaf).length, "| Paper I topics:", Object.keys(psyTree["Paper I"]).length, "| Paper II topics:", Object.keys(psyTree["Paper II"]).length);
}
// ---------------------------------------------------------------- Public Administration (one chapter per syllabus sub-topic)
{
  const NAME = "Public Administration";
  let h22 = fs.readFileSync(PAGE, "utf8");
  const m22 = h22.match(/<script type="application\/json" id="d-public-admin">(.*?)<\/script>/s);
  if(!m22) throw new Error("build-planner: d-public-admin not found (run psychology/build-public-admin.js first), nothing written");
  const pam = JSON.parse(m22[1]);
  const paTree = {"Paper I":{}, "Paper II":{}}, paLeaf = {}, per22 = {};
  pam.topics.forEach(function(t){
    const it = pam.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per22[it.id] = (per22[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per22[it.id] + "  " + t.t;
    (paTree[grp][topic] = paTree[grp][topic] || []).push(unit);
    paLeaf[topic + "|" + unit] = [t.id];
  });
  { const pq = h22.indexOf('  "Public Administration": CT({'); if(pq >= 0){ const pe = h22.indexOf('\n  }),\n', pq); if(pe < 0) throw new Error('build-planner: old Public Administration placeholder not closed, nothing written'); h22 = h22.slice(0, pq) + h22.slice(pe + 7); } }
  const cur22 = '  "' + NAME + '": ' + JSON.stringify(paTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a22 = h22.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a22 >= 0){ const re = /\n  "[A-Z]/g; re.lastIndex = a22 + 20; const m = re.exec(h22); if(!m) throw new Error("build-planner: end of Public Administration block not found, nothing written"); h22 = h22.slice(0, a22) + cur22 + h22.slice(m.index + 1); }
  else { const so9 = h22.indexOf('  "Sociology": CT({'); if(so9 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h22 = h22.slice(0, so9) + cur22 + h22.slice(so9); }
  const la22 = h22.indexOf("var PA_LEAF = {"), leafTxt22 = "var PA_LEAF = " + JSON.stringify(paLeaf, null, 1) + ";";
  if(la22 >= 0){ const e22 = h22.indexOf("\n};", la22); if(e22 < 0) throw new Error("build-planner: PA_LEAF block not closed, nothing written"); h22 = h22.slice(0, la22) + leafTxt22 + h22.slice(h22.indexOf("\n", e22 + 1)); }
  else { const lb22 = h22.indexOf("\n// Optional subjects that have a question analysis"); if(lb22 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h22 = h22.slice(0, lb22) + "\n" + leafTxt22 + h22.slice(lb22); }
  fs.writeFileSync(PAGE, h22);
  console.log(NAME + " chapters:", Object.keys(paLeaf).length, "| Paper I topics:", Object.keys(paTree["Paper I"]).length, "| Paper II topics:", Object.keys(paTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Sociology (one chapter per syllabus sub-topic)
{
  const NAME = "Sociology";
  let h23 = fs.readFileSync(PAGE, "utf8");
  const m23 = h23.match(/<script type="application\/json" id="d-sociology">(.*?)<\/script>/s);
  if(!m23) throw new Error("build-planner: d-sociology not found (run psychology/build-sociology.js first), nothing written");
  const som = JSON.parse(m23[1]);
  const soTree = {"Paper I":{}, "Paper II":{}}, soLeaf = {}, per23 = {};
  som.topics.forEach(function(t){
    const it = som.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per23[it.id] = (per23[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per23[it.id] + "  " + t.t;
    (soTree[grp][topic] = soTree[grp][topic] || []).push(unit);
    soLeaf[topic + "|" + unit] = [t.id];
  });
  { const sq = h23.indexOf('  "Sociology": CT({'); if(sq >= 0){ const se = h23.indexOf('\n  }),\n', sq); if(se < 0) throw new Error('build-planner: old Sociology placeholder not closed, nothing written'); h23 = h23.slice(0, sq) + h23.slice(se + 7); } }
  const cur23 = '  "' + NAME + '": ' + JSON.stringify(soTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a23 = h23.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a23 >= 0){ const re = /\n(  "[A-Z]|\};)/g; re.lastIndex = a23 + 20; const m = re.exec(h23); if(!m) throw new Error("build-planner: end of Sociology block not found, nothing written"); h23 = h23.slice(0, a23) + cur23 + h23.slice(m.index + 1); }
  else { const so9 = h23.indexOf("\n};\n// Official UPSC list"); if(so9 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h23 = h23.slice(0, so9 + 1) + cur23 + h23.slice(so9 + 1); }
  const la23 = h23.indexOf("var SOC_LEAF = {"), leafTxt23 = "var SOC_LEAF = " + JSON.stringify(soLeaf, null, 1) + ";";
  if(la23 >= 0){ const e23 = h23.indexOf("\n};", la23); if(e23 < 0) throw new Error("build-planner: SOC_LEAF block not closed, nothing written"); h23 = h23.slice(0, la23) + leafTxt23 + h23.slice(h23.indexOf("\n", e23 + 1)); }
  else { const lb23 = h23.indexOf("\n// Optional subjects that have a question analysis"); if(lb23 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h23 = h23.slice(0, lb23) + "\n" + leafTxt23 + h23.slice(lb23); }
  fs.writeFileSync(PAGE, h23);
  console.log(NAME + " chapters:", Object.keys(soLeaf).length, "| Paper I topics:", Object.keys(soTree["Paper I"]).length, "| Paper II topics:", Object.keys(soTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Statistics (one chapter per syllabus sub-topic)
{
  const NAME = "Statistics";
  let h24 = fs.readFileSync(PAGE, "utf8");
  const m24 = h24.match(/<script type="application\/json" id="d-statistics">(.*?)<\/script>/s);
  if(!m24) throw new Error("build-planner: d-statistics not found (run psychology/build-statistics.js first), nothing written");
  const stm = JSON.parse(m24[1]);
  const stTree = {"Paper I":{}, "Paper II":{}}, stLeaf = {}, per24 = {};
  stm.topics.forEach(function(t){
    const it = stm.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per24[it.id] = (per24[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per24[it.id] + "  " + t.t;
    (stTree[grp][topic] = stTree[grp][topic] || []).push(unit);
    stLeaf[topic + "|" + unit] = [t.id];
  });
  { const sq2 = h24.indexOf('  "Statistics": CT({'); if(sq2 >= 0){ const se = h24.indexOf('\n  }),\n', sq2); if(se < 0) throw new Error('build-planner: old Statistics placeholder not closed, nothing written'); h24 = h24.slice(0, sq2) + h24.slice(se + 7); } }
  const cur24 = '  "' + NAME + '": ' + JSON.stringify(stTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a24 = h24.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a24 >= 0){ const re = /\n(  "[A-Z]|\};)/g; re.lastIndex = a24 + 20; const m = re.exec(h24); if(!m) throw new Error("build-planner: end of Statistics block not found, nothing written"); h24 = h24.slice(0, a24) + cur24 + h24.slice(m.index + 1); }
  else { const so10 = h24.indexOf("\n};\n// Official UPSC list"); if(so10 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h24 = h24.slice(0, so10 + 1) + cur24 + h24.slice(so10 + 1); }
  const la24 = h24.indexOf("var STAT_LEAF = {"), leafTxt24 = "var STAT_LEAF = " + JSON.stringify(stLeaf, null, 1) + ";";
  if(la24 >= 0){ const e24 = h24.indexOf("\n};", la24); if(e24 < 0) throw new Error("build-planner: STAT_LEAF block not closed, nothing written"); h24 = h24.slice(0, la24) + leafTxt24 + h24.slice(h24.indexOf("\n", e24 + 1)); }
  else { const lb24 = h24.indexOf("\n// Optional subjects that have a question analysis"); if(lb24 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h24 = h24.slice(0, lb24) + "\n" + leafTxt24 + h24.slice(lb24); }
  fs.writeFileSync(PAGE, h24);
  console.log(NAME + " chapters:", Object.keys(stLeaf).length, "| Paper I topics:", Object.keys(stTree["Paper I"]).length, "| Paper II topics:", Object.keys(stTree["Paper II"]).length);
}

// ---------------------------------------------------------------- Zoology (one chapter per syllabus sub-topic)
{
  const NAME = "Zoology";
  let h25 = fs.readFileSync(PAGE, "utf8");
  const m25 = h25.match(/<script type="application\/json" id="d-zoology">(.*?)<\/script>/s);
  if(!m25) throw new Error("build-planner: d-zoology not found (run psychology/build-zoology.js first), nothing written");
  const zom = JSON.parse(m25[1]);
  const zoTree = {"Paper I":{}, "Paper II":{}}, zoLeaf = {}, per25 = {};
  zom.topics.forEach(function(t){
    const it = zom.items.filter(function(x){ return x.id === t.s; })[0], grp = it.pp === 1 ? "Paper I" : "Paper II";
    per25[it.id] = (per25[it.id] || 0) + 1;
    const topic = it.id + "  " + it.t, unit = it.id + "." + per25[it.id] + "  " + t.t;
    (zoTree[grp][topic] = zoTree[grp][topic] || []).push(unit);
    zoLeaf[topic + "|" + unit] = [t.id];
  });
  { const sq3 = h25.indexOf('  "Zoology": CT({'); if(sq3 >= 0){ const se = h25.indexOf('\n  }),\n', sq3); if(se < 0) throw new Error('build-planner: old Zoology placeholder not closed, nothing written'); h25 = h25.slice(0, sq3) + h25.slice(se + 7); } }
  const cur25 = '  "' + NAME + '": ' + JSON.stringify(zoTree, null, 2).replace(/\n/g, "\n  ") + ',\n';
  const a25 = h25.indexOf('  "' + NAME + '": {\n    "Paper I"');
  if(a25 >= 0){ const re = /\n(  "[A-Z]|\};)/g; re.lastIndex = a25 + 20; const m = re.exec(h25); if(!m) throw new Error("build-planner: end of Zoology block not found, nothing written"); h25 = h25.slice(0, a25) + cur25 + h25.slice(m.index + 1); }
  else { const so11 = h25.indexOf("\n};\n// Official UPSC list"); if(so11 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h25 = h25.slice(0, so11 + 1) + cur25 + h25.slice(so11 + 1); }
  const la25 = h25.indexOf("var ZOO_LEAF = {"), leafTxt25 = "var ZOO_LEAF = " + JSON.stringify(zoLeaf, null, 1) + ";";
  if(la25 >= 0){ const e25 = h25.indexOf("\n};", la25); if(e25 < 0) throw new Error("build-planner: ZOO_LEAF block not closed, nothing written"); h25 = h25.slice(0, la25) + leafTxt25 + h25.slice(h25.indexOf("\n", e25 + 1)); }
  else { const lb25 = h25.indexOf("\n// Optional subjects that have a question analysis"); if(lb25 < 0) throw new Error("build-planner: insertion point not found, nothing written"); h25 = h25.slice(0, lb25) + "\n" + leafTxt25 + h25.slice(lb25); }
  fs.writeFileSync(PAGE, h25);
  console.log(NAME + " chapters:", Object.keys(zoLeaf).length, "| Paper I topics:", Object.keys(zoTree["Paper I"]).length, "| Paper II topics:", Object.keys(zoTree["Paper II"]).length);
}
