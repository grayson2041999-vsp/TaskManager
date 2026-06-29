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

// --- Push notifications (Phase 2/3) ---
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { body: event.data ? event.data.text() : "" }; }
  const title = data.title || "🎯 MIT hôm nay";
  const options = {
    body: data.body || "Mở app để xem việc quan trọng nhất hôm nay.",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: data.tag || "mit-daily",   // same tag => only one notification per day
    renotify: false,
    data: { url: data.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
