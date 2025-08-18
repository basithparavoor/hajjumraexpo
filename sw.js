const CACHE_NAME = 'expo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/article.html',
  '/about.html',
  '/create.html',
  '/style.css',
  '/script.js',
  '/article.js',
  '/create.js',
  '/data.js'
];

// Install the service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});