// The official UPSC Botany syllabus (Examination Notice 05/2026-CSE, Appendix I Section III), grouped into items.
// UPSC does not number the Botany paragraphs, so the paragraphs of ../../syllabus/official-2026/botany.txt are numbered here in order
// (a few paragraphs that the notice splits mid-sentence are joined): Paper I -> I-1 ... I-10, Paper II -> II-1 ... II-7.
const S = require("./paras.js");
const J = function(a){ return a.join(" ").replace(/\s+/g, " ").trim(); };
const P1 = S.p1, P2 = S.p2;
if(P1.length !== 12 || P2.length !== 9) throw new Error("botany syllabus paragraphs changed: " + P1.length + " + " + P2.length);
const defs = [
 [1, "I-1",  "Viruses, bacteria, fungi, mycoplasma and applied microbiology", [P1[0]]],
 [1, "I-2",  "Crop diseases, infection, parasitism, toxins and plant quarantine", [P1[1]]],
 [1, "I-3",  "Algae, fungi, lichens, bryophytes and pteridophytes", [P1[2]]],
 [1, "I-4",  "Gymnosperms, fossils and the geological time scale", [P1[3]]],
 [1, "I-5",  "Angiosperm systematics, nomenclature and taxonomic evidence", [P1[4], P1[5]]],
 [1, "I-6",  "Origin of angiosperms, systems of classification and families", [P1[6], P1[7]]],
 [1, "I-7",  "Plant anatomy: stomata, trichomes, secondary growth, C3 and C4 anatomy", [P1[8]]],
 [1, "I-8",  "Embryology and palynology", [P1[9]]],
 [1, "I-9",  "Economic botany, ethnobotany, botanical gardens and herbaria", [P1[10]]],
 [1, "I-10", "Plant tissue culture and cell biotechnology", [P1[11]]],
 [2, "II-1", "Cell biology, cell organelles and chromosomes", [P2[0]]],
 [2, "II-2", "Genetics: inheritance, linkage, sex determination, mutation and cytoplasmic inheritance", [P2[1]]],
 [2, "II-3", "Nucleic acids, protein synthesis, gene expression and organic evolution", [P2[2], P2[3]]],
 [2, "II-4", "Plant breeding, genetic engineering, molecular tools and biostatistics", [P2[4], P2[5]]],
 [2, "II-5", "Plant physiology and biochemistry", [P2[6]]],
 [2, "II-6", "Ecosystem, community, succession, pollution and environment", [P2[7]]],
 [2, "II-7", "Forests, biodiversity, conservation and global change", [P2[8]]]
];
module.exports.items = defs.map(function(d){ return {id:d[1], pp:d[0], t:d[2], full:J(d[3])}; });
