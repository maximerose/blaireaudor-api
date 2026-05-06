<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Action;
use App\Entity\Participation;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

#[AsEntityListener(event: Events::preUpdate, method: 'preUpdate', entity: Action::class)]
#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: Action::class)]
#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: Action::class)]
class ActionScoreListener
{
    public function prePersist(Action $action, PrePersistEventArgs $event): void
    {
        $this->updateParticipationScore($action, $event);
    }

    public function preUpdate(Action $action, PreUpdateEventArgs $event): void
    {
        $this->updateParticipationScore($action, $event);
    }

    public function preRemove(Action $action, PreRemoveEventArgs $event): void
    {
        $participation = $action->getParticipation();
        if ($participation) {
            $participation->getActions()->removeElement($action);

            $this->updateParticipationScore($action, $event);
        }
    }

    private function updateParticipationScore(Action $action, LifecycleEventArgs $event): void
    {
        $participation = $action->getParticipation();
        $em = $event->getObjectManager();

        if (!$participation || !$em instanceof EntityManagerInterface) {
            return;
        }

        $participation->updateScore();

        $uow = $em->getUnitOfWork();
        $meta = $em->getClassMetadata(Participation::class);
        $uow->computeChangeSet($meta, $participation);
    }
}
