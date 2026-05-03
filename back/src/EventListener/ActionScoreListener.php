<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Action;
use App\Repository\ParticipationRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::preUpdate, method: 'preUpdate', entity: Action::class)]
#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: Action::class)]
#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: Action::class)]
class ActionScoreListener
{
    public function __construct(
        private ParticipationRepository $participationRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function prePersist(Action $action, PrePersistEventArgs $event): void
    {
        $this->updateParticipationScore($action);
    }

    public function preUpdate(Action $action, PreUpdateEventArgs $event): void
    {
        $this->updateParticipationScore($action);
    }

    public function preRemove(Action $action, PreRemoveEventArgs $event): void
    {
        $this->updateParticipationScore($action);
    }

    private function updateParticipationScore(Action $action): void
    {
        $participation = $action->getParticipation();

        if ($participation) {
            $participation->updateScore();
        }
    }
}
