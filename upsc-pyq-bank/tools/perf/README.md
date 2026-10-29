# Launch performance

`build-tiercache.js` precomputes the per-chapter question counts that decide each chapter's tier and embeds them in
`page/index.html` (`<script type="application/json" id="d-tiercache">`). Without it a brand-new install spent ~2 s (on a
slow phone) counting matches on first launch. **Re-run it whenever the question bank or syllabus data in index.html changes**:

    node tools/perf/build-tiercache.js     # needs Playwright and Chromium

If you forget, nothing breaks: the stored fingerprint no longer matches, so the app computes the counts itself (slower first launch only).

Other launch-time choices in index.html: the animated timer background starts after the first screen is drawn, the question index warms
up ~0.9 s after launch in small slices, and every chapter's matching questions are worked out in the background so the Tiers tab opens instantly.

`build-tiercache.js` also writes `d-tdcache`: the tier and Pre/Mains counts for every chapter of every subject (keyed by a short hash of the chapter id),
which Today's plan in the timer dropdown and the tier badges in the Planner read so they open at once. It is checked against the same fingerprint plus the sizes of the link map and question map,
and `__tdBuild()` in index.html makes it. **Re-run the same command whenever the question bank, link map or question map changes.** If you forget, the dropdown still works:
it shows a short placeholder and fills in once the background counting has finished.
