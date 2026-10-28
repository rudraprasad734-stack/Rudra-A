// Political Science and International Relations optional: sub-topics under each official syllabus item, with the words that tie a past question to them.
//   s    : the official item (I-A1 ... I-A10, I-B1 ... I-B11, II-A1 ... II-A11, II-B1 ... II-B8) the sub-topic is filed under (see items.js)
//   re   : pattern tested against the question text (case-insensitive, accents removed first); written as a regex literal, stored as its source
//   ex   : a question that also matches this is NOT filed under the topic
//   refs : questions filed here by hand (year|paper|qno) because their text does not carry the words
//   fb   : true = fallback topic, used only for a question no other topic claims
//   p    : 1 or 2 limits the topic to that paper (omit = both)
// A question can belong to several topics (UPSC often joins two thinkers or two ideas in one question).
// Several Paper II India topics use a lookahead (^(?=.*(\bindia|\bindo-))(?=.*...)) so that only questions about India and the named country/group are filed there.
// Re-run with:  node upsc-pyq-bank/tools/optional/political-science/build-political-science.js
const S = function(r){ return r.source; };
const LIST = [
 // ================= PAPER I, SECTION A: Political Theory and Indian Politics =================
 // ---- I-A1 Political theory: meaning and approaches
 {s:"I-A1", p:1, t:"Nature of political theory: the meaning of 'political', decline and resurgence of political theory, its relevance", re:S(/decline of political theory|resurgence of political theory|meanings? inherent in the term|relevance of political theory/)},
 {s:"I-A1", p:1, t:"Normative approach to political theory", re:S(/normative/)},
 {s:"I-A1", p:1, t:"Behavioural and post-behavioural approaches: the credo of relevance, decline of behaviouralism", re:S(/behaviou?ral|post-behaviou?ralism|credo of relevance/)},
 {s:"I-A1", p:1, t:"Philosophical, institutional and systems approaches to political theory", re:S(/philosophical approach|institutional approach|systems approach|empirical approach|historical approach/)},
 {s:"I-A1", p:1, t:"Post-modernism and recent developments in political theory; the evolution of Western political thought", re:S(/post-?modern|western political thought/)},
 // ---- I-A2 Theories of the state
 {s:"I-A2", p:1, t:"Liberal and neo-liberal theories of the State: the minimal State, limits on State power, community and nation against neo-liberalism", re:S(/liberal theory of state|neo-?liberal|liberal approach towards the state|state limiting its own power|minimal state/)},
 {s:"I-A2", p:1, t:"Marxist theory of the State", re:S(/marxist (and liberal )?approach towards the state|marxist theory of (the )?state/)},
 {s:"I-A2", p:1, t:"Pluralist theory of the State (Laski, Cole, Figgis)", re:S(/pluralis|laski/)},
 {s:"I-A2", p:1, t:"Post-colonial theory of the State and Eurocentrism", re:S(/post.?colonial|eurocentrism/)},
 {s:"I-A2", p:1, t:"Feminist critique of the State", re:S(/feminist (critique|theory) of the state/)},
 {s:"I-A2", p:1, t:"The State and the individual: the totalitarian State, the State as a threat to individuality", re:S(/nothing against the state|state .{0,12}does the greatest harm|against the state/)},
 // ---- I-A3 Justice
 {s:"I-A3", p:1, t:"Rawls: justice as fairness, the original position, distributive justice, the liberal self", re:S(/rawl'?s|justice as fairness|pure procedural justice|liberal self|distributive justice/)},
 {s:"I-A3", p:1, t:"Communitarian critique of Rawls and liberal theories of justice", re:S(/communitarian/)},
 {s:"I-A3", p:1, t:"Other conceptions of justice: Greek (Plato, Aristotle), entitlement theory (Nozick), social justice (Ambedkar)", re:S(/greek perspective of justice|entitlement theory|social justice|egalitarian justice|conceptions? of justice/)},
 // ---- I-A4 Equality
 {s:"I-A4", p:1, t:"Equality: social, political and economic equality; equality of opportunity and of outcome; the capability approach", re:S(/equality|egalitarian|capability/), ex:S(/egalitarianism in indian society/)},
 {s:"I-A4", p:1, t:"Liberty and freedom: negative and positive liberty, equality and freedom", re:S(/liberty|freedom of the pike|negative and positive/), ex:S(/civil liberty/)},
 {s:"I-A4", p:1, t:"Affirmative action", re:S(/affirmative action|positive discrimination/)},
 // ---- I-A5 Rights
 {s:"I-A5", p:1, t:"Meaning, theories and kinds of rights: natural rights, rights as trumps, the right to property, multiculturalism and multicultural perspectives on rights (Parekh)", re:S(/rights as trumps|rights of the man|right to property|perspective on rights|theories of rights|natural rights|multi-?cultural/)},
 {s:"I-A5", p:1, t:"Human rights: universalism and cultural relativism, three generations of rights", re:S(/human rights|universal conception|cultural relativism|three generations|universalism/), ex:S(/national human rights commission|human rights movements/)},
 // ---- I-A6 Democracy
 {s:"I-A6", p:1, t:"Classical and contemporary theories of democracy: elite theory, Macpherson, substantive democracy, the rule of the people", re:S(/classical (and contemporary )?democra|elit(e|ist) theory|macpherson|substantive democracy|success of contemporary democracies|rule of the people/)},
 {s:"I-A6", p:1, t:"Models of democracy: representative, participatory and deliberative", re:S(/representative democracy|participatory|deliberati/)},
 // ---- I-A7 Concept of power: hegemony, ideology and legitimacy
 {s:"I-A7", p:1, t:"Power: nature and meaning, bases of power, Foucault, Macpherson on power, power, authority and legitimacy", re:S(/nature and meaning of power|view on power|foucault|bases of power|power and hegemony|political authority and obligation|power, authority/)},
 {s:"I-A7", p:1, t:"Hegemony: Gramsci and hegemony as consent", re:S(/hegemony|gramsci/), ex:S(/hegemony of neo-liberalism/)},
 {s:"I-A7", p:1, t:"Ideology: the end of ideology and end of history debates, the nature of political ideology", re:S(/ideolog|end of history/), ex:S(/absolutist ideology|ideological components/)},
 {s:"I-A7", p:1, t:"Legitimacy: sources, tools of legitimation, legitimacy as a social construct, political obligation", re:S(/legitima|political obligation/)},
 // ---- I-A8 Political ideologies
 {s:"I-A8", p:1, t:"Liberalism: its decline and revival, liberalism as a revolutionary idea, the open society (Popper)", re:S(/liberalism|open society|revolutionary idea/), ex:S(/neo-liberalism|liberalization|liberalisation/)},
 {s:"I-A8", p:1, t:"Socialism and Marxism: class, alienation, revolution in permanence, relevance of Marxism, state socialism, Marcuse", re:S(/marxis|socialis|revolution in permanence|\bclass\b|alienation|marcuse/), ex:S(/national movement|marxism and cultural/)},
 {s:"I-A8", p:1, t:"Fascism: Italian and German fascism, fascism and parliamentary democracy", re:S(/fascis|facism|mussolini/)},
 {s:"I-A8", p:1, t:"Gandhism as an ideology: its ideological components, trusteeship, the theory of property", re:S(/gandhism|ideological components|trusteeship/)},
 {s:"I-A8", p:1, t:"Feminism: liberal and radical feminism, the personal is political, Wollstonecraft, Mill on women's subjection and suffrage", re:S(/feminis|wollstonecraft|personal is political|women suffrage|subordination of one sex/), ex:S(/feminist critique of the state/)},
 // ---- I-A9 Indian political thought
 {s:"I-A9", p:1, t:"Dharmashastra and the sources of ancient Indian political thought", re:S(/dharma ?shastra|sources of ancient indian|ancient indian political/)},
 {s:"I-A9", p:1, t:"Kautilya and the Arthashastra: the Saptanga theory, the elements of the State", re:S(/kautilya|arthashastra|saptanga/)},
 {s:"I-A9", p:1, t:"Buddhist traditions: Dhamma and the ethical foundation of political thought", re:S(/buddhis|dhamma/)},
 {s:"I-A9", p:1, t:"Sir Syed Ahmad Khan: reform, education and modernity", re:S(/syed/)},
 {s:"I-A9", p:1, t:"Sri Aurobindo: Swaraj and spiritual nationalism", re:S(/aurobindo/)},
 {s:"I-A9", p:1, t:"M. K. Gandhi: Swaraj, Gram Swaraj, trusteeship and property, the State and the individual", re:S(/gandhi|swaraj/)},
 {s:"I-A9", p:1, t:"B. R. Ambedkar: constitutionalism, democracy, social justice, annihilation of caste, state socialism", re:S(/ambedkar|annihilation of caste/)},
 {s:"I-A9", p:1, t:"M. N. Roy: radical humanism and Marxism", re:S(/\bm\. ?n\. roy|manabendra|radical humanis/)},
 // ---- I-A10 Western political thought
 {s:"I-A10", p:1, t:"Plato: the theory of Forms, the Republic, Aristotle's critique of Plato", re:S(/plato|theory of forms/)},
 {s:"I-A10", p:1, t:"Aristotle: the view of politics, the constitution, the best State", re:S(/aristot/)},
 {s:"I-A10", p:1, t:"Machiavelli: virtu and fortuna, religion and politics, secularism", re:S(/machiavelli/)},
 {s:"I-A10", p:1, t:"Hobbes: the state of nature, absolutism and individualism", re:S(/hobbes|state of nature/)},
 {s:"I-A10", p:1, t:"John Locke: the social contract, constitutionalism, property, revolution, the father of liberalism", re:S(/locke/)},
 {s:"I-A10", p:1, t:"John Stuart Mill: liberty, representative government, women's subjection, the 'reluctant democrat'", re:S(/\bmill\b/)},
 {s:"I-A10", p:1, t:"Karl Marx: class, alienation, historical materialism, the relevance of Marx", re:S(/\bmarx\b|karl marx|marx's|alienation|concept of class|marxism is a political theory|relevance of marxism/)},
 {s:"I-A10", p:1, t:"Gramsci: hegemony, civil society and consent", re:S(/gramsci/)},
 {s:"I-A10", p:1, t:"Hannah Arendt: labour, work and action (vita activa), the public realm", re:S(/arendt|vita activa|labour, work and action/)},
 // ================= PAPER I, SECTION B: Indian Government and Politics =================
 // ---- I-B1 Indian nationalism
 {s:"I-B1", p:1, t:"Strategies of the freedom struggle: constitutionalism, Swadeshi, non-cooperation, civil disobedience, Satyagraha, the revolt of 1857, the anti-imperialist movement, women in the struggle", re:S(/satyagraha|non-cooperation|civil disobedience|swadeshi|1857|sepoy|anti-imperialist|freedom struggle|freedom fighters|role of socialists/)},
 {s:"I-B1", p:1, t:"Militant and revolutionary movements", re:S(/militant|revolutionary movements|armed revolutionaries/)},
 {s:"I-B1", p:1, t:"Peasant and workers' movements", re:S(/peasant movements|workers'? movement/)},
 {s:"I-B1", p:1, t:"Perspectives on the Indian national movement: liberal, socialist, Marxist, radical humanist, Dalit", re:S(/perspective (of|on) (the )?(nature of )?(indian )?national movement|marxist perspective|dalit perspective|radical humanis/)},
 // ---- I-B2 Making of the Indian Constitution
 {s:"I-B2", p:1, t:"The Constituent Assembly and colonial legacies: the Objective Resolution, British imprint, constitutional antecedents", re:S(/constituent assembly|objective resolution|imprint of the british|historical process|constitutional antecedents|legacies of (the )?british|lawyers' paradise/)},
 {s:"I-B2", p:1, t:"Concerns of the Constitution makers: unity and integrity, national identity amid diversity, social revolution and social inequality, the cornerstone of a nation", re:S(/constitution makers|making of the indian constitution|social revolution|social inequality|cornerstone of a nation|unity and integrity/)},
 // ---- I-B3 Salient features of the Constitution
 {s:"I-B3", p:1, t:"The Preamble, founding principles and secularism", re:S(/preamble|founding principles|secular/), ex:S(/machiavelli/)},
 {s:"I-B3", p:1, t:"Fundamental Rights: Part III, the right to constitutional remedies, legal remedies, the right to privacy", re:S(/fundamental rights|part iii|constitutional remedies|legal remedies|right to privacy|right to life/)},
 {s:"I-B3", p:1, t:"Fundamental Duties", re:S(/fundamental duties/)},
 {s:"I-B3", p:1, t:"Directive Principles of State Policy, their relation to Fundamental Rights, constitutional provisions for the environment", re:S(/directive principles|protection of environment/)},
 {s:"I-B3", p:1, t:"Amendment of the Constitution: procedure, the first amendment, frequent amendments", re:S(/amendments? of the constitution|first constitutional amendment|amendment procedure|constitutional amendment/), ex:S(/73rd|74th/)},
 {s:"I-B3", p:1, t:"Judicial review, the Basic Structure doctrine and constitutional morality", re:S(/basic structure|judicial review|judicial overreach|constitutional morality|constitutionalism/)},
 // ---- I-B4 Principal organs of the Union and State governments
 {s:"I-B4", p:1, t:"The Executive: the President, the Prime Minister and the PMO, Governors and Lieutenant Governors, executive power", re:S(/president of india|prime minister|\bpmo\b|lieutenant governor|governors?\b|executive/), ex:S(/judiciary has acquired/)},
 {s:"I-B4", p:1, t:"The Legislature: Parliament, parliamentary committees, the Speaker, the Legislative Council, functioning of Parliament", re:S(/parliament|legislative council|speaker|committees/), ex:S(/parliamentary system|article 368/)},
 {s:"I-B4", p:1, t:"The Supreme Court and High Courts: jurisdiction, judicial activism, the court as a policy forum", re:S(/supreme court|high court|judicial activism|judicial overreach|constitutional court|advisory jurisdiction|policy evolution|judiciary/)},
 // ---- I-B5 Grassroots democracy
 {s:"I-B5", p:1, t:"Panchayati Raj: the 73rd Amendment, Gram Sabha, political and administrative decentralisation, women in local governance", re:S(/panchayat|gram sabha|gram swaraj|73rd|decentrali|local governance|proxy leadership|grass ?roots?(?! movements?)/)},
 {s:"I-B5", p:1, t:"Municipal government: the 74th Amendment and the District Planning Committee", re:S(/74th|municipal|urban local|district planning committee/)},
 {s:"I-B5", p:1, t:"Grassroots movements: Chipko, anti-arrack, Tuticorin, the environmentalism of the poor", re:S(/chipko|anti-arrack|tuticorin|environmentalism of the poor|grass ?roots movements?/)},
 // ---- I-B6 Statutory institutions and commissions
 {s:"I-B6", p:1, t:"Election Commission of India: appointment, powers, role and functioning", re:S(/election commission|chief election commissioner|election commissioners/)},
 {s:"I-B6", p:1, t:"Comptroller and Auditor General (CAG)", re:S(/comptroller|\bcag\b/)},
 {s:"I-B6", p:1, t:"Finance Commission", re:S(/finance commission/)},
 {s:"I-B6", p:1, t:"UPSC and the civil services: lateral entry", re:S(/lateral entry|public service commission|civil services?/)},
 {s:"I-B6", p:1, t:"Right to Information and the Information Commissions", re:S(/right to information/)},
 {s:"I-B6", p:1, t:"National Commission for Women", re:S(/commission for women/)},
 {s:"I-B6", p:1, t:"National Human Rights Commission", re:S(/national human rights commission/)},
 {s:"I-B6", p:1, t:"National Commission for Minorities and for Backward Classes", re:S(/commission for minorities|backward classes/)},
 // ---- I-B7 Federalism
 {s:"I-B7", p:1, t:"Federalism: constitutional provisions, centre-state relations, unitary and asymmetrical features, Article 293, GST", re:S(/federalism|federal|federation|centre and state|distribution of powers|centre-state|article 293|lieutenant governors|goods and services|\bgst\b|unitary|asymmetric/)},
 {s:"I-B7", p:1, t:"Inter-State disputes: the Inter-State Council, inter-State water disputes", re:S(/inter-?state (water|council|disputes)|water disputes/)},
 {s:"I-B7", p:1, t:"Integrationist tendencies and regional aspirations: new States, Jammu and Kashmir, regional parties, delimitation", re:S(/new states|creation of new|regional aspirations|jammu and kashmir|delimitation|regional parties/)},
 // ---- I-B8 Planning and economic development
 {s:"I-B8", p:1, t:"Planning and economic development: Nehruvian and Gandhian perspectives, the Planning Commission, NITI Aayog, the public sector, the politics of economic growth", re:S(/planning|nehruvian|niti aayog|public sector|economic growth/), ex:S(/district planning/)},
 {s:"I-B8", p:1, t:"Green Revolution, land reforms and agrarian relations", re:S(/green revolution|land reform|agrarian|agricultur/)},
 {s:"I-B8", p:1, t:"Liberalisation and economic reforms", re:S(/liberali[sz]ation (of|has|period)|economic reforms|post-liberali|social development outcomes|liberalization on/), ex:S(/neo-liberal/)},
 // ---- I-B9 Caste, religion and ethnicity
 {s:"I-B9", p:1, t:"Caste in Indian politics: caste politics, caste census, caste and electoral behaviour, caste as a political category", re:S(/caste|backward classes/)},
 {s:"I-B9", p:1, t:"Religion in Indian politics", re:S(/religion|communal/)},
 {s:"I-B9", p:1, t:"Ethnicity and identity: ethnic conflicts, insurgency, the North-East, identity politics", re:S(/ethnic|identity|insurgenc|north-east|north east|tribal|cultural and regional differences/), ex:S(/national identity/)},
 // ---- I-B10 Party system
 {s:"I-B10", p:1, t:"Party system: national and regional parties, intra-party democracy, party personalities, the 1989-1999 shift", re:S(/party system|political parties|regional (political )?parties|national and regional|intra-party|political personalities|1989.1999/)},
 {s:"I-B10", p:1, t:"Coalition politics", re:S(/coalition/)},
 {s:"I-B10", p:1, t:"Pressure groups", re:S(/pressure groups?/)},
 {s:"I-B10", p:1, t:"Electoral behaviour: voting trends, caste and development in elections, religion in elections, astroturfing", re:S(/electoral|voting|voters?|astroturf/), ex:S(/electoral college/)},
 {s:"I-B10", p:1, t:"Changing socio-economic profile of legislators", re:S(/profile of (our )?legislators/)},
 // ---- I-B11 Social movements
 {s:"I-B11", p:1, t:"Civil liberties and human rights movements", re:S(/civil liberty|civil liberties/)},
 {s:"I-B11", p:1, t:"Women's movements: the anti-arrack movement", re:S(/anti-arrack|women'?s movements?/)},
 {s:"I-B11", p:1, t:"Environmentalist movements and environmental governance: Chipko, Tuticorin, political will", re:S(/environmental(ist)? movement|chipko|tuticorin|environmentalism|environmental governance|environmental degradation/)},
 {s:"I-B11", p:1, t:"The Dalit movement and the Dalit struggle for egalitarianism", re:S(/dalit movement|dalit struggle/)},
 // ================= PAPER II, SECTION A: Comparative Political Analysis and International Politics =================
 // ---- II-A1 Comparative politics
 {s:"II-A1", p:2, t:"Nature, scope and approaches of comparative politics: political economy, interpretive, psychological, institutional; empirical theory", re:S(/subject matter of comparative|changing nature of comparative|political economy approach|political-sociolog|political sociolog|interpretive approach|psychological approach|empirical political theory|institutional approach/)},
 {s:"II-A1", p:2, t:"Limitations of the comparative method and difficulties of comparing States", re:S(/comparative method|comparative political analysis|comparing the states|limitations of (the )?comparative/)},
 // ---- II-A2 The State in comparative perspective
 {s:"II-A2", p:2, t:"The changing nature of the State: capitalist, socialist, advanced industrial, developing and post-colonial societies; the post-modern State", re:S(/nature of the state|changing nature of (the )?state|state in the developing|post.?colonial state|post.?modern state|extractive capitalism|industrial societies|capitalist economies/)},
 // ---- II-A3 Politics of representation and participation
 {s:"II-A3", p:2, t:"Political parties and party systems: electoral systems and cleavages, parties in sustaining democracy, centrist and right-wing parties", re:S(/political parties|party systems?|electoral systems?|centrist|centre-right/)},
 {s:"II-A3", p:2, t:"Pressure groups and social movements in advanced industrial and developing societies; new social movements", re:S(/pressure groups?|interest groups?|social movements?/)},
 {s:"II-A3", p:2, t:"Political participation: voter turnout, citizenship, identity, political socialisation, clientelism", re:S(/participation|turnout|citizenship|identity|political socializ|clientil|clientel|electoral democracy/), ex:S(/defensive realism/)},
 // ---- II-A4 Globalisation
 {s:"II-A4", p:2, t:"Globalisation: meaning, debate, deglobalisation and the Global South", re:S(/globali[sz]ation|globalisation/)},
 // ---- II-A5 Approaches to the study of International Relations
 {s:"II-A5", p:2, t:"Idealism and liberal internationalism", re:S(/idealis/)},
 {s:"II-A5", p:2, t:"Realism: classical realism, neo-realism, offensive and defensive realism, the realist prescription", re:S(/realism|realist|morgenthau|waltz|offensive and defensive/), ex:S(/hyper-realist/)},
 {s:"II-A5", p:2, t:"Marxist and world-systems approaches: dependency, Gramscian hegemony", re:S(/marxist|world.systems|dependency|gramscian/)},
 {s:"II-A5", p:2, t:"Functionalist and systems approaches", re:S(/functionalis|systems? (theory|approach)|neo-functional/), ex:S(/world.systems/)},
 {s:"II-A5", p:2, t:"Other theories of International Relations: neo-liberalism, power transition, objectivity and bias in theory", re:S(/power transition|neo-?liberalism|theories of international relations|constructiv/), ex:S(/nehruvianism/)},
 // ---- II-A6 Key concepts in International Relations
 {s:"II-A6", p:2, refs:["2026|2|2(c)"], t:"National interest, power and diplomacy: soft power, hard power, sources of power, diplomacy", re:S(/national interest|soft power|sources of a country/)},
 {s:"II-A6", p:2, t:"Security: non-traditional security, human security, food and environmental threats", re:S(/non-traditional security|human security|environmental degradation|security threats|food and environmental/)},
 {s:"II-A6", p:2, t:"Balance of power and deterrence", re:S(/balance of power|nuclear deterrence|deterrence/)},
 {s:"II-A6", p:2, t:"Collective security and the responsibility to protect", re:S(/collective security|responsibility to protect|\br2p\b/)},
 {s:"II-A6", p:2, t:"Transnational actors and complex interdependence: multinational corporations", re:S(/transnational|complex interdependence|multinational corporations|\bmncs?\b/)},
 // ---- II-A7 Changing international political order
 {s:"II-A7", p:2, t:"The Cold War: superpowers, bipolarity, the arms race and the nuclear threat", re:S(/bipolar|cold war|superpower|arms race|soviet/), ex:S(/post-cold war/)},
 {s:"II-A7", p:2, t:"The Non-Aligned Movement: aims, achievements, relevance and revival", re:S(/non-?aligned movement|\bnam\b|non-?alignment|nonalignment/)},
 {s:"II-A7", p:2, t:"After the Soviet collapse: unipolarity, American hegemony, multipolarity, China's rise and the emerging world order", re:S(/unipolar|disintegration|hegemon|multipolar|multi-polar|world order|trump|rise of people|sino-american|us-china|decline of the united states/), ex:S(/india'?s vision|for india, a multipolar|role of india in shaping/)},
 {s:"II-A7", p:2, t:"Regional conflicts and alliances: NATO, Russia and Ukraine, the Korean Peninsula, denuclearisation", re:S(/nato|ukrain|korean peninsula|russian regime|denuclearis/)},
 // ---- II-A8 Evolution of the international economic system
 {s:"II-A8", p:2, t:"Bretton Woods, the IMF and the World Bank; economic sanctions", re:S(/bretton|\bimf\b|world bank|international monetary|economic sanctions/)},
 {s:"II-A8", p:2, t:"GATT and the WTO: trade barriers, dispute settlement, TRIPS, fisheries, reciprocal tariffs", re:S(/\bwto\b|gatt|world trade|trips|trade barriers|reciprocal tariffs/)},
 {s:"II-A8", p:2, t:"Socialist economies and the CMEA", re:S(/cmea|council of mutual economic|socialist economies/)},
 {s:"II-A8", p:2, t:"The New International Economic Order (NIEO)", re:S(/nieo|new international economic order/)},
 // ---- II-A9 United Nations
 {s:"II-A9", p:2, t:"UN reform and the Security Council: reform proposals, permanent and semi-permanent seats, the veto", re:S(/un reforms|united nations for its reforms|security council reforms|permanent (member|seat)|semi-permanent|reform proposals|veto|\bunsc\b|changes in its structures|functioning of the un|achievements to its credit/)},
 {s:"II-A9", p:2, t:"The organs of the UN: the Security Council, the General Assembly, structure and functions", re:S(/security council|general assembly|secretary-general|structure and functions/), ex:S(/international court|national security council/)},
 {s:"II-A9", p:2, t:"The International Court of Justice: composition, jurisdiction, inter-State disputes", re:S(/international court of justice|\bicj\b/)},
 {s:"II-A9", p:2, t:"UN peace and security: peacekeeping, the Charter, Resolution 1325, UN funding", re:S(/peace-?keeping|un charter|resolution 1325|un funding|funding/)},
 {s:"II-A9", p:2, t:"UN specialised agencies and conventions: WHO, UNCLOS, UNFCCC", re:S(/world health organization|unclos|unfccc|framework convention|specialised agencies/)},
 // ---- II-A10 Regionalisation of world politics
 {s:"II-A10", p:2, t:"The European Union: success, challenges, Brexit", re:S(/european union|\beu\b|brexit/)},
 {s:"II-A10", p:2, t:"ASEAN, APEC and Asian regionalism: ASEAN Plus Three", re:S(/asean|apec|asia plus three/)},
 {s:"II-A10", p:2, fb:true, t:"Regionalism and regional integration in world politics", re:S(/regionalism|regional organi[sz]ation|regional integration/)},
 {s:"II-A10", p:2, t:"NAFTA, USMCA and regionalism in the Americas", re:S(/nafta|usmca|latin america|united states-mexico/)},
 // ---- II-A11 Contemporary global concerns
 {s:"II-A11", p:2, t:"Democracy: democratic backsliding and backlash, democracy promotion, the modernisation thesis", re:S(/democracy promotion|democratic backsliding|modernization thesis|affluence breeds|democrati[sz]ation/)},
 {s:"II-A11", p:2, t:"Human rights: Asian values, human rights frameworks, personal data protection", re:S(/human rights|asian values|personal data/)},
 {s:"II-A11", p:2, t:"Environment and sustainable development: climate change, COP, the SDGs, the North-South divide, environmental degradation", re:S(/environment|climate|cop-26|unfccc|sustainable development|north-south/)},
 {s:"II-A11", p:2, t:"Gender justice: women's security, women's movements and rights", re:S(/women|gender|feminist|lipstick|1325/)},
 {s:"II-A11", p:2, t:"Terrorism and international conventions", re:S(/terroris/)},
 {s:"II-A11", p:2, t:"Nuclear proliferation, disarmament and the NPT", re:S(/nuclear|\bnpt\b|disarmament|denuclear|proliferation|no first use|\bnfu\b/)},
 {s:"II-A11", p:2, t:"Global health and the WHO", re:S(/world health|health agenda|\bwho\b/)},
 // ================= PAPER II, SECTION B: India and the World =================
 // ---- II-B1 Indian foreign policy
 {s:"II-B1", p:2, t:"Determinants of foreign policy and its institutions: the National Security Council, parliamentary diplomacy, States in policy-making", re:S(/determinant|national security council|parliamentary diplomacy|constituent states|policy-making|policy making/)},
 {s:"II-B1", p:2, t:"Continuity and change: phases, philosophical foundations, strategic culture, Nehruvianism and neoliberalism, strategic autonomy, hyper-realism", re:S(/phases|philosophical foundations|strategic culture|continuity and change|neoliberal outlook|nehruvianism|qualitative shifts|turnaround|trajectory|peaceful co-existence|hyper-realist|energetic diplomacy|strategic autonomy|major features of india's foreign policy|foreign policy has been in a transition/)},
 {s:"II-B1", p:2, t:"Soft power and public diplomacy: ICCR, the diaspora, capacity building (ITEC, RIS), coalitional diplomacy", re:S(/soft power|iccr|public diplomacy|diaspora|coalitional diplomacy|capacity building|\bitec\b|\bris\b|research and information system/), ex:S(/joseph nye/)},
 // ---- II-B2 India's contribution to the Non-Alignment Movement
 {s:"II-B2", p:2, t:"India and non-alignment: phases, Non-alignment 2.0, multi-alignment, strategic autonomy", re:S(/non-?alignment|nonalignment|non-aligned|multi-?alignment/)},
 // ---- II-B3 India and South Asia
 {s:"II-B3", p:2, t:"SAARC and regional co-operation: past performance, future prospects, BIMSTEC, regionness", re:S(/saarc|south asian association|bimstec|regional co-?operation|regionness|south asia/)},
 {s:"II-B3", p:2, t:"South Asia as a Free Trade Area: economic co-operation and trade", re:S(/free trade|economic co-?operation among the member states|trade in the saarc/)},
 {s:"II-B3", p:2, t:"India's Look East and Act East Policy; the North-East", re:S(/look.east|act east/)},
 {s:"II-B3", p:2, t:"River water disputes: Brahmaputra, hydro-politics with Bangladesh", re:S(/\brivers?\b|water sharing|hydropolitics|hydro-co-operation|brahmaputra/)},
 {s:"II-B3", p:2, t:"Illegal cross-border migration and refugees: Rohingya, Bangladesh, Myanmar", re:S(/migration|refugee|rohingya/)},
 {s:"II-B3", p:2, t:"Ethnic conflicts and insurgencies in the neighbourhood and the North-East", re:S(/ethnic|insurgenc|free movement regime/)},
 {s:"II-B3", p:2, t:"Border disputes and cross-border terrorism: LAC, land boundary, Kachchatheevu", re:S(/border|boundary|\blac\b|line of actual control|kachchatheevu|terroris/)},
 {s:"II-B3", p:2, t:"Relations with neighbours: Pakistan, Bangladesh, Nepal, Sri Lanka, Bhutan, Maldives, Myanmar, Afghanistan", re:S(/bangladesh|nepal|sri ?lanka|bhutan|maldives|myanmar|pakistan|afghanistan/)},
 // ---- II-B4 India and the Global South
 {s:"II-B4", p:2, t:"India and Africa: guiding principles, capacity building, drivers of India's interest", re:S(/africa/)},
 {s:"II-B4", p:2, t:"India and Latin America: IBSA and India-Brazil", re:S(/ibsa|brazil/)},
 {s:"II-B4", p:2, t:"Leadership of the Global South: NIEO, WTO negotiations, South-South co-operation", re:S(/global south|south-south|nieo|new international economic order|\bwto\b|coalitional diplomacy/)},
 // ---- II-B5 India and the global centres of power
 {s:"II-B5", p:2, t:"India and the USA: the strategic partnership, QUAD, BECA, the diaspora, US-Iran standoff", re:S(/^(?=.*(\bindia|\bindo-))(?=.*(\busa\b|\bus\b|united states|indo-us|quad\b|beca\b))/)},
 {s:"II-B5", p:2, t:"India and the European Union: Brexit, tariffs, the free trade agreement", re:S(/^(?=.*(\bindia|\bindo-))(?=.*(european union|\beu\b|indo-eu|brexit))/)},
 {s:"II-B5", p:2, t:"India and Japan: strategic and global partnership, ACSA", re:S(/japan/)},
 {s:"II-B5", p:2, t:"India and China: OBOR, the LAC, trade and environment, the South China Sea, the Asian century", re:S(/^(?=.*(\bindia|\bindo-))(?=.*(china|chinese|sino|obor|one belt|brahmaputra|\blac\b|line of actual control|south china sea|asian century))/)},
 {s:"II-B5", p:2, t:"India and Russia: arms trade, strategic autonomy, the Ukraine war", re:S(/^(?=.*(\bindia|\bindo-))(?=.*russia)/)},
 {s:"II-B5", p:2, t:"The Indo-Pacific and maritime security", re:S(/indo-pacific|asia-pacific|maritime security|quad\b/)},
 // ---- II-B6 India and the UN system
 {s:"II-B6", p:2, t:"India and UN peacekeeping", re:S(/^(?=.*(\bindia|\bindo-))(?=.*peace-?keep)/)},
 {s:"II-B6", p:2, t:"India's claim to a permanent seat in the Security Council", re:S(/^(?=.*(\bindia|\bindo-))(?=.*(permanent (seat|member)|semi-permanent|veto|security council))(?!.*national security council)/)},
 // ---- II-B7 India and the nuclear question
 {s:"II-B7", p:2, t:"India's nuclear policy: NPT refusal, No First Use, the 1998 tests, nuclear deterrence, the global nuclear order", re:S(/^(?=.*(\bindia|\bindo-))(?=.*(nuclear|\bnpt\b|no first use|\bnfu\b|deterrence))/)},
 // ---- II-B8 Recent developments in Indian foreign policy
 {s:"II-B8", p:2, t:"India and Afghanistan: capacity building, the Taliban takeover", re:S(/afghanistan|taliban/)},
 {s:"II-B8", p:2, t:"West Asia: Israel and Palestine, Iran, the West Asia Quad, Look West, energy security", re:S(/west asia|israel|palestin|iran|gulf|saudi|look west|hamas/)},
 {s:"II-B8", p:2, t:"India's vision of a new world order and its role in shaping it", re:S(/^(?=.*(\bindia|\bindo-))(?=.*(vision of a new world order|vision of new world order|world order|global south))/)},
 {s:"II-B8", p:2, t:"Recent crises and shocks: the Ukraine war, US tariffs, terrorist attacks", re:S(/^(?=.*(\bindia|\bindo-))(?=.*(ukraine|pahalgam|reciprocal tariffs|tariff threats|mediation on kashmir))/)},
 // ---- fallback topics (used only for a question no other topic claims)
];
module.exports = LIST;
