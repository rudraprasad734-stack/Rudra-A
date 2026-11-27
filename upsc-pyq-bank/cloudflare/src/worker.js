// CSE Companion web payments (Razorpay) on Cloudflare Workers.
// POST /config /order /verify /playAck  (the website calls these)   POST /razorpayWebhook  (Razorpay calls this)
import { makeApi } from "../../firebase/functions/lib.js";
import { makeDb } from "./firestore.js";
import { serviceTokenGetter, verifyFirebaseToken } from "./google.js";

const ORIGINS = ["https://csecompanion.in", "https://www.csecompanion.in"];

async function rzp(env, method, path, body) {
  const r = await fetch("https://api.razorpay.com/v1" + path, {
    method,
    headers: { Authorization: "Basic " + btoa(env.RAZORPAY_KEY_ID + ":" + env.RAZORPAY_KEY_SECRET), "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error("Razorpay refused", r.status, (j.error && j.error.description) || ""); const e = new Error("The payment service could not be reached. Please try again in a moment."); e.status = 502; throw e; }
  return j;
}

let getToken = null, tokenFor = null;
function build(env) {
  if (!getToken || tokenFor !== env.FIREBASE_SERVICE_ACCOUNT) { getToken = serviceTokenGetter(env.FIREBASE_SERVICE_ACCOUNT); tokenFor = env.FIREBASE_SERVICE_ACCOUNT; }
  return makeApi({
    db: makeDb({ project: env.FIREBASE_PROJECT, getToken }),
    verifyIdToken: (t) => verifyFirebaseToken(t, env.FIREBASE_PROJECT),
    rzp: (m, p, b) => rzp(env, m, p, b),
    env
  });
}

// Confirms (acknowledges) a Google Play subscription purchase from the server, so Google never cancels it for being unconfirmed.
const PLAY_PACKAGE = "in.csecompanion.app", PLAY_SKU = "cse_companion_yearly";
let getPlayToken = null, playTokenFor = null;
async function playAck(env, token) {
  token = String(token || "");
  if (token.length < 20 || token.length > 2000 || !/^[\w.\-]+$/.test(token)) { const e = new Error("Bad purchase token."); e.status = 400; throw e; }
  if (!getPlayToken || playTokenFor !== env.FIREBASE_SERVICE_ACCOUNT) { getPlayToken = serviceTokenGetter(env.FIREBASE_SERVICE_ACCOUNT, undefined, "https://www.googleapis.com/auth/androidpublisher"); playTokenFor = env.FIREBASE_SERVICE_ACCOUNT; }
  const base = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/" + PLAY_PACKAGE + "/purchases/subscriptions/" + PLAY_SKU + "/tokens/" + encodeURIComponent(token);
  const r = await fetch(base + ":acknowledge", { method: "POST", headers: { Authorization: "Bearer " + await getPlayToken(), "Content-Type": "application/json" }, body: "{}" });
  if (r.ok) return { ok: true };
  const j = await r.json().catch(() => ({}));
  const msg = JSON.stringify(j.error || {}).slice(0, 300);
  if (r.status === 400 && /already.*acknowledg/i.test(msg)) return { ok: true, already: true };
  console.error("Play acknowledge refused", r.status, msg);
  const e = new Error("Google Play did not accept the confirmation (" + r.status + ")."); e.status = 502; throw e;
}

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), { status: status || 200, headers: Object.assign({ "Content-Type": "application/json" }, extra || {}) });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");
    const origin = request.headers.get("Origin");
    const cors = ORIGINS.includes(origin)
      ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Headers": "Authorization, Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" }
      : {};
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "POST only" }, 405, cors);
    try {
      if (+request.headers.get("Content-Length") > 200000) return json({ error: "Too large" }, 413, cors);
      const a = build(env);
      if (path === "/razorpayWebhook") {
        const out = await a.webhook(await request.text(), request.headers.get("x-razorpay-signature"));
        return json(out, 200);
      }
      const req = { headers: { authorization: request.headers.get("Authorization") || "" }, body: await request.json().catch(() => ({})) };
      if (path === "/playAck") return json(await playAck(env, req.body && req.body.token), 200, cors);
      if (path === "/config") return json(await a.config(), 200, cors);
      if (path === "/order") return json(await a.order(req), 200, cors);
      if (path === "/verify") return json(await a.verify(req), 200, cors);
      return json({ error: "Not found" }, 404, cors);
    } catch (e) {
      return json({ error: e.status ? e.message : "Something went wrong." }, e.status || 500, cors);
    }
  }
};
