// Agriculture optional: syllabus sub-topics in syllabus order, with the words that tie a past question to each.
//   s  : the official item (I-1 ... II-8) the sub-topic is filed under (see items.js)
//   re : regular expression tested against the question text (case-insensitive)
//   ex : a question that also matches this is NOT filed under the topic
//   p  : 1 or 2 limits the topic to that paper (omit = both)
// A question can belong to several topics (UPSC often joins two ideas in one question).
// Re-run with:  node upsc-pyq-bank/tools/optional/agriculture/build-agriculture.js
module.exports = [
 // ================= PAPER I =================
 // I-1 Ecology, environment, climate change
 {s:"I-1", t:"Ecology and its relevance to man; natural resources, their sustainable management and conservation", re:"ecolog(y|ical) (principles|concept|adaptation)|\\becology\\b|natural resources?|ecosystems?|xerophyte|theory of tolerance|plant distribution and adaptation|soil animals"},
 {s:"I-1", t:"Physical and social environment as factors of crop distribution and production", re:"physical environmental factors|environmental factors affecting|rising temperature and carbon dioxide|elements of weather|weather affecting crop|changing rainfall pattern|length of growing season|choice of crops and cropping systems|agro-?climatic"},
 {s:"I-1", t:"Agro-ecology; cropping pattern as indicators of environments", re:"agro-?ecolog|agroecological|cropping pattern"},
 {s:"I-1", t:"Environmental pollution and associated hazards to crops, animals and humans", re:"pollut|effluent|ozone|environmental problems|environmental hazards|phytostabili|phytoremediation|bioremediation"},
 {s:"I-1", t:"Climate change: international conventions and global initiatives", re:"climate change|el[ -]nino|nicra|international conventions|global initiatives|climate-resilient|ozone layer|changing climatic|climate"},
 {s:"I-1", t:"Greenhouse effect and global warming", re:"green ?house (effect|gas)|global warming|\\bGHG\\b|carbon[- ]sequestration|c-sequestration|carbon dioxide"},
 {s:"I-1", t:"Advanced tools for ecosystem analysis: remote sensing (RS) and GIS", re:"remote sensing|\\bGIS\\b|geographic information system|proximal"},
 // I-2 Cropping patterns, farming systems, crop production
 {s:"I-2", t:"Cropping patterns in different agro-climatic zones of the country", re:"cropping patterns?|agro-?climatic zones?|agricultural regions of india|region-specific cropping|middle gangetic|western plateau|cereal- and millet-based cropping systems"},
 {s:"I-2", t:"Impact of high-yielding and short-duration varieties on shifts in cropping patterns", re:"high[- ]yielding|short duration and long duration|short duration varieties|crop diversification|diversification|hybrids/high|green revolution|speciality corn"},
 {s:"I-2", t:"Concepts of various cropping and farming systems", re:"cropping systems?|farming systems?|mixed farming|multiple cropping|crop rotation|integrated farming|\\bIFS\\b|diversified system of farming|intensive agriculture|tillage|conservation agriculture|types of farming|catch crop|decoy crop|trap crop|crop residue"},
 {s:"I-2", t:"Organic and precision farming", re:"organic farming|natural farming|precision (farming|agriculture)|biodynamic|cow-pat|smart agricultural|conservation agriculture and precision|sustainability and profitability"},
 {s:"I-2", t:"Package of practices: cereals (rice, wheat, maize, millets)", re:"\\b(rice|wheat|maize|corn|paddy|sorghum|bajra|barley|ragi)\\b|\\bmillets?\\b|cereal|\\bSRI\\b|\\bDSR\\b|direct seeded|transplanted rice|quality protein maize|parali", p:1},
 {s:"I-2", t:"Package of practices: pulses and oilseeds", re:"pulses?|pigeon ?pea|chickpea|black gram|green gram|moong|soybean|groundnut|oilseeds?|sesame|mustard|castor|sunflower|safflower|linseed", ex:"food grain|foodgrain|food-grain", p:1},
 {s:"I-2", t:"Package of practices: fibres, sugar, commercial and fodder crops", re:"cotton|sugarcane|ratoon|\\bjute\\b|forage|fodder|tobacco|rubber|commercial crops?|agrostology|forage conservation", p:1},
 // I-3 Forestry
 {s:"I-3", t:"Types and scope of forestry plantations: social forestry, agro-forestry, natural forests", re:"forestry|agro-?forestry|agrisilvi|agrostology|plantations?|natural forests|afforestation|forest (policies|policy)|functions of indian forests|tree species|forests", ex:"horticulture|orchard|plantation crops|tea plantation|blight|terms remote sensing"},
 {s:"I-3", t:"Propagation of forest plants", re:"propagation (methods )?(adopted )?(for|in) forest plants|methods for propagation of forest|vegetative propagation methods adopted in forest|propagation of forest", p:1},
 {s:"I-3", t:"Forest products; agro-forestry and value addition", re:"forest products|non-wood forest|value[- ]added products from forest|value addition of forest|farmers.? incomes", p:1},
 {s:"I-3", t:"Conservation of forest flora and fauna", re:"forest flora|flora and fauna|conservation of natural resources|conservation of forest", p:1},
 // I-4 Weeds
 {s:"I-4", t:"Weeds: characteristics, dissemination and association with crops; their multiplication", re:"dissemination of weeds|parasitic weeds?|parthenium|orobanche|weed seed bank|crop-weed|weed index|weed (control )?efficiency|\\bWCE\\b|herbicide resistance|weeds? of rice|weeds"},
 {s:"I-4", t:"Cultural, biological and chemical control of weeds", re:"(cultural|biological|chemical|integrated|bio-?control).{0,40}weed|weed (control|management)|herbicides?|bio-?herbicides?|bioagent|selectivity|weed seeds|quarantine check of weed"},
 // I-5 Soil
 {s:"I-5", t:"Soil physical, chemical and biological properties", re:"soil consistency|soil plasticity|soil structure|soil organic matter|organic matter|soil health|soil fertility and soil productivity|puddled soil|soil properties|soil animals|soil acidity|soil mapping|benefits are derived from organic matter|moisture constraints|moisture constants|water absorption and retention|retention capacity"},
 {s:"I-5", t:"Processes and factors of soil formation; soils of India", re:"soil formation|soils of india|major soils|genesis of soil", p:1},
 {s:"I-5", t:"Mineral and organic constituents of soils and their role in soil productivity", re:"organic matter|mineral and organic|humus|soil productivity|soil structure|mulches"},
 {s:"I-5", t:"Essential plant nutrients and other beneficial elements in soils and plants", re:"essential(ity)? (of )?(plant )?nutrients?|essential plant|secondary nutrients|micronutrients?|deficiency symptoms|arnon|beneficial|functions and deficiency|macro- and micro|nutrient element|biofortification|plant nutrients", p:1},
 {s:"I-5", t:"Soil fertility, soil testing and fertiliser recommendations; integrated nutrient management; biofertilizers", re:"soil fertility|soil testing|fertili[sz]er|integrated nutrient|\\bINM\\b|bio-?fertili[sz]er|nutrient management|leaf colou?r chart|\\bSSNM\\b|site-specific nutrient|soil health card|manures?|fertili[sz]ers? use efficiency|soil productivity", p:1},
 {s:"I-5", t:"Nitrogen losses, nitrogen-use efficiency in submerged rice soils, nitrogen fixation", re:"nitrification|nitrogen (use efficiency|losses|transformation|fixation)|gaseous nitrogen|submerged|slow release nitrogen|nitrogen use efficiency|N use efficiency|puddled|nitrogen fixation"},
 {s:"I-5", t:"Efficient phosphorus and potassium use", re:"phosphorus|potassium|phosphorus-use|phosphate", p:1},
 {s:"I-5", t:"Problem soils and their reclamation", re:"saline|sodic|alkali|reclamation|problem(atic)? soils?|salinity|soil acidity|lime requirement|leaching requirement|waterlogging and its effects", p:1},
 {s:"I-5", t:"Soil factors affecting greenhouse gas emission", re:"green ?house gas|\\bGHG\\b|tillage.*(emission|greenhouse)|methane|carbon[- ]sequestration|c-sequestration", p:1},
 // I-6 Soil conservation, watershed, dryland
 {s:"I-6", t:"Soil conservation and integrated watershed management", re:"soil conservation|watershed|bunding|contour|conserving soil|in situ moisture|moisture conservation|mulch"},
 {s:"I-6", t:"Soil erosion and its management", re:"soil erosion|erosion|saltation"},
 {s:"I-6", t:"Dryland agriculture and its problems", re:"dry ?land|rain ?-?fed|arid|drought|contingen|bundelkhand|deccan plateau"},
 {s:"I-6", t:"Technology for stabilising agricultural production in rainfed areas", re:"rain ?-?fed|stabili[sz]ing|dryland|dry land|contingent crop|contingency planning|sustained crop production"},
 // I-7 Water
 {s:"I-7", t:"Water-use efficiency in relation to crop production", re:"water[- ]use efficiency|\\bWUE\\b|water productivity|crop per drop|irrigation efficienc"},
 {s:"I-7", t:"Criteria for scheduling irrigations", re:"scheduling|irrigation schedul|IW/CPE|depletion of available soil moisture|critical stage|aims of irrigation|irrigations? to groundnut|pump", p:1},
 {s:"I-7", t:"Ways and means of reducing run-off losses of irrigation water", re:"run-?off|water losses|losses of irrigation|efficiencies which are used", p:1},
 {s:"I-7", t:"Rainwater harvesting", re:"rain[- ]?water harvesting|water harvesting|recharge of ground water", p:1},
 {s:"I-7", t:"Drip and sprinkler irrigation; micro-irrigation and fertigation", re:"\\bdrip\\b|sprinkler|micro-?irrigation|fertigation|pressuri[sz]ed irrigation|herbigation", p:1},
 {s:"I-7", t:"Drainage of water-logged soils", re:"drainage|waterlogg|water-logged|bio-?drainage", p:1},
 {s:"I-7", t:"Quality of irrigation water; effect of industrial effluents on soil and water pollution", re:"quality of irrigation water|poor quality water|industrial effluents?|conjunctive use|irrigation water|soil and water pollut|boron", p:1},
 {s:"I-7", t:"Irrigation projects in India", re:"irrigation projects|irrigated area|command area|irrigation potential|sources of irrigation|extension, renovation", p:1},
 // I-8 Farm management, marketing
 {s:"I-8", t:"Farm management: scope, importance, characteristics and farm planning", re:"farm (management|planning|plan|profits)|farm management problems|good farm plan|farm management tools", p:1},
 {s:"I-8", t:"Optimum resource use and budgeting", re:"budget|resource use|farm budgeting|credit card|agricultural credit|kisan credit"},
 {s:"I-8", t:"Economics of different types of farming systems", re:"types of farming|economics of|farming systems|contract farming|farm service act|price assurance|rice-wheat crop rotation|farm profits", p:1},
 {s:"I-8", t:"Marketing management strategies, market intelligence, price fluctuations and their cost", re:"market(ing)?|market intelligence|price (instability|fluctuation)|e-?NAM|AGMARK|farmers.? markets?|commodity|glut|directorate of marketing|farm service act|price assurance"},
 {s:"I-8", t:"Role of co-operatives in the agricultural economy", re:"co-?operative|\\bFPOs?\\b|farmers.? producers?.? organi[sz]ations?", p:1},
 {s:"I-8", t:"Agricultural price policy", re:"price policy|minimum support price|\\bMSP\\b|price instability|price assurance"},
 {s:"I-8", t:"Crop insurance", re:"crop insurance|\\bPMFBY\\b|fasal bima|insurance", p:1},
 // I-9 Extension
 {s:"I-9", t:"Agricultural extension: importance, role and methods of evaluation of extension programmes", re:"extension (education|programmes?|services|system|personnel)|evaluation of extension|agricultural extension|approaches of extension|transfer of technolog|front ?line demonstration|\\bFLD\\b|method demonstration|participatory rural|\\bPRA\\b|\\bICTs?\\b|information and communication|new tools and methods|broad[- ]based extension|\\bATMA\\b|technology (dissemination|assessed)|Leagans|Bennett|monitoring and evaluation|farmer first|communication technologies", p:1},
 {s:"I-9", t:"Socio-economic survey and status of big, small and marginal farmers and landless agricultural labourers", re:"small and marginal farmers|landless|socio-economic|doubling the farmers|farm women|marginal farmers|target groups", p:1},
 {s:"I-9", t:"Training programmes for extension workers", re:"training (methods|programmes?)|extension workers|mechanism for imparting training|institutional arrangements", p:1},
 {s:"I-9", t:"Role of Krishi Vigyan Kendras (KVK) in dissemination of agricultural technologies", re:"krishi vigyan|\\bKVKs?\\b", p:1},
 {s:"I-9", t:"NGO and self-help group approach for rural development", re:"\\bNGOs?\\b|non-?government|self[- ]?help groups?|\\bSHGs?\\b|rural development|rural livelihood", p:1},
 // ================= PAPER II =================
 // II-1 Cell, genetics
 {s:"II-1", t:"Cell structure, function and cell cycle", re:"\\bcell (structure|cycle|wall|membrane)|what is cell|define cell|protoplasm|mitochondria|chloroplast|endoplasmic|golgi|organelles|ultrastructure|cell structure", p:2},
 {s:"II-1", t:"Synthesis, structure and function of genetic material; laws of heredity", re:"genetic material|\\bDNA\\b|\\bRNA\\b|protein synthesis|laws? of (heredity|inheritance|independent assortment|segregation)|mendel|theories of inheritance|law of segregation", p:2},
 {s:"II-1", t:"Chromosome structure, chromosomal aberrations, linkage and crossing-over", re:"chromosom|aberration|linkage|cross-?over|inversion", p:2},
 {s:"II-1", t:"Polyploidy, euploids and aneuploids", re:"polyploid|euploid|aneuploid|allopolyploid|autopolyploid", p:2},
 {s:"II-1", t:"Mutation and its role in crop improvement", re:"mutation|mutagen|mutagenesis", p:2},
 {s:"II-1", t:"Heritability, sterility and incompatibility", re:"heritability|sterility|incompatib|\\bCMS\\b|male sterile|quantitative traits", p:2},
 {s:"II-1", t:"Cytoplasmic inheritance; sex-linked, sex-influenced and sex-limited characters", re:"cytoplasmic inheritance|sex-?linked|sex-?linkage|sex-influenced|sex-limited|autosome|theories of inheritance", p:2},
 // II-2 Plant breeding
 {s:"II-2", t:"History of plant breeding", re:"history of plant breeding", p:2},
 {s:"II-2", t:"Modes of reproduction; selfing and crossing techniques", re:"modes? of reproduction|self-pollinat|cross-pollinat|selfing|crossing techniques|pollinat", p:2},
 {s:"II-2", t:"Origin, evolution and domestication of crop plants; centres of origin; law of homologous series; crop genetic resources", re:"origin and domestication|centre of origin|center of origin|law of homologous|genetic resources?|vavilov|gene pool|genetic erosion|germplasm|gene banks?|plant genetic", p:2},
 {s:"II-2", t:"Application of principles of plant breeding; improvement of crop plants", re:"principles of plant breeding|methods of plant breeding|back ?cross|bulk method|inbred lines|synthetic variet|distant hybridi|embryo rescue|inbreeding depression|haploid|somaclonal|varietal improvement|breeding", p:2},
 {s:"II-2", t:"Molecular markers and their application in plant improvement", re:"molecular markers?|marker-assisted|\\bMAS\\b|\\bQTL\\b|gene pyramiding|DNA finger", p:2},
 {s:"II-2", t:"Pure-line, pedigree, mass and recurrent selection; combining ability", re:"pure ?-?line|pedigree|mass selection|recurrent selection|combining ability|clonal selection|\\bclone\\b|diallel|bulk method", p:2},
 {s:"II-2", t:"Heterosis and its exploitation", re:"heteros|hybrid vigou?r|exploited in the development of hybrids|hybrid seed production|dominance and overdominance", p:2},
 {s:"II-2", t:"Somatic hybridization", re:"somatic hybridi[sz]ation", p:2},
 {s:"II-2", t:"Breeding for disease and pest resistance; interspecific and intergeneric hybridization", re:"resistance|inter-?specific|intergeneric|breeding for", p:2, ex:"pesticide resistance"},
 {s:"II-2", t:"Genetic engineering and biotechnology; genetically modified crop plants", re:"genetic engineering|biotechnology|transgenic|\\bGM\\b|genetically modified|gene cloning|tissue culture", p:2},
 // II-3 Seed
 {s:"II-3", t:"Seed production and processing technologies", re:"seed production|hybrid seed|seed processing|seed (tubers|industry)|seed enhancement|seed treatment|certified seed|breeder seed|\\bTPS\\b|true potato seed|types of seeds|seed quality|seed supply", p:2},
 {s:"II-3", t:"Seed certification, seed testing and storage", re:"seed (certification|testing|storage|viability|vigou?r|bank)|grow-out|field and seed standards|genetic purity|longevity of seeds|seed certification agenc|warehouses|seeds? under (prolonged )?storage|storage of seeds?", p:2},
 {s:"II-3", t:"DNA fingerprinting and seed registration", re:"DNA finger|seed registration|protection of plant varieties|\\bPPV\\b|\\bFRA\\b|plant variety protection|identification of the cultivars", p:2},
 {s:"II-3", t:"Role of public and private sectors in seed production and marketing", re:"public and private|national seeds corporation|seed supply systems|seed certification agenc|seed industry|marketing of seeds|indian seeds act|seed production programme", p:2},
 {s:"II-3", t:"IPR issues, WTO issues and their impact on agriculture", re:"intellectual property|\\bIPRs?\\b|patent|breeders.? rights|\\bWTO\\b|TRIPS|sui generis|traditional knowledge|plant variety protection", p:2},
 // II-4 Plant nutrition, water relations
 {s:"II-4", t:"Plant nutrition: absorption, translocation and metabolism of nutrients", re:"nutrient absorption|absorption of (salts|nutrients|water)|translocation|assimilation|nitrate assimilation|nitrate reductase|ion uptake|mineral nutrients|plant nutrition|phloem|water transport in xylem|plant mineral|essential and beneficial|absorb nitrogen|nutrients by plants|criteria of essentiality|essentiality|nutrient deficiency|zinc|sulphur|boron|phosphorus and calcium", p:2, ex:"humans|human beings|women and children|malnutrition|protein energy"},
 {s:"II-4", t:"Soil-water-plant relationship", re:"soil-water-plant|\\bSPAC\\b|water absorption|transpiration|guttation|evapotranspiration|wilting|water potential|matric potential|soil water|stomat|passive absorption|soil moisture|osmotic|water transport|absorbed by land plants|stomate|water present in soil", p:2},
 // II-5 Plant physiology
 {s:"II-5", t:"Enzymes and plant pigments", re:"enzym|chlorophyll|carotenoid|pigments?|phytochrome", p:2},
 {s:"II-5", t:"Photosynthesis: modern concepts and factors affecting the process; C3, C4 and CAM", re:"photosynthe|photophosphorylation|calvin|hatch|\\bC3\\b|\\bC4\\b|\\bCAM\\b|hill reaction|photorespiration|chlorophyll synthesis", p:2},
 {s:"II-5", t:"Aerobic and anaerobic respiration", re:"respiration|oxidative decarboxylation|glycolysis|krebs", p:2},
 {s:"II-5", t:"Carbohydrate, protein and fat metabolism", re:"carbohydrate|sucrose metabolism|fat metabolism|protein (metabolism|synthesis)|amino acid|metabolism", p:2},
 {s:"II-5", t:"Growth and development; photoperiodism and vernalization", re:"photoperiod|vernalization|growth (curve|analysis|measurement)|growth and development|sigmoid|phytochrome|plant growth and development", p:2},
 {s:"II-5", t:"Plant growth substances and their role in crop production", re:"plant growth (substances|regulators)|auxins?|growth regulators|phytohormones?|hormones?|gibberell|cytokinin|ethylene|\\bPGR", p:2},
 {s:"II-5", t:"Physiology of seed development and germination; dormancy", re:"seed (dormancy|germination|development)|dormant|hard seeds|germination", p:2},
 {s:"II-5", t:"Stress physiology: drought, salt and water stress", re:"stress|drought|salinity|osmoprotectant|abiotic|wilting", p:2},
 // II-6 Horticulture
 {s:"II-6", t:"Major fruits, plantation crops, vegetables, spices and flower crops; package of practices", re:"mango|citrus|banana|grapes?|potato|tomato|onion|\\bpeas\\b|marigold|\\baster\\b|carnation|gladiol|chrysanthemum|guava|pomegranate|black pepper|mentha|coriander|cumin|spices?|fruit (crops|plants)|vegetable|brinjal|cauliflower|cabbage|broccoli|plantation crops|cut flower|orcharding|propagation methods for fruit|graft|layering|pruning|rootstock|bahar|fruits? and vegetables|flowers?|horticultur|tubers|cole crops", p:2, ex:"dietary|malnutrition|nutritional security|human nutrition|deficienc"},
 {s:"II-6", t:"Protected cultivation and high-tech horticulture", re:"protected (cultivation|agriculture)|protective cultivation|green-?house|polyhouse|high[- ]tech|high density|terrace garden|moon garden|low tunnel|plastic"},
 {s:"II-6", t:"Post-harvest technology and value addition of fruits and vegetables", re:"post[- ]?harvest|value addition|value-added|jelly|processing of fruits|maturity indices|shelf-life|keeping quality|fruit processing", p:2},
 {s:"II-6", t:"Landscaping and commercial floriculture", re:"landscap|floriculture|roof-gardening|topiary|garden|cut flower|carnation|marigold|chrysanthemum|gladiol|\\baster\\b|keeping quality of cut", p:2},
 {s:"II-6", t:"Medicinal and aromatic plants", re:"medicinal|aromatic|mentha", p:2},
 {s:"II-6", t:"Role of fruits and vegetables in human nutrition", re:"role of fruits and vegetables|nutritional (value|security)|human nutrition|vegetable cultivation", p:2},
 // II-7 Pests and diseases
 {s:"II-7", t:"Diagnosis of pests and diseases of field crops, vegetables, orchard and plantation crops; economic importance", re:"diagnos|symptoms|diseases? of|blight|\\bwilt\\b|mosaic|leaf curl|tungro|malformation|sigatoka|\\bblast\\b|mycoplasm|bacterial diseases|physiological disorders|citrus decline|insect and mite pests|pests of|diseases in", p:2},
 {s:"II-7", t:"Classification of pests and diseases and their management", re:"classif(y|ication of) (pests|pesticides)|pest (and disease )?management|disease management|management of|control (measures|of pests)|methods of pest control|pesticides according to target|vertical and horizontal|disease resistance|spread of exotic pests", p:2},
 {s:"II-7", t:"Integrated pest and disease management", re:"integrated pest|\\bIPM\\b|\\bIDM\\b|integrated disease|economic (injury|threshold)|\\bETL\\b|\\bEIL\\b", p:2},
 {s:"II-7", t:"Storage pests and their management", re:"storage pests|stored grain pests|infestation of pests during storage|red flour beetle|angoumois|pests during storage|pest infestation during storage", p:2},
 {s:"II-7", t:"Biological control of pests and diseases", re:"biological control|natural enemies|bio-?control|predator|parasites?|inoculative and augmentative", p:2},
 {s:"II-7", t:"Epidemiology and forecasting of major crop pests and diseases", re:"epidemic|epidemiology|forecasting", p:2},
 {s:"II-7", t:"Plant quarantine measures", re:"quarantine", p:2},
 {s:"II-7", t:"Pesticides: formulations and modes of action", re:"pesticid|formulations?|fungicides?|organophosphate|bacillus thuringiensis|mode of action|insecticide|ionizing radiations", p:2},
 // II-8 Food
 {s:"II-8", t:"Food production and consumption trends in India", re:"food production|consumption (trends|pattern)|trends of food productivity|food grain production|production and consumption", p:2},
 {s:"II-8", t:"Food security and growing population; reasons for grain surplus", re:"food security|grain surplus|food inflation|population on food|food insecurity|food and nutrition(al)? security|food demand and supply|national food policy", p:2},
 {s:"II-8", t:"National and international food policies; production, procurement and distribution constraints", re:"food polic|procurement|distribution policies|schemes for providing food|programmes run by state and central|constraints of food production|constraints in procurement|food grains to underprivileged", p:2},
 {s:"II-8", t:"Public distribution system, Targeted PDS and trends in poverty", re:"public distribution|\\bPDS\\b|\\bTPDS\\b|poverty|national food security act|technology is improving the efficiency", p:2},
 {s:"II-8", t:"Food processing constraints; national dietary guidelines and food consumption pattern", re:"food processing|processing industry|dietary guidelines|food consumption pattern|food grain processing|balanced diet", p:2},
 {s:"II-8", t:"Food-based dietary approaches; nutrient deficiency, protein energy malnutrition and micronutrient deficiency; women and children", re:"nutrient deficiency|malnutrition|micro-?nutrients?|protein[- ]energy|\\bPEM\\b|dietary approaches|hidden hunger|hunger|women and children|\\bICDS\\b|child development|nutri-?cereals|nutrition challenges|vitamins|classify foods|under-?nutrition|food-based", p:2}
];
