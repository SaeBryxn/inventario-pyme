// Service worker de la PWA. Cachea el "app shell" y sirve offline las
// navegaciones. NO toca la API ni los módulos del dev server (evita romper HMR).
const CACHE = 'stockpro-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  // Navegaciones: red primero, si no hay conexión, el index cacheado.
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }

  // Solo assets del shell (iconos, manifest): cache-first.
  const url = new URL(request.url);
  if (url.origin === self.location.origin && SHELL.includes(url.pathname)) {
    e.respondWith(caches.match(request).then((r) => r || fetch(request)));
  }
});
