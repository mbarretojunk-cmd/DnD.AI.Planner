// Evenings at Home service worker: keeps the app shell available offline.
// Bump VERSION whenever app files change so phones pick up the update.
const VERSION = "eah-v3";
const SHELL = ["./", "index.html", "styles.css", "app.js", "store.js", "dm.js", "config.js", "starter.json", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // never cache API traffic (Supabase, Claude) or non-GET requests
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  // network first, fall back to the cached copy when offline
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
