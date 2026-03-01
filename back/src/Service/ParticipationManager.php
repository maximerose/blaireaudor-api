<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service gérant l'inscription et l'engagement des joueurs dans les compétitions.
 * * Agit comme une fabrique pour l'entité de liaison Participation, assurant
 * la cohérence entre un Player et une Competition.
 */
class ParticipationManager
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Inscrit un joueur à une compétition donnée.
     * * Crée une nouvelle instance de Participation, l'initialise avec le joueur
     * et la compétition, puis la persiste en base de données.
     * @param Player $player Le joueur qui rejoint.
     * @param Competition $competition La compétition concernée.
     * @return Participation L'entité de liaison créée.
     */
    public function joinCompetition(Player $player, Competition $competition): Participation
    {
        $participation = new Participation();
        $participation->setPlayer($player);
        $participation->setCompetition($competition);

        $this->entityManager->persist($participation);

        return $participation;
    }
}
