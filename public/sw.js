// Service Worker for brewfellow PWA
// Provides offline support and asset caching

const CACHE_NAME = "brewfellow-v5";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/styles.css",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files");
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("Service Worker: Clearing old cache");
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip caching for API calls (Cloud Functions, external APIs)
  if (
    event.request.method !== "GET" ||
    url.pathname.includes("/us-central1/") ||
    url.hostname.includes("cloudfunctions.net")
  ) {
    return; // Let the browser handle it normally
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      }),
  );
});
