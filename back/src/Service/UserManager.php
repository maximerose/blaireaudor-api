<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Competition;
use App\Entity\User;
use App\Repository\PlayerRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service de gestion des comptes utilisateurs.
 * * Orchestre la création d'un compte User (sécurité) et son profil Player (jeu).
 * Permet également l'inscription directe à une compétition lors de la création du compte.
 */
class UserManager
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private PlayerManager $playerManager,
        private PlayerRepository $playerRepository,
        private ParticipationManager $participationManager
    ) {
    }

    /**
     * Enregistre un nouvel utilisateur complet.
     * * Crée le compte User, génère le profil Player associé, et gère l'inscription
     * optionnelle à une compétition de départ.
     * @param string $username Nom de connexion.
     * @param string $plainPassword Mot de passe brut (sera haché par le listener).
     * @param string $displayName Nom affiché en jeu.
     * @param Competition|null $competition Une compétition à rejoindre immédiatement.
     * @return User L'entité utilisateur créée.
     */
    public function registerUser(
        string $username,
        string $plainPassword,
        string $displayName,
        ?Competition $competition = null,
        ?string $playerId = null
    ): User {
        $user = new User();
        $user->setUsername($username);
        $user->setPlainPassword($plainPassword);

        $player = null;

        if ($playerId) {
            $player = $this->playerRepository->find($playerId);

            if ($player && null === $player->getAssociatedUser()) {
                $player->setDisplayName($displayName);
            } else {
                $player = null;
            }
        }

        if (!$player) {
            $player = $this->playerManager->createPlayer($displayName);
        }

        $player->setAssociatedUser($user);
        $user->setPlayer($player);

        if ($competition) {
            $this->participationManager->joinCompetition($player, $competition);
        }


        $this->entityManager->persist($user);
        $this->entityManager->persist($player);

        return $user;
    }
}
