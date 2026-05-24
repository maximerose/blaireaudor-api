<?php

declare(strict_types=1);

namespace App\Service\Manager;

use App\Constants\ErrorMessages;
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
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * Inscrit un joueur à une compétition donnée.
     * * Crée une nouvelle instance de Participation, l'initialise avec le joueur
     * et la compétition, puis la persiste en base de données.
     *
     * @param Player $player le joueur qui rejoint
     * @param Competition $competition la compétition concernée
     *
     * @return Participation L'entité de liaison créée
     */
    public function joinCompetition(Player $player, Competition $competition): Participation
    {
        $existing = $this->entityManager->getRepository(Participation::class)->findOneBy([
            'player' => $player,
            'competition' => $competition,
        ]);

        if ($existing) {
            return $existing;
        }

        $participation = new Participation();
        $participation->setPlayer($player);
        $participation->setCompetition($competition);
        $competition->addParticipation($participation);

        $this->entityManager->persist($participation);

        return $participation;
    }

    public function removeParticipation(Participation $participation): void
    {
        if ($participation->getActions()->count() > 0) {
            throw new \LogicException(ErrorMessages::PART_HAS_ACTIONS);
        }

        $this->entityManager->remove($participation);
    }
}
