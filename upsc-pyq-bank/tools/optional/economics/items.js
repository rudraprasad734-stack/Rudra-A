// The official UPSC Economics syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), item by item.
// UPSC numbers Paper I itself (1 Advanced Micro Economics (a)-(d); 2 Advanced Macro Economics; 3 Money-Banking and Finance (a)-(b);
// 4 International Economics (a)-(c) with sub-items (i)-(iv) and (i)-(ix); 5 Growth and Development (a)-(f) with (a)(i)-(v)).
// Paper II is not numbered, so its ids are II-P (the Pre-Independence Era), II-A(i)-(v) (Pre-Liberalization Era) and II-B(i)-(viii) (Post Liberalization Era).
// Source text: ../../syllabus/official-2026/economics.txt (the file also holds Electrical Engineering; it is cut at that heading).
// `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
let raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/economics.txt"), "utf8").replace(/\x0c/g, "");
const e = raw.search(/ELECTRICAL\s+ENGINEERING/); if(e < 0) throw new Error("economics syllabus: Electrical Engineering heading not found");
raw = raw.slice(0, e).split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); }).join("\n").replace(/\s+/g, " ").trim();
const cut = raw.indexOf("PAPER-II"); if(cut < 0) throw new Error("economics syllabus: Paper II marker not found");
// [id, short heading, text that starts the official wording, heading printed before the wording]
const P1 = [
 ["I-1a", "Marshallian and Walrasian approaches to price determination", "Marshallian and Walrasian Approaches", "Advanced Micro Economics"],
 ["I-1b", "Alternative distribution theories: Ricardo, Kaldor, Kalecki", "Alternative Distribution Theories", "Advanced Micro Economics"],
 ["I-1c", "Market structure: monopolistic competition, duopoly, oligopoly", "Markets Structure", "Advanced Micro Economics"],
 ["I-1d", "Modern welfare criteria: Pareto, Hicks, Scitovsky, Arrow, Sen", "Modern Welfare Criteria", "Advanced Micro Economics"],
 ["I-2", "Advanced macro economics: employment, income and interest rate determination", "Approaches to Employment Income", "Advance Macro Economics"],
 ["I-3a", "Money: demand and supply, quantity theory, monetary management", "Demand for and Supply of Money", "Money-Banking and Finance"],
 ["I-3b", "Public finance: taxes, subsidies, borrowing and expenditure", "Public Finance and its Role", "Money-Banking and Finance"],
 ["I-4a(i)", "Trade theory: comparative advantage", "Comparative advantage", "International Economics, Old and New theories of International Trade"],
 ["I-4a(ii)", "Trade theory: terms of trade and offer curve", "Terms of Trade and offer curve", "International Economics, Old and New theories of International Trade"],
 ["I-4a(iii)", "Trade theory: product cycle and strategic trade theories", "Product cycle and Strategic", "International Economics, Old and New theories of International Trade"],
 ["I-4a(iv)", "Trade theory: trade as an engine of growth and underdevelopment", "Trade as an engine", "International Economics, Old and New theories of International Trade"],
 ["I-4b", "Forms of protection: tariff and quota", "Forms of protection", "International Economics"],
 ["I-4c(i)", "Balance of payments: price versus income, income adjustments under fixed rates", "Price versus income", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(ii)", "Balance of payments: theories of policy mix", "Theories of Policy mix", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(iii)", "Balance of payments: exchange rate adjustments under capital mobility", "Exchange rate adjustments under capital mobility", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(iv)", "Balance of payments: floating rates, developing countries and currency boards", "Floating Rates", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(v)", "Balance of payments: trade policy and developing countries", "Trade Policy and Developing", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(vi)", "Balance of payments: adjustments and policy coordination in an open economy", "BOP, adjustments", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(vii)", "Balance of payments: speculative attacks", "Speculative attacks", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(viii)", "Balance of payments: trade blocks and monetary unions", "Trade Blocks and Monetary", "International Economics, Balance of Payments Adjustments"],
 ["I-4c(ix)", "Balance of payments: WTO, TRIMS, TRIPS and the rounds of talks", "WTO", "International Economics, Balance of Payments Adjustments"],
 ["I-5a(i)", "Growth theory: Harrod's model", "Theories of growth", "Growth and Development"],
 ["I-5a(ii)", "Growth theory: Lewis model with surplus labour", "Lewis model", "Growth and Development"],
 ["I-5a(iii)", "Growth theory: balanced and unbalanced growth", "Balanced Unbalanced", "Growth and Development"],
 ["I-5a(iv)", "Growth theory: human capital and economic growth", "human capitals", "Growth and Development"],
 ["I-5a(v)", "Growth theory: research and development and economic growth", "Research and Development and Economic Growth", "Growth and Development"],
 ["I-5b", "Process of development: Myrdal, Kuznets, structural change, agriculture", "Process of Economic Development", "Growth and Development"],
 ["I-5c", "Development, international trade and investment, multinationals", "Economic Development and International Trade", "Growth and Development"],
 ["I-5d", "Planning and development: markets, planning and PPP", "Planning and economic Development", "Growth and Development"],
 ["I-5e", "Welfare indicators, human development indices and the basic needs approach", "Welfare indicators", "Growth and Development"],
 ["I-5f", "Development and environmental sustainability", "Development and Environmental Sustainability", "Growth and Development"]];
const P2 = [
 ["II-P", "Pre-independence economy: land, drain, laissez faire, jute, cotton, railways, money and credit", "Land System and its changes", "Indian Economy in Pre-Independence Era"],
 ["II-A(i)", "Pre-liberalization: Vakil, Gadgil and V.K.R.V. Rao", "Contribution of Vakil", "Indian Economy after Independence, the Pre-Liberalization Era"],
 ["II-A(ii)", "Pre-liberalization: land reforms, tenure, Green Revolution, capital formation in agriculture", "Agriculture: Land Reforms", "Indian Economy after Independence, the Pre-Liberalization Era"],
 ["II-A(iii)", "Pre-liberalization: industry, public and private sector, small scale and cottage industries", "Industry Trends", "Indian Economy after Independence, the Pre-Liberalization Era"],
 ["II-A(iv)", "Pre-liberalization: national and per capita income, patterns and sectoral composition", "National and Per capita income", "Indian Economy after Independence, the Pre-Liberalization Era"],
 ["II-A(v)", "Pre-liberalization: factors of national income, poverty and inequality", "Broad factors determining", "Indian Economy after Independence, the Pre-Liberalization Era"],
 ["II-B(i)", "Post-liberalization: agriculture, WTO, food processing, subsidies, prices and PDS", "New Economic Reform and Agriculture", "Indian Economy after Independence, the Post Liberalization Era"],
 ["II-B(ii)", "Post-liberalization: industry, privatization, disinvestment, FDI and multinationals", "New Economic Policy and Industry", "Indian Economy after Independence, the Post Liberalization Era"],
 ["II-B(iii)", "Post-liberalization: trade, IPR, TRIPS, TRIMS, GATS and EXIM policy", "New Economic Policy and Trade", "Indian Economy after Independence, the Post Liberalization Era"],
 ["II-B(iv)", "Post-liberalization: exchange rate regime and convertibility", "New Exchange Rate Regime", "Indian Economy after Independence, the Post Liberalization Era"],
 ["II-B(v)", "Post-liberalization: public finance, FRBM, Finance Commission, fiscal federalism", "New Economic Policy and Public Finance", "Indian Economy after Independence, the Post Liberalization Era"],
 ["II-B(vi)", "Post-liberalization: monetary system and the role of the RBI", "New Economic Policy and Monetary system", "Indian Economy after Independence, the Post Liberalization Era"],
 ["II-B(vii)", "Post-liberalization: planning, markets and decentralized planning", "Planning: From central", "Indian Economy after Independence, the Post Liberalization Era"],
 ["II-B(viii)", "Post-liberalization: employment, poverty and rural wages", "New Economic Policy and Employment", "Indian Economy after Independence, the Post Liberalization Era"]];
const items = [];
function add(text, list, pp){
  let at = 0; const pos = [];
  list.forEach(function(r){ const i = text.indexOf(r[2], at); if(i < 0) throw new Error("economics syllabus: marker not found for " + r[0] + ": " + r[2]); pos.push(i); at = i + r[2].length; });
  const end = text.length;
  list.forEach(function(r, k){
    const a = pos[k], b = k + 1 < list.length ? pos[k + 1] : end;
    let body = text.slice(a, b).trim();
    // drop what belongs to the next item or group that was cut into the end of this slice
    const TAILS = ["4. International Economics : (a) Old and New theories of International Trade.", "(c) Balance of Payments Adjustments : Alternative Approaches.", "5. Growth and Development: (a)", "2. Advance Macro Economics :", "3. Money-Banking and Finance :",
      "Indian Economy after Independence : A. The Pre-Liberalization Era :", "B. The Post Liberalization Era :"];
    for(let again = true; again;){
      again = false; const before = body;
      body = body.replace(/\s*\((?:[ivx]+|[a-f])\)\s*$/, "").trim();
      TAILS.forEach(function(t){ if(body.slice(-t.length) === t){ body = body.slice(0, -t.length).trim(); } });
      body = body.replace(/[,;]\s*$/, "").trim();
      if(body !== before) again = true;
    }
    items.push({id:r[0], pp:pp, t:r[1], full:r[3] + " : " + body});
  });
}
add(raw.slice(0, cut), P1, 1); add(raw.slice(cut), P2, 2);
const n1 = items.filter(function(i){ return i.pp === 1; }).length, n2 = items.filter(function(i){ return i.pp === 2; }).length;
if(n1 !== 31 || n2 !== 14) throw new Error("economics syllabus items: " + n1 + " + " + n2 + " (expected 31 + 14)");
module.exports.items = items;
