<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Competition;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::preUpdate, method: 'preUpdate', entity: Competition::class)]
class CompetitionListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function preUpdate(Competition $competition, PreUpdateEventArgs $event): void
    {
        if ($event->hasChangedField('endDate')) {
            $newEndDate = $event->getNewValue('endDate');

            if (null !== $newEndDate && $competition->getIsFinished()) {
                $competition->setFogOfWar(false);
            }
        }

        if ($event->hasChangedField('startDate') || $event->hasChangedField('endDate')) {
            $this->cleanOutOfBoundsBonusDays($competition);
        }
    }

    /**
     * Supprime automatiquement les jours bonus qui ne sont plus compris
     * dans les nouvelles dates de la compétition.
     */
    private function cleanOutOfBoundsBonusDays(Competition $competition): void
    {
        $startStr = $competition->getStartDate()?->format('Y-m-d');
        $endStr = $competition->getEndDate()?->format('Y-m-d');

        foreach ($competition->getBonusDays() as $bonusDay) {
            $bonusDateStr = $bonusDay->getDate()->format('Y-m-d');

            $isBeforeStart = null !== $startStr && $bonusDateStr < $startStr;
            $isAfterEnd = null !== $endStr && $bonusDateStr > $endStr;

            if ($isBeforeStart || $isAfterEnd) {
                $competition->removeBonusDay($bonusDay);
                $this->entityManager->remove($bonusDay);
            }
        }
    }
}
