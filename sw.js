// Omar Pizza — Service Worker v3.0 (network-first for app shell)
const CACHE = 'omar-pizza-v21';

const ASSETS = [
  './',
  './index.html',
  './apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,300;1,9..144,500&family=DM+Mono:wght@300;400&family=Caveat:wght@400;600&display=swap',
];

// Install: pre-cache core assets so first offline load works
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return Promise.allSettled(
        ASSETS.map(url =>
          // Default mode: same-origin for the shell, CORS for Google Fonts
          // (both support it). Avoids opaque (status 0) responses that can't
          // be reliably served back as the app shell or applied as CSS.
          fetch(url)
            .then(r => { if (r.ok) return cache.put(url, r); })
            .catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: drop old caches, take control immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Is this the app shell (HTML / the page itself)? Those should be fresh.
function isAppShell(request) {
  if (request.mode === 'navigate') return true;
  if (request.destination === 'document') return true;
  const url = new URL(request.url);
  return url.pathname.endsWith('/') ||
         url.pathname.endsWith('/index.html') ||
         url.pathname.endsWith('.html');
}

// Fetch strategy:
//   App shell  → NETWORK FIRST (always try to get the latest; cache fallback offline)
//   Everything → CACHE FIRST (fonts, icons — static, fast, save bandwidth)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  if (isAppShell(e.request)) {
    // Network-first: fetch latest, update cache, fall back to cache when offline
    e.respondWith(
      fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(e.request).then(cached =>
          cached || caches.match('./index.html')
        )
      )
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => new Response('', { status: 503 }));
    })
  );
});
