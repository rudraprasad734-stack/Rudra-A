# Launch performance

`build-tiercache.js` precomputes the per-chapter question counts that decide each chapter's tier and embeds them in
`page/index.html` (`<script type="application/json" id="d-tiercache">`). Without it a brand-new install spent ~2 s (on a
slow phone) counting matches on first launch. **Re-run it whenever the question bank or syllabus data in index.html changes**:

    node tools/perf/build-tiercache.js     # needs Playwright and Chromium

If you forget, nothing breaks: the stored fingerprint no longer matches, so the app computes the counts itself (slower first launch only).

Other launch-time choices in index.html: the animated timer background starts after the first screen is drawn, the question index warms
up ~0.9 s after launch in small slices, and every chapter's matching questions are worked out in the background so the Tiers tab opens instantly.
