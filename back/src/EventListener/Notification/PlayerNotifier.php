<?php

declare(strict_types=1);

namespace App\EventListener\Notification;

use App\Constants\NotificationConstants;
use App\Entity\Player;
use App\Entity\User;
use App\Service\Notification\NotificationBuilder;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Player::class)]
final readonly class PlayerNotifier
{
    public function __construct(private NotificationBuilder $builder)
    {
    }

    public function postUpdate(Player $player, PostUpdateEventArgs $event): void
    {
        $changeSet = $event->getObjectManager()->getUnitOfWork()->getEntityChangeSet($player);

        if (isset($changeSet['associatedUser']) && null === $changeSet['associatedUser'][0] && $changeSet['associatedUser'][1] instanceof User) {
            $this->notifyGuestClaimed($player);
        }
    }

    private function notifyGuestClaimed(Player $player): void
    {
        $refereesToNotify = [];

        foreach ($player->getParticipations() as $participation) {
            $comp = $participation->getCompetition();

            if (!$comp) {
                continue;
            }

            /** @var Player $referee */
            foreach ($comp->getReferees() as $referee) {
                $user = $referee->getAssociatedUser();

                if ($user && $user !== $player->getAssociatedUser()) {
                    $refereesToNotify[$user->getId()->toString()] = [
                        'user' => $user,
                        'comp' => $comp,
                    ];
                }
            }
        }

        $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_GUEST_CLAIMED];
        foreach ($refereesToNotify as $data) {
            $this->builder->createAndPersist($data['user'], $content['title'], \sprintf($content['msg'], $player->getDisplayName()), NotificationConstants::TYPE_GUEST_CLAIMED, $data['comp']);
        }

        $this->builder->flush();
    }
}
