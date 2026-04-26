<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\Action;
use App\Repository\ParticipationRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Action::class)]
#[AsEntityListener(event: Events::postRemove, method: 'postRemove', entity: Action::class)]
#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Action::class)]
class ActionScoreListener
{
    public function __construct(
        private ParticipationRepository $participationRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function postPersist(Action $action, PostPersistEventArgs $event): void
    {
        $this->updateParticipationScore($action);
    }

    public function postUpdate(Action $action, PostUpdateEventArgs $event): void
    {
        $this->updateParticipationScore($action);
    }

    public function postRemove(Action $action, PostRemoveEventArgs $event): void
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
            'competition' => $competition,
        ]);

        if ($participation) {
            $participation->updateScore();
            $this->entityManager->flush();
        }
    }
}
