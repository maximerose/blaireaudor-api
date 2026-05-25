self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  // On extrait le payload envoyé par notre WebPushNotificationListener PHP
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Le Blaireau d'Or";

  const options = {
    body: data.message || "Il y a du mouvement dans l'arène !",
    icon: '/vite.svg', // Tu pourras remplacer par un beau logo de Blaireau plus tard
    badge: '/vite.svg', // Petite icône monochrome pour la barre de statut Android
    data: {
      url: data.targetUrl || '/'
    },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  // On ferme la notification système
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  // On cherche si l'application est déjà ouverte dans un onglet
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si oui, on ramène l'onglet au premier plan et on navigue
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url && 'focus' in client) {
          client.focus();
          if (urlToOpen) return client.navigate(urlToOpen);
          return;
        }
      }
      // Sinon, on ouvre carrément une nouvelle fenêtre sur la bonne URL
      if (clients.openWindow && urlToOpen) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});