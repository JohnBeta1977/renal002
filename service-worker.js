// El nombre de la caché que usará nuestra PWA.
// Si actualizas los archivos, cambia 'v1' a 'v2', etc., para forzar la actualización.
const CACHE_NAME = 'medicalcare-cache-v1';

// La lista de archivos esenciales para que la aplicación funcione offline.
const urlsToCache = [
  '/',
  'index.html',
  'logo.png',
  'bg.jpg'
  // No es necesario cachear CSS o JS por separado porque están en index.html
];

// Evento 'install': Se dispara la primera vez que el usuario abre la PWA
// o cuando se detecta un nuevo service worker.
self.addEventListener('install', event => {
  // Esperamos a que la promesa de abrir la caché y agregar los archivos se complete.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta y archivos del App Shell agregados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la página solicita un recurso.
// Implementamos una estrategia "Cache First".
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso solicitado está en la caché, lo devolvemos desde ahí.
        if (response) {
          return response;
        }
        // Si no, lo buscamos en la red.
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': Se dispara cuando el service worker se activa.
// Es el lugar ideal para limpiar cachés antiguas y obsoletas.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si una caché no está en nuestra "lista blanca" (es de una versión anterior), la borramos.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
