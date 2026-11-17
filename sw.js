/* Network first, falling back to this version's cache, so updates arrive as soon as the device is online. */
const PREFIX = 'soil-';
const CACHE = PREFIX + 'v9';
const FILES = ['./', 'index.html', 'css/styles.css', 'js/content.js', 'js/units.js', 'js/crops.js', 'js/records.js', 'js/app.js', 'icon.svg', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

/* Drop this app's older caches. Other apps on the same origin keep theirs: only names with our prefix are touched. */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n.startsWith(PREFIX) && n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() =>
      caches.open(CACHE)
        .then(c => c.match(e.request, { ignoreSearch: true }))
        .then(hit => hit || Response.error())
    )
  );
});
