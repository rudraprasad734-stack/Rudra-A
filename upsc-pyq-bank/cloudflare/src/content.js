// Content key: hands out the key that unlocks the encrypted question bank, only to a signed-in person whose
// trial or paid year is still running. The trial clock lives here (trials/<uid>), so clearing the browser does not restart it.
const DAY = 86400000, TRIAL_DAYS = 14;
const fail = (status, message, extra) => { const e = new Error(message); e.status = status; e.extra = extra; return e; };
const hex = (s) => Uint8Array.from(s.match(/../g).map((h) => parseInt(h, 16)));
const b64 = (buf) => Buffer.from(buf).toString("base64");

export async function deriveKey(master, version) {
  if (!/^[0-9a-f]{64}$/i.test(String(master || ""))) throw fail(503, "The content lock is not set up yet.");
  const k = await crypto.subtle.importKey("raw", hex(master), "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: new Uint8Array(32), info: new TextEncoder().encode("cse-content-v" + version) }, k, 256);
  return b64(bits);
}

async function sha(text) { return Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))).toString("hex"); }

// db: {doc, runTransaction}; playExpiry(token) -> expiry in ms (0 when not a live subscription)
export async function contentKey({ env, uid, db, body, now, playExpiry }) {
  const version = Math.max(1, parseInt(env.CONTENT_KEY_VERSION, 10) || 1);
  let until = 0, via = "";
  const ent = await db.runTransaction((tx) => tx.get(db.doc("entitlements/" + uid)));
  const paid = ent.exists ? +ent.data().paidUntil || 0 : 0;
  if (paid > now) { until = paid; via = "web"; }
  const ptoken = String((body && body.playToken) || "");
  if (!until && ptoken && /^[\w.\-]{20,2000}$/.test(ptoken)) {
    const exp = await playExpiry(ptoken);
    if (exp > now) {
      const ref = db.doc("playtokens/" + await sha(ptoken));
      const owner = await db.runTransaction(async (tx) => { const d = await tx.get(ref); if (d.exists) return d.data().uid; tx.set(ref, { uid, at: now }); return uid; });
      if (owner === uid) { until = exp; via = "play"; }   // one Google Play purchase unlocks one account
    }
  }
  if (!until) {
    const ref = db.doc("trials/" + uid);
    const hint = +(body && body.trialStart) || 0;   // an existing trial keeps its real start; a claimed start can only shorten a trial, never extend it
    const start = await db.runTransaction(async (tx) => {
      const d = await tx.get(ref);
      if (d.exists) return +d.data().start || now;
      const s = hint > 0 && hint < now ? hint : now;
      tx.set(ref, { start: s });
      return s;
    });
    const end = start + TRIAL_DAYS * DAY;
    if (end > now) { until = end; via = "trial"; }
  }
  if (!until) throw fail(402, "Your trial has ended. Subscribe to continue.", { locked: true });
  return { key: await deriveKey(env.CONTENT_MASTER, version), until, via, v: version };
}
