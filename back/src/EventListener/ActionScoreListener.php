<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Action;
use App\Entity\Participation;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: Action::class)]
class ActionScoreListener
{
    public function preRemove(Action $action, PreRemoveEventArgs $event): void
    {
        $participation = $action->getParticipation();
        $em = $event->getObjectManager();

        if (!$participation || !$em instanceof EntityManagerInterface) {
            return;
        }

        $participation->getActions()->removeElement($action);

        $participation->updateScore();

        $uow = $em->getUnitOfWork();
        $meta = $em->getClassMetadata(Participation::class);
        $uow->computeChangeSet($meta, $participation);

        error_log('DELETE UPDATE: Score recalculé après suppression.');
    }
}
