/* Fern nail art — minimal cache-first service worker.
   Caches the static shell (HTML, CSS, JS, fonts, leaves, exported PNGs)
   so repeat visits work offline and load instantly. */
const CACHE = 'fern-v1';
const PRECACHE = [
  './',
  './print/',
  './favicon.svg',
  './manifest.webmanifest',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Bypass cross-origin (Google Fonts handles its own caching)
  if (url.origin !== self.location.origin) return;
  // Bypass query-strings (dynamic template URLs etc.)
  if (url.search) return;

  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok && (res.type === 'basic' || res.type === 'default')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached || Response.error());
    })
  );
});
