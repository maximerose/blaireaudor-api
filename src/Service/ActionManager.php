<?php

namespace App\Service;

use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use App\Enum\ActionStatus;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;

final class ActionManager
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function createActionFromPayload(Competition $competition, User $author, array $data): Action
    {
        $playerId = basename($data['player']);
        $player = $this->entityManager->getRepository(Player::class)->find($playerId);

        if (!$player) {
            throw new InvalidArgumentException('Le joueur n\'existe pas');
        }

        $action = new Action();
        $action->setDescription($data['description']);
        $action->setPoints((int) $data['points']);
        $action->setPlayer($player);
        $action->setCompetition($competition);

        if ($competition->getCreatedBy() === $author) {
            $action->setStatus(ActionStatus::VALIDATED);
        } else {
            $action->setStatus(ActionStatus::PENDING);
        }

        $this->entityManager->persist($action);

        return $action;
    }
}
