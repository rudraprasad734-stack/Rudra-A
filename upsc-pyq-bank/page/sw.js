// UPSC Companion service worker: caches the app shell so the page loads and
// runs with zero network connectivity after the first successful visit.
// Bump CACHE_NAME on any deploy that changes cached files so clients refresh.
const CACHE_NAME = "upsc-companion-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png"
];

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
          if (res && res.ok) caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
        }).catch(() => {});
        return cached;
      }
      return fetch(req)
        .then((res) => {
          if (res && res.ok) caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
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
