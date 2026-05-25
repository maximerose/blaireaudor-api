<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Notification;
use App\Repository\PushSubscriptionRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Notification::class)]
final readonly class WebPushNotificationListener
{
    public function __construct(
        private PushSubscriptionRepository $pushSubscriptionRepository,
        private WebPush $webPush,
    ) {
    }

    /**
     * Pousse la notification via VAPID aux navigateurs endormis.
     */
    public function postPersist(Notification $notification, PostPersistEventArgs $event): void
    {
        $recipient = $notification->getRecipient();
        if (!$recipient) {
            return;
        }

        // On récupère tous les appareils (téléphone, PC de bureau) du joueur
        $subscriptions = $this->pushSubscriptionRepository->findBy(['user' => $recipient]);

        if (empty($subscriptions)) {
            return;
        }

        // Le payload natif pour le Service Worker
        $payload = json_encode([
            'title' => $notification->getTitle(),
            'message' => $notification->getMessage(),
            'targetUrl' => $notification->getTargetUrl() ?? '/',
        ]);

        foreach ($subscriptions as $sub) {
            $pushSubscription = Subscription::create([
                'endpoint' => $sub->getEndpoint(),
                'keys' => [
                    'p256dh' => $sub->getP256dh(),
                    'auth' => $sub->getAuth(),
                ],
            ]);

            $this->webPush->queueNotification($pushSubscription, $payload);
        }

        // Envoi groupé vers les serveurs de Google, Apple et Mozilla
        $this->webPush->flush();
    }
}
