<?php

namespace App\Service;

use App\Entity\Competition;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserManager
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private PlayerManager $playerManager
    ) {}

    public function registerUser(
        string $username, 
        string $plainPassword, 
        string $displayName, 
        ?Competition $competition = null
    ): User {
        $user = new User();
        $user->setUsername($username);
        $user->setPlainPassword($plainPassword);

        if ($competition) {
            $player = $this->playerManager->createPlayerAndJoin($displayName, $competition);
        } else {
            $player = $this->playerManager->createPlayer($displayName);
        }

        $player->setAssociatedUser($user);
        $user->setPlayer($player);

        $this->entityManager->persist($user);
        $this->entityManager->persist($player);

        return $user;
    }
}