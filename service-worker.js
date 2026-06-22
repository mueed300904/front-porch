const CACHE_NAME = 'front-porch-v1';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything except our cached shell, so chat data is always fresh.
  if (ASSETS.some((a) => event.request.url.endsWith(a.replace('./', '')))) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
  }
});
