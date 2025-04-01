
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
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta solicitudes y devuelve recursos desde el caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Archivo servido desde caché:', event.request.url);
          return response;
        }
        console.log('Archivo servido desde red:', event.request.url);
        return fetch(event.request).catch(() => {
          // Si no hay conexión, devuelve index.html para manejar rutas desconocidas
          return caches.match('/index.html');
        });
      })
  );
});