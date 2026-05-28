<?php

declare(strict_types=1);

namespace App\EventListener\Notification;

use App\Constants\NotificationConstants;
use App\Entity\Action;
use App\Enum\ActionStatus;
use App\Service\Notification\NotificationBuilder;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Action::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Action::class)]
final readonly class ActionNotifier
{
    public function __construct(private NotificationBuilder $builder)
    {
    }

    public function postPersist(Action $action, PostPersistEventArgs $event): void
    {
        $this->handleLifecycle($action, null);
    }

    public function postUpdate(Action $action, PostUpdateEventArgs $event): void
    {
        $changeSet = $event->getObjectManager()->getUnitOfWork()->getEntityChangeSet($action);
        $oldStatusRaw = $changeSet['status'][0] ?? null;
        $oldStatus = $oldStatusRaw instanceof ActionStatus ? $oldStatusRaw : (\is_string($oldStatusRaw) ? ActionStatus::tryFrom($oldStatusRaw) : null);

        $this->handleLifecycle($action, $oldStatus);
    }

    private function handleLifecycle(Action $action, ?ActionStatus $oldStatus): void
    {
        $comp = $action->getCompetition();
        if (!$comp) {
            return;
        }

        $currentStatus = $action->getStatus();
        $targetName = $action->getParticipation()?->getPlayer()?->getDisplayName() ?? 'Un joueur';

        if (null === $oldStatus && ActionStatus::PENDING === $currentStatus) {
            $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_NEW_SUBMISSION];
            foreach ($comp->getReferees() as $ref) {
                if ($user = $ref->getAssociatedUser()) {
                    $isTarget = $action->getParticipation()?->getPlayer() === $ref;
                    $this->builder->createAndPersist($user, $content['title'], \sprintf($content['msg'], $isTarget ? 'TOI' : $targetName), NotificationConstants::TYPE_NEW_SUBMISSION, $comp);
                }
            }
        }

        if (ActionStatus::VALIDATED === $currentStatus && ActionStatus::VALIDATED !== $oldStatus) {
            $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_ACTION_VALIDATED];
            $targetUser = $action->getParticipation()?->getPlayer()?->getAssociatedUser();

            if ($comp->hasFogOfWar()) {
                if ($targetUser) {
                    $this->builder->createAndPersist($targetUser, $content['title'], \sprintf($content['msg_fog_target'], $action->getDescription()), NotificationConstants::TYPE_ACTION_VALIDATED, $comp);
                }
                $this->builder->notifyParticipants($comp, $content['title'], \sprintf($content['msg_fog_others'], $targetName), NotificationConstants::TYPE_ACTION_VALIDATED, $targetUser ? [$targetUser] : []);
            } else {
                if ($targetUser) {
                    $this->builder->createAndPersist($targetUser, $content['title'], \sprintf($content['msg_target'], $action->getPoints(), $action->getDescription()), NotificationConstants::TYPE_ACTION_VALIDATED, $comp);
                }
                $this->builder->notifyParticipants($comp, $content['title'], \sprintf($content['msg_others'], $targetName, $action->getPoints(), $action->getDescription()), NotificationConstants::TYPE_ACTION_VALIDATED, $targetUser ? [$targetUser] : []);
            }
        }

        if (ActionStatus::REJECTED === $currentStatus && ActionStatus::PENDING === $oldStatus) {
            $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_ACTION_REJECTED];
            if ($creator = $action->getCreatedBy()) {
                $this->builder->createAndPersist($creator, $content['title'], \sprintf($content['msg'], $targetName), NotificationConstants::TYPE_ACTION_REJECTED, $comp);
            }
        }

        $this->builder->flush();
    }
}
