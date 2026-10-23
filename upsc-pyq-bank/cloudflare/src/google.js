// Google-side helpers for the Worker: a service-account token (to write Firestore) and Firebase ID-token checking.
const enc = new TextEncoder();
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64uText = (s) => b64u(enc.encode(s));
function unb64u(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  const bin = atob(s); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out;
}
const RS256 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };

// Returns a function that gives a valid access token for Firestore, refreshing it about every 50 minutes.
export function serviceTokenGetter(saJson, fetchFn) {
  const sa = typeof saJson === "string" ? JSON.parse(saJson) : saJson;
  let cached = null, until = 0, key = null;
  return async function () {
    const now = Date.now();
    if (cached && now < until) return cached;
    if (!key) {
      const pem = sa.private_key.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
      key = await crypto.subtle.importKey("pkcs8", unb64u(pem.replace(/\+/g, "-").replace(/\//g, "_")), RS256, false, ["sign"]);
    }
    const iat = Math.floor(now / 1000);
    const head = b64uText(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claims = b64uText(JSON.stringify({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/datastore", aud: "https://oauth2.googleapis.com/token", iat, exp: iat + 3600 }));
    const sig = b64u(await crypto.subtle.sign(RS256.name, key, enc.encode(head + "." + claims)));
    const r = await (fetchFn || fetch)("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=" + encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer") + "&assertion=" + head + "." + claims + "." + sig
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.access_token) throw new Error("Google sign-in for the server failed");
    cached = j.access_token; until = now + 50 * 60 * 1000;
    return cached;
  };
}

// Checks a Firebase ID token (RS256, signed by Google) and returns {uid}. Throws if anything is off.
let jwks = null, jwksUntil = 0;
export async function verifyFirebaseToken(token, project, fetchFn) {
  const parts = String(token).split(".");
  if (parts.length !== 3) throw new Error("bad token");
  const head = JSON.parse(new TextDecoder().decode(unb64u(parts[0])));
  const body = JSON.parse(new TextDecoder().decode(unb64u(parts[1])));
  if (head.alg !== "RS256" || !head.kid) throw new Error("bad token");
  const now = Math.floor(Date.now() / 1000);
  if (!(body.exp > now) || body.iat > now + 300) throw new Error("expired");
  if (body.aud !== project || body.iss !== "https://securetoken.google.com/" + project) throw new Error("wrong project");
  if (!body.sub || typeof body.sub !== "string") throw new Error("no subject");
  async function keys(force) {
    if (!force && jwks && Date.now() < jwksUntil) return jwks;
    const r = await (fetchFn || fetch)("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com");
    if (!r.ok) throw new Error("could not load Google keys");
    jwks = (await r.json()).keys || []; jwksUntil = Date.now() + 60 * 60 * 1000;
    return jwks;
  }
  let jwk = (await keys(false)).find((k) => k.kid === head.kid);
  if (!jwk) jwk = (await keys(true)).find((k) => k.kid === head.kid);   // Google rotates keys: refetch once
  if (!jwk) throw new Error("unknown key");
  const pub = await crypto.subtle.importKey("jwk", jwk, RS256, false, ["verify"]);
  const okSig = await crypto.subtle.verify(RS256.name, pub, unb64u(parts[2]), enc.encode(parts[0] + "." + parts[1]));
  if (!okSig) throw new Error("bad signature");
  return { uid: body.sub };
}
