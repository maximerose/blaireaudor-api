<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Competition;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::preUpdate, method: 'preUpdate', entity: Competition::class)]
#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: Competition::class)]
class CompetitionClosedListener
{
    public function prePersist(Competition $competition, PrePersistEventArgs $event): void
    {
        $this->normalizeEndDate($competition);
    }

    public function preUpdate(Competition $competition, PreUpdateEventArgs $event): void
    {
        if ($event->hasChangedField('endDate')) {
            $newEndDate = $event->getNewValue('endDate');

            if (null !== $newEndDate && $competition->getIsFinished()) {
                $competition->setFogOfWar(false);
            }
        }
    }

    private function normalizeEndDate(Competition $competition): void
    {
        $endDate = $competition->getEndDate();
        if ($endDate && '00:00:00' === $endDate->format('H:i:s')) {
            $competition->setEndDate($endDate->setTime(23, 59, 59));
        }
    }
}
