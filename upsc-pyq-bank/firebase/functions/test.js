// Tests for the payment logic with in-memory fakes (no Firebase or Razorpay needed): npm test
"use strict";
const crypto = require("crypto");
const { makeApi } = require("./lib");
let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
const DAY = 86400000;

function fakeDb() {
  const store = {};
  const ref = (path) => ({ path });
  const snap = (path) => ({ exists: path in store, data: () => store[path] });
  return {
    store,
    doc: ref,
    async runTransaction(fn) {
      const writes = [];
      const tx = {
        get: async (r) => snap(r.path),
        set: (r, d, o) => writes.push([r.path, d, o])
      };
      const out = await fn(tx);
      writes.forEach(([p, d, o]) => { store[p] = o && o.merge ? Object.assign({}, store[p] || {}, d) : d; });
      return out;
    }
  };
}
const env = { RAZORPAY_KEY_ID: "rzp_test_x", RAZORPAY_KEY_SECRET: "sec", RAZORPAY_WEBHOOK_SECRET: "hook", PRICE_PAISE: "29900", PERIOD_DAYS: "365" };
const sig = (o, p) => crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(o + "|" + p).digest("hex");

(async () => {
  let t = 1_700_000_000_000;
  const orders = {}, payments = {};
  const rzp = async (m, path, body) => {
    if (m === "POST" && path === "/orders") { const id = "order_" + Object.keys(orders).length; orders[id] = { id, amount: body.amount, currency: body.currency, notes: body.notes }; return orders[id]; }
    let x = /^\/orders\/(.+)$/.exec(path); if (x) return orders[x[1]];
    x = /^\/payments\/([^/]+)\/capture$/.exec(path); if (x) { payments[x[1]].status = "captured"; return payments[x[1]]; }
    x = /^\/payments\/(.+)$/.exec(path); if (x) return payments[x[1]];
    throw new Error("unexpected " + m + path);
  };
  const db = fakeDb();
  const api = makeApi({ db, rzp, env, now: () => t, verifyIdToken: async (tok) => { if (tok === "tokA") return { uid: "userA" }; if (tok === "tokB") return { uid: "userB" }; throw new Error("bad"); } });
  const req = (tok, body) => ({ headers: tok ? { authorization: "Bearer " + tok } : {}, body });
  const fail = async (fn) => { try { await fn(); return null; } catch (e) { return e.status || "err"; } };

  ok((await api.config()).amount === 29900, "config reports the price");
  const badApi = makeApi({ db, rzp, env: Object.assign({}, env, { PRICE_PAISE: "50" }), now: () => t, verifyIdToken: async () => ({ uid: "userA" }) });
  ok(await fail(() => badApi.order(req("tokA"))) === 500, "a price below 100 paise is refused (Razorpay minimum)");
  ok(await fail(() => api.order(req(null))) === 401, "order needs sign-in");
  ok(await fail(() => api.order(req("nope"))) === 401, "order rejects a bad token");

  const o1 = await api.order(req("tokA"));
  ok(o1.orderId && o1.amount === 29900, "order created for user A");
  payments.pay_1 = { id: "pay_1", order_id: o1.orderId, amount: 29900, status: "captured" };

  ok(await fail(() => api.verify(req("tokA", { orderId: o1.orderId, paymentId: "pay_1", signature: "00" }))) === 400, "wrong signature refused");
  ok(await fail(() => api.verify(req("tokB", { orderId: o1.orderId, paymentId: "pay_1", signature: sig(o1.orderId, "pay_1") }))) === 400, "another account cannot claim A's payment");
  ok(db.store["entitlements/userA"] === undefined, "nothing granted by failed attempts");

  const v = await api.verify(req("tokA", { orderId: o1.orderId, paymentId: "pay_1", signature: sig(o1.orderId, "pay_1") }));
  ok(v.paidUntil === t + 365 * DAY, "a valid payment gives exactly one year");
  ok(db.store["entitlements/userA"].paidUntil === v.paidUntil, "entitlement saved");

  const v2 = await api.verify(req("tokA", { orderId: o1.orderId, paymentId: "pay_1", signature: sig(o1.orderId, "pay_1") }));
  ok(v2.paidUntil === v.paidUntil, "sending the same payment again adds nothing");

  // renewing while still active adds on top of the remaining time
  t += 100 * DAY;
  const o2 = await api.order(req("tokA"));
  payments.pay_2 = { id: "pay_2", order_id: o2.orderId, amount: 29900, status: "authorized" };
  const v3 = await api.verify(req("tokA", { orderId: o2.orderId, paymentId: "pay_2", signature: sig(o2.orderId, "pay_2") }));
  ok(v3.paidUntil === v.paidUntil + 365 * DAY, "renewing early adds a year after the current end");
  ok(payments.pay_2.status === "captured", "an authorized payment is captured");

  // expired then pays again: counts from today
  t += 1000 * DAY;
  const o3 = await api.order(req("tokA"));
  payments.pay_3 = { id: "pay_3", order_id: o3.orderId, amount: 29900, status: "captured" };
  const v4 = await api.verify(req("tokA", { orderId: o3.orderId, paymentId: "pay_3", signature: sig(o3.orderId, "pay_3") }));
  ok(v4.paidUntil === t + 365 * DAY, "paying after expiry starts from today");

  // wrong amount on the order
  orders.order_x = { id: "order_x", amount: 100, currency: "INR", notes: { uid: "userA" } };
  payments.pay_x = { id: "pay_x", order_id: "order_x", amount: 100, status: "captured" };
  ok(await fail(() => api.verify(req("tokA", { orderId: "order_x", paymentId: "pay_x", signature: sig("order_x", "pay_x") }))) === 400, "an order with the wrong amount is refused");
  // unfinished payment
  const o4 = await api.order(req("tokB"));
  payments.pay_4 = { id: "pay_4", order_id: o4.orderId, amount: 29900, status: "failed" };
  ok(await fail(() => api.verify(req("tokB", { orderId: o4.orderId, paymentId: "pay_4", signature: sig(o4.orderId, "pay_4") }))) === 402, "a failed payment gives nothing");

  // webhook
  const hook = (ev) => { const body = JSON.stringify(ev); return [body, crypto.createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex")]; };
  ok(await fail(() => api.webhook("{}", "bad")) === 400, "webhook with a bad signature refused");
  const o5 = await api.order(req("tokB"));
  payments.pay_5 = { id: "pay_5", order_id: o5.orderId, amount: 29900, status: "captured" };
  let [b, s] = hook({ event: "payment.captured", payload: { payment: { entity: { id: "pay_5", order_id: o5.orderId, amount: 29900 } } } });
  const w = await api.webhook(b, s);
  ok(w.granted && db.store["entitlements/userB"].paidUntil === t + 365 * DAY, "webhook grants a payment the browser never confirmed");
  await api.webhook(b, s);
  ok(db.store["entitlements/userB"].paidUntil === t + 365 * DAY, "webhook sent twice adds nothing");
  [b, s] = hook({ event: "refund.processed", payload: { refund: { entity: { payment_id: "pay_5" } } } });
  const r = await api.webhook(b, s);
  ok(r.revoked && db.store["entitlements/userB"].paidUntil === t, "a refund takes the year back");
  const r2 = await api.webhook(b, s);
  ok(!r2.revoked, "a refund notice repeated takes back nothing more");

  console.log(fails ? "FAILS " + fails : "ALL OK"); process.exit(fails ? 1 : 0);
})();
