# Locked question bank

The question bank, notes, daily news and quizzes are published only as encrypted files. The decryption key is held by the payment server and handed out
(`POST /contentKey`) only to a signed-in person whose 14-day trial (started on the server), paid year, or Google Play subscription is live.
The app keeps the key on the device, so it still works offline until the trial or year ends, and renews it quietly while online.

## Pieces
- `lock.mjs` turns the full page plus the daily/quiz/crux folders into the locked site (`node lock.mjs <index.html> <outDir> <64-hex master> [keyVersion]`).
- `boot.js` is the start-up gate inserted into the locked page (sign-in, payment, key, decrypt, then it starts the app).
- `../cloudflare/src/content.js` is the server side (key derivation HKDF-SHA-256 from the master secret, trial and entitlement checks).
- `workflows/publish.yml` goes in the private source repo and publishes the locked site into the public repo.

## Cut-over (once)
1. Generate the master key: `openssl rand -hex 32`. Save it in a password manager AND an offline copy. If it is lost the data cannot be opened.
2. Public repo secret `CONTENT_MASTER` = that key; then run "Deploy payment server" (this sets it on the Worker).
3. Create the private repo (e.g. `cse-companion-source`). Copy this repo's `upsc-pyq-bank/` and `.github/workflows/publish.yml` (from `workflows/`) into it. Add secrets `CONTENT_MASTER` (same key) and `PUBLIC_REPO_TOKEN` (fine-grained token, only the public repo, Contents read/write).
4. Run "Lock and publish" in the private repo. The public repo then holds only the locked page and `.bin` files.
5. Optionally purge old plain copies from the public repo history (force-push rewrite). Anything published earlier must be treated as already exposed.

## Rotating the key
Change the master, bump the key version (`CONTENT_KEY_VERSION` on the Worker and the last argument of `lock.mjs`), publish. Everyone fetches the new key when online.
