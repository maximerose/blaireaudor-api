<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\BonusDay;
use App\Service\Manager\ActionManager;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: BonusDay::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: BonusDay::class)]
#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: BonusDay::class)]
final class BonusDayListener
{
    public function __construct(
        private ActionManager $actionManager,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function postPersist(BonusDay $bonusDay, PostPersistEventArgs $event): void
    {
        $this->refreshScores($bonusDay);
    }

    public function postUpdate(BonusDay $bonusDay, PostUpdateEventArgs $event): void
    {
        $this->refreshScores($bonusDay);
    }

    public function postRemove(BonusDay $bonusDay, PostRemoveEventArgs $event): void
    {
        $this->refreshScores($bonusDay);
    }

    private function refreshScores(BonusDay $bonusDay): void
    {
        $competition = $bonusDay->getCompetition();
        if ($competition && $this->entityManager->contains($competition)) {
            $this->actionManager->updateAllCompetitionScores($competition);
        }
    }
}
