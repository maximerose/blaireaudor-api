<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Action;
use App\Service\ActionManager;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Action::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Action::class)]
#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: Action::class)]
class ActionScoreListener
{
    public function __construct(
        private ActionManager $actionManager,
    ) {
    }

    public function postPersist(Action $action, PostPersistEventArgs $event): void
    {
        $this->syncScore($action, 'INSERT');
    }

    public function postUpdate(Action $action, PostUpdateEventArgs $event): void
    {
        $this->syncScore($action, 'UPDATE');
    }

    public function postRemove(Action $action, PostRemoveEventArgs $event): void
    {
        $this->syncScore($action, 'DELETE');
    }

    private function syncScore(Action $action, string $context): void
    {
        if ($action->getParticipation()) {
            $this->actionManager->updateScore($action);
            error_log("$context: Score recalculé pour la participation {$action->getParticipation()->getId()}");
        }
    }
}
