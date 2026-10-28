// Public Administration optional: sub-topics under each official syllabus item, with the words that tie a past question to them.
//   s    : the official item (I-1 ... I-12, II-1 ... II-14) the sub-topic is filed under (see items.js)
//   re   : pattern tested against the question text (case-insensitive, accents removed first); written as a regex literal, stored as its source
//   ex   : a question that also matches this is NOT filed under the topic
//   refs : questions filed here by hand (year|paper|qno) because their text does not carry the words
//   fb   : true = fallback topic, used only for a question no other topic claims
//   p    : 1 or 2 limits the topic to that paper (omit = both)
// A question can belong to several topics (UPSC often joins two ideas in one question).
// Re-run with:  node upsc-pyq-bank/tools/optional/public-administration/build-public-administration.js
const S = function(r){ return r.source; };
const LIST = [
 // ================= PAPER I: Administration Theory =================
 // ---- I-1 Introduction
 {s:"I-1", p:1, t:"Meaning, scope and significance of Public Administration; politics-administration dichotomy; Wilson's essay 'The Study of Administration'; evolution of the discipline; centrality of the discipline", re:S(/woodrow wilson|study of administration|politics.administration dichotomy|public administration is the translation|scope of the discipline|scope of public administration|evolution of the discipline|horizons have been expanding|paradigms of public administration|public administration is constantly being reinvented|public management takes|disciplinary silos|profession of public administration|science of public administration/)},
 {s:"I-1", p:1, t:"New Public Administration and the Minnowbrook conferences", re:S(/new public administration|minnowbrook|phenomenological approach/)},
 {s:"I-1", p:1, t:"Public Choice approach; bureau-shaping and budget-maximising models", re:S(/public choice|bureau.shaping|budget.maximi[sz]ing|niskanen/)},
 {s:"I-1", p:1, t:"Liberalisation, privatisation and globalisation: the challenge to public administration, the state and the market", re:S(/role and responsibility of the state|liberali[sz]ation, privati[sz]ation|globali[sz]ation has constructed|globali[sz]ation is impacting|balance between a competitive market|strong state|market economy|market freedom|state intervention|role of the state in the development|state-led development|post-washington|washington consensus|lpg|transnational corporations|contractuali[sz]m|neoliberal|goods that market fails|market approaches|market fails/)},
 {s:"I-1", p:1, t:"Good governance and governance: concept, application, criteria, the hollow state, administrative values", re:S(/good governance|governance is neither|governance as an organizing|self-organi[sz]ing networks|under governance become|governance approach|public governance|normative and evaluative|administrative values/), ex:S(/regulatory governance|budgetary governance/)},
 {s:"I-1", p:1, t:"New Public Management, New Public Service and New Public Governance; Neo-Weberian State; public service motivation", re:S(/new public management|\bnpm\b|new public service|new public governance|neo.weberian|neo.taylorism|public service motivation|public management\b/)},
 // ---- I-2 Administrative thought
 {s:"I-2", p:1, t:"Scientific Management: Taylor and Taylorism, the gig economy, work study critics; Fayol", re:S(/taylor|scientific management|fayol/), ex:S(/human relations theory are two/)},
 {s:"I-2", p:1, t:"Classical theory and the principles of administration; the proverbs of administration", re:S(/classical (organi[sz]ation )?theory|principles of administration|proverbs|classical and human relations/)},
 {s:"I-2", p:1, t:"Weber's bureaucratic model, its critique and post-Weberian developments; bureau pathology; rationality and efficiency", re:S(/weber|bureaucra[ct]|bureau pathology|imaginary state/), ex:S(/bureaucratic (authoritarianism|values)|environmental sustainability|bureaucracy in developing|bureaucracies need|traditional bureaucratic model|bureaucracy and democracy/)},
 {s:"I-2", p:1, t:"Mary Parker Follett: dynamic administration, conflict and integration", re:S(/follett/)},
 {s:"I-2", p:1, t:"Human Relations School: Elton Mayo, Hawthorne, informal groups and organisations", re:S(/elton mayo|hawthorne|human relation|informal groups|formal organi[sz]ations are made up/)},
 {s:"I-2", p:1, t:"Chester Barnard: functions of the executive, zone of indifference, contribution-satisfaction equilibrium", re:S(/barnard|functions of the executive|zone of indifference/)},
 {s:"I-2", p:1, t:"Herbert Simon: decision-making theory, administrative behaviour, bounded rationality, programmed and non-programmed decisions", re:S(/herbert simon|administrative (behaviou?r|man)\b|programmed or non-programmed|satisfic|equilibrium of the system|inducements in sufficient/)},
 {s:"I-2", p:1, t:"Participative management: Likert, Argyris and McGregor's Theory X and Theory Y", re:S(/likert|argyris|mcgregor|participative management|theory x|theory y|system-i/)},
 {s:"I-2", p:1, t:"Systems and administrative thought: Waldo's administrative state, behavioural approach, integration of schools", re:S(/waldo|administrative state|behavioural approach|systems theory|universal administrative theory|integration of different streams|ecology of administration/), ex:S(/constitutionality of the administrative state/)},
 // ---- I-3 Administrative behaviour
 {s:"I-3", p:1, t:"Decision-making: process and techniques, narrowing choices, strategic decisions, group decisions", re:S(/decision.making|process of decisions|narrowing choices|art of decision/), ex:S(/policy|rational decision|public policy|group decision/)},
 {s:"I-3", p:1, t:"Communication: grapevine, headquarters-field communication, strategic communication, MIS and communication", re:S(/communication|grapevine|nerves of government|transparent organi[sz]ation keeps the staff/), ex:S(/new communication technology|information communication technology|ict\b/)},
 {s:"I-3", p:1, t:"Morale and motivation: Maslow, Herzberg's two-factor theory, McClelland, ERG, intrinsic and extrinsic motivation, equity, content and process theories", re:S(/morale|motivation|maslow|herzberg|mcclelland|erg theory|two-factor|hierarchy of needs|fairness and equity|equity at the workplace|content and process/), ex:S(/public service motivation/)},
 {s:"I-3", p:1, t:"Leadership: traditional and modern theories, Reddin, Blake and Mouton, transformational leadership, leaders and managers", re:S(/leader|managerial grid/)},
 {s:"I-3", p:1, t:"Organisational behaviour: individual, job and environmental factors", re:S(/organi[sz]ational behaviou?r/)},
 {s:"I-3", p:1, t:"Conflict, coordination and administrative behaviour", re:S(/conflict|coordination/), ex:S(/leader|transparent|civil society|political process/)},
 // ---- I-4 Organisations
 {s:"I-4", p:1, t:"Theories of organisation: systems and contingency theories, organic structures, strategic fit, the form of an organisation", re:S(/contingency|organi[sz]ation theory|systems approach|no single best way|future will be organic|organi[sz]ational (analysis|theory)|forms of structuring|hierarchical structures do not align|closed and open models/)},
 {s:"I-4", p:1, t:"Forms of public enterprise and organisation: departments, corporations, companies, boards and commissions, autonomy of public corporations", re:S(/public corporations?|departments?, corporations|boards and commissions|form of an organi[sz]ation|form of organi[sz]ation influences/)},
 {s:"I-4", p:1, t:"Headquarters and field relationships; MIS", re:S(/headquarter|field agenc|field relationship|management information system|\bmis\b/)},
 {s:"I-4", p:1, t:"Regulatory authorities and regulatory governance", re:S(/regulatory (authorit|commission|governance|regimes)|regulation is an old|standards are the foundation/)},
 {s:"I-4", p:1, t:"Public-Private Partnerships", re:S(/public.private partnership|\bppps?\b|public private partnership|markets, hierarchies and networks|collaboration and its cognates/)},
 // ---- I-5 Accountability and control
 {s:"I-5", p:1, t:"Accountability and control: concepts, administrative accountability, legislative and executive control, delegated legislation checks", re:S(/accountab|control over administration|legislative control|administrative control|checks and balances/), ex:S(/social audit|audit/)},
 {s:"I-5", p:1, t:"Judicial control over administration; judicial review and administrative discretion", re:S(/judicial control|judicial review|judiciary is playing|administrative discretion|judicial overreach/)},
 {s:"I-5", p:1, t:"Citizen and administration: Citizen's Charter, Right to Information, citizen-centricity", re:S(/citizen'?s? charter|right to information|\brti\b|citizen.centric|right to know|rights.based|citizen as a customer/)},
 {s:"I-5", p:1, t:"Role of media, interest groups and civil society", re:S(/media|interest groups?|civil society|voluntary organi[sz]ations|fourth estate/)},
 {s:"I-5", p:1, t:"Social audit", re:S(/social audit/)},
 // ---- I-6 Administrative law
 {s:"I-6", p:1, t:"Administrative law: meaning, scope, Dicey and the rule of law, Red Light and Green Light theories, droit administratif", re:S(/administrative law|dicey|rule of law|red light|droit|constitutionality of the administrative state/)},
 {s:"I-6", p:1, t:"Delegated legislation; subordinate legislation", re:S(/delegated legislation|subordinate legislation/)},
 {s:"I-6", p:1, t:"Administrative tribunals; courts and tribunals", re:S(/tribunal/)},
 // ---- I-7 Comparative public administration
 {s:"I-7", p:1, t:"Comparative public administration: current status, decline, new objectives, Heady and the study of administrative systems across nations", re:S(/comparative public administration|comparative study|\bcpa\b|ferrel heady|administrative systems across the world|historical and social contexts/)},
 {s:"I-7", p:1, t:"Ecology and administration: the environmental context of administration; ethnocentrism", re:S(/ecology|ecological|environmental context|ethnocentrism|environment and situational|social and historical factors play/)},
 {s:"I-7", p:1, t:"Riggsian models: fused, prismatic and diffracted societies; the critique of Riggs; industria", re:S(/riggs|prismatic|fused|diffracted|industria/)},
 {s:"I-7", p:1, t:"Politics and administration in different countries: political approach, French Republic, comparative legacy", re:S(/political and administrative systems|french republic|reciprocal relationship|political approach to public administration|politics and administration/)},
 // ---- I-8 Development dynamics
 {s:"I-8", p:1, t:"Concept of development and development administration; administrative development; Weidner", re:S(/development administration|administrative development|weidner|concept of development|dynamics is marked|development management|idea of development|concept of the development/)},
 {s:"I-8", p:1, t:"Anti-development thesis", re:S(/anti.development/)},
 {s:"I-8", p:1, t:"Bureaucracy and development; bureaucracy in developing countries", re:S(/bureaucrac.{0,60}develop|develop.{0,60}bureaucrac|bureaucracy in developing|bureaucracies need to be/), ex:S(/anti-development|liberali|globali|state intervention|sustainable|ethnocentr|comparative/)},
 {s:"I-8", p:1, t:"Women and development; self-help groups; gender equality and women's rights; women empowerment", re:S(/women|\bgender\b|self.help group/)},
 {s:"I-8", p:1, t:"Sustainable development goals, civil society and affirmative action in development", re:S(/sdgs?|sustainable development|socio-economic development|equal partners|ngos|legitimacy of the state/)},
 // ---- I-9 Personnel administration
 {s:"I-9", p:1, t:"Human resource development; recruitment and career advancement; competency mapping; lateral entry; merit-based civil service", re:S(/human resource|recruitment|career advancement|promotion|competency|lateral entry|merit.based|civil service is bound|civil service reforms|post-retirement/)},
 {s:"I-9", p:1, t:"Training: needs, types, administrative training and capacity", re:S(/training|capacity building/), ex:S(/induction/)},
 {s:"I-9", p:1, t:"Performance appraisal and performance management; 360 degree appraisal; morale of employees", re:S(/performance (appraisal|management)|360|appraisal/)},
 {s:"I-9", p:1, t:"Discipline, code of conduct and employer-employee relations; grievance redressal", re:S(/disciplinary action|discipline,|discipline and|employer.employee|code of conduct|grievance|position classification/)},
 {s:"I-9", p:1, t:"Administrative ethics and values in public service; public sector ethics, corruption", re:S(/ethic|corruption|values in|neutrality|civil servants.{0,40}(ethical|neutral)/), ex:S(/code of ethics and code of conduct for ministers/)},
 {s:"I-9", p:1, t:"Civil service role, neutrality and politics: civil servants and political superiors, voting and electoral participation", re:S(/civil servants should be allowed|political superiors|ministers from being|civil service neutrality|political neutrality/)},
 // ---- I-10 Public policy
 {s:"I-10", p:1, t:"Models of policy-making and their critique: rationalism, incrementalism, Lindblom, policy sciences, public choice in policy", re:S(/policy.making|policy making|rationalism|incrementalism|lindblom|policy sciences|rational decision|rationality in policy|policy formulation/)},
 {s:"I-10", p:1, t:"Policy implementation, monitoring, evaluation and review; policy failures; implementation gap", re:S(/implementation|policy evaluation|policy failure|public policy.{0,40}(involvement|evaluat)|evidence based policy|policy analysis|policy knowledge|cost.benefit/), ex:S(/ict can harness|e-governance|budget/)},
 {s:"I-10", p:1, t:"State theories and public policy; agenda setting; interest groups in policy; judiciary in policy formulation", re:S(/agenda setting|state theories|interest groups in|political analysis to policy|judiciary is playing|wicked/)},
 // ---- I-11 Techniques of administrative improvement
 {s:"I-11", p:1, t:"E-governance and information technology: digitalisation, ICT, AI in governance", re:S(/e-governance|information technology|digitali[sz]ation|information communication technology|\bict\b|artificial intelligence|\bai\b|new communication technology|e-advocacy/)},
 {s:"I-11", p:1, t:"Modernisation of public services and global trends in service delivery", re:S(/modernization of public services|modernisation of public services/)},
 {s:"I-11", p:1, refs:["2020|1|7(c)"], t:"Work study, organisation and methods", re:S(/work study|work measurement|organi[sz]ation and methods/)},
 {s:"I-11", p:1, t:"Management aid tools: network analysis, PERT, CPM", re:S(/\bpert\b|\bcpm\b|critical path|network analysis|management aid/)},
 // ---- I-12 Financial administration
 {s:"I-12", p:1, t:"Monetary and fiscal policies", re:S(/monetary|fiscal policy/)},
 {s:"I-12", p:1, t:"Public borrowings and public debt", re:S(/public debt|public borrowing|prudent fiscal management/)},
 {s:"I-12", p:1, t:"Budgets: types and forms, budgetary process, performance, outcome, zero-based and deficit budgeting; budgetary governance", re:S(/budget/), ex:S(/budget proposals in the parliament/)},
 {s:"I-12", p:1, t:"Performance measurement and performance information in the public sector", re:S(/performance measurement|performance information/)},
 {s:"I-12", p:1, t:"Financial accountability, accounts and audit: performance audit, internal audit, statutory audit, taxation", re:S(/audit|financial accountab|public finance|tax\b|taxation|financial integrity|financial information/), ex:S(/social audit/)},
 // ================= PAPER II: Indian Administration =================
 // ---- II-1 Evolution of Indian administration
 {s:"II-1", p:2, t:"Kautilya's Arthashastra", re:S(/kautilya|arthashastra|arthasastra/)},
 {s:"II-1", p:2, t:"Mughal administration", re:S(/mughal/)},
 {s:"II-1", p:2, t:"Legacy of British rule: Regulating Act, colonial legacy, Indianisation of services, British Civil Service", re:S(/regulating act|colonial|british (rule|civil service)|indiani[sz]ation|macaulay|company agents/)},
 {s:"II-1", p:2, t:"Revenue administration, district administration and local self-government in the colonial period", re:S(/revenue administration/)},
 // ---- II-2 Philosophical and constitutional framework
 {s:"II-2", p:2, t:"Salient features and value premises: the Preamble, constitutional ideals, social and economic justice, government by limited powers", re:S(/preamble|salient features|value premises|government of india act, 1935|sources of indian constitution|philosophical part|constitutional (sources|ideals)|basic structure/)},
 {s:"II-2", p:2, t:"Constitutionalism and rule of law", re:S(/constitutionalism|rule of law|constitutional values|constitutional amendment/), ex:S(/ninety-first|73rd|74th|gst|panchayat/)},
 {s:"II-2", p:2, refs:["2017|2|4(a)"], t:"Political culture; bureaucracy and democracy; bureaucracy and development in India", re:S(/traditional bureaucratic model|political culture|bureaucracy and democracy|bureaucrac.{0,40}(democra|nation|develop|environmental sustainability)|bureaucratic (authoritarianism|values)|political and permanent executive|permanent executive|political interference in development|technocrats in bureaucracy|checks and balances/)},
 {s:"II-2", p:2, t:"Fundamental rights, human rights and the judiciary: horizontal application, gender equality, NHRC", re:S(/fundamental rights|gender equality|human rights|vishaka|equal(ity)? opportunity/)},
 // ---- II-3 Public sector undertakings
 {s:"II-3", p:2, t:"Public sector in modern India: forms, Maharatna and Navratna, welfarism, public enterprises", re:S(/public sector|public enterprise|public undertakings|\bpsus?\b|maharatna|navratna|ordnance factory/)},
 {s:"II-3", p:2, t:"Autonomy, accountability and control of public undertakings", re:S(/autonomy.{0,40}(public|undertaking)|public.{0,40}autonomy/)},
 {s:"II-3", p:2, t:"Impact of liberalisation and privatisation: disinvestment, LPG, market reforms, NPAs and banks", re:S(/liberali[sz]ation|privati[sz]ation|disinvestment|\blpg\b|market reforms|economic reforms|non.performing assets|\bnpa\b|atmanirbhar|nationali[sz]ed banks/)},
 // ---- II-4 Union government and administration
 {s:"II-4", p:2, refs:["2019|2|3(a)","2021|2|5(d)","2023|2|1(c)"], t:"Executive at the Union: Prime Minister, Cabinet, PMO, Council of Ministers, Cabinet Secretariat, Ministry of Home Affairs", re:S(/prime minister|\bpmo\b|cabinet|council of ministers|ninety-first|elected head as the real executive|ministry of home|central secretariat|ministries and departments|ministers/), ex:S(/chief minister|state/)},
 {s:"II-4", p:2, t:"Parliament and parliamentary control: committees, cut motions, speaker, legislative control, Westminster model", re:S(/parliament|westminster|cut motions|speaker|legislatures?|legislative/), ex:S(/parliamentary democracy in india envisages elected head|finance commission|pith and substance/)},
 {s:"II-4", p:2, t:"Judiciary: judicial reforms, collegium, All India Judicial Service, judicial overreach, efficiency", re:S(/judiciar|judicial|collegium|aijs|supreme court|courts? system|delivery of justice|speedy justice|access to justice/), ex:S(/prakash singh|police reform|judicial control/)},
 {s:"II-4", p:2, t:"Intra-governmental relations, boards, commissions, attached offices, field organisations, Election Commission", re:S(/attached offices|field organi[sz]ations|election commission|boards|commissions? /), ex:S(/planning commission|ordnance factory|finance commission|capacity building commission|human rights commission|regulatory commission|reforms commission/)},
 {s:"II-4", p:2, t:"Recent trends in Union administration: Pro-Active Governance and Timely Implementation (PRAGATI), digital public infrastructure, e-governance", re:S(/pragati|digital public infrastructure|recent trends|cyber|e-marketplace|\bgem\b|aadhaar|cpgrams|government process reengineering|\bgpr\b|sevottam|public service guarantee|citizens? charter/)},
 // ---- II-5 Plans and priorities
 {s:"II-5", p:2, t:"Machinery of planning: Planning Commission, NITI Aayog, National Development Council, NDAP", re:S(/planning commission|\bniti\b|national development council|\bndc\b|machinery of planning|\bndap\b|planning in india|planning has failed/)},
 {s:"II-5", p:2, t:"Indicative and strategic planning; plan formulation; integrated and holistic plans", re:S(/indicative|strategic planning|unified and holistic plans|plan formulation|planning pattern/)},
 {s:"II-5", p:2, t:"73rd and 74th Amendments and decentralised planning for economic development and social justice; District Planning Committee", re:S(/decentrali[sz]ed planning|district planning|decentrali[sz]ed|planning enhances/)},
 // ---- II-6 State government and administration
 {s:"II-6", p:2, t:"Union-State administrative, legislative and financial relations; centre-state relations; fiscal federalism; GST; cooperative federalism", re:S(/centre.state|union.state|fiscal federalism|cooperative federalism|co-operative federalism|\bgst\b|goods and services tax|federal|doctrine of pith|union government contributes|legislative relations|one nation|inter-state rivers|water of interstate|article 356|state government to correct/)},
 {s:"II-6", p:2, t:"Finance Commission: role, terms of reference, State Finance Commissions, devolution to local bodies", re:S(/finance commission/)},
 {s:"II-6", p:2, refs:["2023|2|1(e)"], t:"Governor, Chief Minister and Council of Ministers; role of the Speaker; coalition governments at the State", re:S(/governor|chief minister|assembly|coalition/), ex:S(/chief secretary|colonial/)},
 {s:"II-6", p:2, t:"Chief Secretary, State Secretariat and Directorates", re:S(/chief secretary|state secretariat|directorate/)},
 // ---- II-7 District administration since Independence
 {s:"II-7", p:2, t:"Changing role of the Collector and District Magistrate; redefining the functions of the Deputy Commissioner", re:S(/collector|district magistrate|deputy commissioner|district administration|district training|districts? was|reorgani[sz]ation of districts/)},
 {s:"II-7", p:2, t:"Union-State-local relations and development management versus law and order in the district", re:S(/development management|law and order maintenance|local relations|district administration and local/), ex:S(/police/)},
 {s:"II-7", p:2, t:"District administration and democratic decentralisation; climate change and the district", re:S(/climate change|democratic decentrali[sz]ation|district.{0,30}(local|panchayat)/)},
 // ---- II-8 Civil services
 {s:"II-8", p:2, t:"Constitutional position, Public Service Commissions and structure of the civil services", re:S(/public service commission|constitutional position|constitutional stature|all india services|structure of (the )?civil service|autonomy granted to higher civil servants|safeguards available to the civil servants/)},
 {s:"II-8", p:2, t:"Recruitment, training and capacity building: induction training, Mission Karmayogi, Capacity Building Commission, National Training Policy", re:S(/recruitment|induction training|karmayogi|capacity building commission|national training policy|training programmes|capacity (building|issues)|lateral entry|post-retirement|employees have hampered/)},
 {s:"II-8", p:2, t:"Good governance initiatives, code of conduct, civil service reforms, transfer policy and neutrality; Prime Minister's awards", re:S(/good governance initiatives|awards for excellence|civil service reforms|transfer policy|neutrality of civil service|neutral and anonymous|neutral|autonomy.{0,30}civil serv|code of conduct and discipline|civil servants|bureaucrac.{0,40}(accountab|innovat)|enablers|red.tapism/), ex:S(/ethical|corruption/)},
 {s:"II-8", p:2, t:"Staff associations, political rights, grievance redressal and civil service activism", re:S(/staff association|political rights|grievance|airing grievances|activism|performance management system|deadwood/)},
 {s:"II-8", p:2, t:"Civil service role in policy: Seventh Pay Commission, bureaucracy and ethics of public life", re:S(/pay commission|ethics and integrity in public life|ethics in public/)},
 // ---- II-9 Financial management
 {s:"II-9", p:2, t:"Budget as a political and economic instrument; budget proposals and scrutiny; guillotine; Railway Budget", re:S(/budget|guillotine|railway budget/), ex:S(/disaster|police/)},
 {s:"II-9", p:2, t:"Parliamentary control of public expenditure; Public Accounts Committee", re:S(/parliamentary control over public expenditure|public expenditure|accountability of the executive to the parliament/)},
 {s:"II-9", p:2, refs:["2026|2|6(b)"], t:"Role of Finance Ministry; monetary and fiscal area; banks and financial inclusion; accounting techniques", re:S(/finance ministry|monetary|fiscal|financial inclusion|income tax|black money|banks|treasur|accounting/), ex:S(/fiscal federalism|fiscal management|state/)},
 {s:"II-9", p:2, t:"Audit: Comptroller and Auditor General, Controller General of Accounts, statutory audit", re:S(/comptroller|\bcag\b|controller general of accounts|\bcga\b|audit/)},
 // ---- II-10 Administrative reforms since Independence
 {s:"II-10", p:2, t:"Administrative reforms: major concerns, committees and commissions (Appleby, ARC), political will, problems of implementation", re:S(/restructuring of the administrative|administrative reforms?|reforms commission|administrative reform is|artificial inducement|\barc\b|appleby|political will|reforms in india/)},
 {s:"II-10", p:2, t:"Reforms in financial management and human resource development; subsidiarity; process reengineering", re:S(/subsidiarity|reforms in financial|human resource development|performance management|process reengineering|competency mapping/), ex:S(/civil service/)},
 // ---- II-11 Rural development
 {s:"II-11", p:2, t:"Rural development institutions, agencies and programmes: foci and strategies; MGNREGA; Rurban Mission; Antyodaya; rural connectivity", re:S(/rural development|rural connectivity|rurban|antyodaya|mgnrega|small and marginal farmers|rural economy|swachh bharat|village/)},
 {s:"II-11", p:2, t:"Decentralisation and Panchayati Raj; 73rd Amendment; Gram Sabha; PESA; gram swaraj; women in panchayats", re:S(/panchayat|gram sabha|gram swaraj|73rd|local (self.)?government|local governance|local bodies|local actors|new localism|ward committees|democratic decentrali|deliberative democracy/), ex:S(/urban|74th|municipal|metropolitan/)},
 // ---- II-12 Urban local government
 {s:"II-12", p:2, t:"Municipal governance: structures, finance, problem areas; 74th Amendment; ward committees", re:S(/urban|municipal|74th|ward committees|metropolitan|mega cit|city management|smart cit/)},
 {s:"II-12", p:2, t:"Global-local debate and new localism; development dynamics of city management", re:S(/global.local|new localism|neighbourhood management|glocal|ease of living/)},
 // ---- II-13 Law and order administration
 {s:"II-13", p:2, t:"Police administration and police reforms: Prakash Singh case, National Police Commission, police-public relations, separation of investigation and prosecution, smart policing", re:S(/police|prakash singh|law and order|smart policing|community policing|investigation and prosecution/)},
 {s:"II-13", p:2, t:"Investigative agencies and paramilitary forces: NIA, AFSPA, countering insurgency and terrorism, cyber crime", re:S(/\bnia\b|national investigation agency|afspa|paramilitary|terroris|insurgen|cyber crime|armed forces/)},
 {s:"II-13", p:2, t:"Criminalisation of politics and administration; corruption institutions at the Centre and States", re:S(/criminali[sz]ation|criminali[sz]ation of politics/)},
 // ---- II-14 Significant issues in Indian administration
 {s:"II-14", p:2, refs:["2021|2|4(b)","2021|2|5(c)"], t:"Values in public service; ethics and integrity in public life; ethics code for ministers", re:S(/values in public service|ethics and integrity|ethics in public services|ethics|ethical|code of ethics|ministers.{0,40}(conduct|ethical)/), ex:S(/administrative ethics|public sector ethics|by police/)},
 {s:"II-14", p:2, t:"Regulatory Commissions and regulators: TRAI, SEBI, National Green Tribunal, regulators and their accountability", re:S(/regulatory|regulators?|\btrai\b|\bsebi\b|national green tribunal|net neutrality|telecom/)},
 {s:"II-14", p:2, t:"National Human Rights Commission and Lokpal, Lokayukta: anti-corruption institutions", re:S(/human rights commission|\bnhrc\b|lokpal|lokayukta|uncac|corruption|zero tolerance/)},
 {s:"II-14", p:2, refs:["2016|2|1(e)","2018|2|2(c)"], t:"Civil society, NGOs and the State in administration", re:S(/civil society|\bngos?\b/)},
 {s:"II-14", p:2, t:"Problems of administration in coalition regimes and citizen-administration interface; consumer and citizen grievances", re:S(/coalition|citizen.administration|citizen administration|public grievance|public service delivery|service delivery|consumers|right to information|\brti\b/)},
 {s:"II-14", p:2, t:"Public policies and programmes: health policy, Project Bharatmala and national projects", re:S(/health policy|bharatmala|national health/)},
 {s:"II-14", p:2, t:"Disaster management: National Disaster Management Plan, disaster risk, AI in disaster management, community-based DRM", re:S(/disaster/)},
 // ---- fallback topics (used only for a question no other topic claims)
];
module.exports = LIST;
