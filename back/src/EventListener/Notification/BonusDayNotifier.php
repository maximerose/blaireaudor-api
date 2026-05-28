<?php

declare(strict_types=1);

namespace App\EventListener\Notification;

use App\Constants\NotificationConstants;
use App\Entity\BonusDay;
use App\Service\Notification\NotificationBuilder;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: BonusDay::class)]
final readonly class BonusDayNotifier
{
    public function __construct(private NotificationBuilder $builder)
    {
    }

    public function postPersist(BonusDay $bonus, PostPersistEventArgs $event): void
    {
        if ($comp = $bonus->getCompetition()) {
            $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_BONUS_TRIGGERED];
            $this->builder->notifyParticipants($comp, $content['title'], \sprintf($content['msg'], $bonus->getMultiplier()), NotificationConstants::TYPE_BONUS_TRIGGERED);
            $this->builder->flush();
        }
    }
}
