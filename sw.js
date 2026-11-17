/* Self-updating service worker. There is no version number to bump.

   The app opens instantly from the cache. The page then sends "check": every shell file is
   fetched again, the cache is refreshed, and if any file came back different every open
   window is sent "updated" so it can offer a refresh.

   This app keeps its content in several script files, so a change to any shell file counts
   as a new version, not only a change to index.html. */
'use strict';

const CACHE_PREFIX = 'soil-';        // unique to this app; see activate
const CACHE = 'soil-shell';          // fixed name; never changes between deploys
const INDEX = './index.html';

const SHELL = [
  INDEX,
  './css/styles.css',
  './js/content.js',
  './js/units.js',
  './js/crops.js',
  './js/records.js',
  './js/calc.js',
  './js/store.js',
  './js/app.js',
  './icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './manifest.webmanifest',
];

function sameBytes(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  const x = new Uint8Array(a), y = new Uint8Array(b);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
  return true;
}

/* Fetch one file past the HTTP cache and store it. Resolves true only when a copy was already
   cached and the new one differs. Errors and non-200 responses leave the cache alone, so a
   404 or 503 can never replace the app. */
function refresh(url) {
  return fetch(url, { cache: 'no-cache' }).then(res => {
    if (!res || !res.ok) return false;
    return caches.open(CACHE).then(c =>
      c.match(url).then(old =>
        Promise.all([old ? old.arrayBuffer() : null, res.clone().arrayBuffer()]).then(b => {
          const changed = !!b[0] && !sameBytes(b[0], b[1]);
          return c.put(url, res).then(() => changed);
        })
      )
    );
  }).catch(() => false);
}

const refreshShell = () => Promise.all(SHELL.map(refresh)).then(changed => changed.some(Boolean));

/* install: save the shell, then take over at once. Safe because the cache name is stable,
   so a new worker never strands an open page on a deleted cache. */
self.addEventListener('install', e => {
  e.waitUntil(refreshShell().then(() => self.skipWaiting()));
});

/* activate: delete only this app's other caches (the old versioned ones). Cache Storage is
   shared by the whole origin, and on <user>.github.io that is every project page, so caches
   without our prefix are never touched. */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => (k.indexOf(CACHE_PREFIX) === 0 && k !== CACHE ? caches.delete(k) : null))))
      .then(() => self.clients.claim())
  );
});

/* A saved file is handed to the page marked "no-cache". Without that, the browser may keep reusing the copy it
   already holds in memory for as long as the host's max-age allows, and a refresh would show the old app. */
const fromShell = request => caches.open(CACHE).then(c => c.match(request, { ignoreSearch: true })).then(hit => {
  if (!hit) return hit;
  const headers = new Headers(hit.headers);
  headers.set('cache-control', 'no-cache');
  return new Response(hit.body, { status: hit.status, statusText: hit.statusText, headers });
});

/* fetch:
   - navigations  -> the saved app, instantly; the network only if nothing is saved
   - same-origin  -> this app's cache first, then the network, saving what comes back
   - cross-origin -> left alone
   Freshness is handled by the "check" message, not here. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  const save = (key, res) => {
    if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
    return res;
  };
  if (req.mode === 'navigate') {
    e.respondWith(fromShell(INDEX).then(hit => hit || fetch(req).then(res => save(INDEX, res))));
    return;
  }
  e.respondWith(fromShell(req).then(hit => hit || fetch(req).then(res => save(req, res))));
});

self.addEventListener('message', e => {
  /* "check" from a page: refresh the shell and, if anything changed, tell every open window */
  if (e.data === 'check') {
    e.waitUntil(
      refreshShell().then(changed => {
        if (!changed) return null;
        return self.clients.matchAll({ type: 'window' }).then(list => list.forEach(c => c.postMessage('updated')));
      })
    );
    return;
  }
  /* The page asks what is saved, so it can say whether the app will open without a connection.
     "updated" is the newest Last-Modified among the saved files: when the content was last published. */
  if (e.data && e.data.type === 'soil-status' && e.ports && e.ports[0]) {
    e.waitUntil(
      caches.open(CACHE).then(async c => {
        let cached = 0, newest = 0;
        for (const f of SHELL) {
          const hit = await c.match(f);
          if (!hit) continue;
          cached++;
          const when = Date.parse(hit.headers.get('last-modified') || '');
          if (when > newest) newest = when;
        }
        e.ports[0].postMessage({ cached, total: SHELL.length, updated: newest ? new Date(newest).toISOString() : null });
      })
    );
  }
});
