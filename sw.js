/* Service Worker — Bodega SC PWA */
const CACHE = "bodega-sc-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Peticiones a otros orígenes (Supabase, fuentes, CDN) van directo a la red.
  if (url.origin !== self.location.origin) return;

  // Navegación / HTML: red primero (para ver siempre la última versión),
  // con respaldo a la copia en caché si no hay señal.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Recursos estáticos (íconos, manifest): caché primero, red de respaldo.
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
