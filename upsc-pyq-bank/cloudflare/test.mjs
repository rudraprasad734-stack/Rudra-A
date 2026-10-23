// End-to-end test of the Worker with fake Google, Firestore and Razorpay (no network): npm test
import crypto from "node:crypto";
import worker from "./src/worker.js";

let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const PROJECT = "demo-proj";
const b64u = (b) => Buffer.from(b).toString("base64url");

// keys: one for the "service account", one for Google's Firebase token signing
const sa = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const gk = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const SA = JSON.stringify({ client_email: "svc@demo.iam", private_key: sa.privateKey.export({ type: "pkcs8", format: "pem" }) });
const jwk = Object.assign(gk.publicKey.export({ format: "jwk" }), { kid: "k1", alg: "RS256", use: "sig" });
function idToken(uid, over) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64u(JSON.stringify({ alg: "RS256", kid: "k1", typ: "JWT" }));
  const p = b64u(JSON.stringify(Object.assign({ iss: "https://securetoken.google.com/" + PROJECT, aud: PROJECT, sub: uid, iat: now - 5, exp: now + 3600 }, over || {})));
  const s = crypto.sign("sha256", Buffer.from(h + "." + p), gk.privateKey);
  return h + "." + p + "." + b64u(s);
}

// fake network
const docs = {}, orders = {}, payments = {}; let txs = 0, conflictOnce = false, saTokenCalls = 0;
const toObj = (fields) => { const o = {}; for (const k in fields) { const f = fields[k]; o[k] = "stringValue" in f ? f.stringValue : "booleanValue" in f ? f.booleanValue : "integerValue" in f ? Number(f.integerValue) : f.doubleValue; } return o; };
const fromObj = (o) => { const f = {}; for (const k in o) f[k] = typeof o[k] === "string" ? { stringValue: o[k] } : typeof o[k] === "boolean" ? { booleanValue: o[k] } : { integerValue: String(o[k]) }; return f; };
const R = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
globalThis.fetch = async (url, init) => {
  url = String(url); const m = (init && init.method) || "GET"; const body = init && init.body;
  if (url.startsWith("https://oauth2.googleapis.com/token")) {
    saTokenCalls++;
    const jwt = new URLSearchParams(body).get("assertion").split(".");
    const good = crypto.verify("sha256", Buffer.from(jwt[0] + "." + jwt[1]), sa.publicKey, Buffer.from(jwt[2], "base64url"));
    return good ? R(200, { access_token: "tok" }) : R(401, {});
  }
  if (url.includes("securetoken@system.gserviceaccount.com")) return R(200, { keys: [jwk] });
  if (url.startsWith("https://firestore.googleapis.com/")) {
    if (!(init.headers.Authorization === "Bearer tok")) return R(401, {});
    if (url.endsWith(":beginTransaction")) return R(200, { transaction: "tx" + (++txs) });
    if (url.endsWith(":commit")) {
      if (conflictOnce) { conflictOnce = false; return R(409, {}); }
      for (const w of JSON.parse(body).writes) {
        const path = w.update.name.split("/documents/")[1];
        const data = toObj(w.update.fields);
        docs[path] = w.updateMask ? Object.assign({}, docs[path] || {}, data) : data;
      }
      return R(200, {});
    }
    const path = decodeURIComponent(url.split("/documents/")[1].split("?")[0]);
    return path in docs ? R(200, { fields: fromObj(docs[path]) }) : R(404, {});
  }
  if (url.startsWith("https://api.razorpay.com/v1")) {
    const path = url.replace("https://api.razorpay.com/v1", ""); const b = body ? JSON.parse(body) : {};
    if (m === "POST" && path === "/orders") { const id = "order_" + Object.keys(orders).length; orders[id] = { id, amount: b.amount, currency: b.currency, notes: b.notes }; return R(200, orders[id]); }
    let x = /^\/orders\/(.+)$/.exec(path); if (x) return R(200, orders[x[1]]);
    x = /^\/payments\/(.+)$/.exec(path); if (x) return R(200, payments[x[1]]);
  }
  throw new Error("unexpected fetch " + m + " " + url);
};

const env = { FIREBASE_PROJECT: PROJECT, FIREBASE_SERVICE_ACCOUNT: SA, RAZORPAY_KEY_ID: "rzp_test_x", RAZORPAY_KEY_SECRET: "sec", RAZORPAY_WEBHOOK_SECRET: "hook" };
const call = (path, body, token, origin) => worker.fetch(new Request("https://pay.example" + path, { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: "Bearer " + token } : {}, origin ? { Origin: origin } : {}), body: JSON.stringify(body || {}) }), env);
const sig = (o, p) => crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(o + "|" + p).digest("hex");

let r = await call("/config", {}, null, "https://csecompanion.in");
let j = await r.json();
ok(r.status === 200 && j.amount === 29900 && j.keyId === "rzp_test_x", "config returns price and key id");
ok(r.headers.get("Access-Control-Allow-Origin") === "https://csecompanion.in", "CORS allows the website");
r = await call("/config", {}, null, "https://evil.example");
ok(!r.headers.get("Access-Control-Allow-Origin"), "CORS refuses other sites");
r = await worker.fetch(new Request("https://pay.example/config", { method: "OPTIONS", headers: { Origin: "https://csecompanion.in" } }), env);
ok(r.status === 204, "preflight answered");

r = await call("/order", {}, null);
ok(r.status === 401, "order without sign-in is refused");
r = await call("/order", {}, idToken("alice", { exp: 1 }));
ok(r.status === 401, "expired token refused");
r = await call("/order", {}, idToken("alice", { aud: "other" }));
ok(r.status === 401, "token for another project refused");
const forged = idToken("alice").split("."); forged[1] = b64u(JSON.stringify({ iss: "https://securetoken.google.com/" + PROJECT, aud: PROJECT, sub: "mallory", iat: 1, exp: 9999999999 }));
r = await call("/order", {}, forged.join("."));
ok(r.status === 401, "forged token refused");

r = await call("/order", {}, idToken("alice"));
j = await r.json();
ok(r.status === 200 && j.orderId === "order_0", "order created for signed-in person");
payments.pay_1 = { id: "pay_1", order_id: "order_0", status: "captured", amount: 29900 };

r = await call("/verify", { orderId: "order_0", paymentId: "pay_1", signature: "bad" }, idToken("alice"));
ok(r.status === 400, "bad signature refused");
r = await call("/verify", { orderId: "order_0", paymentId: "pay_1", signature: sig("order_0", "pay_1") }, idToken("bob"));
ok(r.status === 400, "someone else's order refused");
conflictOnce = true;
r = await call("/verify", { orderId: "order_0", paymentId: "pay_1", signature: sig("order_0", "pay_1") }, idToken("alice"));
j = await r.json();
ok(r.status === 200 && j.paidUntil > Date.now() + 364 * 86400000, "good payment grants a year (retried after a write conflict)");
ok(docs["entitlements/alice"] && docs["entitlements/alice"].paidUntil === j.paidUntil && docs["payments/pay_1"].uid === "alice", "entitlement and payment saved in Firestore");
r = await call("/verify", { orderId: "order_0", paymentId: "pay_1", signature: sig("order_0", "pay_1") }, idToken("alice"));
j = await r.json();
ok(j.paidUntil === docs["entitlements/alice"].paidUntil, "same payment twice adds nothing");

// webhook: payment whose browser never came back
r = await call("/order", {}, idToken("carol")); j = await r.json();
payments.pay_2 = { id: "pay_2", order_id: j.orderId, status: "captured", amount: 29900 };
const hookBody = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: payments.pay_2 } } });
const hook = (b, s) => worker.fetch(new Request("https://pay.example/razorpayWebhook", { method: "POST", headers: { "x-razorpay-signature": s }, body: b }), env);
r = await hook(hookBody, "nope");
ok(r.status === 400, "webhook with wrong signature refused");
r = await hook(hookBody, crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(hookBody).digest("hex"));
ok(r.status === 200 && docs["entitlements/carol"] && docs["entitlements/carol"].paidUntil > Date.now(), "webhook grants the year");
const refundBody = JSON.stringify({ event: "refund.processed", payload: { refund: { entity: { payment_id: "pay_2" } } } });
r = await hook(refundBody, crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(refundBody).digest("hex"));
ok(r.status === 200 && docs["entitlements/carol"].paidUntil < Date.now(), "refund takes the year back");
ok(saTokenCalls === 1, "server token fetched once and reused");
r = await call("/nope", {}, null);
ok(r.status === 404, "unknown path 404");
r = await worker.fetch(new Request("https://pay.example/config"), env);
ok(r.status === 405, "GET refused");

console.log(fails ? fails + " FAILED" : "ALL PASSED"); process.exit(fails ? 1 : 0);
