<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Action;
use App\Repository\ParticipationRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Doctrine\ORM\Mapping\PostPersist;
use Doctrine\ORM\Mapping\PostRemove;
use Doctrine\ORM\Mapping\PostUpdate;

#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Action::class)]
#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: Action::class)]
class ActionScoreListener
{
    public function __construct(
        private ParticipationRepository $participationRepository
    ) {
    }

    public function postPersist(Action $action, PostPersist $event): void
    {
        $this->updateParticipationScore($action);
    }

    public function postUpdate(Action $action, PostUpdate $event): void
    {
        $this->updateParticipationScore($action);
    }

    public function postRemove(Action $action, PostRemove $event): void
    {
        $this->updateParticipationScore($action);
    }

    private function updateParticipationScore(Action $action): void
    {
        $player = $action->getPlayer();
        $competition = $action->getCompetition();

        if (!$player || !$competition) {
            return;
        }

        $participation = $this->participationRepository->findOneBy([
          'player' => $player,
          'competition' => $competition
        ]);

        if ($participation) {
            $participation->updateScore();
            $this->participationRepository->save($participation, true);
        }
    }
}
