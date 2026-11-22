/* Service worker: guarda os arquivos do app para abrir rápido e sem internet.
   As chamadas /api (dados e IA) nunca passam pelo cache. */
const CACHE = 'lifemaxxing-v19';
const CACHE_EX = 'lifemaxxing-exercicios'; // fotos dos exercícios (ficam entre versões)
const ARQUIVOS = ['./', './index.html', './styles.css', './app.js', './data.js', './fx.js', './pet.js', './logos.js', './exercicios.js', './vendor/motion-14.10.1.js', './manifest.json', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== CACHE_EX).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Rede primeiro (pega atualizações), cache quando estiver sem internet
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // fotos dos exercícios: cache primeiro (funciona na academia sem sinal)
  if (e.request.method === 'GET' && url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/free-exercise-db@')) {
    e.respondWith(caches.open(CACHE_EX).then((c) => c.match(e.request).then((m) => m || fetch(e.request).then((r) => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }))));
    return;
  }
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      if (r.ok) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); }
      return r;
    }).catch(() => caches.match(e.request).then((m) => m || caches.match('./index.html')))
  );
});
