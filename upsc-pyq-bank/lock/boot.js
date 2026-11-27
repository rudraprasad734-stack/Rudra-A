// CSE Companion start-up gate. The question bank and notes are NOT in this page: they are encrypted files in ./data/.
// This script asks the server for the decryption key (only a signed-in person with a live trial / paid year gets it),
// keeps the key on the device so the app works offline, decrypts the files and then starts the app.
(function(){
"use strict";
var CFG = __CFG__;   // {api, fb, ver, man:{id:file}, kv}
window.__cseGate = 1;
var DB = "cse.lock", SHOW = false, auth = null, fbm = null, user = null;

function $(id){ return document.getElementById(id); }
function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
function idb(mode, fn){
  return new Promise(function(res, rej){
    var r = indexedDB.open(DB, 1);
    r.onupgradeneeded = function(){ r.result.createObjectStore("k"); };
    r.onerror = function(){ rej(r.error); };
    r.onsuccess = function(){ try{ var t = r.result.transaction("k", mode), q = fn(t.objectStore("k")); t.oncomplete = function(){ res(q && q.result); }; t.onerror = function(){ rej(t.error); }; }catch(e){ rej(e); } };
  });
}
function getKey(){ return idb("readonly", function(s){ return s.get("key"); }).catch(function(){ return null; }); }
function putKey(v){ return idb("readwrite", function(s){ return v ? s.put(v, "key") : s.delete("key"); }).catch(function(){}); }

// ---- the screen shown while the person has to sign in / pay / reconnect ----
var CSS = "#cseGate{position:fixed;inset:0;z-index:2147483000;background:#04161d;color:#e6fbf8;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font:16px/1.5 -apple-system,system-ui,Segoe UI,sans-serif}" +
  "#cseGate .g{max-width:380px;width:100%}#cseGate img{width:72px;height:72px;border-radius:18px;margin-bottom:14px}" +
  "#cseGate h1{font:600 26px/1.2 Georgia,serif;margin:0 0 8px}#cseGate p{margin:0 0 16px;opacity:.85}" +
  "#cseGate button{display:block;width:100%;min-height:50px;margin:10px 0;padding:12px 18px;border:0;border-radius:14px;font:700 16px -apple-system,system-ui,sans-serif;background:#2de6d6;color:#04262c;cursor:pointer}" +
  "#cseGate button.s{background:transparent;color:#2de6d6;border:1px solid #2de6d655}#cseGate button[disabled]{opacity:.55}" +
  "#cseGate .e{color:#ff9a9a;font-size:14px;min-height:20px}#cseGate .f{font-size:12px;opacity:.7;margin-top:18px}#cseGate a{color:#46c8b9}";
function gate(h, p, btns, err){
  var sp = $("splash"); if(sp && sp.parentNode){ sp.parentNode.removeChild(sp); document.documentElement.className = document.documentElement.className.replace(/\bsp-on\b/, ""); }
  if(!SHOW){ SHOW = true; var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st); var d = document.createElement("div"); d.id = "cseGate"; document.body.appendChild(d); }
  var el = $("cseGate");
  el.innerHTML = '<div class="g"><img src="./icon-192.png" alt=""><h1></h1><p></p><div id="gb"></div><div class="e" id="ge" role="alert"></div><div class="f"><a href="./terms.html">Terms</a> · <a href="./refund.html">Refunds</a> · <a href="./privacy.html">Privacy</a></div></div>';
  el.querySelector("h1").textContent = h; el.querySelector("p").textContent = p; $("ge").textContent = err || "";
  btns.forEach(function(b){ var x = document.createElement("button"); x.type = "button"; x.textContent = b[0]; if(b[2]) x.className = "s"; x.addEventListener("click", function(){ x.disabled = true; Promise.resolve(b[1]()).then(function(){ x.disabled = false; }, function(){ x.disabled = false; }); }); $("gb").appendChild(x); });
}
function busy(msg){ gate("CSE Companion", msg, []); }
function hideGate(){ var el = $("cseGate"); if(el && el.parentNode) el.parentNode.removeChild(el); }

// ---- Firebase sign-in (same project and same saved session as the app) ----
function loadFb(){
  if(fbm) return Promise.resolve(fbm);
  var imp = new Function("u", "return import(u)"), b = "https://www.gstatic.com/firebasejs/" + CFG.ver + "/";
  return Promise.all([imp(b + "firebase-app.js"), imp(b + "firebase-auth.js")]).then(function(x){
    fbm = {app: x[0], auth: x[1]}; auth = fbm.auth.getAuth(fbm.app.initializeApp(CFG.fb)); return fbm;
  });
}
function whoami(){   // the signed-in person (a saved session comes back within a moment), or null
  return loadFb().then(function(m){
    return new Promise(function(res){
      var done = false, off = m.auth.onAuthStateChanged(auth, function(u){ if(done) return; done = true; try{ off(); }catch(e){} res(u || null); });
      setTimeout(function(){ if(!done){ done = true; res(null); } }, 6000);
    });
  });
}
function signIn(){
  return loadFb().then(function(m){
    var prov = new m.auth.GoogleAuthProvider();
    return m.auth.signInWithPopup(auth, prov).catch(function(e){
      var c = e && e.code;
      if(c === "auth/popup-blocked" || c === "auth/operation-not-supported-in-this-environment" || c === "auth/web-storage-unsupported") return m.auth.signInWithRedirect(auth, prov);
      if(c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request") return null;
      throw e;
    });
  }).then(function(){ return run(); });
}

// ---- asking the server for the key ----
function playToken(){   // inside the Android app: the Google Play subscription, if there is one
  if(!window.getDigitalGoodsService) return Promise.resolve("");
  return window.getDigitalGoodsService("https://play.google.com/billing").then(function(svc){
    return svc.listPurchases().then(function(l){ var m = (l || []).filter(function(p){ return p.itemId === "cse_companion_yearly"; })[0]; return m ? m.purchaseToken : ""; });
  }).catch(function(){ return ""; });
}
function trialHint(){ try{ var s = JSON.parse(localStorage.getItem("dossier.sub.v1") || "null"); return s && +s.t0 > 0 ? +s.t0 : 0; }catch(e){ return 0; } }
function post(path, body, tok){
  return fetch(CFG.api + path, {method: "POST", headers: {"Content-Type": "application/json", Authorization: "Bearer " + tok}, body: JSON.stringify(body || {})}).then(function(r){
    return r.json().catch(function(){ return {}; }).then(function(j){ if(!r.ok){ var e = new Error(j.error || ("Error " + r.status)); e.status = r.status; e.locked = !!j.locked; throw e; } return j; });
  });
}
function fetchKey(){
  return user.getIdToken().then(function(tok){
    return playToken().then(function(pt){ return post("/contentKey", {playToken: pt, trialStart: trialHint()}, tok); });
  }).then(function(j){ var rec = {key: j.key, until: j.until, v: j.v, uid: user.uid}; return putKey(rec).then(function(){ return rec; }); });
}

// ---- paying when the trial is over (the same two ways the app offers) ----
function loadRzp(){ if(window.Razorpay) return Promise.resolve(); return new Promise(function(res, rej){ var s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = res; s.onerror = function(){ rej(new Error("load")); }; document.head.appendChild(s); }); }
function payWeb(){
  return user.getIdToken().then(function(tok){
    return post("/order", {}, tok).then(function(o){
      return loadRzp().then(function(){ return new Promise(function(res, rej){
        var rz = new window.Razorpay({key: o.keyId, order_id: o.orderId, amount: o.amount, currency: o.currency, name: "CSE Companion", description: "One year of CSE Companion", prefill: {email: user.email || "", name: user.displayName || ""}, theme: {color: "#46C8B9"}, handler: function(r){ res(r); }, modal: {ondismiss: function(){ rej({dismissed: true}); }}});
        if(rz.on) rz.on("payment.failed", function(){ rej({failed: true}); });
        rz.open();
      }); });
    }).then(function(r){ return post("/verify", {orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature}, tok); });
  }).then(function(){ return run(); }, function(e){
    if(e && e.dismissed) return;
    return lockedScreen(e && e.failed ? "The payment did not go through. You have not been charged." : "We could not confirm the payment. If money was taken it is added within a few minutes; reopen the app to check.");
  });
}
function payPlay(){
  return window.getDigitalGoodsService("https://play.google.com/billing").then(function(svc){
    var req = new PaymentRequest([{supportedMethods: "https://play.google.com/billing", data: {sku: "cse_companion_yearly"}}], {total: {label: "Total", amount: {currency: "INR", value: "0"}}});
    return req.show().then(function(res){
      var t = res.details && res.details.purchaseToken;
      return Promise.resolve(t ? svc.acknowledge(t, "onetime").catch(function(){}) : 0).then(function(){ return res.complete("success"); });
    });
  }).then(function(){ return run(); }, function(e){
    if(e && e.name === "AbortError") return;
    return lockedScreen("The purchase did not go through. You have not been charged.");
  });
}
function lockedScreen(err){
  var inApp = !!window.getDigitalGoodsService && (function(){ try{ return !window.matchMedia("(display-mode: browser)").matches; }catch(e){ return false; } })();
  var b = [[inApp ? "Subscribe on Google Play" : "Pay for one year", inApp ? payPlay : payWeb], ["Check again", function(){ return run(); }, 1]];
  gate("Your trial is complete", "Your plan, progress and streak are saved. Pick up exactly where you left off.", b, err);
}

// ---- downloading and decrypting the data files ----
function importKey(b64){ return crypto.subtle.importKey("raw", Uint8Array.from(atob(b64), function(c){ return c.charCodeAt(0); }), "AES-GCM", false, ["decrypt"]); }
function decrypt(key, buf){
  var u = new Uint8Array(buf);
  return crypto.subtle.decrypt({name: "AES-GCM", iv: u.slice(0, 12)}, key, u.slice(12)).then(function(plain){
    return new Response(new Blob([plain]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
  });
}
function files(){
  var ids = Object.keys(CFG.man);
  return (window.caches ? caches.open("cse-data") : Promise.resolve(null)).catch(function(){ return null; }).then(function(c){
    var out = {};
    return Promise.all(ids.map(function(id){
      var url = "./data/" + CFG.man[id];
      return (c ? c.match(url) : Promise.resolve(null)).then(function(hit){ return hit || fetch(url).then(function(r){ if(!r.ok) throw new Error("download"); if(c) c.put(url, r.clone()).catch(function(){}); return r; }); })
        .then(function(r){ return r.arrayBuffer(); }).then(function(b){ out[id] = b; });
    })).then(function(){
      if(c) c.keys().then(function(ks){ ks.forEach(function(k){ var f = k.url.split("/data/")[1]; if(f && Object.keys(CFG.man).every(function(i){ return CFG.man[i] !== f; })) c.delete(k); }); }).catch(function(){});
      return out;
    });
  });
}
function launch(rec){
  busy("Opening your study space…");
  return importKey(rec.key).then(function(key){
    window.__cseDec = function(buf){ return decrypt(key, buf); };   // the app opens the daily / quiz / Crux files with this
    return files().then(function(bufs){
      return Promise.all(Object.keys(bufs).map(function(id){ return decrypt(key, bufs[id]).then(function(t){ return [id, t]; }); }));
    });
  }).then(function(list){
    list.forEach(function(x){ var s = document.createElement("script"); s.type = "application/json"; s.id = x[0]; s.textContent = x[1]; document.body.appendChild(s); });
    list = null; hideGate(); window.__cseGate = 0;
    var codes = Array.prototype.slice.call(document.querySelectorAll('script[type="text/x-cse"]'));
    var late = [], ael = window.addEventListener;   // the page has already loaded: run "load" listeners right away
    if(document.readyState === "complete") window.addEventListener = function(t, f, o){ if(t === "load"){ late.push(f); return; } return ael.call(this, t, f, o); };
    codes.forEach(function(c){ var s = document.createElement("script"); s.text = c.textContent; c.parentNode.replaceChild(s, c); });
    window.addEventListener = ael; late.forEach(function(f){ try{ f.call(window, new Event("load")); }catch(e){} });
    // renew the key quietly (or take it away if the trial ended or the year was refunded)
    if(user && navigator.onLine !== false) setTimeout(function(){ fetchKey().catch(function(e){ if(e && (e.status === 402 || e.status === 401)){ putKey(null); } }); }, 15000);
  });
}

var running = false;
function run(){
  if(running) return Promise.resolve(); running = true;
  var fin = function(){ running = false; };
  return getKey().then(function(rec){
    if(rec && rec.until > Date.now() && rec.v === CFG.kv){
      return whoami().catch(function(){ return null; }).then(function(u){ user = u; return launch(rec); });   // saved key: works offline; the person is looked up only to renew it later
    }
    if(navigator.onLine === false){ gate("Connect to the internet", "Open the app once while online to unlock your study space. After that it works offline.", [["Try again", function(){ return run(); }]]); return; }
    busy("Checking your account…");
    return whoami().then(function(u){
      user = u;
      if(!u){ gate("Welcome to CSE Companion", "Sign in with Google to start your 14-day free trial. Your plan and progress are saved to your account.", [["Continue with Google", signIn]]); return; }
      return fetchKey().then(launch, function(e){
        if(e && e.locked) return lockedScreen("");
        if(e && e.status === 401){ gate("Please sign in again", "Your sign-in has expired.", [["Continue with Google", signIn]]); return; }
        gate("Could not open the app", "Check your internet connection and try again.", [["Try again", function(){ return run(); }]], (e && e.message) || "");
      });
    });
  }).catch(function(e){
    // a key that no longer opens the files (changed on the server): forget it and ask again once
    return putKey(null).then(function(){ gate("Could not open the app", "Check your internet connection and try again.", [["Try again", function(){ return run(); }]], (e && e.message) || ""); });
  }).then(fin, fin);
}
function startGate(){ if(window.crypto && crypto.subtle && window.DecompressionStream && window.indexedDB) run(); else { gate("Please update your browser", "This app needs a newer version of your browser (Chrome 80+ or Safari 16.4+).", []); } }
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", startGate); else startGate();
})();
