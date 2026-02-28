<?php

namespace App\Service;

use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class PlayerManager
{    
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {
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

            $player = new Player();
            $player->setDisplayName($trimmedName);
            $player->setCreatedBy($user);

            $violations = $this->validator->validate($player);

            if (count($violations) > 0) {
                foreach ($violations as $v) {
                    $results['errors'][] = ['name' => $trimmedName, 'message' => $v->getMessage()];
                }
                continue;
            }

            $participation = new Participation();
            $participation->setCompetition($competition);
            $participation->setPlayer($player);

            $this->entityManager->persist($player);
            $this->entityManager->persist($participation);

            $results['successes'][] = ['name' => $trimmedName];
        }

        $this->entityManager->flush();

        return $results;
    }
}
