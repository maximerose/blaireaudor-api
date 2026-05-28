<?php

declare(strict_types=1);

namespace App\Service\Notification;

use App\Constants\NotificationConstants;
use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

final readonly class RefereeNotifier
{
    public function __construct(
        private NotificationBuilder $builder,
        private Security $security,
    ) {
    }

    public function notifyRoleChanged(Competition $competition, Player $referee, bool $isAdded): void
    {
        $initiator = $this->security->getUser();
        $initiatorName = $initiator instanceof User && $initiator->getPlayer() ? $initiator->getPlayer()->getDisplayName() : 'Un administrateur';
        $targetUser = $referee->getAssociatedUser();

        $type = $isAdded ? NotificationConstants::TYPE_REFEREE_PROMOTED : NotificationConstants::TYPE_REFEREE_REVOKED;
        $content = NotificationConstants::CONTENT[$type];

        if ($targetUser && $targetUser !== $initiator) {
            $msg = \sprintf($content['msg_target'], $initiatorName, $competition->getName());
            $this->builder->createAndPersist($targetUser, $content['title'], $msg, $type, $competition);
        }

        $msgOthers = \sprintf($content['msg_others'], $referee->getDisplayName(), $competition->getName());

        $this->builder->notifyParticipants($competition, $content['title'], $msgOthers, $type, $targetUser ? [$targetUser] : []);
        $this->builder->flush();
    }
}
