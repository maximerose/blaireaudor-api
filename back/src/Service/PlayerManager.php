<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Service de gestion des joueurs.
 * * Gère la création des profils (invités ou membres) et facilite l'importation
 * par lots (batch) de nouveaux participants dans une compétition.
 */
class PlayerManager
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private ParticipationManager $participationManager
    ) {
    }

    public function createPlayer(string $displayName, ?User $createdBy = null): Player
    {
        $player = new Player();
        $player->setDisplayName($displayName);

        if ($createdBy) {
            $player->setCreatedBy($createdBy);
        }

        $this->entityManager->persist($player);

        return $player;
    }

    /**
     * Crée un joueur et l'inscrit immédiatement à une compétition.
     * @return Player Le joueur créé et inscrit.
     */
    public function createPlayerAndJoin(
        string $displayName,
        Competition $competition,
        ?User $createdBy = null
    ): Player {
        $player = $this->createPlayer($displayName, $createdBy);
        $this->participationManager->joinCompetition($player, $competition);

        return $player;
    }

    /**
     * Importe une liste de noms de joueurs dans une compétition.
     * * Nettoie les noms (trim), valide les contraintes d'entité, et gère les erreurs
     * pour chaque ligne sans interrompre le processus global.
     * @param array<string> $rawNames Liste des noms à importer.
     * @return array{successes: array, errors: array} Un résumé du traitement.
     */
    public function createPlayersBatch(array $rawNames, Competition $competition, User $user): array
    {
        $results = ['successes' => [], 'errors' => []];

        foreach ($rawNames as $name) {
            $trimmedName = trim($name);

            if (empty($trimmedName)) {
                $results['errors'][] = [
                    'name' => '',
                    'message' => 'Le nom du joueur ne peut pas être vide'
                ];

                continue;
            };

            $player = $this->createPlayer($trimmedName, $user);
            $violations = $this->validator->validate($player);

            if (count($violations) > 0) {
                foreach ($violations as $v) {
                    $results['errors'][] = ['name' => $trimmedName, 'message' => $v->getMessage()];
                }
                $this->entityManager->detach($player);
                continue;
            }

            $this->participationManager->joinCompetition($player, $competition);

            $results['successes'][] = ['name' => $trimmedName];
        }

        return $results;
    }
}
