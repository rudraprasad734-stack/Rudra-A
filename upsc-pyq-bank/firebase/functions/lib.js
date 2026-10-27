// Payment logic for CSE Companion web subscriptions (Razorpay, one payment = one year).
// Kept free of Firebase/Razorpay imports so it can be tested with fakes: see test.js
"use strict";
const crypto = require("crypto");

const DAY = 86400000;

function makeApi(deps) {
  const { db, verifyIdToken, rzp, env, now } = deps;
  // Razorpay's minimum is 100 paise (₹1); anything lower is a configuration mistake, so refuse rather than create a broken order
  const price = () => { const v = +env.PRICE_PAISE || 29900; if (!(v >= 100)) throw httpError(500, "Price is not configured correctly."); return v; };
  const days = () => +env.PERIOD_DAYS || 365;
  const clock = now || Date.now;
  // a signing secret that is missing or empty would let anyone forge a signature: refuse to run instead
  const secret = (name) => { const v = env[name]; if (typeof v !== "string" || !v.trim()) throw httpError(500, "Payments are not configured."); return v; };
  // best-effort limit per person (kept in memory, so it holds per server instance): stops one account from flooding Razorpay with orders
  const hits = new Map();
  function throttle(key, max, windowMs) {
    const t = clock(); const h = (hits.get(key) || []).filter((x) => t - x < windowMs);
    if (h.length >= max) throw httpError(429, "Too many attempts. Please wait a few minutes and try again.");
    h.push(t); hits.set(key, h);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.length || t - v[v.length - 1] >= windowMs) hits.delete(k);
  }

  async function grant(uid, paymentId, amount) {
    const entRef = db.doc("entitlements/" + uid);
    const payRef = db.doc("payments/" + paymentId);
    return db.runTransaction(async (tx) => {
      const p = await tx.get(payRef);
      const e = await tx.get(entRef);
      const cur = e.exists ? +e.data().paidUntil || 0 : 0;
      if (p.exists) return { paidUntil: cur, duplicate: true };
      const t = clock();
      const until = Math.max(t, cur) + days() * DAY;
      tx.set(payRef, { uid, amount, grantedAt: t, refunded: false });
      tx.set(entRef, { paidUntil: until, source: "razorpay", updatedAt: t, lastPaymentId: paymentId }, { merge: true });
      return { paidUntil: until, duplicate: false };
    });
  }

  async function revoke(paymentId) {
    const payRef = db.doc("payments/" + paymentId);
    return db.runTransaction(async (tx) => {
      const p = await tx.get(payRef);
      // a refund that arrives before the payment was recorded is remembered, so the payment cannot give a year afterwards
      if (!p.exists) { tx.set(payRef, { uid: null, amount: 0, grantedAt: 0, refunded: true }); return { revoked: false, early: true }; }
      if (p.data().refunded) return { revoked: false };
      const uid = p.data().uid;
      const entRef = db.doc("entitlements/" + uid);
      const e = await tx.get(entRef);
      const cur = e.exists ? +e.data().paidUntil || 0 : 0;
      tx.set(payRef, { refunded: true }, { merge: true });
      tx.set(entRef, { paidUntil: Math.max(0, cur - days() * DAY), updatedAt: clock() }, { merge: true });
      return { revoked: true, uid };
    });
  }

  function hmac(secret, text) {
    return crypto.createHmac("sha256", secret).update(text).digest("hex");
  }
  function same(a, b) {
    const x = Buffer.from(String(a)), y = Buffer.from(String(b));
    return x.length === y.length && crypto.timingSafeEqual(x, y);
  }

  async function authUid(req) {
    const h = (req.headers && (req.headers.authorization || req.headers.Authorization)) || "";
    const m = /^Bearer (.+)$/.exec(h);
    if (!m) throw httpError(401, "Please sign in first.");
    try { return (await verifyIdToken(m[1])).uid; } catch (e) { throw httpError(401, "Please sign in again."); }
  }
  function httpError(status, message) { const e = new Error(message); e.status = status; return e; }

  // POST /config  -> what the Pay button needs to show
  async function config() {
    return { keyId: env.RAZORPAY_KEY_ID, amount: price(), currency: "INR", days: days() };
  }

  // POST /order  -> creates a Razorpay order for the signed-in person
  async function order(req) {
    const uid = await authUid(req);
    throttle("order:" + uid, 8, 10 * 60000);
    const o = await rzp("POST", "/orders", {
      amount: price(), currency: "INR", payment_capture: 1,
      receipt: ("cse_" + uid.slice(0, 16) + "_" + clock()).slice(0, 40),
      notes: { uid, product: "cse_companion_yearly" }
    });
    return { orderId: o.id, amount: o.amount, currency: o.currency, keyId: env.RAZORPAY_KEY_ID };
  }

  // POST /verify {orderId, paymentId, signature} -> checks the payment really happened, then adds a year
  async function verify(req) {
    const uid = await authUid(req);
    throttle("verify:" + uid, 20, 10 * 60000);
    const b = req.body || {};
    if (typeof b.orderId !== "string" || typeof b.paymentId !== "string" || typeof b.signature !== "string" || !b.orderId || !b.paymentId || !b.signature || b.orderId.length > 64 || b.paymentId.length > 64) throw httpError(400, "Missing payment details.");
    if (!same(hmac(secret("RAZORPAY_KEY_SECRET"), b.orderId + "|" + b.paymentId), b.signature)) throw httpError(400, "Payment could not be verified.");
    const o = await rzp("GET", "/orders/" + encodeURIComponent(b.orderId));
    if (!o || !o.notes || o.notes.uid !== uid || +o.amount !== price() || o.currency !== "INR") throw httpError(400, "This payment does not belong to your account.");
    let p = await rzp("GET", "/payments/" + encodeURIComponent(b.paymentId));
    if (!p || p.order_id !== b.orderId || +p.amount !== price() || (p.currency && p.currency !== "INR")) throw httpError(400, "Payment does not match the order.");
    if (p.status === "authorized") p = await rzp("POST", "/payments/" + encodeURIComponent(b.paymentId) + "/capture", { amount: price(), currency: "INR" });
    if (!p || p.status !== "captured") throw httpError(402, "The payment has not completed yet.");
    const g = await grant(uid, b.paymentId, +p.amount);
    return { paidUntil: g.paidUntil };
  }

  // Razorpay -> us. Catches payments whose browser never came back, and refunds.
  async function webhook(rawBody, signature) {
    const key = secret("RAZORPAY_WEBHOOK_SECRET");
    if (!signature || !same(hmac(key, rawBody), signature)) throw httpError(400, "bad signature");
    let ev; try { ev = JSON.parse(rawBody); } catch (e) { throw httpError(400, "bad body"); }
    if (!ev || typeof ev !== "object") throw httpError(400, "bad body");
    const type = ev.event, payload = ev.payload || {};
    if (type === "payment.captured" || type === "order.paid") {
      const pay = (payload.payment || {}).entity || {};
      if (!pay.order_id || !pay.id) return { ignored: true };
      const o = await rzp("GET", "/orders/" + encodeURIComponent(pay.order_id));
      if (!o || !o.notes || !o.notes.uid || +o.amount !== price() || o.currency !== "INR" || +pay.amount !== price()) return { ignored: true };
      await grant(o.notes.uid, pay.id, +pay.amount);
      return { granted: true };
    }
    if (type === "refund.processed" || type === "refund.created") {
      const ref = (payload.refund || {}).entity || {};
      if (ref.payment_id && type === "refund.processed") return revoke(ref.payment_id);
    }
    return { ignored: true };
  }

  return { config, order, verify, webhook, grant, revoke, httpError };
}

module.exports = { makeApi };
