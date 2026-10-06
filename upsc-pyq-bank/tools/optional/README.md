# Optional-subject analysis

Turns the past-question bank plus the syllabus into the searchable topic/tier list on the **Tiers → Optional** screen.

1. Past papers go into the question bank (`<script id="d-bank">` in `page/index.html`), one record per paper and year, `exam: "optional"`.
2. `anthropology.items.js` holds the official syllabus items (the true syllabus, copied from the UPSC Examination Notice; full text for every subject is in `../syllabus/official-2026/`) and says which item each sub-topic belongs to. `anthropology.topics.js` lists the finer sub-topics. Each topic has a keyword pattern (`re`, optionally `re2` for Paper II and `ex` to leave things out).
3. Run `node upsc-pyq-bank/tools/optional/build-optional.js`. It files every question under the topics it tests and writes the result into `<script id="d-anthro">`.
   - `--check` prints the report without writing.
   - `--topics` prints hits and years per topic.
   - `--q an94` lists the questions filed under one topic, to spot wrong matches.
4. The report must show **0 unmatched questions**, no topic without an official item and no official item without a sub-topic. A sub-topic with no past question is fine (it is then shown as never asked). If a new paper leaves a question unmatched, add a keyword or a topic and run again.
5. Tiers and trends are not stored; the app works them out from the lists (years asked out of all exam years, last 5 years against earlier ones), so they update when papers are added.
6. Bump `CACHE_NAME` in `page/sw.js` when you publish.

## Thumb rule: optional and General Studies are never mixed

An optional subject is always its own subject in the app, named `<Subject> (Optional)` (for example `Agriculture (Optional)`), even when a General Studies subject has the same name (History, Geography, Agriculture). Their chapters, ticks, progress, sessions and questions are kept apart everywhere: an optional chapter only ever shows questions from the optional papers, and a General Studies chapter never shows an optional question. Saved plans made before this rule are renamed once by `migrateOptionalSeparation()` in `page/index.html`.

## Adding an optional subject (the Agriculture folder is the worked example)

The **Tiers → Optional** screen, the Syllabus screen, the Planner chapters, the PYQ Bank and the Dashboard card all read from the registry `OPT_SUBJECTS` in `page/index.html`, so a new subject needs data, not code:

1. Put the question text in `<subject>/questions.txt` (one part per line: `year|paper|qno|marks|text`; `#PREFIX|year|paper|q|text` gives the instruction printed above a question). Scanned papers are read with OCR and every page is checked against the image. The builder refuses a paper whose questions do not add up to 50 marks each.
2. `<subject>/items.js` = the official syllabus paragraphs (word for word, from `../syllabus/official-2026/`), `<subject>/topics.js` = the sub-topics with their keyword patterns.
3. `node upsc-pyq-bank/tools/optional/<subject>/build-<subject>.js` writes the papers into the question bank (`d-bank`) and the analysis into `<script id="d-<subject>">`. Same rules as above: 0 unmatched questions, every item has a sub-topic.
4. `node upsc-pyq-bank/tools/optional/build-planner.js` writes the Planner chapters and the chapter-to-topic map; `node upsc-pyq-bank/tools/gs/build-gs.js` writes the official wording and frequency badges on the Syllabus screen.
5. Add the subject to `OPT_SUBJECTS` (and `OPT_PLAN_V` if an earlier plan may hold other chapters for it) and bump `CACHE_NAME` in `page/sw.js`.

Done so far: Anthropology (2010-2026, 922 questions, 55 official items, 135 sub-topics) and Agriculture (2014-2026, 750 questions, 17 official paragraphs, 105 sub-topics). `agriculture-official-links.md` lists UPSC's own PDFs for the Agriculture papers.

Animal Husbandry and Veterinary Science (`animal-husbandry/`, 2014-2026, 776 questions, 50 official paragraphs numbered by UPSC, 137 sub-topics): the questions were read from the bilingual scans through Drive's text extraction (and from page screenshots where the extraction stopped at a black gap). Only Paper I 2022 is still missing. Add it to `questions.txt` and run `build-ahvs.js`, then `build-planner.js` and `../gs/build-gs.js`.
