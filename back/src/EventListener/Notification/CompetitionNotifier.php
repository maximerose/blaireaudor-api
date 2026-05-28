<?php

declare(strict_types=1);

namespace App\EventListener\Notification;

use App\Constants\NotificationConstants;
use App\Entity\Competition;
use App\Service\Notification\NotificationBuilder;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Competition::class)]
final readonly class CompetitionNotifier
{
    public function __construct(private NotificationBuilder $builder)
    {
    }

    public function postUpdate(Competition $comp, PostUpdateEventArgs $event): void
    {
        $changeSet = $event->getObjectManager()->getUnitOfWork()->getEntityChangeSet($comp);

        if (isset($changeSet['fogOfWar'])) {
            if (true === $changeSet['fogOfWar'][0] && false === $changeSet['fogOfWar'][1]) {
                $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_FOG_DISABLED];
                $this->builder->notifyParticipants($comp, $content['title'], $content['msg'], NotificationConstants::TYPE_FOG_DISABLED);
            } elseif (false === $changeSet['fogOfWar'][0] && true === $changeSet['fogOfWar'][1]) {
                $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_FOG_ENABLED];
                $this->builder->notifyParticipants($comp, $content['title'], $content['msg'], NotificationConstants::TYPE_FOG_ENABLED);
            }
        }

        if (isset($changeSet['endDate']) && $comp->getIsFinished()) {
            $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_COMPETITION_FINISHED];
            $this->builder->notifyParticipants($comp, $content['title'], \sprintf($content['msg'], $comp->getName()), NotificationConstants::TYPE_COMPETITION_FINISHED);
        }

        $this->builder->flush();
    }
}
