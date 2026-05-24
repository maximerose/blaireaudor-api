<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Constants\NotificationConstants;
use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Notification;
use App\Entity\User;
use App\Enum\ActionStatus;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Action::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Action::class)]
final class NotificationTriggerListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function postPersist(Action $action, PostPersistEventArgs $event): void
    {
        $this->handleActionLifecycle($action, null);
    }

    public function postUpdate(Action $action, PostUpdateEventArgs $event): void
    {
        $unitOfWork = $event->getObjectManager()->getUnitOfWork();
        $changeSet = $unitOfWork->getEntityChangeSet($action);

        $oldStatusRaw = isset($changeSet['status']) ? $changeSet['status'][0] : null;

        $oldStatus = $oldStatusRaw instanceof ActionStatus
            ? $oldStatusRaw
            : (\is_string($oldStatusRaw) ? ActionStatus::tryFrom($oldStatusRaw) : null);

        $this->handleActionLifecycle($action, $oldStatus);
    }

    /**
     * Chef d'orchestre du cycle de vie des notifications d'actions.
     */
    private function handleActionLifecycle(Action $action, ?ActionStatus $oldStatus): void
    {
        $competition = $action->getCompetition();
        if (!$competition) {
            return;
        }

        $currentStatus = $action->getStatus();
        $notifications = [];

        // 1. Demande d'arbitrage (NEW_SUBMISSION)
        if (null === $oldStatus && ActionStatus::PENDING === $currentStatus) {
            $notifications = [...$notifications, ...$this->createNewSubmissionNotifications($action, $competition)];
        }

        // 2. Validation du méfait (ACTION_VALIDATED)
        if ((null === $oldStatus && ActionStatus::VALIDATED === $currentStatus)
            || (ActionStatus::PENDING === $oldStatus && ActionStatus::VALIDATED === $currentStatus)) {
            $notifications = [...$notifications, ...$this->createActionValidatedNotifications($action, $competition)];
        }

        // 3. Rejet du signalement (ACTION_REJECTED)
        if (ActionStatus::PENDING === $oldStatus && ActionStatus::REJECTED === $currentStatus) {
            $notifications[] = $this->createActionRejectedNotification($action, $competition);
        }

        // Sauvegarde groupée
        $this->persistNotifications($notifications);
    }

    /**
     * Gère le cas NEW_SUBMISSION (Alerte pour l'équipe d'arbitrage).
     */
    private function createNewSubmissionNotifications(Action $action, Competition $competition): array
    {
        $notifications = [];
        $targetName = $action->getParticipation()?->getPlayer()?->getDisplayName() ?? 'Un joueur';

        foreach ($competition->getReferees() as $refereePlayer) {
            $recipient = $refereePlayer->getAssociatedUser();
            if ($recipient) {
                $notifications[] = $this->buildNotification(
                    $recipient,
                    NotificationConstants::TITLE_NEW_SUBMISSION,
                    \sprintf(NotificationConstants::MSG_NEW_SUBMISSION, $targetName),
                    NotificationConstants::TYPE_NEW_SUBMISSION,
                    $competition
                );
            }
        }

        return $notifications;
    }

    /**
     * Gère le cas ACTION_VALIDATED (Alerte cible + reste du monde selon le Brouillard).
     */
    private function createActionValidatedNotifications(Action $action, Competition $competition): array
    {
        $notifications = [];
        $targetPlayer = $action->getParticipation()?->getPlayer();
        $targetUser = $targetPlayer?->getAssociatedUser();

        // Cas A : Le brouillard est actif -> Seule la cible sait, mais sans les points
        if ($competition->hasFogOfWar()) {
            if ($targetUser) {
                $notifications[] = $this->buildNotification(
                    $targetUser,
                    NotificationConstants::TITLE_ACTION_VALIDATED,
                    \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_FOG, $action->getDescription()),
                    NotificationConstants::TYPE_ACTION_VALIDATED,
                    $competition
                );
            }

            return $notifications;
        }

        // Cas B : Pas de brouillard -> On balance les points à tout le monde
        if ($targetUser) {
            $notifications[] = $this->buildNotification(
                $targetUser,
                NotificationConstants::TITLE_ACTION_VALIDATED,
                \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_TARGET, $action->getPoints(), $action->getDescription()),
                NotificationConstants::TYPE_ACTION_VALIDATED,
                $competition
            );
        }

        foreach ($competition->getParticipations() as $participation) {
            $otherPlayer = $participation->getPlayer();
            if ($otherPlayer === $targetPlayer) {
                continue;
            }

            $otherUser = $otherPlayer?->getAssociatedUser();
            if ($otherUser) {
                $notifications[] = $this->buildNotification(
                    $otherUser,
                    NotificationConstants::TITLE_ACTION_VALIDATED,
                    \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_OTHERS, $targetPlayer->getDisplayName(), $action->getPoints(), $action->getDescription()),
                    NotificationConstants::TYPE_ACTION_VALIDATED,
                    $competition
                );
            }
        }

        return $notifications;
    }

    /**
     * Gère le cas ACTION_REJECTED (Alerte pour l'auteur du signalement).
     */
    private function createActionRejectedNotification(Action $action, Competition $competition): Notification
    {
        $recipient = $action->getCreatedBy();
        $targetName = $action->getParticipation()?->getPlayer()?->getDisplayName() ?? 'Un joueur';

        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_ACTION_REJECTED,
            \sprintf(NotificationConstants::MSG_ACTION_REJECTED, $targetName),
            NotificationConstants::TYPE_ACTION_REJECTED,
            $competition
        );
    }

    /**
     * Mass-persist & flush en base de données.
     */
    private function persistNotifications(array $notifications): void
    {
        if (empty($notifications)) {
            return;
        }

        foreach ($notifications as $notification) {
            $this->entityManager->persist($notification);
        }
        $this->entityManager->flush();
    }

    private function buildNotification(
        User $recipient,
        string $title,
        string $message,
        string $type,
        Competition $competition,
    ): Notification {
        $notification = new Notification();
        $notification->setRecipient($recipient);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType($type);
        $notification->setTargetUrl('/competitions/'.$competition->getJoinCode());

        return $notification;
    }
}
