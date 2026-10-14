// Botany optional: syllabus sub-topics in syllabus order, with the words that tie a past question to each.
//   s  : the official item (I-1 ... II-7) the sub-topic is filed under (see items.js)
//   re : regular expression tested against the question text (case-insensitive)
//   ex : a question that also matches this is NOT filed under the topic
//   p  : 1 or 2 limits the topic to that paper (omit = both)
// A question can belong to several topics (UPSC often joins two ideas in one question).
// Re-run with:  node upsc-pyq-bank/tools/optional/botany/build-botany.js
module.exports = [
 // ================= PAPER I =================
 // I-1 Viruses, bacteria, fungi, mycoplasma, applied microbiology
 {s:"I-1", p:1, t:"Viruses: structure, symmetry, replication, lytic and lysogenic cycles, bacteriophage", re:"\\bvirus|viruses|virion|bacteriophage|\\bphage|lytic|lysogenic|symmetry of virus", ex:"retrovirus"},
 {s:"I-1", p:1, t:"Viroids and prions", re:"viroid|\\bprion"},
 {s:"I-1", p:1, t:"Bacteria: cell wall, structure, sexual reproduction and genetic recombination", re:"bacteri(a|um|al)|gram.?(negative|positive)|endospore|conjugation|transformation in bacteria|bacterial cell wall", ex:"bacteriophage|virus of bacteria"},
 {s:"I-1", p:1, t:"Mycoplasma", re:"mycoplasma"},
 {s:"I-1", p:1, t:"Applications of microbiology in agriculture, industry, medicine and pollution control", re:"microbes|micro-?organisms|microbiology|bioremediation|bioleaching|biopesticide|mycorrhiz|soil nutrient cycling|chemical recycling in nature|mining and pharmaceuticals|immobilised enzymes|industrial uses of microorganisms|soil solari[sz]ation|endophyte|mineralization|nitrogen fixation"},
 // I-2 Crop diseases, infection, parasitism
 {s:"I-2", p:1, t:"Important crop diseases: causal organism, symptoms, disease cycle and control", re:"plant disease control|causal (organism|agent)|symptoms|red rot|late blight|white rust|loose smut|citrus canker|\\bcanker|paddy blast|tikka|ergot|tundu|yellow vein|green ear|sandal spike|angular leaf|brown spot|stalk rot|rust of wheat|crop diseases?|nematode"},
 {s:"I-2", p:1, t:"Modes of infection and dissemination; molecular basis of disease resistance and defence", re:"modes of (entry|transmission)|entry of plant pathogens|infection|dissemination|defen[cs]e structures|disease resistance|plant pathogen"},
 {s:"I-2", p:1, t:"Physiology of parasitism, Koch's postulates and fungal toxins", re:"parasitism|koch|mycotoxin|fungal toxin"},
 {s:"I-2", p:1, t:"Modelling and disease forecasting; plant quarantine", re:"forecasting|modelling|quarantine"},
 // I-3 Cryptogams
 {s:"I-3", p:1, t:"Algae: structure, pigments, life cycles, evolution of sex and uses", re:"alga|phycobili|chlorophyceae|polysiphonia|laminariales|volvocales|\\bchara\\b|brown and green|flagella in algae|heterotrichous|spermocarp|cystocarp|evolution of sex|bioindicator"},
 {s:"I-3", p:1, t:"Cyanobacteria and Cyanophyceae (blue-green algae)", re:"cyanobacteri|cyanophyceae|blue.?green|heterocyst"},
 {s:"I-3", p:1, t:"Fungi: structure, fructification and reproduction (Puccinia, Rhizopus, Mucorales, Ascomycetes, myxomycetes)", re:"fung(i|al|us)|puccinia|parasexual|heterothall|dikaryot|rhizopus|mucorales|peziza|ascomycet|basidiomycet|myxomycet|fructification|apothecium|teleutosorus|rust and smut", ex:"fungal toxins"},
 {s:"I-3", p:1, t:"Lichens", re:"lichen|cyphellae|cephalodia"},
 {s:"I-3", p:1, t:"Bryophytes: classes, gametophyte and sporophyte, evolution of the sporophyte", re:"bryophyt|marchantia|anthoceros|anthocerotopsida|funaria|\\belaters?\\b|peristome|hepatic|bryopsida|sporogonium"},
 {s:"I-3", p:1, t:"Pteridophytes: stelar evolution, heterospory and seed habit, aquatic ferns", re:"pteridophyt|\\bstel(e|ar)|steles|marsilea|salvinia|azolla|equisetum|psilotum|homospor|heterospor|sporocarp|vascular cryptogam|seed habit|incipient|lycopodium|prothall|eusporangiate|leptosporangiate|\\bsori\\b"},
 {s:"I-3", p:1, t:"Distribution, ecological and economic importance of cryptogams in India", re:"distribution and economic importance of bryophytes|beneficial and harmful effects of algae|ecological and economic (significance|importance) of bryophytes|commercial cultivation|food and fuel production|economic importance of laminariales"},
 // I-4 Gymnosperms
 {s:"I-4", p:1, t:"Concept of progymnosperms", re:"progymnosperm"},
 {s:"I-4", p:1, t:"Cycadales: Cycas and cycad characters", re:"cycas|cycadales|\\bcycads?\\b|fern characters"},
 {s:"I-4", p:1, t:"Ginkgoales: Ginkgo, the living fossil", re:"ginkgo"},
 {s:"I-4", p:1, t:"Coniferales: Pinus cones, gametophytes, pollination and fertilization", re:"pinus|conifer|coniferales"},
 {s:"I-4", p:1, t:"Gnetales: Gnetum, Ephedra and Welwitschia", re:"gnetum|gnetales|ephedra|welwitschia"},
 {s:"I-4", p:1, t:"Fossil gymnosperms: Cycadofilicales, Bennettitales, Cordaitales", re:"bennettitales|cycadeoidea|cordaitales|cordaites|cycadofilicales|fossil gymnosperm|pteridosperm"},
 {s:"I-4", p:1, t:"Classification and distribution of gymnosperms in India", re:"distribution (of|.{0,25})(living )?gymnosperms|gymnosperms .{0,30}distributed|gymnosperms in india|distribution of different modern species"},
 {s:"I-4", p:1, t:"Geological time scale, types of fossils and fossilization", re:"geological time|fossil(s|ization)\\b|petrifaction", ex:"gymnosperm"},
 // I-5 Systematics
 {s:"I-5", p:1, t:"International Code of Botanical Nomenclature, typification and the taxonomic hierarchy", re:"nomenclature|typification|international code|taxonomic hierarchy"},
 {s:"I-5", p:1, t:"Numerical taxonomy and chemotaxonomy", re:"numerical taxonomy|numerical expression|chemotaxonomy|\\botus?\\b|operational taxonomic|chemical evidence|secondary metabolites.{0,30}taxonomy"},
 {s:"I-5", p:1, t:"Evidence from anatomy, embryology and palynology in taxonomy", re:"embryology in relation to taxonomy|(embryology|palynology|trichomes?|anatomy).{0,40}(taxonom|systematic)|(taxonom|systematic).{0,30}(importance|value)|palynology in plant systematics|how is embryology useful in taxonomy"},
 // I-6 Origin and classification, families
 {s:"I-6", p:1, t:"Origin and evolution of angiosperms; evolution of floral structure", re:"origin of angiosperms|ana grade|evolution of floral|directions of evolution|primitive|advanced features"},
 {s:"I-6", p:1, t:"Systems of classification of angiosperms (Bentham-Hooker, Engler-Prantl, Hutchinson, Takhtajan, Cronquist, Dahlgren, APG)", re:"bentham|engler|hutchinson|takhtajan|cronquist|dahlgren|\\bapg\\b|natural and phylogenetic|systems? of classification|classification of angiosperms|classification systems"},
 {s:"I-6", p:1, t:"Families: Magnoliaceae and Ranunculaceae", re:"magnoliaceae|ranunculaceae"},
 {s:"I-6", p:1, t:"Families: Brassicaceae, Rosaceae and Fabaceae", re:"brassicaceae|rosaceae|fabaceae|crucifer"},
 {s:"I-6", p:1, t:"Families: Euphorbiaceae, Malvaceae and Dipterocarpaceae", re:"euphorbiaceae|euphorbia\\b|cyathium|malvaceae|dipterocarpaceae"},
 {s:"I-6", p:1, t:"Families: Apiaceae, Asclepiadaceae and Verbenaceae", re:"apiaceae|asclepiadaceae|verbenaceae"},
 {s:"I-6", p:1, t:"Families: Solanaceae, Rubiaceae, Cucurbitaceae and Asteraceae", re:"solanaceae|rubiaceae|cucurbitaceae|asteraceae"},
 {s:"I-6", p:1, t:"Families: Poaceae, Arecaceae, Liliaceae, Musaceae and Orchidaceae", re:"poaceae|arecaceae|liliaceae|musaceae|orchidaceae"},
 // I-7 Anatomy
 {s:"I-7", p:1, t:"Stomata and their types", re:"stomata"},
 {s:"I-7", p:1, t:"Glandular and non-glandular trichomes", re:"trichome"},
 {s:"I-7", p:1, t:"Unusual (anomalous) secondary growth", re:"anomalous|abnormal secondary|successive cambia|interxylary|secondary growth in (some |dicot)|secondary growth in monocots|role of xylem and phloem in secondary"},
 {s:"I-7", p:1, t:"Anatomy of C3 and C4 plants (Kranz anatomy)", re:"kranz|bundle sheath|leaf anatomy of c3|anatomy of c3"},
 {s:"I-7", p:1, t:"Xylem and phloem differentiation and wood anatomy", re:"xylem and phloem differentiation|differentiation of xylem|heart ?wood|sap ?wood|wood anatomy|vessel is structurally|cells cut off by cambium|xylem tissue"},
 // I-8 Embryology, palynology
 {s:"I-8", p:1, t:"Development of male and female gametophytes, pollination and fertilization in angiosperms", re:"gametophyte|pollination|fertili[sz]ation|embryo.?sac", ex:"lycopodium|pinus|gnetum|cycas|marsilea|marchantia|anthoceros|bryophyte|pteridophyte|ginkgo|post fertili"},
 {s:"I-8", p:1, t:"Endosperm: types, development and function", re:"endosperm|aleurone"},
 {s:"I-8", p:1, t:"Patterns of embryo development", re:"embryo (development|developments)|types of embryos|zygotic and somatic embryos|structural complexity of angiosperm embryo|arabidopsis|normal embryo sac"},
 {s:"I-8", p:1, t:"Polyembryony and apomixis (agamospermy)", re:"polyembryony|apomixis|agamospermy"},
 {s:"I-8", p:1, t:"Palynology and its applications", re:"palynolog|npc system|pollen grains?"},
 {s:"I-8", p:1, t:"Experimental embryology: pollen storage and test-tube fertilization", re:"test.?tube|pollen storage|in vitro pollination|experimental embryology"},
 // I-9 Economic botany
 {s:"I-9", p:1, t:"Domestication and introduction of plants; origin of cultivated plants (Vavilov, de Candolle)", re:"domesticat|vavilov|centres? of origin|candolle"},
 {s:"I-9", p:1, t:"Plants as sources of food, fodder, fibres, spices and beverages", re:"fibre|fiber|spices|beverage|millets?|cereals?|maize|groundnut|soybean|vegetable fibers", ex:"causal|symptoms|disease|fibre.?optic"},
 {s:"I-9", p:1, t:"Edible oils, drugs, narcotics, insecticides, latex and rubber", re:"\\boils?\\b|narcotic|latex|insecticide|\\bdrugs?\\b|rubber|medicinal|ethno-?medicin|perfumery|useful parts|botanical names? (and|,) ?(their )?famil|aconite", ex:"oil spill"},
 {s:"I-9", p:1, t:"Timber, gums, resins, dyes, cellulose and starch", re:"timber|\\bgums?\\b|resins?|\\bdyes?\\b|dye.?yielding|cellulose|starch|natural dyes"},
 {s:"I-9", p:1, t:"Ethnobotany in the Indian context", re:"ethnobotan|ethno-?medicin|traditional knowledge"},
 {s:"I-9", p:1, t:"Energy plantations and energy crops", re:"energy plantation|energy crop|biodiesel|hydrocarbon yielding"},
 {s:"I-9", p:1, t:"Botanical gardens and herbaria", re:"botanical gardens?|herbari|'preservation' and 'conservation'"},
 // I-10 Tissue culture
 {s:"I-10", p:1, t:"Totipotency, polarity, symmetry and differentiation", re:"totipoten|polarity|symmetry in plants|cytodifferentiation|cell differentiation|morphogenesis"},
 {s:"I-10", p:1, t:"Cell, tissue and organ culture; micropropagation", re:"tissue culture|organ culture|micropropagation|organogenesis|somatic embryo|rooting and acclimati|plant cell, tissue|basal media|tumour cells|single cells|suspension culture", ex:"protoplast"},
 {s:"I-10", p:1, t:"Protoplast culture, somatic hybrids and cybrids", re:"protoplast|somatic hybrid|cybrid|cytoplasmic hybrids|symmetric hybrids"},
 {s:"I-10", p:1, t:"Somaclonal variation and its applications", re:"somaclon"},
 {s:"I-10", p:1, t:"Pollen haploids and embryo rescue", re:"haploid|embryo rescue|anther culture|microspore|androgenic|embryo culture"},

 // ================= PAPER II =================
 // II-1 Cell biology
 {s:"II-1", p:2, t:"Prokaryotic and eukaryotic cells; endosymbiosis", re:"prokaryotic and eukaryotic|prokaryotic cells|endosymbiosis"},
 {s:"II-1", p:2, t:"Cell wall, plasma membrane, cell adhesion, membrane and vesicular transport", re:"cell wall|plasma membrane|cell.cell adhesion|cell adhesion|cellular adhesion|membrane transport|extrinsic and intrinsic|vesicular|passive transport|active transport|solute moves|extracellular matrix"},
 {s:"II-1", p:2, t:"Chloroplast and mitochondria: structure and function", re:"chloroplast|mitochondri|semi-autonomous", ex:"electron|proton|atp synth|sub-mitochondrial"},
 {s:"II-1", p:2, t:"ER, dictyosomes, ribosomes, endosomes, lysosomes and peroxisomes", re:"endoplasmic|dictyosome|golgi|ribosome|lysosome|peroxisome|endosome|plasmodesmata", ex:"ribosomal rna gene"},
 {s:"II-1", p:2, t:"Cytoskeleton, nucleus, nucleolus, nuclear pore complex, chromatin and nucleosome", re:"cytoskeleton|microtubule|nuclear pore|nucleolus|nucleosome|chromatin|histone", ex:"histone modification"},
 {s:"II-1", p:2, t:"Cell signalling, receptors and signal transduction", re:"signal(l)?ing|signal transduction|receptors|ins ?p3|ins ?pg"},
 {s:"II-1", p:2, t:"Mitosis, meiosis and the cell cycle", re:"cell cycle|mitosis|meiosis|cyclin|synaptonemal"},
 {s:"II-1", p:2, t:"Numerical and structural variations of chromosomes; polytene, B and lampbrush chromosomes", re:"numerical|structural variations|chromosomal aberration|translocation|inversion|polytene|polyteny|b.?chromosomes?|lampbrush|special types of chromosomes|polyploid|amphidiploid|c-value|numerical and structural|variations found in the structure", ex:"cellular signals"},
 // II-2 Genetics
 {s:"II-2", p:2, t:"Mendelian inheritance: incomplete dominance, polygenic inheritance, multiple alleles, epistasis", re:"incomplete dominance|polygenic|multiple (alleles|factor)|pseudoallele|epistasis|mendel|quantitative genetics|gene versus allele|genotype of each parent|dominant over"},
 {s:"II-2", p:2, t:"Linkage, crossing over, chiasma and gene mapping (molecular maps)", re:"linkage|crossing.?over|gene mapping|chiasma|chromosome map|recombination freq|molecular maps"},
 {s:"II-2", p:2, t:"Sex chromosomes, sex-linked inheritance and sex determination", re:"sex[- ]linked|sex determination|sex differentiation|sex chromosome"},
 {s:"II-2", p:2, t:"Mutations: biochemical and molecular basis, mutagens", re:"mutation|mutagen|radiomimetic|frame shift", ex:"breeding"},
 {s:"II-2", p:2, t:"Cytoplasmic inheritance and cytoplasmic genes (including male sterility)", re:"cytoplasmic inheritance|plastid inheritance|cytoplasmic genes|cytoplasmic-genetic|male sterility.{0,40}cytoplasmic|probability and distribution|chloroplast and mitochondrial genes"},
 // II-3 Nucleic acids, gene expression, evolution
 {s:"II-3", p:2, t:"Structure and synthesis of nucleic acids and proteins; genetic code", re:"genetic code|triplet codon|wobble|protein synthesis|dna replication|replication fork|structure and function of proteins|dna is the genetic material|z-dna|antisense|rna processing|rrna gene|transcription|translation"},
 {s:"II-3", p:2, t:"Regulation of gene expression: operons, gene silencing and multigene families", re:"operon|lac operon|gene expression|gene silencing|silencing of|multigene famil|overlapping genes|histone modification"},
 {s:"II-3", p:2, t:"Organic evolution: evidences, mechanisms and theories", re:"organic evolution|natural selection|theories of (organic )?evolution|synthetic theory|mutations in plant evolution|biological species concept|phylogenetic stud"},
 {s:"II-3", p:2, t:"Role of RNA in the origin and evolution of life", re:"role of rna|rna considered as the first|origin of life|catalytic activity of rna|ribozyme"},
 // II-4 Breeding, genetic engineering, tools, statistics
 {s:"II-4", p:2, t:"Methods of plant breeding: selection and hybridization (pedigree, backcross, mass selection, bulk)", re:"back.?cross|mass selection|pedigree|bulk method|plant hybridi[sz]ation|basmati|breeding (programme|program)|resistant varieties|improved variety|mechanism of disease resistance"},
 {s:"II-4", p:2, t:"Heterosis breeding, male sterility and inbreeding depression", re:"heterosis|hybrid vigou?r|male sterility|barnase|inbreeding depression|hybrid varieties|self-?incompatibility"},
 {s:"II-4", p:2, t:"Mutation breeding, polyploidy and apomixis in plant breeding", re:"mutation breeding|mutations in plant breeding|polyploidy in|significance of polyploidy|apomixis|amphidiploid"},
 {s:"II-4", p:2, t:"DNA sequencing", re:"dna sequencing|shotgun|sequenced eukaryotic"},
 {s:"II-4", p:2, t:"Genetic engineering: methods of gene transfer, vectors and gene editing", re:"gene transfer|gene editing|agrobacterium|t-dna|restriction endonuclease|retrovirus|vector|plasmid|gene replacement|transfer of genes"},
 {s:"II-4", p:2, t:"Transgenic crops and biosafety aspects", re:"transgenic|biosafety|bioreactor|insect resistant"},
 {s:"II-4", p:2, t:"Molecular markers and tools: probes, Southern blotting, DNA fingerprinting, PCR and FISH", re:"molecular marker|probe|southern blotting|finger.?print|\\bpcr\\b|reporter gene|\\bfish\\b|rapd|rt-pcr"},
 {s:"II-4", p:2, t:"Biostatistics: standard deviation, tests of significance, probability, correlation and regression", re:"standard deviation|coefficient of variation|tests? of significance|t-test|chi-?square|probability|correlation|regression|goodness of fit|statistical test"},
 // II-5 Physiology
 {s:"II-5", p:2, t:"Water relations and stomatal physiology", re:"water relations|water potential|stomatal|transpiration|ion fluxes"},
 {s:"II-5", p:2, t:"Mineral nutrition, ion transport and mineral deficiencies", re:"mineral|zinc deficiency|nutrient|ion acquisition|phytochelatin|uptake of sucrose|co-factors|movement of ions|secondary active|primary active"},
 {s:"II-5", p:2, t:"Phloem transport", re:"phloem (transport|loading|unloading)|munch|what is phloem|transportation in phloem"},
 {s:"II-5", p:2, t:"Photosynthesis: light reactions and photophosphorylation", re:"photosystem|photophosphorylation|photo-?oxidation of water|oxygen-evolving|light reaction|chloroplast atp synthase|solar energy is trapped"},
 {s:"II-5", p:2, t:"Carbon fixation: C3, C4 and CAM pathways; photorespiration", re:"\\bc4\\b|\\bcam\\b|carbon fixation|kranz|photorespiration|carboxylation|c3, c4"},
 {s:"II-5", p:2, t:"Respiration: glycolysis, citric acid cycle, fermentation and electron transport", re:"respiration|glycolysis|citric acid|krebs|fermentation|electron transport|sub-mitochondrial|oxidative phosphorylation|electrons and pumping"},
 {s:"II-5", p:2, t:"Chemiosmotic theory, ATP synthesis and energy conservation", re:"chemi-?osmotic|chemo-osmotic|proton.motive|atp synth|energy transfer|energy conservation|atp\\b"},
 {s:"II-5", p:2, t:"Enzymes, coenzymes and thermodynamics", re:"enzyme|coenzyme|apoenzyme|allosteric|isoenzyme|feedback control|thermodynamic|free energy"},
 {s:"II-5", p:2, t:"Lipid metabolism", re:"fatty acid|lipid|beta.?oxidation|\\bb.?oxidation|glyoxysome|gluconeogenesis"},
 {s:"II-5", p:2, t:"Nitrogen fixation and nitrogen metabolism", re:"nitrogen|nitrate|\\bnif\\b|nitrogenase|nod factor|root nodule|amino acid biosynthesis|gogat|nitrification|symplasmid"},
 {s:"II-5", p:2, t:"Secondary metabolites and photoreceptors (phytochrome)", re:"secondary metabolite|alkaloid|phytochrome|photoreceptor"},
 {s:"II-5", p:2, t:"Plant movements", re:"nastic|tropic movements|plant movements|growth movements"},
 {s:"II-5", p:2, t:"Photoperiodism, flowering and vernalization", re:"photoperiod|florigen|flowering|vernali[sz]ation|clock hypothesis|day length|night break"},
 {s:"II-5", p:2, t:"Senescence", re:"senescence"},
 {s:"II-5", p:2, t:"Growth substances (plant hormones) and their agri-horticultural uses", re:"auxin|gibberellin|phytohormone|growth substances|growth regulators|cytokinin|ethylene|abscisic|apical dominance|\\bkinetin|\\biaa\\b"},
 {s:"II-5", p:2, t:"Stress physiology: heat, water, salinity and metal stress", re:"stress|drought|salinity|heat shock|\\bhsp"},
 {s:"II-5", p:2, t:"Fruit and seed physiology: ripening, dormancy and germination", re:"fruit ripening|climacteric|seed (germination|dormancy)|dormancy|germination|seedlings"},
 // II-6 Ecology
 {s:"II-6", p:2, t:"Ecosystem: components, energy flow, trophic levels and ecological pyramids", re:"ecosystem|trophic|pyramid|food chain|solar energy is trapped|niche"},
 {s:"II-6", p:2, t:"Ecological factors", re:"ecological factors|limiting factor|biotic factors|mutualism|commensalism|species based mechanism"},
 {s:"II-6", p:2, t:"Community, plant succession and climax", re:"community|succession|climax|barren land"},
 {s:"II-6", p:2, t:"Biogeochemical cycles", re:"biogeochemical|sedimentary cycle|phosphorus|elemental cycle|recycling in nature|lithosphere|chemical recycling"},
 {s:"II-6", p:2, t:"Pollution and its control; phytoremediation and plant indicators", re:"pollut|phytoremediation|bioremediation|plant indicators|metallophytes|oil spillage|eutrophication|solid waste|environment(al)? (management|protection)|biocide|acid rain|smog|detoxify|effluents|environmental pollution"},
 {s:"II-6", p:2, t:"Energy resources: renewable energy, OTEC and solar pond", re:"renewable energy|otec|solar pond"},
 // II-7 Forests, biodiversity
 {s:"II-7", p:2, t:"Forest types of India; afforestation, deforestation and social forestry", re:"forest|afforestation|deforestation|himalayan vegetation|altitudinal zonation"},
 {s:"II-7", p:2, t:"Phytogeographical regions of India and endemism", re:"phytogeograph|phyto-geograph|biogeograph|endemism|regions of india|flora of the region"},
 {s:"II-7", p:2, t:"Endangered plants, IUCN categories, Red Data Book and invasive species", re:"endangered|iucn|red data|red list|extinction|invasive|alien species|threat categories"},
 {s:"II-7", p:2, t:"Biodiversity and its conservation; Protected Area Network, biosphere reserves, Convention on Biological Diversity", re:"biodiversity|biosphere|protected area|germplasm|convention on biological|ex situ|in situ|conservation of biodiversity", ex:"energy conservation|phosphorus"},
 {s:"II-7", p:2, t:"Farmers' Rights, Intellectual Property Rights and sustainable development", re:"farmers.? rights|intellectual property|\\bipr\\b|sustainable development"},
 {s:"II-7", p:2, t:"Global warming and climatic change", re:"global warming|climate change|climatic change|greenhouse|mean atmospheric temperature"},
 {s:"II-7", p:2, t:"Environmental Impact Assessment", re:"environmental impact assessment|\\beia\\b"}
];
