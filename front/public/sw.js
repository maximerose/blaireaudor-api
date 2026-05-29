const CACHE_NAME = 'blaireau-cache-v1';

// --- 1. INSTALLATION & ACTIVATION PWA ---

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Nettoie les vieux caches si on change de version (v2, v3...)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim());
});

// --- 2. STRATÉGIE DE CACHE (Stale-While-Revalidate) ---

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.well-known/mercure')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // En cas de panne réseau (hors-ligne), on pioche dans le cache
        return caches.match(event.request);
      })
  );
});

// --- 3. NOTIFICATIONS PUSH (Existant) ---

self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  const data = event.data ? event.data.json() : {};
  const title = data.title || "Le Blaireau d'Or";

  const options = {
    body: data.message || "Il y a du mouvement dans l'arène !",
    icon: '/favicon.svg', // Icone de la notif dans la barre d'état
    badge: '/badge.svg', // Icone monochrome pour Android
    data: {
      url: data.targetUrl || '/'
    },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url && 'focus' in client) {
          client.focus();
          if (urlToOpen) return client.navigate(urlToOpen);
          return;
        }
      }
      if (clients.openWindow && urlToOpen) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});