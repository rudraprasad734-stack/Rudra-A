// Psychology optional: sub-topics under each official syllabus item, with the words that tie a past question to them.
//   s    : the official item (I-1 ... I-14, II-1 ... II-14) the sub-topic is filed under (see items.js)
//   re   : pattern tested against the question text (case-insensitive, accents removed first); written as a regex literal, stored as its source
//   ex   : a question that also matches this is NOT filed under the topic
//   refs : questions filed here by hand (year|paper|qno) because their text does not carry the words
//   fb   : true = fallback topic, used only for a question no other topic claims
//   p    : 1 or 2 limits the topic to that paper (omit = both)
// A question can belong to several topics (UPSC often joins two ideas in one question).
// Re-run with:  node upsc-pyq-bank/tools/optional/psychology/build-psychology.js
const S = function(r){ return r.source; };
const LIST = [
 // ================= PAPER I: Foundations of Psychology =================
 // ---- I-1 Introduction
 {s:"I-1", p:1, t:"Psychology as a science: definition, scientific methods against intuition and common sense, why psychology is a science", re:S(/what makes psychology a (more )?scien|scientific study of behaviou?r|limits of intuition|psychology is the scientific|scientific discipline/)},
 {s:"I-1", p:1, t:"Historical antecedents and schools: structuralism, functionalism, behaviourism, psychoanalysis, the rise of cognitive psychology", re:S(/neuropsychology|structuralism|functionalism|behaviourism|behaviourists avoid|diversity in the disciplinary|teleological approach in psychoanalysis|emergence and development of cognitive psychology/)},
 {s:"I-1", p:1, t:"Application of psychology to societal problems: war and peace, social problems, resolving conflict, knowledge in use", re:S(/societal problems|resolving interpersonal|social problem|war and peace|resolution of societal|resolving societal|used psychology to solve/)},
 // ---- I-2 Methods of psychology
 {s:"I-2", p:1, t:"Types of research: descriptive, evaluative, diagnostic and prognostic; basic and applied research", re:S(/descriptive|diagnostic|prognostic|evaluative|basic and applied/)},
 {s:"I-2", p:1, t:"Methods of research: survey, observation (naturalistic and laboratory), interview and case study", re:S(/observation|survey|case.study|interview|data collection methods/), ex:S(/observational learning|observations of others/)},
 {s:"I-2", p:1, t:"Experimental, quasi-experimental and non-experimental designs: variables, confounding, double-blind, correlational and within/between-group designs", re:S(/experimental|independent, dependent|confounding|double.blind|single blind|correlational|within-group|between-groups|which research design|which method is most appropriate|cause and effect/), ex:S(/experimental evidence/)},
 {s:"I-2", p:1, t:"Focus group discussion, brain storming and grounded theory", re:S(/focus group|brain.?storming|grounded theory/)},
 // ---- I-3 Research methods
 {s:"I-3", p:1, t:"Steps in psychological research: hypothesis, sampling, research design, tools of data collection, interpretation", re:S(/research method is considered|steps to be undertaken|hypothesis|sampling|sampling bias|probability sampling|data analysis and interpretation|steps in psychological research|formulate a hypothesis/), ex:S(/critical period|language acquisition|whorf/)},
 {s:"I-3", p:1, t:"Reliability and validity of measures", re:S(/reliable|validity/)},
 {s:"I-3", p:1, t:"Statistical techniques: t-test, two-way ANOVA, correlation, regression, factor analysis, item response theory", re:S(/anova|regression|factor analysis|correlat|t-test|item response|statistical|number of students intake/), ex:S(/correlational studies/)},
 // ---- I-4 Development of human behaviour
 {s:"I-4", p:1, refs:["2021|1|1(d)"], t:"Growth and development: principles, life-span development, developmental tasks, Erikson, adolescence, midlife, attachment and parenting", re:S(/cognitive decline|elderly|well-being of youth|gender identity|gender typing|growth and development|life span|erikson|adolescen|midlife|attachment|parenting|child rearing|developmental milestones|prenatal|developmental ecology|early developmental stages/), ex:S(/internet addiction|adolescents.{0,6}behaviour|programmes of the government|information technology on adolescents|media, specially|electronic media|guidance programme for adolescents|mass media|drug abuse/)},
 {s:"I-4", p:1, t:"Heredity and environment: genes, nature and nurture, genetic and environmental determinants", re:S(/genes|nature.{0,20}nurture|genetic|heredity|multiple factors that tend to overlap/), ex:S(/personality is all in our genes/)},
 {s:"I-4", p:1, t:"Culture and socialization: values in childhood, socialization in a multicultural society, cultural factors", re:S(/socialization|socialisation|fostering moral|values can best be fostered|cultural factors in|gender differences account/)},
 // ---- I-5 Sensation, attention and perception
 {s:"I-5", p:1, t:"Sensation and attention: thresholds, signal detection, vigilance, selective attention", re:S(/signal detection|vigilance|threshold|selective attention|attention/), ex:S(/attention and consciousness|deficit/)},
 {s:"I-5", p:1, t:"Perception: organization, depth and space, illusions, plasticity, top-down and bottom-up processing, 3D vision", re:S(/perception|perceptual|perceive|depth|illusion|3d|three dimensions|monocular|bottom-up|plasticity|sensory input|see the world/), ex:S(/subliminal perception|culture and perception|extrasensory|speech perception/)},
 {s:"I-5", p:1, t:"Subliminal and extrasensory perception, inattentional blindness, culture and perception", re:S(/subliminal|extra.?sensory|esp\b|inattentional|psychological and cultural factors affect perception/)},
 // ---- I-6 Learning
 {s:"I-6", p:1, t:"Classical conditioning: principles, applications, cognitive approach, formation of likes and preferences", re:S(/classical conditioning|conditioned|contingency|chemotherapy/)},
 {s:"I-6", p:1, t:"Operant conditioning: reinforcement, punishment, escape and avoidance, schedules, behaviour modification and toilet training", re:S(/operant|reinforce|punishment|escape|avoidance|toilet training|reward and punishment|behaviour modify/), ex:S(/reconstruct/)},
 {s:"I-6", p:1, t:"Observational, vicarious and social learning; modelling", re:S(/vicarious|observational learning|modelling|social learning|learning occurs/)},
 {s:"I-6", p:1, t:"Programmed learning, probability learning, discrimination and generalization", re:S(/programmed|probability learning|discrimination and generalization|generalization|extinction/)},
 {s:"I-6", p:1, t:"Theories of learning: behaviourist, Gestalt and information-processing models of learning", re:S(/theories of learning|learning theories|gestalt/)},
 // ---- I-7 Memory
 {s:"I-7", p:1, t:"Models of memory: multistore model, levels of processing, working memory, sensory, short-term and long-term memory, leaky bucket", re:S(/levels of memory|initial processing|multistore|multi-store|levels of processing|working memory|short-term memory|long-term memory|sensory memory|leaky bucket|tulving|serial position|implicit and explicit memor/)},
 {s:"I-7", p:1, t:"Encoding, retrieval and reconstruction: encoding specificity, schemas, eyewitness testimony, reconstructed memory", re:S(/encod|retriev|reconstruct|eyewitness|schemas|meaningfulness/), ex:S(/retrieval failure\? discuss/)},
 {s:"I-7", p:1, t:"Forgetting and amnesia: interference, decay, retrieval failure, anterograde and retrograde amnesia, case of H.M.", re:S(/forget|amnesia|memory disorders|interference|decay/)},
 {s:"I-7", p:1, t:"Improving memory: organization, mnemonic techniques, meta-memory, memory strategies", re:S(/mnemonic|meta-?memory|improve|retention|memory strateg|expertise and exceptional/), ex:S(/language|aspirations/)},
 // ---- I-8 Thinking and problem solving
 {s:"I-8", p:1, t:"Piaget's theory of cognitive development: stages and developmental milestones", re:S(/piaget|formal operational|stages of cognitive development/)},
 {s:"I-8", p:1, t:"Concept formation, reasoning and problem solving: heuristics and algorithms, mental set, functional fixedness, deductive and inductive reasoning", re:S(/concept formation|define 'concept'|types of concepts|reasoning|problem.solving|solving the problems|heuristic|algorithm|mental set|functional fixedness|thinking|metacognitive|computer is an analogy|computer as an analogy|cognitive psychologists often use computer/)},
 {s:"I-8", p:1, t:"Creative thinking: creativity, divergent and convergent thinking, fostering creativity", re:S(/creativ|divergent|convergent/)},
 {s:"I-8", p:1, t:"Decision making and judgement: factors, group decision-making errors and biases, recent trends", re:S(/decision.making|judgement|group decision/), ex:S(/social change|advantages and disadvantages|managerial/)},
 // ---- I-9 Motivation and emotion
 {s:"I-9", p:1, t:"Motivation: psychological and physiological basis, Maslow, arousal, drive and expectancy theories, motivational cycle, homeostasis, hunger", re:S(/motivation|motivational|maslow|homeostatic|hunger|arousal, drive/), ex:S(/achievement motivation|entrepreneur|intrinsic|extrinsic|work.motivation|work motivation|extra sensory/)},
 {s:"I-9", p:1, t:"Extrinsic and intrinsic motivation; factors influencing intrinsic motivation", re:S(/intrinsic|extrinsic/)},
 {s:"I-9", p:1, t:"Emotion: James-Lange and Cannon-Bard, biological and cultural bases, facial-affect programme and display rules, non-verbal cues, emotional regulation", re:S(/\bemotions?\b|james-lange|cannon-bard|facial.affect|display rules|non-verbal cues|physical indicators/), ex:S(/emotional intelligence|emotional competency|emotional health/)},
 {s:"I-9", p:1, t:"Needs and achievement: need for achievement, achievement motivation and entrepreneurial behaviour", re:S(/needs should one be high|achievement motivation|entrepreneur/)},
 // ---- I-10 Intelligence and aptitude
 {s:"I-10", p:1, t:"Theories of intelligence: Spearman g and s, Thurstone, Guilford, Gardner, Sternberg, J. P. Das, information processing", re:S(/spearman|gardner|sternberg|\bj\. ?p\. das|\bg\b.{0,6}\bs\b|thurstone|guilford|multiple intelligence|univariate|theories of intelligence|kind of general intelligence/)},
 {s:"I-10", p:1, t:"Measurement of intelligence: IQ, deviation IQ, Binet and Wechsler, IQ scores and mental retardation, constancy of IQ", re:S(/\biq\b|binet|wechsler|deviation|mental retardation|intelligence test|intelligence and aptitude|aptitude/), ex:S(/emotional intelligence/)},
 {s:"I-10", p:1, t:"Emotional and social intelligence; crystallized and fluid intelligence", re:S(/emotional intelligence|emotional competency|social intelligence|crystalli[sz]ed|fluid intelligence|salovey/)},
 // ---- I-11 Personality
 {s:"I-11", p:1, t:"Theories of personality: psychoanalytic, humanistic, socio-cultural, trait and type approaches; big five and 16 PF; genes and personality", re:S(/personality|big five|16 personality|five-factor|neo five|psychoanalytic|humanistic|self-defeating|childhood experiences|self-actualized|who am i/), ex:S(/personality inventories|paper-pencil|projective|psychometric tests of personality|objective tests|personality development|personality assessment|indian approach|tri-?gunas/)},
 {s:"I-11", p:1, t:"Measurement of personality: projective tests (Rorschach, TAT) and paper-pencil and objective tests", re:S(/projective|rorschach|tat tests|paper.pencil|objective tests|measuring personality/)},
 {s:"I-11", p:1, t:"Indian approach to personality (tri-gunas), the notion of self, defence mechanisms, personality development", re:S(/tri-?gunas|indian approach to personality|defen[cs]e mechanism|personality development|notion of self|narrative approach|self-efficacy/)},
 // ---- I-12 Attitudes, values and interests
 {s:"I-12", p:1, t:"Attitudes: components, formation, change, cognitive dissonance, measurement; attitude and behaviour", re:S(/attitude|dissonance|positive attitude/), ex:S(/pro-social|intergroup attitudes/)},
 {s:"I-12", p:1, t:"Values: fostering values, moral and ethical values in children", re:S(/values|moral/), ex:S(/value education|economic|entrepreneur|mass media|tv and mass media|societal values|pro-social values|fostering values/)},
 {s:"I-12", p:1, t:"Stereotypes, prejudice and discrimination; attribution theories and biases", re:S(/stereotyp|prejudice|discriminat|attribution|attributional|assign causes|biases and errors|situational factors|personal traits|defy social norms|ethnolinguistic/), ex:S(/gender discrimination|caste|disadvantaged|generalization/)},
 // ---- I-13 Language and communication
 {s:"I-13", p:1, t:"Language acquisition: critical period hypothesis, predisposition, theories of Skinner and Chomsky, transformational grammar", re:S(/language acquisition|language development|critical period|chomsky|skinner|biological predisposition|nativistic|behaviouristic perspective to language/)},
 {s:"I-13", p:1, t:"Properties, structure and hierarchy of language; speech perception; Whorfian hypothesis; bilingualism and multilingualism", re:S(/structure of language|hierarchy of language|surface and deep|whorf|bilingual|multilingual|linguistic|ethnolinguistic|speech perception|human language|language can be analy|similarities across cultures/)},
 {s:"I-13", p:1, t:"Process and types of communication; effective communication training", re:S(/communication/)},
 // ---- I-14 Issues and perspectives in modern psychology
 {s:"I-14", p:1, t:"Sleep, dreams and consciousness: REM sleep, sleep disorders, jet lag and circadian rhythm, meditation, hypnotic and drug-induced states", re:S(/sleep|dream|rem\b|consciousness|meditation|hypnot|circadian|jet.lag|psychoactive|psycho-active|drug|altered/), ex:S(/substance abuse|drug-addiction\? /)},
 {s:"I-14", p:1, t:"Stimulus deprivation and sensory deprivation", re:S(/stimulus.deprivation/)},
 {s:"I-14", p:1, t:"Computer application, artificial intelligence, psychocybernetics and simulation", re:S(/computer|artificial intelligence|psychocybernetics|simulation/), ex:S(/analogy/)},
 {s:"I-14", p:1, t:"Mental health and drug addiction as modern issues: use of AI in mental health, drug addiction", re:S(/mental health study|mental health problems|drug-addiction/)},
 // ================= PAPER II: Psychology: Issues and applications =================
 // ---- II-1 Psychological measurement of individual differences
 {s:"II-1", p:2, t:"Nature of individual differences; psychological tests as tools for assessing them", re:S(/individual differences|assessing individual|tools in assessing/)},
 {s:"II-1", p:2, t:"Construction and standardization of tests: steps, item validation, factor analysis in test construction, achievement tests, norms and percentile ranks", re:S(/construct|standardi[sz]|item validation|exploratory factor|confirmatory|norms|percentile|achievement test|psychometric scaling|norm referenced|criterion referenced|methodological issues/), ex:S(/construction of knowledge|constructing social|family norm|psychological construct/)},
 {s:"II-1", p:2, t:"Reliability and validity of psychological tests", re:S(/reliab|validity|valid\b/)},
 {s:"II-1", p:2, t:"Types of psychological tests: intelligence, aptitude, achievement and personality tests", re:S(/types of psychological tests|intelligence, aptitude|personality assessment|aptitude, and achievement|psychological tests for personality/)},
 {s:"II-1", p:2, t:"Use, misuse, limitations and ethical issues of psychological tests", re:S(/misuse|limitations of psychological tests|ethical issues|efficacy of psychological tests|limitations in the use|uses and limitations|limitations of psychological|uses of psychological tests|challenges in the development/)},
 // ---- II-2 Psychological well-being and mental disorders
 {s:"II-2", p:2, t:"Anxiety disorders and mood disorders: causes, depression, manic-depressive disorder, learned helplessness", re:S(/anxiety|mood disorder|depression|manic|learned helplessness|phobia/), ex:S(/therap.{0,30}(depress|phobia)|treat phobia|cognitive-behavioural model of depression|desensitization|to treat such patients/)},
 {s:"II-2", p:2, t:"Schizophrenia and delusional disorders: hallucinations and delusions, positive and negative symptoms", re:S(/schizophren|hallucination|delusion|psychotic/)},
 {s:"II-2", p:2, t:"Personality disorders: psychopathic, narcissistic and deviant personality", re:S(/psychopath|narcissistic|personality disorder|deviant behaviou?r|abnormal behaviour/)},
 {s:"II-2", p:2, t:"Substance abuse disorders: explanation of substance use and drug abuse", re:S(/substance (abuse|use)|drug abuse|psychological approaches/), ex:S(/rehabilitat|primary prevention|prevention programme/)},
 {s:"II-2", p:2, t:"Health, well-being and mental disorders: positive health, psychological well-being, stress and illness, lifestyle and quality of life, biological causes of disorders", re:S(/well.being|positive health|quality of life|lifestyle|biological factors explain|stress contribute|mental disorders|mental health|etiology|health/), ex:S(/defence|rehabilit|prevention|community|disadvantaged|population|biopsychosocial|therap/)},
 {s:"II-2", p:2, t:"Biopsychosocial model of health and illness", re:S(/biopsychosocial|biological, psychological and social factors/)},
 // ---- II-3 Therapeutic approaches
 {s:"II-3", p:2, t:"Psychodynamic therapies: transference, psychoanalytic methods, unresolved inner conflicts", re:S(/psychodynamic|psychoanalyt|transference|unconscious motives|inner conflicts|psycho-dynamic/)},
 {s:"II-3", p:2, t:"Behaviour therapies: systematic desensitization, reciprocal inhibition, assertive coping, techniques to treat phobia", re:S(/behaviou?r therap|desensiti|reciprocal inhibition|assertive coping|behavioural approaches to treat/)},
 {s:"II-3", p:2, t:"Client-centred therapy: incongruence, directional and non-directional therapies", re:S(/client.cent|person.cent|incongruence|non-directional|directional/)},
 {s:"II-3", p:2, t:"Cognitive and cognitive-behavioural therapies: Ellis' REBT, ABCD model", re:S(/cognitive therap|rational emotive|ellis|abcd|cognitive-behavioural|behavioural cognitive|cognitive therapy/)},
 {s:"II-3", p:2, t:"Indigenous therapies, biofeedback, eclectic approach and spontaneous remission", re:S(/indigenous therap|biofeedback|eclectic|spontaneous remission|yoga|single form of therapy/)},
 {s:"II-3", p:2, t:"Prevention and fostering of mental health; comparing therapies and psychological treatment", re:S(/prevention of mental|therapeutic|therapies|psychological treatment|treatment of (psychological|patients)|mental health care|culturally sensitive/), ex:S(/rehabilitation programmes|substance|primary prevention programme|domestic violence/)},
 // ---- II-4 Work psychology and organisational behaviour
 {s:"II-4", p:2, t:"Personnel selection and training: psychological tests in selection, executive training, HRD and competency mapping", re:S(/personnel selection|selection of|employee selection|training methods|learning and training|competency mapping|human resource|selection and training|process of infusion/)},
 {s:"II-4", p:2, t:"Theories of work motivation: Herzberg, Maslow, Vroom, and work motivation in India", re:S(/motivation come from within|herzberg|work.motivation|work motivation|vroom|maslow|equity theory|porter and lawler/)},
 {s:"II-4", p:2, t:"Leadership and participatory management: theories of leadership, transformational leaders, managerial effectiveness, norm crystallization", re:S(/leader|participatory management|managerial effectiveness|transactional|norm crystallization|citizenship behaviour/)},
 {s:"II-4", p:2, t:"Stress management, ergonomics, sensitivity training, power and politics, group decision-making in organisations", re:S(/stress and its management|manage stress|ergonomics|sensitivity training|power and politics|political behaviour in organi|power in organi|group decision-making over|decisions made by individuals|organizational development/)},
 {s:"II-4", p:2, t:"Advertising, marketing and consumer psychology; diversity in organisations; IT and mass media on work-life", re:S(/advertis|marketing|consumer|diversity in today|work-life|multiculturalism|impulsive buying|organizational environment/), ex:S(/consumer rights/)},
 // ---- II-5 Application of psychology to educational field
 {s:"II-5", p:2, t:"Effective teaching-learning process: psychological principles, collaborative construction of knowledge, learning styles, online learning", re:S(/teaching.learning|learning styles|online learning|distance learning|classroom structure/), ex:S(/distance learning through it/)},
 {s:"II-5", p:2, t:"Gifted, retarded and learning disabled children: identification, training, dyslexia, early intervention", re:S(/gifted|learning disabilit|dyslexia|retarded|intellectually challenged|early identification/)},
 {s:"II-5", p:2, t:"Academic achievement and memory training; study habits; personality development and value education", re:S(/academic|study|value education|personality development of children|wellbeing curriculum|memory development|school dropouts|motivational level and aspirations/), ex:S(/disadvantaged|deprived|achievement motivation/)},
 {s:"II-5", p:2, t:"Educational and vocational guidance, career counselling and guidance programmes; psychological tests in education", re:S(/vocational guidance|career counsel|guidance programme|educational settings|out of school|competitive examinations/)},
 // ---- II-6 Community psychology
 {s:"II-6", p:2, t:"Concept of community psychology: skills of the community psychologist, community mental health, revolving door, diversity as a core value", re:S(/community psycholog|community mental|revolving door|community based|core value|community-based/)},
 {s:"II-6", p:2, t:"Use of small groups in social action; community consciousness and action for social problems", re:S(/small groups|community consciousness|collective consciousness|role of the community|community in handling|community play|community members as leaders/)},
 {s:"II-6", p:2, t:"Group decision making and leadership for social change", re:S(/group decision.{0,30}social change|leaders for social change|leaders will be effective in bringing about social change|decision making for social change|leadership for social change/)},
 {s:"II-6", p:2, t:"Strategies for social change: first-order and second-order change, top-down and bottom-up approaches, empowering marginalised communities", re:S(/social change|first-order|second-order|top-down|empowering|marginali[sz]ed communit|positive social change/), ex:S(/necessary|effective strategies to bring about/)},
 {s:"II-6", p:2, t:"Strategies for social change: why social change is necessary and effective strategies for community development", re:S(/why is social change necessary|strategies to bring about social change|handling social problems|community development/)},
 // ---- II-7 Rehabilitation psychology
 {s:"II-7", p:2, t:"Prevention programmes: primary, secondary and tertiary prevention and the role of psychologists", re:S(/primary prevention|tertiary|prevention programme|secondary prevention/)},
 {s:"II-7", p:2, t:"Rehabilitation of the physically, mentally and socially challenged, including old persons and senior citizens", re:S(/rehabilitation of (the )?(mentally|intellectually)|mentally challenged|mentally ill|senior citizens|aged having|old persons|\baging|\bageing|socially challenged|rehabilitation of mentally/)},
 {s:"II-7", p:2, t:"Rehabilitation of substance abusers, juvenile delinquents and criminals; criminal behaviour; re-integration of ex-offenders", re:S(/substance abuse|juvenile|delinquen|criminal|ex-offenders|crime/), ex:S(/psychological approaches to substance/)},
 {s:"II-7", p:2, t:"Rehabilitation of victims of violence and of HIV/AIDS patients; role of social agencies; violence and displacement", re:S(/victims of violence|domestic violence|hiv|aids|social agencies|forced to leave their homeland|violence/), ex:S(/violent behaviour|aggression/)},
 {s:"II-7", p:2, t:"Prevention and rehabilitation in mental health care; rehabilitation of mentally ill youth", re:S(/prevention and rehabilitation|rehabilitation of mentally ill|rehabilitation programmes/), ex:S(/information technology|technology/)},
 // ---- II-8 Application of psychology to disadvantaged groups
 {s:"II-8", p:2, t:"Disadvantage and deprivation: concepts, social, cultural and economic consequences of being disadvantaged", re:S(/disadvantaged|deprivation|deprived|capability|disadvantage is related/), ex:S(/relative deprivation|motivat|educat|school dropouts|defence/)},
 {s:"II-8", p:2, t:"Relative and prolonged deprivation", re:S(/relative deprivation|prolonged deprivation|relative and prolonged/), ex:S(/defence/)},
 {s:"II-8", p:2, t:"Educating and motivating the disadvantaged towards development: tribal education, school dropouts, vulnerable children", re:S(/educating and motivating|motivating students belonging|tribal communities|school dropouts|motivate disadvantaged|disadvantaged groups to move|vulnerable children|needs of disadvantaged children|educating and motivat|tribal people|educational failure/)},
 // ---- II-9 Psychological problems of social integration
 {s:"II-9", p:2, t:"Social integration: concept and measures to achieve it, cultural assimilation, religious harmony", re:S(/social integration|religious groups|religion|assimilation|communal/)},
 {s:"II-9", p:2, t:"Prejudice and conflict between in-group and out-group: caste prejudice, newer forms of prejudice, categorization, crossed categorization", re:S(/prejudice|in-group|out-group|categori[sz]ation|caste|discrimination|frustration-aggression|stereotyp|intergroup/), ex:S(/gender|sex-role|social media|attitudes? in the media/)},
 {s:"II-9", p:2, t:"Psychological strategies for handling conflicts: social conflicts and their resolution", re:S(/conflict/), ex:S(/prejudice and discrimination|ethnolinguistic/)},
 {s:"II-9", p:2, t:"Group membership, groups and social behaviour; social facilitation and inhibition", re:S(/group membership|social facilitation|social inhibition|group processes|intergroup/)},
 // ---- II-10 Application of psychology in IT and mass media
 {s:"II-10", p:2, t:"Information technology and mass media: role of psychologists, social media, internet addiction, digital media, television and adolescents", re:S(/information technology|\bit and mass|managing it\b|through it\b|internet|social media|smartphone|media|television|digital|\btv\b|pornograph|technology/), ex:S(/pro-social|anti-social|antisocial|aggressi|degradation of environment|negative impact of technological|rapid scientific|technological growth are|advertis|defence|computer/)},
 {s:"II-10", p:2, t:"Distance learning through IT; e-commerce and multilevel marketing", re:S(/distance learning|multilevel marketing|e-commerce|multi-level/)},
 {s:"II-10", p:2, t:"Fostering values and positivity through mass media; media and emotional health", re:S(/fostering (societal )?values|value development|pro-social values|spreading positivity|values and cognition|emotional health and values|values cannot be fostered/)},
 // ---- II-11 Psychology and economic development
 {s:"II-11", p:2, t:"Achievement motivation and economic development", re:S(/achievement motivation|economic development|child rearing practices/)},
 {s:"II-11", p:2, t:"Entrepreneurial behaviour: characteristics, motivating and training people for entrepreneurship, women entrepreneurship, government policies", re:S(/entrepreneur/)},
 {s:"II-11", p:2, t:"Consumer rights and consumer awareness; Skill India and economic development", re:S(/consumer rights|consumer awareness|skill india|economic.{0,10}psychological conceptuali|psychological conceptualization/)},
 // ---- II-12 Application of psychology to environment and related fields
 {s:"II-12", p:2, t:"Environmental psychology: noise, pollution and crowding", re:S(/noise|pollution|crowd|population density|density/)},
 {s:"II-12", p:2, t:"Population psychology: population explosion, small family norm, population control", re:S(/population|small family|family norm|family size/), ex:S(/high population density area|crowding/)},
 {s:"II-12", p:2, t:"Impact of rapid scientific and technological growth on degradation of the environment; pro-environmental behaviour", re:S(/degradation|biodiversity|environmental|pro-environmental|technological growth|technology.{0,20}environment|excessive use of technology/), ex:S(/environmental intervention/)},
 // ---- II-13 Application of psychology in other fields
 {s:"II-13", p:2, t:"Military psychology: defence personnel, selection, positive health, human engineering and man-machine systems in defence", re:S(/defen[cs]e|human engineering|man-machine|security personnel|border areas|aircraft/)},
 {s:"II-13", p:2, t:"Sports psychology: performance of athletes, team cohesion and psychological interventions in sport", re:S(/athlete|sport|hockey|team cohesion|team spirit|team games|cohesiveness|group cohesion/)},
 {s:"II-13", p:2, t:"Media influences on pro-social and anti-social behaviour: aggression, violence and erotica", re:S(/anti-?social|pro-?social|aggressive|violent behaviour|erotica|exposure to erotica/), ex:S(/prejudice|attitudes?\b.{0,20}individual/)},
 {s:"II-13", p:2, t:"Psychology of terrorism: radicalization, the terrorist profile, ideology", re:S(/terroris|radicali[sz]ation|extremis/)},
 // ---- II-14 Psychology of gender
 {s:"II-14", p:2, t:"Gender discrimination and diversity: gender differences, gender socialization, gender schema, gender diversity, management of diversity", re:S(/gender|sex-role|sexual harassment|management of diversity/), ex:S(/glass ceiling|self-fulfilling|self-fulfilling|core value for a community/)},
 {s:"II-14", p:2, t:"Glass ceiling effect and women in the Indian workforce", re:S(/glass ceiling/)},
 {s:"II-14", p:2, t:"Self-fulfilling prophecy; women and Indian society: Beti Bachao Beti Padhao, women's safety, women entrepreneurs", re:S(/self.fulfilling|women|beti bachao|girl child|crime against women/), ex:S(/entrepreneur|glass ceiling|gender discrimination/)},
 // ---- fallback topics (used only for a question no other topic claims)
];
module.exports = LIST;
