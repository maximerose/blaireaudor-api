import { useEffect, useRef } from 'react';
import { useAuthContext } from '@/features/account/context/AuthContext';
import { pushService } from '@/features/notification/services';

/**
 * Utilitaire natif Web Push : Convertit la clé VAPID Base64 en Uint8Array
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushSubscription = () => {
  const { user } = useAuthContext();
  const hasAttempted = useRef(false);

  useEffect(() => {
    // Garde-fous : On évite de s'abonner plusieurs fois par session
    // et on s'assure que le navigateur gère les Service Workers
    if (
      !user ||
      hasAttempted.current ||
      !('serviceWorker' in navigator) ||
      !('PushManager' in window)
    ) {
      return;
    }

    const registerPush = async () => {
      hasAttempted.current = true;

      try {
        // 1. Demande d'autorisation système à l'utilisateur
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // 2. Enregistrement du fichier sw.js
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // 3. Récupération de la clé VAPID
        const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
          console.warn('VITE_VAPID_PUBLIC_KEY manquante dans .env.local');
          return;
        }

        // 4. Génération de l'abonnement via Google/Apple
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // 5. Sauvegarde côté Symfony
        await pushService.subscribe(subscription);
      } catch (error) {
        console.error('Erreur lors de la souscription Web Push:', error);
      }
    };

    registerPush();
  }, [user]);
};
