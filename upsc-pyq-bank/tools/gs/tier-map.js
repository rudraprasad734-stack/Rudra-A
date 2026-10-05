// Places every Tier topic under the official UPSC syllabus line it belongs to, and writes <script id="d-olmap"> in page/index.html.
//   node upsc-pyq-bank/tools/gs/tier-map.js [--show]
// Tiers -> Prelims / Mains pages then list the OFFICIAL lines (tools/gs/official-gs.json) and nest the tier topics under them.
//   mains   : tier topic id -> line index inside its GS paper (hand-made, below)
//   extra   : chapter added from the syllabus reference -> line index (rule-based, tools/gs/gs.rules.js)
//   prelims : by subject (the Prelims syllabus has 7 broad lines)
const fs = require("fs"), path = require("path");
const PAGE = path.join(__dirname, "../../page/index.html"), RULES = require("./gs.rules.js");
let html = fs.readFileSync(PAGE, "utf8");
const get = function(id){ return JSON.parse(html.match(new RegExp('<script type="application/json" id="' + id + '">(.*?)</script>', "s"))[1]); };
const D = get("d-data"), E = get("d-extra");

// GS I (0-11) -- Indian culture, modern history, freedom struggle, post-independence, world history, society, world geography
const MAINS = {
  m0:0, m2:1, m4:2, m8:3, m7:4, m3:5, m1:6, m5:7, m6:8,
  m100:9, m102:9, m109:9, m110:9,                          // physical geography of the world
  m101:10, m103:10, m104:10, m107:10,                      // resources, industries, trade
  m99:11, m105:11, m108:11, m106:6,                        // geophysical phenomena, changing features; population -> line 6
  // GS II (0-19)
  m12:0, m9:1, m13:4, m14:5, m10:7, m25:6, m26:15, m16:14, m15:12, m19:13, m22:11, m24:11, m18:10, m21:9, m27:10, m11:19, m17:17, m23:16, m20:18, m28:5,
  // GS III (0-19)
  m29:0, m36:1, m40:2, m30:3, m42:5, m43:6, m48:7, m34:8, m44:9, m31:10, m47:11, m46:11, m35:12, m49:12, m32:13, m33:14, m45:15, m39:16, m41:17, m50:17, m51:17, m37:18, m38:18,
  // GS IV (0-7)
  m64:2, m52:5, m62:5, m53:6, m56:6, m54:7, m55:7, m57:7, m58:7, m59:7, m60:7, m61:7, m63:7
};
const PRE_SUBJ = {"Current Affairs & Society":0, "History (incl. Art & Culture)":1, "Geography":2, "Polity & Governance":3, "Economy":4, "Environment & Ecology":5, "Science & Technology":6};
// chapters from the syllabus reference, by their subject
const PRE_EXTRA = {"History":1, "Art & Culture":1, "Geography":2, "Polity":3, "Governance":3, "Economy":4, "Agriculture":4, "Indian Society":4, "Social Justice":4, "Environment":5, "Disaster Management":5, "Science & Technology":6, "International Relations":0, "Internal Security":0};
const MAIN_PAPER = {"History":"GS Paper I", "Art & Culture":"GS Paper I", "Indian Society":"GS Paper I", "Geography":"GS Paper I", "Polity":"GS Paper II", "Governance":"GS Paper II", "Social Justice":"GS Paper II", "International Relations":"GS Paper II", "Economy":"GS Paper III", "Agriculture":"GS Paper III", "Environment":"GS Paper III", "Science & Technology":"GS Paper III", "Internal Security":"GS Paper III", "Disaster Management":"GS Paper III", "Ethics, Integrity & Aptitude":"GS Paper IV"};

// the keyword rules misplace a few chapters; these are placed by hand (key = subject|group|chapter, or subject|group for the whole group)
const XM_OVR = {
  "Indian Society|Globalisation and Society|Effects on Indian Society":7, "Indian Society|Globalisation and Society|Cultural Change":7, "Indian Society|Globalisation and Society|Social Movements":8,
  "Indian Society|Social Empowerment|Social Empowerment Approaches":8, "Indian Society|Social Empowerment|Poverty and Development":6, "Indian Society|Social Institutions|Caste System":5,
  "History|Post-Independence India|Planning and Economic Policy":3, "History|Post-Independence India|Land Reforms and Green Revolution":3, "History|Post-Independence India|Regionalism and Political Consolidation":3,
  "History|Modern History|Partition of India":2, "History|Modern History|Constitutional Development":2,
  "Polity|State and Local Government|Governor and State Legislature":4, "Polity|Federalism|Emergency Provisions":1,
  "Governance|E-Governance|Digital India":14, "Governance|Civil Services|Role in a Democracy":15,
  "Social Justice|Poverty and Hunger|Poverty Estimation":13, "Social Justice|Vulnerable Sections|Persons with Disabilities":11, "Social Justice|Education|Skill Development":12,
  "International Relations|India and the World|Indian Diaspora":18,
  "Economy|Economic Reforms|Subsidies":4, "Economy|Sectors|Services Sector":0, "Economy|Money and Banking|Banking and NBFCs":0,
  "Environment|Laws and Institutions|Institutions and Treaties":13,
  "Science & Technology|Space and Defence|Space Programme":12, "Science & Technology|Space and Defence|Missiles and Defence Technology":11, "Science & Technology|Space and Defence|Nuclear Technology":10,
  "Science & Technology|IT and Emerging Tech|IT and Computers":12, "Science & Technology|Indigenisation|Energy Technologies":10, "Science & Technology|Indigenisation|Science in Everyday Life":10,
  "Internal Security|Cyber and Media|Cyber Security":17, "Internal Security|Threats|Terrorism":18, "Internal Security|Forces and Framework|Coastal Security":18,
  "Geography|Geophysical Phenomena|Cyclones":11,
  "Ethics, Integrity & Aptitude|Emotional Intelligence|Utility in Administration":3, "Ethics, Integrity & Aptitude|Emotional Intelligence|Governance Applications":3,
  "Ethics, Integrity & Aptitude|Case Studies":7
};

const bad = [];
D.mainsTopics.forEach(function(t){ if(/^(GS\d|Geography)/.test(t.paper) && MAINS[t.id] === undefined) bad.push("mains " + t.id + " " + t.topic); });
Object.keys(MAINS).forEach(function(id){ if(!D.mainsTopics.some(function(t){ return t.id === id; })) bad.push("unknown id " + id); });
D.prelimsTopics.forEach(function(t){ if(PRE_SUBJ[t.subject] === undefined) bad.push("prelims " + t.id + " " + t.subject); });

const xm = {}, xp = {}; let none = 0;
E.items.forEach(function(it, i){
  if(it.x.indexOf("p") >= 0) xp[i] = PRE_EXTRA[it.s] === undefined ? 0 : PRE_EXTRA[it.s];
  if(it.x.indexOf("m") >= 0){
    const paper = MAIN_PAPER[it.s], rules = RULES[paper]; if(!rules){ bad.push("no paper for " + it.s); return; }
    const txt = (it.u + " " + it.g + " " + it.sub.join(" ")).replace(/\s+/g, " ");
    let best = -1, bs = 0;
    rules.forEach(function(re, li){ if(!re) return; const g = new RegExp(re.source, re.flags.indexOf("g") >= 0 ? re.flags : re.flags + "g"); const hits = {}; let m; while((m = g.exec(txt))){ hits[m[0].toLowerCase()] = 1; if(!m[0].length) g.lastIndex++; } const sc = Object.keys(hits).length; if(sc > bs){ bs = sc; best = li; } });
    if(paper === "GS Paper IV") best = best < 0 ? 7 : best;
    const ov = XM_OVR[it.s + "|" + it.g + "|" + it.u]; if(ov !== undefined) best = ov; else if(XM_OVR[it.s + "|" + it.g] !== undefined) best = XM_OVR[it.s + "|" + it.g];
    if(best < 0) none++;
    xm[i] = best;
  }
});
if(process.argv.indexOf("--show") >= 0) E.items.forEach(function(it, i){ if(xm[i] !== undefined) console.log(MAIN_PAPER[it.s].slice(-3).padEnd(4), String(xm[i]).padStart(2), it.s + " | " + it.g + " | " + it.u); });
console.log("mains extras:", Object.keys(xm).length, "no line:", none, "| tier topics unmapped:", bad.length); bad.forEach(function(b){ console.log("  !", b); });
if(bad.length) process.exit(1);
const out = '<script type="application/json" id="d-olmap">' + JSON.stringify({mains:MAINS, prelimsSubj:PRE_SUBJ, xp:xp, xm:xm}) + '</script>';
html = /id="d-olmap"/.test(html) ? html.replace(/<script type="application\/json" id="d-olmap">.*?<\/script>/s, function(){ return out; }) : html.replace(/(<script type="application\/json" id="d-freq">.*?<\/script>)/s, function(m){ return m + "\n" + out; });
fs.writeFileSync(PAGE, html); console.log("d-olmap written");
