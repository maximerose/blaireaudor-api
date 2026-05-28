<?php

declare(strict_types=1);

namespace App\EventListener\Notification;

use App\Constants\NotificationConstants;
use App\Entity\Participation;
use App\Entity\User;
use App\Service\Notification\NotificationBuilder;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;
use Symfony\Bundle\SecurityBundle\Security;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Participation::class)]
final readonly class ParticipationNotifier
{
    public function __construct(private NotificationBuilder $builder, private Security $security)
    {
    }

    public function postPersist(Participation $participation, PostPersistEventArgs $event): void
    {
        $comp = $participation->getCompetition();
        $player = $participation->getPlayer();
        if (!$comp || !$player) {
            return;
        }

        $currentUser = $this->security->getUser();
        $isSelfJoin = true;

        if (!$isSelfJoin) {
            if ($recipient = $player->getAssociatedUser()) {
                $refereeName = $currentUser instanceof User && $currentUser->getPlayer() ? $currentUser->getPlayer()->getDisplayName() : 'Un arbitre';
                $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_ADDED_BY_REFEREE];
                $this->builder->createAndPersist($recipient, $content['title'], \sprintf($content['msg'], $refereeName, $comp->getName()), NotificationConstants::TYPE_ADDED_BY_REFEREE, $comp);
            }
        } else {
            $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_PLAYER_JOINED];
            $this->builder->notifyParticipants($comp, $content['title'], \sprintf($content['msg'], $player->getDisplayName()), NotificationConstants::TYPE_PLAYER_JOINED, $player->getAssociatedUser() ? [$player->getAssociatedUser()] : []);
        }

        $this->builder->flush();
    }
}
