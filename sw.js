/* Self-updating service worker. There is no version number to bump.

   The app opens instantly from the cache. The page then sends "check": every shell file is
   fetched again, and if any file came back different the whole release is swapped in together
   and every open window is sent "updated" so it can offer a refresh.

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
  './icons/favicon-48.png',
  './icons/icon-maskable-512.png',
  './icons/icon-maskable.svg',
  './manifest.webmanifest',
];

function sameBytes(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  const x = new Uint8Array(a), y = new Uint8Array(b);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
  return true;
}

/* A release is the whole SHELL together. Files from two releases must never be mixed, because
   the scripts depend on each other. So an update is downloaded into a separate staging cache
   and the live cache is only touched once every file has arrived:

     1. fetch every shell file past the HTTP cache; any failure abandons the update
     2. write them all to the staging cache, then a marker that says "complete"
     3. copy staging into the live cache, then delete staging

   If the worker is stopped during step 3, the complete staging cache is still there and the copy
   is finished the next time the worker starts. Requests wait for a copy in progress. */
const STAGING = 'soil-staging';
const COMPLETE = './__release-complete';

/* Copies a complete staging cache into the live cache. Does nothing if staging is absent or unfinished. */
function promote() {
  return caches.has(STAGING).then(has => {
    if (!has) return false;
    return caches.open(STAGING).then(stage => stage.match(COMPLETE).then(done => {
      if (!done) return caches.delete(STAGING).then(() => false);
      return caches.open(CACHE).then(live =>
        Promise.all(SHELL.map(url => stage.match(url).then(res => {
          if (!res) throw new Error('staging lost ' + url);
          return live.put(url, res);
        })))
      ).then(() => caches.delete(STAGING)).then(() => true);
    }));
  }).catch(() => false);
}

/* While sw.js itself is being replaced, the old worker and the new one run side by side and share
   these caches. A Web Lock, which is shared by every worker and page of the origin, keeps one
   worker from swapping a release in while another is swapping or reading. Where locks are not
   available the queue below still orders the work inside this worker. */
const LOCK = 'soil-release';
const locks = self.navigator && self.navigator.locks;
const exclusive = fn => (locks ? locks.request(LOCK, fn) : fn());
const shared = fn => (locks ? locks.request(LOCK, { mode: 'shared' }, fn) : fn());

/* everything that reads or replaces the live cache queues behind this, so a page never loads half a copy */
let settled = exclusive(promote);
const whenSettled = () => settled.then(() => null, () => null);

/* Downloads every shell file past the HTTP cache. Rejects if any file fails or takes too long.
   This runs outside the queue above: a slow network must never hold up pages opening from the cache. */
const FETCH_TIMEOUT = 30000;
function download() {
  return Promise.all(SHELL.map(url => {
    const stop = new AbortController();
    const timer = setTimeout(() => stop.abort(), FETCH_TIMEOUT);
    return fetch(url, { cache: 'no-cache', signal: stop.signal }).then(res => {
      if (!res || !res.ok) throw new Error('could not fetch ' + url);
      return res.clone().arrayBuffer().then(bytes => ({ url, res, bytes }));
    }).finally(() => clearTimeout(timer));
  }));
}

/* Swaps a downloaded release in. Resolves true only when a release was already saved and the new one differs. */
function swapIn(files) {
  return caches.open(CACHE).then(live =>
    Promise.all(files.map(f => live.match(f.url).then(old => (old ? old.arrayBuffer() : null)))).then(olds => {
      const had = olds.filter(Boolean).length;
      const same = had === files.length && files.every((f, i) => sameBytes(olds[i], f.bytes));
      if (same) return false;
      return caches.delete(STAGING).then(() => caches.open(STAGING)).then(stage =>
        Promise.all(files.map(f => stage.put(f.url, f.res)))
          .then(() => stage.put(COMPLETE, new Response('ok')))
      ).then(promote).then(done => done && had > 0);
    })
  ).catch(() => false);
}

/* Any download error leaves the saved release untouched. Only the local swap joins the queue,
   one at a time, each after the previous has settled. */
function refreshShell() {
  return download().then(files => {
    const run = whenSettled().then(() => exclusive(() => swapIn(files)));
    settled = run;
    return run;
  }, () => false);
}

const announce = () => self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => list.forEach(c => c.postMessage('updated')));

/* install: save the shell, then take over at once. Safe because the cache name is stable,
   so a new worker never strands an open page on a deleted cache. */
self.addEventListener('install', e => {
  /* when this worker replaces an older one and brings new files, the open pages are told here too,
     in case the older worker's own check lost the race for the lock and saw nothing new */
  e.waitUntil(refreshShell().then(changed => (changed ? announce() : null)).then(() => self.skipWaiting()));
});

/* activate: delete only this app's other caches (the old versioned ones). Cache Storage is
   shared by the whole origin, and on <user>.github.io that is every project page, so caches
   without our prefix are never touched. */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => (k.indexOf(CACHE_PREFIX) === 0 && k !== CACHE && k !== STAGING ? caches.delete(k) : null))))
      .then(() => self.clients.claim())
  );
});

/* A saved file is handed to the page marked "no-cache". Without that, the browser may keep reusing the copy it
   already holds in memory for as long as the host's max-age allows, and a refresh would show the old app. */
const fromShell = request => whenSettled().then(() => shared(() => caches.open(CACHE).then(c => c.match(request, { ignoreSearch: true })))).then(hit => {
  if (!hit) return hit;
  const headers = new Headers(hit.headers);
  headers.set('cache-control', 'no-cache');
  return new Response(hit.body, { status: hit.status, statusText: hit.statusText, headers });
});

/* fetch:
   - navigations  -> the saved app, instantly; the network only if nothing is saved
   - same-origin  -> this app's cache first, then the network. Shell files are saved only as a
                     whole release (see above); other files are saved as they come back
   - cross-origin -> left alone
   Freshness is handled by the "check" message, not here. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  const inShell = SHELL.some(f => new URL(f, self.location.href).pathname === url.pathname);
  const save = (key, res) => {
    if (!inShell && res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
    return res;
  };
  if (req.mode === 'navigate') {
    e.respondWith(fromShell(INDEX).then(hit => hit || fetch(req)));
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
        return announce();
      })
    );
    return;
  }
  /* The page asks what is saved, so it can say whether the app will open without a connection.
     "updated" is the newest Last-Modified among the saved files: when the content was last published. */
  if (e.data && e.data.type === 'soil-status' && e.ports && e.ports[0]) {
    e.waitUntil(
      whenSettled().then(() => caches.open(CACHE)).then(async c => {
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
