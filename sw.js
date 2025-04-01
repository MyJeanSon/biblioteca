
// Importar el script de PushAlert
importScripts("https://cdn.pushalert.co/sw-80323_2.js");

// Nombre del caché
const CACHE_NAME = 'biblioteca-v1';

// Archivos a cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/servicios.html',
  '/busqueda.html',
  '/sugerencias.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/style.css',
  '/script.js'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Intercepta solicitudes y devuelve recursos desde el caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});