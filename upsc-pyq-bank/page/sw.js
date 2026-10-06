// UPSC Companion service worker: caches the app shell so the page loads and
// runs with zero network connectivity after the first successful visit.
// Bump CACHE_NAME on any deploy that changes cached files so clients refresh.
const CACHE_NAME = "upsc-companion-v92";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./privacy.html",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png"
];

// keep good responses, plus the font files (they come back "opaque" from another site) so the fonts also work offline
function cacheable(req, res) {
  if (!res) return false;
  if (res.ok) return true;
  try { return res.type === "opaque" && /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(new URL(req.url).hostname); } catch (e) { return false; }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Serve the cached copy immediately, but refresh it in the background
        // so the next offline visit has whatever changed, without blocking this one.
        fetch(req).then((res) => {
          if (cacheable(req, res)) caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
        }).catch(() => {});
        return cached;
      }
      return fetch(req)
        .then((res) => {
          if (cacheable(req, res)) caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => {
          // Fully offline and never cached: for a page navigation, fall back to
          // the app shell itself rather than a browser error page.
          if (req.mode === "navigate") return caches.match("./index.html");
        });
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({type: "window", includeUncontrolled: true}).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
