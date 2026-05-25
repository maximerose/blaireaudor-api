<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Constants\NotificationConstants;
use App\Entity\Notification;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Notification::class)]
final readonly class MercureNotificationListener
{
    public function __construct(
        private HubInterface $hub,
        private SerializerInterface $serializer,
    ) {
    }

    /**
     * Pousse la notification dans le Hub Mercure dès qu'elle est sauvegardée en base.
     */
    public function postPersist(Notification $notification, PostPersistEventArgs $event): void
    {
        $recipient = $notification->getRecipient();
        if (!$recipient || !$recipient->getId()) {
            return;
        }

        // 1. Topic privé structuré autour de l'ID de l'utilisateur cible
        $topic = \sprintf(NotificationConstants::TOPIC_USER_NOTIFICATIONS, $recipient->getId()->toString());

        // 2. Sérialisation identique à ce que l'API REST renverrait
        $payload = $this->serializer->serialize(
            $notification,
            'json',
            ['groups' => ['notification:read']]
        );

        // 3. Création de la mise à jour (marquée comme privée pour des raisons de sécurité)
        $update = new Update(
            $topic,
            $payload,
            true
        );

        $this->hub->publish($update);
    }
}
