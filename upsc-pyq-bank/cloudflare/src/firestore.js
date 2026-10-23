// Tiny Firestore adapter over Google's REST API, shaped like the bits of firebase-admin that lib.js uses:
//   db.doc(path)  and  db.runTransaction(async (tx) => { await tx.get(ref); tx.set(ref, data, {merge}) })
function encode(v) {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  throw new Error("unsupported value");
}
function decode(f) {
  if ("stringValue" in f) return f.stringValue;
  if ("booleanValue" in f) return f.booleanValue;
  if ("integerValue" in f) return Number(f.integerValue);
  if ("doubleValue" in f) return f.doubleValue;
  return null;
}

export function makeDb({ project, getToken, fetchFn }) {
  const doFetch = fetchFn || ((...a) => fetch(...a));
  const root = "projects/" + project + "/databases/(default)/documents";
  const base = "https://firestore.googleapis.com/v1/" + root;
  async function call(method, url, body) {
    return doFetch(url, { method, headers: { Authorization: "Bearer " + (await getToken()), "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  }
  return {
    doc: (path) => ({ path }),
    async runTransaction(fn) {
      for (let attempt = 0; attempt < 5; attempt++) {
        const b = await call("POST", base + ":beginTransaction", {});
        if (!b.ok) throw new Error("database unavailable");
        const txId = (await b.json()).transaction;
        const writes = [];
        const tx = {
          async get(ref) {
            const r = await call("GET", base + "/" + ref.path + "?transaction=" + encodeURIComponent(txId));
            if (r.status === 404) return { exists: false, data: () => undefined };
            if (!r.ok) throw new Error("database read failed");
            const fields = (await r.json()).fields || {};
            const data = {}; Object.keys(fields).forEach((k) => { data[k] = decode(fields[k]); });
            return { exists: true, data: () => data };
          },
          set(ref, data, opts) {
            const fields = {}; Object.keys(data).forEach((k) => { fields[k] = encode(data[k]); });
            const w = { update: { name: root + "/" + ref.path, fields } };
            if (opts && opts.merge) w.updateMask = { fieldPaths: Object.keys(data) };
            writes.push(w);
          }
        };
        const out = await fn(tx);
        const c = await call("POST", base + ":commit", { transaction: txId, writes });
        if (c.ok) return out;
        if (c.status === 409) continue;   // someone else wrote at the same moment: run again from the top
        throw new Error("database write failed");
      }
      throw new Error("database is busy, try again");
    }
  };
}
