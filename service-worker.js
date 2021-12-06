var cacheStatic = "cacheStatic@GeraldineV1";
var cacheInmutable = "cacheInmutable@GeraldineV1";
var cacheDinamyc = "cacheDinamyc@GeraldineV1";

const files = [
  "public/css/style.css",
  "public/js/index.js",
  "index.html",
  "app.js",
];
const inmutable_files = [
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css",
];

self.addEventListener("install", (event) => {
  console.log("install SW");

  const guardarCacheStatic = caches
    .open(cacheStatic)
    .then((cache) => cache.addAll(files));

  const guardarCacheInmutable = caches
    .open(cacheInmutable)
    .then((cache) => cache.addAll(inmutable_files));

  event.waitUntil(Promise.all([guardarCacheStatic, guardarCacheInmutable]));
});

//primero la red, manda a traer los archivos de la red, si no los encuentra, hace un recorrido en el cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((respuestaRed) => {
      return respuestaRed || caches.match(event.request);
    })
  );
});

//cuando se activa el service worker se actualiza el cache
self.addEventListener("activate", (event) => {
  const cacheList = [cacheStatic, cacheInmutable, cacheDinamyc];

  console.log("Activado");
  event.waitUntil(
    caches.keys().then((cachesNames) =>
      cachesNames.map((cacheName) => {
        if (cacheList.indexOf(cacheName) === -1) {
          console.log("activado");
          return caches.delete(cacheName);
        }
      })
    )
  );
});
