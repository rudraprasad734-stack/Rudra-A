// Firebase Cloud Functions for CSE Companion web payments (Razorpay).
// api       POST /config /order /verify   (the website calls these; sign-in required for order and verify)
// razorpayWebhook   POST (Razorpay calls this)
"use strict";
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const { makeApi } = require("./lib");

admin.initializeApp();
const SECRETS = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"];
const ORIGINS = ["https://csecompanion.in", "https://www.csecompanion.in"];
const REGION = "asia-south1";

async function rzp(method, path, body) {
  const auth = Buffer.from(process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET).toString("base64");
  const r = await fetch("https://api.razorpay.com/v1" + path, {
    method,
    headers: { Authorization: "Basic " + auth, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { console.error("Razorpay refused", r.status, (j.error && j.error.description) || ""); const e = new Error("The payment service could not be reached. Please try again in a moment."); e.status = 502; throw e; }   // Razorpay refused or is down: a server error from the person's point of view
  return j;
}

function api() {
  return makeApi({
    db: admin.firestore(),
    verifyIdToken: (t) => admin.auth().verifyIdToken(t),
    rzp,
    env: process.env
  });
}

exports.api = functions.region(REGION).runWith({ secrets: SECRETS }).https.onRequest(async (req, res) => {
  const origin = req.headers.origin;
  if (ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const a = api();
    const path = req.path.replace(/\/+$/, "");
    if (path === "/config") return res.json(await a.config());
    if (path === "/order") return res.json(await a.order(req));
    if (path === "/verify") return res.json(await a.verify(req));
    return res.status(404).json({ error: "Not found" });
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.status ? e.message : "Something went wrong." });
  }
});

exports.razorpayWebhook = functions.region(REGION).runWith({ secrets: SECRETS }).https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("POST only");
  try {
    const out = await api().webhook(req.rawBody.toString("utf8"), req.headers["x-razorpay-signature"]);
    return res.json(out);
  } catch (e) {
    return res.status(e.status || 500).send(e.status ? e.message : "error");
  }
});
