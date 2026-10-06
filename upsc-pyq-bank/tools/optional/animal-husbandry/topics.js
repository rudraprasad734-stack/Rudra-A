// Animal Husbandry and Veterinary Science optional: syllabus sub-topics in syllabus order, with the words that tie a past question to each.
//   s  : the official item (I-1.1 ... II-5.5) the sub-topic is filed under (see items.js)
//   re : regular expression tested against the question text (case-insensitive)
//   ex : a question that also matches this is NOT filed under the topic
//   p  : 1 or 2 limits the topic to that paper (omit = both)
// A question can belong to several topics (UPSC often joins two ideas in one question).
// Re-run with:  node upsc-pyq-bank/tools/optional/animal-husbandry/build-ahvs.js
module.exports = [
 // ================= PAPER I =================
 // I-1.1 Energy
 {s:"I-1.1", p:1, t:"Partitioning of food energy, calorimetry, carbon-nitrogen balance and comparative slaughter", re:"basal metabolism|fasting metabolism|calorimetr|partition(ing)? of (the )?(food|feed) energy|energy retention|carbon.?nitrogen|comparative slaughter|schematic representation of partitioning"},
 {s:"I-1.1", p:1, t:"Systems for expressing the energy value of feeds (TDN, starch equivalent, ME, NE, DE)", re:"energy value|starch equivalent|net energy|metaboli[sz]able energy|digestible energy|total digestible nutrients|\\btdn\\b|metabolic energy|respiratory quotient"},
 {s:"I-1.1", p:1, t:"Energy requirements for maintenance, growth, lactation, egg, wool and meat production", re:"energy requirements?|requirements? (of energy|for maintenance in adult)|maintenance in adult animals"},
 // I-1.2 Protein
 {s:"I-1.2", p:1, t:"Protein quality evaluation (PER, NPU, biological value, EAAI, amino acids)", re:"protein efficiency|net protein|protein value|biological value|essential amino acid|eaai|protein quality|true protein|crude protein|amino acids?|digestible crude protein|faecal nitrogen|urinary nitrogen"},
 {s:"I-1.2", p:1, t:"Non-protein nitrogen (urea) in ruminant diets", re:"non.?protein nitrogen|\\bnpn\\b|urea utili[sz]ation"},
 {s:"I-1.2", p:1, t:"Protein requirements and energy-protein interrelationships", re:"protein requirements?|protein.?energy|energy.?protein|calorie : protein|protein in(take)?"},
 // I-1.3 Minerals and vitamins
 {s:"I-1.3", p:1, t:"Minerals: sources, functions, deficiency and interactions", re:"staggers|minerals?\\b|calcium|phosphorus|copper|molybden|iodine|metalloenzyme|hyperparathyroid|mucosal block|swollen hock|trace elements?|\\biron\\b"},
 {s:"I-1.3", p:1, t:"Fat-soluble and water-soluble vitamins", re:"curled.?toe|polyneuritis|vitamins?\\b|coenzymes?|prosthetic group|phytobiotics|xenobiotics?"},
 // I-1.4 Feed additives
 {s:"I-1.4", p:1, t:"Growth promoters, antibiotics and hormones in feed: use and abuse", re:"growth.?promot|antibiotics? as feed|use and abuse|feed additives?"},
 {s:"I-1.4", p:1, t:"Probiotics, prebiotics, ionophores, methane inhibitors and other additives", re:"probiotic|prebiotic|ionophore|methane inhibitor|oligosaccharide|emulsifier|mould inhibitor|enzymes? (in|as) feed|antioxidants?"},
 // I-1.5 Feed technology
 {s:"I-1.5", p:1, t:"Conservation of fodder: silage and hay", re:"silage|\\bhay\\b|hay.?making|\\baiv\\b|conservation of fodder"},
 {s:"I-1.5", p:1, t:"Feed processing, storage, anti-nutritional and toxic factors", re:"feed industry|clfma|processing of animal feeds|feed processing|anti.?nutrition|antinutrition|protease inhibitors?|toxic factors|storage of feeds|bulk\\b"},
 {s:"I-1.5", p:1, t:"Feed analysis and digestibility trials (Weende, Van Soest, indicators)", re:"weende|van soest|fib(re|er) analysis|digestibility|indicators? for|feed analysis|proximate"},
 {s:"I-1.5", p:1, t:"Predicting feed intake in grazing animals and voluntary intake", re:"feed intake|voluntary (feed )?intake|grazing"},
 // I-1.6 Ruminant nutrition
 {s:"I-1.6", p:1, t:"Balanced rations and ration computation for dairy animals", re:"balanced ration|compute a ration|ration for a|formulating a ration|formulation of (a )?ration|desirable characteristics of ration|practical and economic rations?|economic and balanced ration|feed ingredients|ration (for|of)|formulating animal rations|concentrates|roughages|cellulose|maintenance ration|production ration"},
 {s:"I-1.6", p:1, t:"Feeding of calves, pregnant and work animals", re:"calves|calf\\b|bullocks?|pregnant cows|young stock|neonatal|flushing|steaming.?up"},
 {s:"I-1.6", p:1, t:"Feeding of breeding bulls", re:"breeding bulls?\\b.*(feed|diet|schedule)|feeding (schedule )?(of|for) breeding bulls|feeding of breeding bulls"},
 {s:"I-1.6", p:1, t:"Feeding of milch animals through the lactation cycle; effect on milk composition", re:"lactation|milk composition|composition of milk|high.?yield|milch|dairy cows?.*(feed|nutri)|feeding of high|guidelines to feed|high yielder"},
 {s:"I-1.6", p:1, t:"Feeding of goats for meat and milk production", re:"goat kids|goats?\\b.*(feed|food|stall|chevon|habit)|feeding (habits )?of goats|stall.?feeding of goats|chevon"},
 {s:"I-1.6", p:1, t:"Feeding of sheep for meat and wool production", re:"feeding of (sheep|lambs)|lambs? (raising|for)|lamb.raising|sheep for (good quality )?wool|mutton production|feeding of lambs"},
 {s:"I-1.6", p:1, t:"Rumen digestion and advances in ruminant nutrition", re:"rumen|ruminants?\\b.*(digest|diet|nutri)|microbial digestion|copper.?molybdenum|nutrient.?parasite|water requirements"},
 // I-1.7 Swine
 {s:"I-1.7", p:1, t:"Swine rations: creep, starter, grower, finisher and low cost rations", re:"creep feed|swine ration|rations? (of|for) pigs|economic ration of pigs|swine feeding|feeding of swine|piglets?.*(feed|ration)|amino acid imbalance in swine|feeding of breeding boars|feeding practices.*(pigs|sows)|adult female pigs|energy value.*swine|requirements in swine"},
 {s:"I-1.7", p:1, t:"Feeding of pigs for lean meat production", re:"lean meat"},
 // I-1.8 Poultry nutrition
 {s:"I-1.8", p:1, t:"Poultry nutrition: nutrient requirements and feed formulation", re:"nutrient requirements? of chicken|poultry feed|ration (for|of) (laying|poultry)|laying hens|broilers? (and|chicks)|feed intake in poultry|poultry\\b.*(nutri|feed|ration)|(calorie|amino acid).*poultry|bis specifications|nutritional characteristics of feed ingredients|feeding of broiler"},
 // I-2.1 and 2.2 blood
 {s:"I-2.1", p:1, t:"Endocrine glands in health and disease; hormones of the pituitary and other glands", re:"endocrine and exocrine|endocrine glands?|pituitary|adrenal|hormones? secreted|gastrointestinal hormon|hormones? (are|is) (secreted|regulated)|secretion of hormones|hormone secretion"},
 {s:"I-2.2", p:1, t:"Blood constituents, plasma proteins and blood cell formation", re:"role of blood|blood.?proteins?|plasma proteins?|constituents of blood|general functions of blood|functions of blood|erythropoi|blood cell|haemoglobin|blood groups?|blood volume|buffer systems"},
 {s:"I-2.2", p:1, t:"Blood coagulation and haemorrhagic disorders", re:"coagulation|clotting|fibrinolysis|haemorrhagic disorders|hemorrhagic disorders|thrombocytopenia|anticoagulants?"},
 {s:"I-2.2", p:1, t:"Biochemical tests and their significance in disease diagnosis", re:"biochemical tests|haematobiochemical|hematobiochemical"},
 // I-2.3 circulation
 {s:"I-2.3", p:1, t:"Physiology of the heart: cardiac cycle, heart sounds, ECG", re:"cardiac|heart sounds?|heart beat|heartbeat|electrocardiogram|diagrammatic representation of heart|reno-?renal"},
 {s:"I-2.3", p:1, t:"Blood pressure, circulation, cerebrospinal fluid and blood-brain barrier", re:"blood pressure|circulatory system|pulmonary circulation|circulation of (blood|cerebro)|cerebrospinal|blood.?brain barrier|process of blood circulation|radiolabel"},
 // I-2.4 respiration
 {s:"I-2.4", p:1, t:"Mechanism and control of respiration; hypoxia; respiration in birds", re:"respiration|hypoxia|chemoreceptors?|exchange (of )?(gases|oxygen)|exchange gases|gas exchange"},
 // I-2.5 excretion
 {s:"I-2.5", p:1, t:"Kidney function, urine formation, acid-base balance and renal regulation", re:"kidney|renal|urine|acid.?base|glomerular|aldosterone|renin|uric acid|nitrogenous waste|excretory"},
 // I-2.6 endocrine
 {s:"I-2.6", p:1, t:"Hormone synthesis, receptors and regulation of secretion", re:"hormonal receptors?|hormone receptors?|signal transduction|third messenger|regulation of hormone|hormone secretion regulated|how is hormone"},
 // I-2.7 growth
 {s:"I-2.7", p:1, t:"Growth: prenatal and postnatal growth, growth curves, tissue growth factors", re:"growth curve|(pre|post).?natal|growth factors|postnatal growth|maturation|measures of growth|pre-natal"},
 // I-2.8 milk, reproduction, digestion
 {s:"I-2.8", p:1, t:"Mammary development, milk secretion and milk ejection", re:"milk ejection|milk secretion|let.?down|udder development|mammary|dairy animals along with diagram"},
 {s:"I-2.8", p:1, t:"Male and female reproductive organs and their functions", re:"male reproductive|reproductive (system|organs)|accessor?y sex glands|seminal vesicle|spermatogenesis and oogenesis|formation and structure of various components of chicken egg|egg formation|hormones secreted by different reproductive"},
 {s:"I-2.8", p:1, t:"Digestive organs and digestion", re:"digestive organs|monogastric|digestion of carbohydrate|digestion of (food|feed)|role of pancreas and liver|digestion in|carbohydrates and proteins are digested"},
 // I-2.9 environmental
 {s:"I-2.9", p:1, t:"Climate, heat stress and adaptation of animals", re:"ambient temperature|heat stress|hot (desert|weather)|adaptation|climatic conditions|climate change|physical environment|global warming|extreme climatic|photoperiod"},
 {s:"I-2.9", p:1, t:"Animal behaviour (reproductive behaviour, ethology)", re:"behaviou?r|ethology|central nervous system|role of nervous system"},
 // I-3 reproduction
 {s:"I-3", p:1, t:"Semen: components, quality and factors affecting production", re:"semen|spermatozoa|spermatogenesis|spermiogenesis|sperm (motility|concentration)|capacitation|sperm\\b"},
 {s:"I-3", p:1, t:"Semen preservation, extenders and deep freezing", re:"preservation|cryopreserv|dilut(o|e)rs?|extenders?|diluents?|deep.?freezing|egg yolk|tris\\b|thawing"},
 {s:"I-3", p:1, t:"Artificial insemination and conception rate", re:"artificial insemination|\\bai\\b|conception|insemination|sires in good condition|breeding males"},
 {s:"I-3", p:1, t:"Detection of oestrus and time of insemination", re:"oestrus|estrus|silent heat|heat detection|\\boestrous"},
 {s:"I-3", p:1, t:"Anoestrus, repeat breeding and reproductive efficiency", re:"infertility|anoestrus|anestrus|repeat breeding|breeding efficiency|reproductive efficiency|embryonic mortality|embryonic development"},
 // I-4.1 dairy
 {s:"I-4.1", p:1, t:"Starting and organising a dairy farm; capital, land and equipment", re:"milk and milk products is constantly|dairy plan|dairy enterprise|dairy farm|commercial dairy|dairy industries|500 kg milk|100 lactating|dairy development|national programme for dairy|ndd?b\\b|dairy farming"},
 {s:"I-4.1", p:1, t:"Herd recording and records on the farm", re:"herd recording|record.?keeping|records to be maintained|farm production records|feeding records"},
 {s:"I-4.1", p:1, t:"Cost of milk production, economics and pricing", re:"cost of milk|economics of milk|economic considerations|production efficiency of dairy|investment, receipts|receipts and expenditure"},
 {s:"I-4.1", p:1, t:"Dairying under mixed farming versus specialised farming", re:"mixed farming|specialized farming|specialised farming"},
 {s:"I-4.1", p:1, t:"Supply of green fodder through the year", re:"green fodder|supply of greens|crop.?rotation|round the year supply"},
 {s:"I-4.1", p:1, t:"Care and management of calves, heifers and pregnant cows", re:"neonatal calf|colostrum|care and management of pregnant|new born calf|calf (care|management)|transport of dairy cattle|heat stress during summer for dairy|reproductive efficiency at your farm|quarantine"},
 // I-4.2
 {s:"I-4.2", p:1, t:"Commercial egg and broiler production; brooding", re:"commercial egg production|brooder|brooding|egg production|chicks|broiler production|management of poultry"},
 {s:"I-4.2", p:1, t:"Rabbit farming", re:"rabbits?\\b"},
 {s:"I-4.2", p:1, t:"Goat and sheep rearing and development programmes", re:"goat rearing|sheep development|upliftment|sheep programmes?|cattle and sheep developmental|madras red"},
 {s:"I-4.2", p:1, t:"Pig management: housing, breeding system, farrowing", re:"pig production|productivity of pig|piglet|farrowing|breeding system used for pig|care and managemental practices.*sow|modern management practices for enhancing productivity of pig"},
 // I-4.3
 {s:"I-4.3", p:1, t:"Feeding and management under drought, flood and other natural calamities", re:"natural calamit|natural disasters?|drought|flood|scarcity|disaster"},
 // I-5.1 genetics
 {s:"I-5.1", p:1, t:"Mendelian inheritance, deviations from Mendelian ratios and gene expression", re:"mendel|independent assortment|segregation|monohybrid|gene expression|gene action|expression of genes|random assortment|linkage|crossing over|polymorphism|genes? express"},
 {s:"I-5.1", p:1, t:"Mitosis, meiosis and cell division", re:"cell division|mitosis|meiosis|somatic and germ cells"},
 {s:"I-5.1", p:1, t:"Sex determination and sex-linked, sex-limited and sex-influenced characters", re:"sex determination|sex.?linked|sex.?limited|sex.?influenced|genic balance"},
 {s:"I-5.1", p:1, t:"Chromosomes, chromosome aberrations and cytogenetics", re:"chromosom|metaphase|karyotyp|cytoplasmic inheritance"},
 {s:"I-5.1", p:1, t:"DNA, genetic code, protein synthesis and gene structure", re:"genetic code|\\bdna\\b|ribosomal rna|\\brna\\b|gene structure|protein synthesis|molecular basis"},
 {s:"I-5.1", p:1, t:"Recombinant DNA technology, transgenesis and molecular markers", re:"recombinant|transgen|molecular marker|dna markers?|dna vaccines?|embryo transfer|biotechnology"},
 {s:"I-5.1", p:1, t:"Mutations", re:"mutation"},
 // I-5.2 population genetics
 {s:"I-5.2", p:1, t:"Quantitative versus qualitative traits; threshold traits", re:"quantitative|qualitative|threshold|traits of economic importance|production and reproductive traits"},
 {s:"I-5.2", p:1, t:"Hardy-Weinberg law, gene and genotypic frequencies", re:"hardy|gene frequenc|genotypic frequenc|genotype frequenc|gene and genotype|forces changing|systematic process|idealized animal population|genetic constitution of a population"},
 {s:"I-5.2", p:1, t:"Genetic drift, small populations and effective population size", re:"genetic drift|small populations|effective population|drift from hardy|random drift"},
 {s:"I-5.2", p:1, t:"Inbreeding coefficient, coancestry and inbreeding depression", re:"inbreeding coefficient|coancestry|inbreeding depression|path coefficient"},
 {s:"I-5.2", p:1, t:"Breeding value, variance components and resemblance between relatives", re:"breeding value|components of variance|covariance components|partitioning of variation|resemblance|sources of variation|variation is the raw|variance components|dominance|epistatic|genotype.*environment|repeated measurements"},
 // I-5.3 breeding systems
 {s:"I-5.3", p:1, t:"Heritability, repeatability and correlations", re:"heritability|repeatability|genetic parameters|genetic and phenotypic correlations"},
 {s:"I-5.3", p:1, t:"Methods of selection: individual, pedigree, family and within-family; selection indices", re:"individual selection|pedigree selection|family selection|within.?family|sib selection|selection indices|selection index|methods of selection|recurrent selection|define selection|sire ind(ex|ices)|aids to selection|criteria for selection|choosing traits|selection of breeding bulls|progeny test|under selection|multi.?traits|breeding worth"},
 {s:"I-5.3", p:1, t:"Inbreeding, crossbreeding, heterosis and combining ability", re:"inbreeding|crossbreed|cross.?breeding|heterosis|combining ability|inbred lines|upgrading|synthesis of breeds|out.?breeding"},
 {s:"I-5.3", p:1, t:"Breeds of livestock and poultry; crossbreeding programmes in India", re:"breeds? (characteristics|of)|gir and sahiwal|indigenous cattle breeds|crossbred cattle breeds|experiences of crossbreeding|madras red"},
 // I-6 extension
 {s:"I-6", p:1, t:"Principles, objectives and methods of extension", re:"extension|training needs|method demonstration|extension education"},
 {s:"I-6", p:1, t:"Transfer of technology, constraints and animal husbandry programmes for rural development", re:"transfer of technology|transfer technology|technology transfer|rural (development|women|farmers|planning)|participatory rural|role of nddb|socio-economic|animal husbandry programmes|livestock health and disease control|welfare of animal husbandry|gokul mission|cyber extension|information and communication|gender|backbone of poor rural farmers|dairy development programmes|national livestock mission"},
 // ================= PAPER II =================
 // II-1.1 histology
 {s:"II-1.1", p:2, t:"Histological techniques and microscopy", re:"histolog|microscop|in vitro staining|staining"},
 {s:"II-1.1", p:2, t:"Cell structure, cell division and tissues", re:"pituitary gland|cell division|body tissues|basic tissues|tissue structure|cytology|connective tissue cells"},
 {s:"II-1.1", p:2, t:"Histology of organs and glands, neurons and integument", re:"neurons|testis in bull|histology of (adrenal|ovary|testis)|ovary with|sweat glands|pancreas|histological structure of ovary|classify the glands in mammals|glands associated with male|regulation of hormone secretion|blood.?testis"},
 // II-1.2 embryology
 {s:"II-1.2", p:2, t:"Gametogenesis and germ layer derivatives", re:"development of bone|spermatogenesis and oogenesis|gametogenesis|germ layer|ectodermal|endodermal|organogenesis"},
 {s:"II-1.2", p:2, t:"Foetal membranes, placenta and twinning", re:"foetal membranes|placenta|twinning"},
 // II-1.3 bovine anatomy
 {s:"II-1.3", p:2, t:"Regional anatomy: sinuses, nerve blocks and lymph nodes", re:"paranasal|sinuses|lymph nodes|nerve blocks?|cornual|epidural"},
 {s:"II-1.3", p:2, t:"Cranial nerves, brachial and lumbosacral plexus", re:"cranial nerves?|brachial plexus|lumbosacral plexus|vagus|nerves originating|nerves constituting"},
 {s:"II-1.3", p:2, t:"Topographic anatomy of visceral organs (abdominal and pelvic cavities, stomach)", re:"thoracic and pelvic|abdominal cavity|pelvic cavity|ruminal stomach|rumen and reticulum|topograph|female genitalia|reproductive system of a bull|male reproductive organs of bovine|surface anatomy"},
 // II-1.4 fowl
 {s:"II-1.4", p:2, t:"Musculo-skeletal system, air sacs and respiration in fowl", re:"anatomical adaptation for flight|musculo.?skeletal|airsacs?|air sacs|flying birds|respiration in fowl"},
 {s:"II-1.4", p:2, t:"Digestive system and egg production in fowl (ovary, oviduct)", re:"digestive system of fowl|crop and gizzard|ovary and oviduct|female fowl|functional anatomy of (female|domestic) fowl|formation of egg in hen|anatomical structures and formation of egg"},
 // II-1.5 pharmacology
 {s:"II-1.5", p:2, t:"Pharmacodynamics, pharmacokinetics, biotransformation and bioavailability", re:"biotransformation|bioavailability|pharmacodynamic|pharmacokinetic|developing a newer drug|pharmacology and clinical use"},
 {s:"II-1.5", p:2, t:"Drugs acting on the autonomic nervous system; atropine and anticholinergics", re:"autonomic nervous|atropine|antimuscarinic|anticholinergic|anticholinergic agents"},
 {s:"II-1.5", p:2, t:"Anaesthetics, pre-anaesthetics and dissociative anaesthesia", re:"anaesthe|anesthe|preanaesthetic"},
 {s:"II-1.5", p:2, t:"Autacoids, antihistamines, fluids, electrolytes and diuretics", re:"autacoid|antihistamin|fluids? and electrolyte|fluid balance|diuretics?"},
 {s:"II-1.5", p:2, t:"Antimicrobials, antibiotic resistance and principles of chemotherapy", re:"antimicrobial|antibiotic resistance|chemotherapy in microbial"},
 {s:"II-1.5", p:2, t:"Chemotherapy of parasitic infections and neoplastic diseases", re:"neoplastic|ivermectin|ectoparasit|antiparasitic|parasitic infestations?|chemotherapy of"},
 {s:"II-1.5", p:2, t:"Toxicology: poisons, mycotoxins, insecticides, nitrates and cyanide", re:"toxicity|poison|organophosphate|organophosphorus|cyanide|nitrate|mycotoxin|reactivators|carb.?phosphorus|sources of toxicity|toxic"},
 // II-1.6 hygiene
 {s:"II-1.6", p:2, t:"Pollution of water, air and soil and its effect on animals", re:"pollut|aqi|water quality|air pollutants"},
 {s:"II-1.6", p:2, t:"Climate, environment and animal performance; industrialisation and animal agriculture", re:"climate scenario|indigenous livestock breeds|industriali[sz]ation|climate change|effect of (the )?environment|environment on production|photoperiod|heat stress|environmental"},
 {s:"II-1.6", p:2, t:"Housing requirements of livestock and poultry", re:"housing|brooder house|farrowing pen|calf pen|for pregnant cows and milking cows"},
 // II-2.1 infectious diseases
 {s:"II-2.1", p:2, t:"Infectious diseases of cattle and buffaloes (FMD, HS, brucellosis, trypanosomiasis, leptospirosis)", re:"lumpy skin|foot and mouth|\\bfmd\\b|haemorrhagic septic|hemorrhagic septic|brucell|tubercul|trypanosom|leptospir|haemoprotozoan|hemoprotozoan|mediterranean fever|meningitis|mastitis|anthrax"},
 {s:"II-2.1", p:2, t:"Infectious diseases of pigs, horses, sheep and goats (swine fever, erysipelas)", re:"swine fever|erysipelas|equine|sheep and goat|horses"},
 {s:"II-2.1", p:2, t:"Diseases of poultry (avian influenza, viral and bacterial diseases)", re:"avian influenza|poultry industry|bacterial and viral diseases of poultry|diseases of poultry|layer bird diseases|protection against layer"},
 {s:"II-2.1", p:2, t:"Rabies and diagnosis of viral diseases", re:"rabies|rabid|viral diseases|biochemical, biotechnological and immunological"},
 // II-2.2 production diseases
 {s:"II-2.2", p:2, t:"Production diseases of dairy animals (ketosis, milk fever, hypomagnesaemic tetany, haemoglobinuria, recumbency)", re:"ketosis|acetonaemia|hypocalc|hypomagnes|tetany|post.?parturient|haemoglobinur|recumbency|production diseases|grass staggers|monday morning|milk fever"},
 // II-2.3 deficiency
 {s:"II-2.3", p:2, t:"Deficiency diseases of domestic animals and birds", re:"iodine|deficiency (disease|of|symptoms)|thiamine|vitamin (e|b)\\b|vitamin deficiency|leathery eggs|clinical signs exhibited by poultry"},
 // II-2.4 non specific
 {s:"II-2.4", p:2, t:"Impaction, bloat, indigestion, diarrhoea, dehydration and forestomach disorders", re:"anaemia|impaction|bloat|diarrhoea|indigestion|dehydration|fore.?stomach|rumenal disorders|heat stress|colic|esophagitis|heat stroke|stroke"},
 // II-2.5 neurological
 {s:"II-2.5", p:2, t:"Diagnosis and treatment of neurological disorders", re:"neurolog|nervous system|paralysis|convulsions|epilepsy|nervous"},
 // II-2.6 immunisation
 {s:"II-2.6", p:2, t:"Vaccines, immunisation schedules and types of immunity", re:"vaccin|immuni[sz]ation|types of immunity|herd immunity|immuni(ty|se)"},
 {s:"II-2.6", p:2, t:"Zero disease concept, disease-free zones and chemoprophylaxis", re:"quarantine|control and eradication|zero disease|chemoprophyl|disease.?free zones?|disease prevention"},
 // II-2.7 surgery
 {s:"II-2.7", p:2, t:"Fractures and dislocations", re:"fractures?|dislocation|femur|non.?union|stay apparatus|bow and string"},
 {s:"II-2.7", p:2, t:"Hernia, choke, abomasal displacement, caesarean operation, castration", re:"hernia|choke|abomasal displacement|ca?esarean|rumenotomy|castration|surgical (condition|management|intervention)|stages of general anaesthesia"},
 // II-2.8 disease investigation
 {s:"II-2.8", p:2, t:"Materials and techniques for laboratory investigation", re:"collection and despatch|biological samples|laboratory (investigation|diagnosis)|samples? (for|from)|dna fingerprint|disease investigation|neurological examination"},
 {s:"II-2.8", p:2, t:"Animal health centres, veterinary hospital and outbreak investigation", re:"animal health centres?|veterinary hospital|infectious outbreak|outbreak|after floods"},
 // II-3.1 zoonoses
 {s:"II-3.1", p:2, t:"Zoonoses: classification, transmission and role of animals and birds", re:"zoono|animals and birds|zoonoses"},
 {s:"II-3.1", p:2, t:"Occupational zoonotic diseases; meat- and milk-borne diseases; role of public health veterinarians", re:"occupational zoonotic|meat and milk borne|milk and meat borne|public health veterinarian|emerging zoonotic|zoonoses associated with meat and milk"},
 // II-3.2 epidemiology
 {s:"II-3.2", p:2, t:"Epidemiological tools and measures; cohort and case-control studies", re:"epidemiolog|cohort|case.?control|point epidemic|propagating epidemic|disease occurrence|landscape"},
 {s:"II-3.2", p:2, t:"Air-, water- and food-borne infections; OIE, WTO and SPS measures", re:"air- and water|food.?borne|oie|\\bwto\\b|sanitary and phytosanitary|ecological interfaces|disease transmission"},
 // II-3.3 jurisprudence
 {s:"II-3.3", p:2, t:"Rules and regulations: SPCA, cruelty prevention, animal rights and legislation", re:"spca|cruelty|animal rights|legislations?|rules and regulations|regulations for improvement|animal welfare"},
 {s:"II-3.3", p:2, t:"Vetero-legal cases, wounds, blood stains, post-mortem and sample collection", re:"vetero.?legal|veterolegal|blood stains|time of death|legal aspects of wounds|sudden death|post.?mortem examination of a cow"},
 // II-4.1 market milk
 {s:"II-4.1", p:2, t:"Quality, testing and grading of raw milk; collection and transport", re:"raw milk|platform tests?|quality of milk|milk quality|collection and transportation of raw milk|grading of raw"},
 {s:"II-4.1", p:2, t:"Pasteurisation, sterilisation and UHT processing of milk", re:"pasteuri[sz]ation|sterili[sz]ed|\\buht\\b|aseptic|sterility"},
 {s:"II-4.1", p:2, t:"Homogenised, toned, reconstituted, recombined and flavoured milks", re:"homogeni[sz]|reconstituted|recombined|flavoured milk|standardi[sz]ed|\\btoned"},
 {s:"II-4.1", p:2, t:"Cultured milks: yoghurt, dahi, lassi, srikhand, buttermilk and starter cultures", re:"yoghurt|yogurt|buttermilk|\\blassi\\b|srikhand|shrikhand|dahi|acidophilus|cultured milk|fermented milk|starter"},
 {s:"II-4.1", p:2, t:"Market milk defects, spoilage and legal standards", re:"flavour defects|microbial spoilage in milk|defects of whole milk|fssai standards for different types of milk|legal standards|milk plant|dairy plant|haccp|sanitation (requirement|of)|packaging milk|packaging (of )?milk"},
 // II-4.2 milk products
 {s:"II-4.2", p:2, t:"Cream, butter and ghee", re:"cream|butter\\b|\\bghee\\b|stored butter"},
 {s:"II-4.2", p:2, t:"Khoa, channa, paneer, cheese and indigenous milk products", re:"khoa|channa|paneer|cheese|cheddar|indigenous milk products|marketing system of milk products"},
 {s:"II-4.2", p:2, t:"Condensed, evaporated and dried milk; ice cream and kulfi", re:"condensed|evaporated|dried milk|milk powder|spray drying|drying of milk|ice.?cream|kulfi|baby food"},
 {s:"II-4.2", p:2, t:"By-products of milk: whey, casein, lactose", re:"whey|casein|lactose|by.?products produced during the preparation of milk|dairy industry by-?products"},
 // II-5.1.1 meat hygiene
 {s:"II-5.1.1", p:2, t:"Ante-mortem care of food animals; preslaughter handling", re:"ante.?mortem|preslaughter|pre.?slaughter|transportation of poultry"},
 {s:"II-5.1.1", p:2, t:"Stunning, slaughter techniques and dressing operations", re:"stunning|slaughtering techniques|slaughter techniques|scalding|slaughter"},
 {s:"II-5.1.1", p:2, t:"Abattoirs: requirements, design, satellite abattoirs and management", re:"abattoir|slaughter.?house|satellite slaughter|building components"},
 {s:"II-5.1.1", p:2, t:"Meat inspection, post-mortem inspection and carcass grading", re:"meat inspection|post.?mortem inspection|grading and fabrication|carcass grading|inspection procedure|categorization of animals"},
 // II-5.1.2
 {s:"II-5.1.2", p:2, t:"Spoilage of meat, contamination and control measures", re:"fresh meat|spoilage of meat|spoilage.*meat|microbial growth on meat|contamination of meat|contamination"},
 {s:"II-5.1.2", p:2, t:"Post-slaughter physico-chemical changes, rigor mortis, PSE and DFD meat", re:"physico.?chemical changes|rigor mortis|porcine stress|\\bpse\\b|\\bdfd\\b|conversion of muscle into meat|meat quality|physical changes that occur in preserved meat|eating quality"},
 {s:"II-5.1.2", p:2, t:"Adulteration and fraudulent substitution of meat; hygienic meat from farm to fork", re:"adulteration|fraudulent|farm to fork|hygienic meat|wholesome meat|quality of meat for domestic|meat trade|regulatory provisions|convenience meat"},
 // II-5.2.1
 {s:"II-5.2.1", p:2, t:"Meat emulsions, sausages and meat products", re:"meat emulsion|sausage|meat products|value addition in meat|convenience meat"},
 {s:"II-5.2.1", p:2, t:"Preservation of meat: curing, canning, irradiation, low temperature", re:"curing|canning|irradiation|preservation of meat|low temperature preservation|meat preservation|preservation.*poultry meat"},
 {s:"II-5.2.1", p:2, t:"Packaging and processing of meat", re:"packaging (is a very important|of meat)|modern processing technologies|processing of meat|packaging techniques"},
 // II-5.3
 {s:"II-5.3", p:2, t:"Slaughter house by-products and their utilisation", re:"by.?products|byproducts|rendering|meat.?cum.?bone|condemned|casings|effluent|horn and hoof|glandular|organ products|organs and glandular|fallen animal carcasses|hides and skin|proper utili"},
 // II-5.4
 {s:"II-5.4", p:2, t:"Poultry meat: composition, slaughter, inspection and ready-to-cook chicken", re:"poultry meat|chicken meat|ready to cook|dressed chicken|bis grading|nutritional content of poultry|slaughter.*poultry"},
 {s:"II-5.4", p:2, t:"Eggs: structure, composition, preservation, standards and marketing", re:"\\beggs?\\b|egg price|shell eggs?|egg powder|nutritive value of egg"},
 // II-5.5
 {s:"II-5.5", p:2, t:"Rabbit and fur animal farming; fur utilisation", re:"rabbit|\\bfur\\b"},
 {s:"II-5.5", p:2, t:"Wool: processing, grading and quality", re:"\\bwool\\b|woollen|worsted|carpet wool|apparel"}
];
