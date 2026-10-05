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

For another optional subject, copy `anthropology.topics.js`, change the topics, and point the builder at the new subject (the screen already takes its data from `d-anthro`; a subject picker is the next step).
