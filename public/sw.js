/* Photo Contest Radar service worker
 * - Makes the site installable and lets it open offline.
 * - The page and icons are served from cache first; the contest list
 *   (/data/radar.json) is fetched fresh when online, with the cached copy
 *   as the offline fallback, so new contests show up as soon as they're pushed.
 */
const CACHE = "pcr-shell-v1";
const DATA = "/data/radar.json";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", DATA];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req) {
  const c = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(req) {
  const c = await caches.open(CACHE);
  const hit = await c.match(req);
  if (hit) {
    // Refresh in the background so the next visit gets the newest page.
    fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); }).catch(() => {});
    return hit;
  }
  const res = await fetch(req);
  if (res.ok && new URL(req.url).origin === location.origin) c.put(req, res.clone());
  return res;
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fonts load straight from Google
  if (url.pathname === DATA) { e.respondWith(networkFirst(e.request)); return; }
  if (e.request.mode === "navigate") { e.respondWith(networkFirst(new Request("/")).catch(() => caches.match("/"))); return; }
  e.respondWith(cacheFirst(e.request));
});
