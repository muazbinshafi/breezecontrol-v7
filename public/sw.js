// BreezeControl service worker — precaches MediaPipe WASM + the
// HandLandmarker model so the second visit to /demo initializes in
// <500 ms instead of ~3 s. Network-first for HTML, cache-first for
// the heavy ML assets.
/* eslint-disable no-restricted-globals */

const VERSION = "v1";
const CACHE = `breezecontrol-${VERSION}`;

const PRECACHE_HOSTS = ["cdn.jsdelivr.net", "storage.googleapis.com"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isMlAsset = PRECACHE_HOSTS.includes(url.host);
  if (!isMlAsset) return; // let everything else hit the network normally

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        // Last-resort: serve a cached copy if any partial match exists.
        const fallback = await cache.match(req, { ignoreVary: true, ignoreSearch: true });
        if (fallback) return fallback;
        throw err;
      }
    })(),
  );
});
