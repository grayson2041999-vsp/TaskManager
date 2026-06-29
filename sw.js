/* Service worker — Phase 1: makes the app installable (PWA).
   Phase 2 will add 'push' and 'notificationclick' handlers for daily MIT push. */
const CACHE = "tasks-shell-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

// Network-first for navigation so the app always loads the latest version when online.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }
});

/* --- Phase 2 placeholder (push notifications) ---
self.addEventListener("push", (event) => { ... });
self.addEventListener("notificationclick", (event) => { ... });
*/
