<?php

declare(strict_types=1);

namespace App\Service\Notification;

use App\Entity\Competition;
use App\Entity\Notification;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

final readonly class NotificationBuilder
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    public function createAndPersist(User $recipient, string $title, string $message, string $type, ?Competition $competition = null): void
    {
        $prefs = $recipient->getNotificationPreferences();
        if (isset($prefs[$type]) && false === $prefs[$type]) {
            return;
        }

        $notification = new Notification();
        $notification->setRecipient($recipient);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType($type);
        $notification->setTargetUrl($competition ? '/competitions/'.$competition->getJoinCode() : '/');

        $this->entityManager->persist($notification);
    }

    public function notifyParticipants(Competition $competition, string $title, string $message, string $type, array $excludeUsers = []): void
    {
        $currentUser = $this->security->getUser();
        if ($currentUser instanceof User) {
            $excludeUsers[] = $currentUser;
        }

        foreach ($competition->getParticipations() as $participation) {
            $recipient = $participation->getPlayer()?->getAssociatedUser();
            if ($recipient && !\in_array($recipient, $excludeUsers, true)) {
                $this->createAndPersist($recipient, $title, $message, $type, $competition);
            }
        }
    }

    public function flush(): void
    {
        $this->entityManager->flush();
    }
}
