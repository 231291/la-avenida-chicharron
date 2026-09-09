const CACHE_NAME = 'avenida-v1';

self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Notificación push real — llega aunque la app esté cerrada del todo o el
// celular bloqueado, mandada por la Edge Function de Supabase.
self.addEventListener('push', (e) => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) { data = {}; }
  const title = data.title || 'La Avenida Chicharrón';
  e.waitUntil(self.registration.showNotification(title, {
    body: data.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag || undefined,
    vibrate: [300, 150, 300, 150, 300],
    requireInteraction: true
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      for (const cliente of lista) { if ('focus' in cliente) return cliente.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('/');
    })
  );
});
