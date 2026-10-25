// Evenings at Home service worker: keeps the app shell available offline.
// Bump VERSION whenever app files change so phones pick up the update.
const VERSION = "eah-v10";
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

// phone reminders sent by scripts/nudge.mjs
self.addEventListener("push", e => {
  let msg = { title: "Evenings at Home", body: "Time for one small thing." };
  try { if (e.data) msg = Object.assign(msg, e.data.json()); } catch (err) { if (e.data) msg.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(msg.title, {
    body: msg.body, icon: msg.icon || "icons/icon-192.png", badge: "icons/badge.png", tag: "evenings-nudge", renotify: true, data: { url: "./" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  }));
});
