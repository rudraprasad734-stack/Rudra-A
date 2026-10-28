// Philosophy optional: sub-topics under each official syllabus item, with the words that tie a past question to them.
//   s    : the official item (I-1 ... I-20, II-S1 ... II-S10, II-R1 ... II-R10) the sub-topic is filed under (see items.js)
//   re   : pattern tested against the question text (case-insensitive, Sanskrit accents removed first: write Carvaka, Samkhya, Sankara); written as a regex literal, stored as its source
//   ex   : a question that also matches this is NOT filed under the topic
//   refs : questions filed here by hand (year|paper|qno) because their text does not carry the words
//   fb   : true = fallback topic, used only for a question no other topic claims
//   p    : 1 or 2 limits the topic to that paper (omit = both)
// A question can belong to several topics (UPSC often joins two thinkers or two ideas in one question).
// Re-run with:  node upsc-pyq-bank/tools/optional/philosophy/build-philosophy.js
const S = function(r){ return r.source; };
const LIST = [
 // ================= PAPER I: History and Problems of Philosophy =================
 // ---- I-1 Plato and Aristotle
 {s:"I-1", p:1, t:"Plato: Ideas and the theory of Forms; Ideas as immanent and transcendent; the Allegory of the Cave", re:S(/plato|theory of forms|allegory of (the )?cave|ideas are timeless|ideas be both immanent/)},
 {s:"I-1", p:1, t:"Aristotle: substance, form and matter, causation, actuality and potentiality, entelechy", re:S(/aristotle|actuality|potentiality|entelechy|form and matter|matter and form|compound of matter/)},
 // ---- I-2 Rationalism
 {s:"I-2", p:1, t:"Descartes: method, certainty, clear and distinct ideas, innate ideas, mind-body dualism", re:S(/descartes|cartesian|clear and distinct|innate ideas|cogito|mind-body problem/)},
 {s:"I-2", p:1, t:"Spinoza: substance, God, determinism and freedom, mind and body", re:S(/spinoza|determination is negation|whatever is, is in god|necessity of its own nature/)},
 {s:"I-2", p:1, t:"Leibniz: monads, pre-established harmony, determinism and freedom", re:S(/leibniz|monad|pre-established|entelechy as presented/)},
 {s:"I-2", p:1, t:"Rationalism as a school: its tenets and how its thinkers differ (substance, God, mind-body)", re:S(/rationalis(m|t)/)},
 // ---- I-3 Empiricism
 {s:"I-3", p:1, t:"Locke: primary and secondary qualities, personal identity, knowledge, refutation of innate ideas", re:S(/locke|primary (and secondary )?qualities|secondary qualities|intuitive knowledge and demonstrative/)},
 {s:"I-3", p:1, t:"Berkeley: esse est percipi, mind and ideas, nominalism and abstract ideas", re:S(/berkeley|abstract ideas|sensible things are those only|nominalism/)},
 {s:"I-3", p:1, t:"Hume: causation and necessity, personal identity, scepticism, ideas of reason", re:S(/hume|causal relation|relation of cause and effect|causality is a matter|constant conjunction/)},
 // ---- I-4 Kant
 {s:"I-4", p:1, t:"Kant: synthetic a priori judgments, space and time, categories and pure concepts, apperception", re:S(/synthetic (a ?priori|apriori)|a ?priori synthetic|apriori synthetic|analytic judgement|space and time|pure concepts|categories|apperception|understanding makes nature|precepts without concepts|kant reconciles|kant respond|kant's response|kant and hegel|kant's criticism on descartes|a priori judg/)},
 {s:"I-4", p:1, t:"Kant: phenomena and noumena, ideas of reason, antinomies, critique of the proofs for God", re:S(/phenomena and noumena|noumena|antinom|ontological (argument|proof|formulation)|objections against the ontological|criticised by kant|pure reason|ideas of reason|ideas of pure reason/), ex:S(/hume account for ideas of reason/)},
 // ---- I-5 Hegel
 {s:"I-5", p:1, t:"Hegel: dialectical method, Absolute Idealism, identity and difference, history and the Absolute", re:S(/hegel|dialectic|absolute idealism|absolute as being|identity is identity and difference|universal spirit/)},
 // ---- I-6 Moore, Russell and early Wittgenstein
 {s:"I-6", p:1, t:"Moore: defence of common sense, refutation of idealism", re:S(/moore|common[- ]sense|truisms|refutation of idealism|blue exists|blue is one object|human hands/)},
 {s:"I-6", p:1, t:"Russell: logical atomism, logical constructions, incomplete symbols, theory of descriptions, neutral monism", re:S(/russell|logical atomism|logical construction|neutral monism|incomplete symbols|definite description|theory of descriptions|present king of france|golden mountain|i met a man|atomic facts?/)},
 {s:"I-6", p:1, t:"Early Wittgenstein: picture theory of meaning, saying and showing, language and reality", re:S(/picture[- ]theory|pictorial form|logical form|saying' and 'showing|saying and showing|whereof one cannot speak|hierarchy of languages|early wittgenstein|early views of wittgenstein|solipsism/)},
 // ---- I-7 Logical Positivism
 {s:"I-7", p:1, t:"Logical Positivism: verification theory of meaning, rejection of metaphysics, pseudostatements, unity of science", re:S(/logical positivi|logical positivists|verification|verifiable|pseudostatement|metaphysical (sentences|statements)|elimination of metaphysics|rejection of metaphysics|unified language of science|criterion of meaningfulness|all objects are either red|soul of superman|handmaid to science/)},
 // ---- I-8 Later Wittgenstein
 {s:"I-8", p:1, t:"Later Wittgenstein: meaning as use, language-games, family resemblance, form of life", re:S(/later wittgenstein|language[- ]games?|family resemblance|form of life|use[- ]theory|use theory of meaning|language is a game|picture-theory of meaning to use|transition from early/)},
 {s:"I-8", p:1, t:"Critique of private language and of solipsism", re:S(/private language|solipsism|essentially private|inner experiences|words be viewed as the ideas/)},
 // ---- I-9 Phenomenology
 {s:"I-9", p:1, t:"Husserl: phenomenological method, epoche and reduction, natural attitude, theory of essences", re:S(/husserl|phenomenolog|epoche|bracketing|natural attitude|essences/)},
 {s:"I-9", p:1, t:"Husserl: intentionality, the transcendental ego, avoiding psychologism", re:S(/psychologism|intentional|transcendental ego|\"i think\"|hallucination/)},
 // ---- I-10 Existentialism
 {s:"I-10", p:1, t:"Kierkegaard: subjectivity as truth, the single individual, stages of existence", re:S(/kierkegaard|subjectivity|single individual|stages of existence/), ex:S(/Xx/)},
 {s:"I-10", p:1, t:"Sartre: existence precedes essence, freedom and choice, bad faith, nothingness, being-for-itself", re:S(/sartre|existence precedes essence|existentialist thinkers|bad faith|nothingness|being-for-itself|consciousness is what it is not/)},
 {s:"I-10", p:1, t:"Heidegger: Dasein, being-in-the-world, authenticity and inauthenticity, temporality", re:S(/heidegger|dasein|being-in-the-world|authenticity|temporality/)},
 // ---- I-11 Quine and Strawson
 {s:"I-11", p:1, t:"Quine: two dogmas of empiricism, the analytic-synthetic distinction, critique of a priori knowledge", re:S(/quine|two dogmas|dogmas of empiricism|analytic-synthetic|synthetic-analytic|article of faith/)},
 {s:"I-11", p:1, t:"Strawson: basic particulars, the concept of a person, ascription of states of consciousness", re:S(/strawson|basic particulars|person to be a primitive|states of consciousness (are )?ascribed/)},
 // ---- I-12 Carvaka
 {s:"I-12", p:1, t:"Carvaka: theory of knowledge, rejection of inference, vyapti and the problem of induction", re:S(/(?=.*carvaka)(?=.*(inference|anumana|vyapti|knowledge|epistemolog|mortal|socrates|positivis|empiric|perception))|carvakas are consistent|inference is not a source/)},
 {s:"I-12", p:1, t:"Carvaka: materialism, the soul as conscious body, rejection of transcendent entities and rebirth", re:S(/(?=.*carvaka)(?=.*(soul|self|materialis|transcend|ether|akasa|rebirth|transmigration|reality|element))|conscious body/)},
 // ---- I-13 Jainism
 {s:"I-13", p:1, t:"Jainism: theory of reality, tattvartha, saptabhangi-naya, syadvada and anekantavada", re:S(/(?=.*jain)(?=.*(reality|judg|relativ|absolutis|syadvada|saptabha|pluralis|tattv|sevenfold))|syadvada|saptabha|anekanta|\bnaya\b|tattvartha/), ex:S(/bhavabandha/)},
 {s:"I-13", p:1, t:"Jainism: karma, bondage and liberation, the liberated and the bound soul", re:S(/jain\w*.*(karma|bondage|liberat|soul|moksa|kaivalya)|bhavabandha|bound soul|kaivalya.* jain|jaina and yoga/)},
 // ---- I-14 Schools of Buddhism
 {s:"I-14", p:1, refs:["2016|1|6(c)"], t:"Buddhism: pratityasamutpada, ksanikavada and nairatmyavada", re:S(/pratityasamutp|ksanika|nairatmya|dependent origination|momentar|pancaskandha|no-soul|pudgala|dharma-nairatmya|everything is momentary/)},
 {s:"I-14", p:1, t:"Schools of Buddhism: Madhyamika, Yogacara, Sarvastivada; sunyata, catuskoti, the external world", re:S(/madhyamika|yogacara|sarvastivad|sunyata|catuskoti|schools of buddhism|external world|two schools of buddhism|everything is void/)},
 {s:"I-14", p:1, t:"Buddhist soteriology: nirvana, the three jewels, karma and liberation", re:S(/nirvana|triratna|buddhist (soteriology|theory of karma)|buddhists? (explain|respond)|buddhism explain|buddhist concept of|rejection of atma/)},
 // ---- I-15 Nyaya-Vaisesika
 {s:"I-15", p:1, refs:["2023|1|8(c)"], t:"Vaisesika categories: padartha, abhava, samanya, visesa, samavaya (inherence)", re:S(/vaisesika|padartha|abhava|samavaya|samanya|visesa|inherence|negation|absence|ayuta|category|brown colour of the table/)},
 {s:"I-15", p:1, t:"Nyaya theory of knowledge: pramana, perception, inference, hetu and fallacies, upamana, sabda", re:S(/nyaya|naiyayika|gautama|\bpramana\b|\bhetu\b|upamana|\bsabda\b|anumana|valid middle|fallacies of the middle|\bapta\b/), ex:S(/udayana|god/)},
 {s:"I-15", p:1, t:"Nyaya on appearance and error: khyati theories, jnana-laksana perception, anirvacaniya-khyati", re:S(/khyati|erroneous|error|illusion|jnanalaksana|jnanalaksana-pratyaksa/)},
 {s:"I-15", p:1, t:"Nyaya-Vaisesika on the self, liberation, God and causation: proofs of God, asatkaryavada, atomism", re:S(/udayana|naiyayikas? prove|naiyayikas.*existence of (the )?self|existence of the self|asatkarya|pragabhava|anyathasiddha|atomis|nyaya.*(causation|seed)|does the seed contain|seed contain the tree|naiyayikas.*god/)},
 // ---- I-16 Samkhya
 {s:"I-16", p:1, t:"Samkhya: prakrti, the three gunas and the evolution of prakrti", re:S(/prakrti|gunas?|evolution of prakrti|buddhi, mahat|there can be only one prakrti|role of prakrti/), ex:S(/prakrtiparinama/)},
 {s:"I-16", p:1, refs:["2016|1|6(c)"], t:"Samkhya: purusa (one or many), consciousness, jiva and purusa", re:S(/purusa|metaphysical status of a jiva|consciousness in the world|samkhya.*consciousness/)},
 {s:"I-16", p:1, t:"Samkhya: satkaryavada and the theory of causation, Sankara's criticism of Samkhya", re:S(/samkhya|sankhya/), ex:S(/\bpurusa\b|prakrti\b.*(proof|evolution)/)},
 // ---- I-17 Yoga
 {s:"I-17", p:1, t:"Yoga: citta, cittavrtti, klesas and their removal", re:S(/citta|klesa|yogascittavrtti/), ex:S(/aurobindo|integral/)},
 {s:"I-17", p:1, t:"Yoga: samadhi, kaivalya, the role of Isvara", re:S(/samadhi|kaivalya|yoga (philosophy|system)|nature of god and its role in kaivalya|yoga philosophers/), ex:S(/aurobindo|integral|jaina and yoga/)},
 // ---- I-18 Mimamsa
 {s:"I-18", p:1, t:"Mimamsa theory of knowledge: arthapatti, anupalabdhi, memory, the authority of the Veda", re:S(/arthapatti|anupalabdhi|memory|vedic knowledge|authority of vedic|mimamsa.*(implication|valid)|mimamsakas? (refute|establish)/)},
 {s:"I-18", p:1, t:"Mimamsa on the validity of knowledge: svatah and paratah pramanya", re:S(/pramanyavada|prama(n)?ya|validity of knowledge|intrinsic (validity|validation)|extrinsic|svatah|svayamprakasa|how do i know that i know/)},
 {s:"I-18", p:1, refs:["2023|1|8(c)"], t:"Bhatta and Prabhakara Mimamsakas: abhava, error, word-meaning and verbal knowledge", re:S(/bhatta|prabhakara|mimamsakas?|sabdabodha|word-meaning|sentential-meaning/), ex:S(/udayana/)},
 // ---- I-19 Schools of Vedanta
 {s:"I-19", p:1, t:"Advaita Vedanta: Brahman, Isvara, jiva and saksi, the great sentence tat tvam asi", re:S(/advaita|advaitin|advaitism|non-dualism|brahman|isvara|saksi|tat tvam asi|bimba|jiva and jiva|jivanmukti/), ex:S(/ramanuja|madhva|visistadvaita|nimbarka|aurobindo/)},
 {s:"I-19", p:1, t:"Advaita Vedanta: Maya, avidya, anirvacaniyata, vivartavada, liberation as attainment of the already attained", re:S(/maya|avidya|anirvacaniya|vivarta|already attained|attainment of that which|moksa|liberation is defined by advaita|vedantins? react/), ex:S(/aurobindo|buddhist|jaina/)},
 {s:"I-19", p:1, t:"Visistadvaita: Ramanuja's refutation of Maya, God, matter and spirit, the body-soul analogy", re:S(/ramanuja|visistadvaita|qualified non-dualism|seven objections|sapta/)},
 {s:"I-19", p:1, t:"Dvaita and other Vedanta schools: Madhva's pancavidhabheda, Nimbarka, moksa across the schools, Sankara and Ramanuja compared", re:S(/madhva|madhvacarya|dvaita|dualistic school|pancavidhabheda|nimbarka|suddhadvaita|acintyabheda|sankara.*ramanuja|ramanuja.*sankara|various schools|status of the world/)},
 // ---- I-20 Aurobindo
 {s:"I-20", p:1, t:"Aurobindo: evolution and involution, the life divine, the psychic being", re:S(/aurobindo.*(evolution|involution|life divine|psychic|ascetic|materialist|gnostic)|life divine|conscious evolution|psychic being|evolution and involution|gnostic being/)},
 {s:"I-20", p:1, t:"Aurobindo: integral yoga, the Supermind and the triple transformation", re:S(/integral yoga|supermind|triple transformation|double movement of ascent|aurobindo/)},

 // ================= PAPER II: Socio-Political Philosophy =================
 // ---- II-S1 Social and political ideals
 {s:"II-S1", p:2, t:"Justice: Plato, Rawls, Nozick, Sen, justice and the other ideals", re:S(/justice|rawls|nozick|amartya sen/), ex:S(/problem of evil/)},
 {s:"II-S1", p:2, t:"Liberty and equality: positive and negative liberty, equality and equity, liberty and its limits", re:S(/liberty|freedom of an individual|equality|equity|self-realization|negative liberty|positive liberty|put limitations to equality|unalienable rights?/), ex:S(/gender|women|female/)},
 // ---- II-S2 Sovereignty
 {s:"II-S2", p:2, t:"Sovereignty: Austin, Bodin, Laski, monistic and pluralistic views, sovereignty and globalization", re:S(/sovereignty|austin|bodin|laski/), ex:S(/kautilya|arthasastra/)},
 {s:"II-S2", p:2, t:"Kautilya: sovereignty, danda-niti, the Rajamandala and the Arthasastra", re:S(/kautilya|arthasastra|danda|rajamandala/)},
 // ---- II-S3 Individual and State
 {s:"II-S3", p:2, refs:["2024|2|3(a)"], t:"Rights: human rights, natural rights, social contract, rights and citizens", re:S(/rights?\b|social contract|human dignity|dignity of each person|rousseau|natural and artificial inequality/), ex:S(/women|land and property|gender/)},
 {s:"II-S3", p:2, t:"Duties and accountability: duty prior to rights, accountability of citizens and State", re:S(/duties|duty and accountab|accountab|obligation|rights and duties/)},
 // ---- II-S4 Forms of government
 {s:"II-S4", p:2, t:"Monarchy and theocracy: divine right, theocracy in the modern state, monarchy and freedom", re:S(/monarch|theocra|divine right/)},
 {s:"II-S4", p:2, t:"Democracy: liberal democracy, pure democracy, propaganda, democracy and development, challenges to the democratic State", re:S(/democra|propaganda|body-politic|dictatorship|universal franchise|enlightenment/), ex:S(/democratic equality|marxian notion|secular democracy|philosophical foundations/)},
 // ---- II-S5 Political ideologies
 {s:"II-S5", p:2, t:"Anarchism: the anarchist's view of the State, Gandhi as an anarchist", re:S(/anarch/)},
 {s:"II-S5", p:2, refs:["2016|2|3(a)"], t:"Marxism and socialism: historical materialism, alienation, equity and equality, socialism and democracy, Gandhian socialism", re:S(/marx|socialis|communis|historical materialism|alienation|equity and equality/)},
 // ---- II-S6 Humanism, secularism, multi-culturalism
 {s:"II-S6", p:2, t:"Humanism: its tenets, Tagore's humanism, humanism and religion, the Enlightenment", re:S(/humanis(m|t)|enlightenment/), ex:S(/religious (conflict|pluralism)/)},
 {s:"II-S6", p:2, t:"Secularism: secularism and religion, religious freedom, secularism and pluralism, Gandhi on secularism", re:S(/secular|religion and state|religious freedom/), ex:S(/secular (use of language|ethics)|religion without/)},
 {s:"II-S6", p:2, t:"Multi-culturalism: its descriptive and normative aspects, challenges, group and individual rights, tolerance", re:S(/multicultura|multi-cultura|tolerance and coexistence|cultural identity|freedom from domination/)},
 // ---- II-S7 Crime and punishment
 {s:"II-S7", p:2, t:"Punishment: capital punishment, retributive, reformative and deterrent theories, punishing a juvenile, punishment and human rights", re:S(/punish|capital punishment|death|retributiv|deterren|reform the individual|juvenile|rape, murder/)},
 {s:"II-S7", p:2, t:"Corruption and mass violence: corruption as systemic or ethical, remedies, genocide", re:S(/corrupt|mass violence|genocide|value based education/)},
 // ---- II-S8 Development and social progress
 {s:"II-S8", p:2, t:"Social development and social progress: economic development, ethical standards, technology, skill education, tribal values", re:S(/social (development|progress)|economic development|technological development|skill education|tribal values|development and (social|human)|human development|modern technological society|reconcile the concept of development|democracy and development/)},
 // ---- II-S9 Gender discrimination
 {s:"II-S9", p:2, t:"Gender discrimination: gender as a social construct, female foeticide, feminism", re:S(/gender|female foeticide|feminism|sex as a biological|social imbalance|female sex|crimes against women|gender equality/)},
 {s:"II-S9", p:2, t:"Women's empowerment: land and property rights, collective decision-making, divorce and equal rights", re:S(/women|empower|land and property|empowerment of women/)},
 // ---- II-S10 Caste discrimination
 {s:"II-S10", p:2, t:"Caste discrimination: Gandhi and Ambedkar, annihilation of caste, caste and the body-politic", re:S(/caste|ambedkar|endosmosis/)},

 // ================= PAPER II: Philosophy of Religion =================
 // ---- II-R1 Notions of God
 {s:"II-R1", p:2, refs:["2016|2|5(a)"], t:"Notion of God: attributes, personal and impersonal God, immanence and transcendence, omniscience and omnipotence", re:S(/notion of god|nature of god|attributes|personalistic|impersonalistic|immanent|transcendent|omniscien|omnipoten|conception of god|god as|spinoza.*god|concept of god|ultimate cause|physical manifestation|god in hinduism|god and (the )?(self|world)/), ex:S(/proof|existence of god|language/)},
 {s:"II-R1", p:2, refs:["2018|2|5(e)","2019|2|8(c)"], t:"God in the Indian traditions: Vishishtadvaita, Yoga, Hinduism, Brahman, non-theological and theological concepts of God", re:S(/vishishtadvaita|visistadvaita|yoga system|brahman|non-theological (concept|system)|theological concept|god in hinduism|relation between the god and the self|ramanujacarya/)},
 // ---- II-R2 Proofs for the existence of God
 {s:"II-R2", p:2, refs:["2016|2|7(c)","2016|2|8(c)"], t:"Western proofs: ontological, cosmological, design, moral, contingency, a priori and a posteriori, Aquinas' Five Ways", re:S(/ontological|cosmological|design argument|moral argument|contingency of the world|a priori and a posteriori|five ways|aquinas.* proof|prove the existence of god|existence of god/), ex:S(/nyaya|jain|buddhist|madhva/)},
 {s:"II-R2", p:2, t:"Indian proofs and their critique: Nyaya, Jain, Buddhist and Madhva arguments for and against God", re:S(/(nyaya|jain|buddhis|madhva).*(god|existence)|god.*(nyaya|jain|buddhis)|existence of god.*(nyaya|jain)|arguments against the existence of god/)},
 // ---- II-R3 Problem of evil
 {s:"II-R3", p:2, t:"Problem of evil: logical problem of evil, theodicy, Augustine, moral and natural evil", re:S(/evil|theodicy|\bsin\b/)},
 // ---- II-R4 Soul: immortality, rebirth, liberation
 {s:"II-R4", p:2, t:"Immortality of the soul, rebirth, reincarnation and karma", re:S(/immortality|rebirth|reincarnation|karma|soul and bondage|nature of soul/)},
 {s:"II-R4", p:2, t:"Liberation: moksa, jivanmukti, Advaita and Vishishtadvaita, liberation in theological and non-theological approaches, the Bhagavad Gita", re:S(/liberation|moksa|jivanmukti|bhagavad|embodied liberation|bhakti|knowledge, action and devotion/)},
 // ---- II-R5 Reason, revelation and faith
 {s:"II-R5", p:2, refs:["2026|2|5(e)"], t:"Faith and reason: faith and belief, rational and irrational faith, Aquinas on faith, the role of reason in religion", re:S(/faith|role of reason|reason and faith|faith or reason|belief/), ex:S(/religious freedom/)},
 {s:"II-R5", p:2, t:"Revelation: natural and revealed theology, revelation and reason, claims to revelation", re:S(/revelation|revealed theology|natural theology/)},
 // ---- II-R6 Religious experience
 {s:"II-R6", p:2, refs:["2020|2|7(b)","2026|2|5(e)"], t:"Religious experience and practice: mystical experience, prayer and worship, William James, Radhakrishnan, Advaita and Vedantic accounts", re:S(/religious experience|mystic|mysticism|william james|radhakrishnan/)},
 // ---- II-R7 Religion without God
 {s:"II-R7", p:2, t:"Religion without God: Buddhism, Jainism and non-theistic religion, agnosticism, Nietzsche on religion", re:S(/without god|buddhism as a religion|religion without|anti-theistic|agnostic|nietzsche|god necessary for religion|substitute for religion|non-theological/)},
 // ---- II-R8 Religion and morality
 {s:"II-R8", p:2, t:"Religion and morality: religion without morality, moral autonomy, religion and social morality, ethics independent of religion", re:S(/moral|morality|ethic|immoral|religiosity|god is truth|obligation in a moral agent/), ex:S(/ethical (principles of tolerance|standards)|moral argument|moral and natural evil|moral behaviour of|ethical principles/)},
 // ---- II-R9 Religious pluralism and absolute truth
 {s:"II-R9", p:2, t:"Religious pluralism, exclusivism and inclusivism; absolute truth; truth claims; universal religion", re:S(/pluralis|exclusivis|inclusivis|absolute truth|truth claims|one absolute truth|universal religion|truth is one|conflicting truth/), ex:S(/pluralism.*moral relativism/)},
 {s:"II-R9", p:2, refs:["2017|2|8(a)"], t:"Religion and society: religious tolerance, religious conflict, religion as a uniting force, violence in the name of religion, world religion", re:S(/religious tolerance|history of religions|uniting force|violence in the name|world-religion|inter-religious|religious pluralism necessarily entail|moral relativism|religious absolutism|oriental religions/)},
 // ---- II-R10 Nature of religious language
 {s:"II-R10", p:2, t:"Religious language: cognitive and non-cognitive views, Braithwaite, Hare's blik, Wittgenstein on religious language", re:S(/cognitiv|religious language|braithwaite|blik|meaningfulness of religious/), ex:S(/analogical|symbolic|tillich|indescrib/)},
 {s:"II-R10", p:2, t:"Symbolic and analogical language: Tillich, religious symbols, analogy and symbol", re:S(/analog|symbolic|symbolism|tillich|religious symbols|language of symbols/)},
 {s:"II-R10", p:2, t:"Language of religion: secular and religious language, communicating religious experience, the Advaitic view of indescribability", re:S(/secular use of language|indescrib|anirvachaniyata|communicable|kind of language|religious experiences communic/)},
 // ---- fallback topics (used only for a question no other topic claims)
];
module.exports = LIST;
