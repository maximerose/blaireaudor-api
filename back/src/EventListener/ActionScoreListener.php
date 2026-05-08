<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Action;
use App\Service\ActionManager;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: Action::class)]
class ActionScoreListener
{
    public function __construct(
        private ActionManager $actionManager,
    ) {
    }

    public function postRemove(Action $action, PostRemoveEventArgs $event): void
    {
        $participation = $action->getParticipation();

        if ($participation) {
            $this->actionManager->updateScore($action);
            error_log('DELETE UPDATE: Score synchronisé via SQL après suppression.');
        }
    }
}
