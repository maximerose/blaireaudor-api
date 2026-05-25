<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Constants\NotificationConstants;
use App\Entity\Action;
use App\Entity\BonusDay;
use App\Entity\Competition;
use App\Entity\Notification;
use App\Entity\Participation;
use App\Entity\User;
use App\Enum\ActionStatus;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;
use Symfony\Bundle\SecurityBundle\Security;

#[AsEntityListener(event: Events::postPersist, method: 'postPersistAction', entity: Action::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdateAction', entity: Action::class)]
#[AsEntityListener(event: Events::postPersist, method: 'postPersistParticipation', entity: Participation::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdateCompetition', entity: Competition::class)]
#[AsEntityListener(event: Events::postPersist, method: 'postPersistBonusDay', entity: BonusDay::class)]
final class NotificationTriggerListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    public function postPersistAction(Action $action, PostPersistEventArgs $event): void
    {
        $this->handleActionLifecycle($action, null);
    }

    public function postUpdateAction(Action $action, PostUpdateEventArgs $event): void
    {
        $unitOfWork = $event->getObjectManager()->getUnitOfWork();
        $changeSet = $unitOfWork->getEntityChangeSet($action);

        $oldStatusRaw = isset($changeSet['status']) ? $changeSet['status'][0] : null;
        $oldStatus = $oldStatusRaw instanceof ActionStatus
            ? $oldStatusRaw
            : (\is_string($oldStatusRaw) ? ActionStatus::tryFrom($oldStatusRaw) : null);

        $this->handleActionLifecycle($action, $oldStatus);
    }

    public function postPersistParticipation(Participation $participation, PostPersistEventArgs $event): void
    {
        $this->persistNotifications($this->createParticipationNotifications($participation));
    }

    public function postUpdateCompetition(Competition $competition, PostUpdateEventArgs $event): void
    {
        $unitOfWork = $event->getObjectManager()->getUnitOfWork();
        $changeSet = $unitOfWork->getEntityChangeSet($competition);

        $notifications = [
            ...$this->createCompetitionFogNotifications($competition, $changeSet),
            ...$this->createCompetitionFinishedNotifications($competition, $changeSet),
        ];

        $this->persistNotifications($notifications);
    }

    public function postPersistBonusDay(BonusDay $bonusDay, PostPersistEventArgs $event): void
    {
        $competition = $bonusDay->getCompetition();
        if (!$competition) {
            return;
        }

        $notifications = $this->notifyAllParticipants(
            $competition,
            NotificationConstants::TITLE_BONUS_TRIGGERED,
            \sprintf(NotificationConstants::MSG_BONUS_TRIGGERED, $bonusDay->getMultiplier()),
            NotificationConstants::TYPE_BONUS_TRIGGERED
        );

        $this->persistNotifications($notifications);
    }

    // ─── FONCTIONS PRIVÉES DE ROUTAGE MÉTIER ───────────────────────────────

    private function handleActionLifecycle(Action $action, ?ActionStatus $oldStatus): void
    {
        $competition = $action->getCompetition();
        if (!$competition) {
            return;
        }

        $currentStatus = $action->getStatus();
        $notifications = [];

        if (null === $oldStatus && ActionStatus::PENDING === $currentStatus) {
            $notifications = [...$notifications, ...$this->createNewSubmissionNotifications($action, $competition)];
        }

        if ((null === $oldStatus && ActionStatus::VALIDATED === $currentStatus)
            || (ActionStatus::PENDING === $oldStatus && ActionStatus::VALIDATED === $currentStatus)) {
            $notifications = [...$notifications, ...$this->createActionValidatedNotifications($action, $competition)];
        }

        if (ActionStatus::PENDING === $oldStatus && ActionStatus::REJECTED === $currentStatus) {
            $notification = $this->createActionRejectedNotification($action, $competition);
            if ($notification) {
                $notifications[] = $notification;
            }
        }

        $this->persistNotifications($notifications);
    }

    private function createParticipationNotifications(Participation $participation): array
    {
        $competition = $participation->getCompetition();
        $player = $participation->getPlayer();
        if (!$competition || !$player) {
            return [];
        }

        $currentUser = $this->security->getUser();
        $notifications = [];

        $isSelfJoin = $currentUser instanceof User && $player->getAssociatedUser() && $player->getAssociatedUser()->getUserIdentifier() === $currentUser->getUserIdentifier();

        // 1. Si ajouté par un arbitre, on prévient la cible
        if (!$isSelfJoin) {
            $recipient = $player->getAssociatedUser();
            if ($recipient) {
                $refereeName = $currentUser instanceof User && $currentUser->getPlayer()
                    ? $currentUser->getPlayer()->getDisplayName()
                    : 'Un arbitre';

                $notifications[] = $this->buildPlayerAddedByRefereeNotification($recipient, $refereeName, $competition);
            }
        }

        // 2. Dans TOUS les cas, on prévient les autres joueurs que quelqu'un est entré
        foreach ($competition->getParticipations() as $p) {
            $otherUser = $p->getPlayer()?->getAssociatedUser();

            // On ne notifie pas le nouveau joueur, ni l'arbitre qui l'a fait rentrer
            if ($otherUser && $p->getPlayer() !== $player) {
                if ($currentUser instanceof User && $otherUser->getUserIdentifier() === $currentUser->getUserIdentifier()) {
                    continue;
                }
                $notifications[] = $this->buildPlayerJoinedNotification($otherUser, $player->getDisplayName(), $competition);
            }
        }

        return $notifications;
    }

    private function createCompetitionFogNotifications(Competition $competition, array $changeSet): array
    {
        if (!isset($changeSet['fogOfWar'])) {
            return [];
        }

        $oldFog = $changeSet['fogOfWar'][0];
        $newFog = $changeSet['fogOfWar'][1];

        if (true === $oldFog && false === $newFog) {
            return $this->notifyAllParticipants(
                $competition,
                NotificationConstants::TITLE_FOG_DISABLED,
                NotificationConstants::MSG_FOG_DISABLED,
                NotificationConstants::TYPE_FOG_DISABLED
            );
        }

        if (false === $oldFog && true === $newFog) {
            return $this->notifyAllParticipants(
                $competition,
                NotificationConstants::TITLE_FOG_ENABLED,
                NotificationConstants::MSG_FOG_ENABLED,
                NotificationConstants::TYPE_FOG_ENABLED
            );
        }

        return [];
    }

    private function createCompetitionFinishedNotifications(Competition $competition, array $changeSet): array
    {
        if (isset($changeSet['endDate']) && $competition->getIsFinished()) {
            return $this->notifyAllParticipants(
                $competition,
                NotificationConstants::TITLE_COMPETITION_FINISHED,
                \sprintf(NotificationConstants::MSG_COMPETITION_FINISHED, $competition->getName()),
                NotificationConstants::TYPE_COMPETITION_FINISHED
            );
        }

        return [];
    }

    private function createNewSubmissionNotifications(Action $action, Competition $competition): array
    {
        $notifications = [];
        $targetName = $action->getParticipation()?->getPlayer()?->getDisplayName() ?? 'Un joueur';

        foreach ($competition->getReferees() as $refereePlayer) {
            $recipient = $refereePlayer->getAssociatedUser();
            if ($recipient) {
                $isTarget = $action->getParticipation()?->getPlayer() === $refereePlayer;
                $targetName = $isTarget ? 'TOI' : ($action->getParticipation()?->getPlayer()?->getDisplayName() ?? 'Un joueur');
                $notifications[] = $this->buildNewSubmissionNotification($recipient, $targetName, $competition);
            }
        }

        return $notifications;
    }

    private function createActionValidatedNotifications(Action $action, Competition $competition): array
    {
        $notifications = [];
        $targetPlayer = $action->getParticipation()?->getPlayer();
        $targetUser = $targetPlayer?->getAssociatedUser();
        $currentUser = $this->security->getUser();

        if ($competition->hasFogOfWar()) {
            foreach ($competition->getParticipations() as $participation) {
                $otherUser = $participation->getPlayer()?->getAssociatedUser();
                if (!$otherUser) {
                    continue;
                }

                if ($otherUser === $targetUser) {
                    $notifications[] = $this->buildActionValidatedFogTargetNotification($otherUser, $action->getDescription(), $competition);
                } else {
                    if ($currentUser instanceof User && $otherUser->getUserIdentifier() === $currentUser->getUserIdentifier()) {
                        continue;
                    }
                    $notifications[] = $this->buildActionValidatedFogOthersNotification($otherUser, $targetPlayer?->getDisplayName() ?? 'Un joueur', $competition);
                }
            }

            return $notifications;
        }

        // --- CLASSIQUE ---
        if ($targetUser) {
            $notifications[] = $this->buildActionValidatedTargetNotification($targetUser, $action->getPoints(), $action->getDescription(), $competition);
        }

        foreach ($competition->getParticipations() as $participation) {
            $otherPlayer = $participation->getPlayer();
            if ($otherPlayer === $targetPlayer) {
                continue;
            }

            $otherUser = $otherPlayer?->getAssociatedUser();
            if ($otherUser) {
                if ($currentUser instanceof User && $otherUser->getUserIdentifier() === $currentUser->getUserIdentifier()) {
                    continue;
                }

                $notifications[] = $this->buildActionValidatedOthersNotification($otherUser, $targetPlayer->getDisplayName(), $action->getPoints(), $action->getDescription(), $competition);
            }
        }

        return $notifications;
    }

    private function createActionRejectedNotification(Action $action, Competition $competition): ?Notification
    {
        $recipient = $action->getCreatedBy();
        if (!$recipient) {
            return null;
        }

        $targetName = $action->getParticipation()?->getPlayer()?->getDisplayName() ?? 'Un joueur';

        return $this->buildActionRejectedNotification($recipient, $targetName, $competition);
    }

    public function notifyAllParticipants(Competition $competition, string $title, string $message, string $type): array
    {
        $notifications = [];
        $currentUser = $this->security->getUser();

        foreach ($competition->getParticipations() as $participation) {
            $recipient = $participation->getPlayer()?->getAssociatedUser();

            if ($recipient) {
                if ($currentUser instanceof User && $recipient->getUserIdentifier() === $currentUser->getUserIdentifier()) {
                    continue;
                }

                $notifications[] = $this->buildNotification($recipient, $title, $message, $type, $competition);
            }
        }

        return $notifications;
    }

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

    // ─── USINES SÉMANTIQUES (NAMED FACTORIES) ───────────────────────────────

    private function buildActionValidatedFogTargetNotification(User $recipient, string $description, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_ACTION_VALIDATED,
            \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_FOG_TARGET, $description),
            NotificationConstants::TYPE_ACTION_VALIDATED,
            $competition
        );
    }

    private function buildActionValidatedFogOthersNotification(User $recipient, string $targetName, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_ACTION_VALIDATED,
            \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_FOG_OTHERS, $targetName),
            NotificationConstants::TYPE_ACTION_VALIDATED,
            $competition
        );
    }

    private function buildNewSubmissionNotification(User $recipient, string $targetName, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_NEW_SUBMISSION,
            \sprintf(NotificationConstants::MSG_NEW_SUBMISSION, $targetName),
            NotificationConstants::TYPE_NEW_SUBMISSION,
            $competition
        );
    }

    private function buildActionValidatedTargetNotification(User $recipient, int $points, string $description, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_ACTION_VALIDATED,
            \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_TARGET, $points, $description),
            NotificationConstants::TYPE_ACTION_VALIDATED,
            $competition
        );
    }

    private function buildActionValidatedOthersNotification(User $recipient, string $targetName, int $points, string $description, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_ACTION_VALIDATED,
            \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_OTHERS, $targetName, $points, $description),
            NotificationConstants::TYPE_ACTION_VALIDATED,
            $competition
        );
    }

    private function buildActionRejectedNotification(User $recipient, string $targetName, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_ACTION_REJECTED,
            \sprintf(NotificationConstants::MSG_ACTION_REJECTED, $targetName),
            NotificationConstants::TYPE_ACTION_REJECTED,
            $competition
        );
    }

    private function buildPlayerJoinedNotification(User $recipient, string $playerName, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_PLAYER_JOINED,
            \sprintf(NotificationConstants::MSG_PLAYER_JOINED, $playerName),
            NotificationConstants::TYPE_PLAYER_JOINED,
            $competition
        );
    }

    private function buildPlayerAddedByRefereeNotification(User $recipient, string $refereeName, Competition $competition): Notification
    {
        return $this->buildNotification(
            $recipient,
            NotificationConstants::TITLE_ADDED_BY_REFEREE,
            \sprintf(NotificationConstants::MSG_ADDED_BY_REFEREE, $refereeName, $competition->getName()),
            NotificationConstants::TYPE_ADDED_BY_REFEREE,
            $competition
        );
    }

    public function buildNotification(User $recipient, string $title, string $message, string $type, Competition $competition): Notification
    {
        $notification = new Notification();
        $notification->setRecipient($recipient);
        $notification->setTitle($title);
        $notification->setMessage($message);
        $notification->setType($type);
        $notification->setTargetUrl('/competitions/'.$competition->getJoinCode());

        return $notification;
    }
}
