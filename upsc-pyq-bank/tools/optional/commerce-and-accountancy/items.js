// The official UPSC Commerce and Accountancy syllabus (Examination Notice 05/2026-CSE, Appendix I), paragraph by paragraph.
// Paper I has two sections: A = Accounting, Taxation & Auditing (UPSC items 1-4), B = Financial Management, Financial Institutions and Markets (items 1-2).
// Paper II has two sections: A = Organisation Theory and Behaviour (items 1-2), B = Human Resource Management and Industrial Relations (items 1-2).
// UPSC does not number the paragraphs inside an item, so the ids are I-A<item><letter>, I-B<item><letter>, II-A<item><letter>, II-B<item><letter>, the letter being the paragraph in syllabus order.
// Source text: ../../syllabus/official-2026/commerce-and-accountancy.txt.  `t` is a short heading for lists; `full` is the official wording.
const fs = require("fs"), path = require("path");
const raw = fs.readFileSync(path.join(__dirname, "../../syllabus/official-2026/commerce-and-accountancy.txt"), "utf8").replace(/\x0c/g, "");
const lines = raw.split("\n").filter(function(l){ return !/^\s*\d{1,3}\s*$/.test(l); });
const ps = []; let cur = [];
lines.forEach(function(l){ if(!l.trim()){ if(cur.length) ps.push(cur.join(" ").replace(/\s+/g, " ").trim()); cur = []; } else cur.push(l); });
if(cur.length) ps.push(cur.join(" ").replace(/\s+/g, " ").trim());
// [paragraph index, id, pp, heading].  Paragraph 28 (NOI, MM and Traditional approach) continues the sentence of paragraph 27 and is joined to it.
const MAP = [
 [1, "I-A1a", 1, "Financial accounting: accounting standards, cash flow statement and EPS"],
 [2, "I-A1b", 1, "Share capital transactions, bonus and right shares"],
 [3, "I-A1c", 1, "Employees stock option and buy-back of securities"],
 [4, "I-A1d", 1, "Company final accounts"],
 [5, "I-A1e", 1, "Amalgamation, absorption and reconstruction of companies"],
 [7, "I-A2a", 1, "Cost accounting: nature, cost concepts and installation of a system"],
 [8, "I-A2b", 1, "Methods of costing: job, process and activity based costing"],
 [9, "I-A2c", 1, "Cost-volume-profit relationship"],
 [10, "I-A2d", 1, "Incremental analysis and differential costing for decisions"],
 [11, "I-A2e", 1, "Budgeting, standard costing and variance analysis"],
 [12, "I-A2f", 1, "Responsibility accounting and divisional performance measurement"],
 [14, "I-A3a", 1, "Income tax: computation of income under the heads"],
 [15, "I-A3b", 1, "Set-off and carry forward of loss"],
 [16, "I-A3c", 1, "Deductions from gross total income"],
 [17, "I-A3d", 1, "VAT and service tax"],
 [19, "I-A4a", 1, "Company audit: divisible profits, dividends, special investigations, tax audit"],
 [20, "I-A4b", 1, "Audit of banking, insurance, non-profit organisations and charitable trusts"],
 [23, "I-B1a", 1, "Finance function, objectives and risk-return relationship"],
 [24, "I-B1b", 1, "Ratio analysis, funds flow and cash flow statements"],
 [25, "I-B1c", 1, "Capital budgeting decisions"],
 [26, "I-B1d", 1, "Cost of capital and CAPM"],
 [27, "I-B1e", 1, "Capital structure theories and leverages"],
 [29, "I-B1f", 1, "Dividend decisions and valuation of the firm"],
 [30, "I-B1g", 1, "Working capital management"],
 [31, "I-B1h", 1, "Corporate restructuring: mergers and acquisitions"],
 [33, "I-B2a", 1, "Indian financial system: an overview"],
 [34, "I-B2b", 1, "Money markets, commercial banks, banking reforms and RBI"],
 [35, "I-B2c", 1, "Capital market, innovative debt instruments and SEBI"],
 [36, "I-B2d", 1, "Financial services: mutual funds, venture capital, credit rating, insurance and IRDA"],
 [40, "II-A1a", 2, "Organisation: concept, environment, goals and management by objectives"],
 [41, "II-A1b", 2, "Evolution of organisation theory"],
 [42, "II-A1c", 2, "Modern concepts: design, structure and culture"],
 [43, "II-A1d", 2, "Organisational design: differentiation, centralisation, formal and informal organisation"],
 [44, "II-A1e", 2, "Organisation structures, power and politics, impact of IT"],
 [45, "II-A1f", 2, "Managing organisational culture"],
 [47, "II-A2a", 2, "Organisation behaviour: personality, perception"],
 [48, "II-A2b", 2, "Motivation, leadership, QWL, conflict, change and effectiveness"],
 [51, "II-B1a", 2, "Human resource management"],
 [53, "II-B2a", 2, "Industrial relations and trade unions"],
 [54, "II-B2b", 2, "Impact of liberalisation on the trade union movement"],
 [55, "II-B2c", 2, "Industrial disputes: strikes, lockouts, prevention and settlement"],
 [56, "II-B2d", 2, "Workers' participation in management"],
 [57, "II-B2e", 2, "Adjudication and collective bargaining"],
 [58, "II-B2f", 2, "Industrial relations in public enterprises, absenteeism and labour turnover"],
 [59, "II-B2g", 2, "ILO and its functions"]];
if(ps.length !== 60) throw new Error("commerce syllabus: expected 60 paragraphs, found " + ps.length);
const items = MAP.map(function(m){ return {id:m[1], pp:m[2], t:m[3], full:m[0] === 27 ? ps[27] + " " + ps[28] : ps[m[0]]}; });
if(items.length !== 45) throw new Error("commerce syllabus items: " + items.length + " (expected 45)");
module.exports.items = items;
