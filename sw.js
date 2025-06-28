const CACHE_NAME = 'kombi-generator-final-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching statische Assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(err => {
        console.warn('Fehler beim Caching:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  // Umgehe Service Worker für Datenanfragen
  if (event.request.url.includes('/data/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    ))
  );
});