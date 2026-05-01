<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\BonusDay;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: BonusDay::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: BonusDay::class)]
#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: BonusDay::class)]
class BonusDayListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function postPersist(BonusDay $bonusDay, PostPersistEventArgs $event): void
    {
        $this->updateAllParticipations($bonusDay);
    }

    public function postUpdate(BonusDay $bonusDay, PostUpdateEventArgs $event): void
    {
        $this->updateAllParticipations($bonusDay);
    }

    public function postRemove(BonusDay $bonusDay, PostRemoveEventArgs $event): void
    {
        $this->updateAllParticipations($bonusDay);
    }

    private function updateAllParticipations(BonusDay $bonusDay): void
    {
        $competition = $bonusDay->getCompetition();

        if (!$competition) {
            return;
        }

        foreach ($competition->getParticipations() as $participation) {
            $participation->updateScore();
        }

        $this->entityManager->flush();
    }
}
