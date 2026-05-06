<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\BonusDay;
use App\Entity\Participation;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: BonusDay::class)]
#[AsEntityListener(event: Events::preUpdate, method: 'preUpdate', entity: BonusDay::class)]
#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: BonusDay::class)]
class BonusDayListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function prePersist(BonusDay $bonusDay, LifecycleEventArgs $event): void
    {
        $this->updateAllParticipations($bonusDay, $event);
    }

    public function preUpdate(BonusDay $bonusDay, LifecycleEventArgs $event): void
    {
        $this->updateAllParticipations($bonusDay, $event);
    }

    public function preRemove(BonusDay $bonusDay, LifecycleEventArgs $event): void
    {
        $competition = $bonusDay->getCompetition();
        if ($competition) {
            $competition->getBonusDays()->removeElement($bonusDay);
        }

        $this->updateAllParticipations($bonusDay, $event);
    }

    private function updateAllParticipations(BonusDay $bonusDay, LifecycleEventArgs $event): void
    {
        $em = $event->getObjectManager();
        $competition = $bonusDay->getCompetition();

        if (!$competition || !$em instanceof EntityManagerInterface) {
            return;
        }

        $uow = $em->getUnitOfWork();
        $meta = $em->getClassMetadata(Participation::class);

        foreach ($competition->getParticipations() as $participation) {
            $participation->updateScore();
            $uow->computeChangeSet($meta, $participation);
        }
    }
}
