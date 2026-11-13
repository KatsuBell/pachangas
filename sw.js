// Service worker sencillo: siempre intenta la red y, sin cobertura, usa la última copia guardada
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || (u.origin !== location.origin && !u.hostname.endsWith('gstatic.com'))) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open('pachangas-v1').then(ca => ca.put(e.request, c)).catch(() => {}); return r; }).catch(() => caches.match(e.request)));
});
