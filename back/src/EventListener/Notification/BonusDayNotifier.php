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
    private const array DAYS_FR = [
        1 => 'lundi',
        2 => 'mardi',
        3 => 'mercredi',
        4 => 'jeudi',
        5 => 'vendredi',
        6 => 'samedi',
        7 => 'dimanche',
    ];

    public function __construct(private NotificationBuilder $builder)
    {
    }

    public function postPersist(BonusDay $bonus, PostPersistEventArgs $event): void
    {
        if ($comp = $bonus->getCompetition()) {
            $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_BONUS_TRIGGERED];
            $message = $this->buildMessage($bonus, $content);

            $this->builder->notifyParticipants(
                $comp,
                $content['title'],
                $message,
                NotificationConstants::TYPE_BONUS_TRIGGERED
            );
            $this->builder->flush();
        }
    }

    private function buildMessage(BonusDay $bonus, array $content): string
    {
        $today = new \DateTimeImmutable('today');
        $bonusDate = \DateTimeImmutable::createFromInterface($bonus->getDate())->setTime(0, 0, 0);

        $diffDays = (int) $today->diff($bonusDate)->format('%r%a');
        $multiplier = $bonus->getMultiplier();

        if ($diffDays < 0) {
            return \sprintf(
                $content['msg_past'],
                $multiplier,
                $bonusDate->format('d/m/Y')
            );
        }

        if (0 === $diffDays) {
            return \sprintf($content['msg_today'], $multiplier);
        }

        if (1 === $diffDays) {
            return \sprintf($content['msg_tomorrow'], $multiplier);
        }

        $dayOfWeek = self::DAYS_FR[(int) $bonusDate->format('N')];

        return \sprintf(
            $content['msg_future'],
            $multiplier,
            $diffDays,
            $dayOfWeek
        );
    }
}
