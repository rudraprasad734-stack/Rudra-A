// Payment logic for CSE Companion web subscriptions (Razorpay, one payment = one year).
// Kept free of Firebase/Razorpay imports so it can be tested with fakes: see test.js
"use strict";
const crypto = require("crypto");

const DAY = 86400000;

function makeApi(deps) {
  const { db, verifyIdToken, rzp, env, now } = deps;
  const price = () => +env.PRICE_PAISE || 29900;
  const days = () => +env.PERIOD_DAYS || 365;
  const clock = now || Date.now;

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
      if (!p.exists || p.data().refunded) return { revoked: false };
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
    const b = req.body || {};
    if (!b.orderId || !b.paymentId || !b.signature) throw httpError(400, "Missing payment details.");
    if (!same(hmac(env.RAZORPAY_KEY_SECRET, b.orderId + "|" + b.paymentId), b.signature)) throw httpError(400, "Payment could not be verified.");
    const o = await rzp("GET", "/orders/" + encodeURIComponent(b.orderId));
    if (!o || !o.notes || o.notes.uid !== uid || +o.amount !== price() || o.currency !== "INR") throw httpError(400, "This payment does not belong to your account.");
    let p = await rzp("GET", "/payments/" + encodeURIComponent(b.paymentId));
    if (!p || p.order_id !== b.orderId) throw httpError(400, "Payment does not match the order.");
    if (p.status === "authorized") p = await rzp("POST", "/payments/" + encodeURIComponent(b.paymentId) + "/capture", { amount: price(), currency: "INR" });
    if (!p || p.status !== "captured") throw httpError(402, "The payment has not completed yet.");
    const g = await grant(uid, b.paymentId, +p.amount);
    return { paidUntil: g.paidUntil };
  }

  // Razorpay -> us. Catches payments whose browser never came back, and refunds.
  async function webhook(rawBody, signature) {
    if (!signature || !same(hmac(env.RAZORPAY_WEBHOOK_SECRET, rawBody), signature)) throw httpError(400, "bad signature");
    const ev = JSON.parse(rawBody);
    const type = ev.event;
    if (type === "payment.captured" || type === "order.paid") {
      const pay = (ev.payload.payment || {}).entity || {};
      if (!pay.order_id || !pay.id) return { ignored: true };
      const o = await rzp("GET", "/orders/" + encodeURIComponent(pay.order_id));
      if (!o || !o.notes || !o.notes.uid || +o.amount !== price() || o.currency !== "INR" || +pay.amount !== price()) return { ignored: true };
      await grant(o.notes.uid, pay.id, +pay.amount);
      return { granted: true };
    }
    if (type === "refund.processed" || type === "refund.created") {
      const ref = (ev.payload.refund || {}).entity || {};
      if (ref.payment_id && type === "refund.processed") return revoke(ref.payment_id);
    }
    return { ignored: true };
  }

  return { config, order, verify, webhook, grant, revoke, httpError };
}

module.exports = { makeApi };
