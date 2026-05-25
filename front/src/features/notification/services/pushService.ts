import { API, apiFetch } from '@/shared';

export const pushService = {
  /**
   * Envoie l'objet PushSubscription généré par le navigateur à notre Back-end Symfony
   */
  subscribe: async (subscription: PushSubscription): Promise<void> => {
    // La méthode toJSON() du PushSubscription extrait automatiquement l'endpoint et les clés P256DH/Auth
    const subJson = subscription.toJSON();

    const payload = {
      endpoint: subJson.endpoint,
      p256dh: subJson.keys?.p256dh,
      auth: subJson.keys?.auth,
    };

    await apiFetch(API.ENDPOINTS.NOTIFICATIONS.PUSH_SUBSCRIBE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
