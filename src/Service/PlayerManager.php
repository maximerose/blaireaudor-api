<?php

namespace App\Service;

use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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

    public function createPlayerAndJoin(
        string $displayName, 
        Competition $competition, 
        ?User $createdBy = null
    ): Player {
        $player = $this->createPlayer($displayName, $createdBy);
        $this->participationManager->joinCompetition($player, $competition);

        return $player;
    }

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
