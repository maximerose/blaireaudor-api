<?php

namespace App\Service;

use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
use Doctrine\ORM\EntityManagerInterface;

class ParticipationManager
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function joinCompetition(Player $player, Competition $competition): Participation
    {
        $participation = new Participation();
        $participation->setPlayer($player);
        $participation->setCompetition($competition);

        $this->entityManager->persist($participation);

        return $participation;
    }
}