<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        // --- 1. LES COMPTES DE TEST (IDENTIFIANTS FIXES) ---

        // L'Arbitre
        $admin = PlayerFactory::createOne([
            'displayName' => 'Le Grand Arbitre',
            'associatedUser' => UserFactory::new([
                'username' => 'admin',
                'plainPassword' => 'admin',
                'roles' => ['ROLE_ADMIN']
            ])
        ]);

        // Le Joueur de test
        $testPlayer = PlayerFactory::createOne([
            'displayName' => 'Martin Matin (Moi)',
            'associatedUser' => UserFactory::new([
                'username' => 'player',
                'plainPassword' => 'player'
            ])
        ]);

        // --- 2. LE VOLUME (MASSIVE SEEDING) ---

        // On crée 30 autres joueurs avec leurs comptes Users
        $otherPlayers = PlayerFactory::createMany(30);
        $allPlayers = array_merge([$admin, $testPlayer], $otherPlayers);

        // --- 3. LES COMPÉTITIONS ET ACTIONS ---

        $competitions = [
            CompetitionFactory::createOne(['name' => 'Saison Hiver 2026', 'joinCode' => 'WINTER']),
            CompetitionFactory::createOne(['name' => 'Bureau Central', 'joinCode' => 'OFFICE']),
            CompetitionFactory::createOne(['name' => 'Tournoi de l\'Été', 'joinCode' => 'SUMMER']),
            CompetitionFactory::createOne(['name' => 'Championnat Flash', 'joinCode' => 'FLASH']),
        ];

        foreach ($allPlayers as $player) {
            // On définit un nombre aléatoire de compétitions auxquelles le joueur participe (entre 1 et 3)
            $assignedComps = (array) array_rand($competitions, rand(1, 3));

            // On s'assure que c'est un tableau d'index
            if (!is_array($assignedComps)) {
                $assignedComps = [$assignedComps];
            }

            foreach ($assignedComps as $index) {
                $comp = $competitions[$index];
                // Création de la participation
                $participation = ParticipationFactory::createOne([
                    'player' => $player,
                    'competition' => $comp,
                    'score' => 0 // Score initial aléatoire
                ]);

                // Génération d'un mix d'actions (Total entre 5 et 12 par joueur/compète)
                $nbActions = rand(5, 12);
                $currentScore = 0;

                for ($i = 0; $i < $nbActions; $i++) {
                    // 80% de chance d'être validée, 20% d'être en attente
                    $isValidated = (rand(1, 10) <= 8);
                    $points = rand(-5, 10) * 10;

                    ActionFactory::createOne([
                        'player' => $player,
                        'competition' => $comp,
                        'points' => $points,
                        'description' => $faker->sentence(4),
                        'status' => $isValidated ? ActionStatus::VALIDATED : ActionStatus::PENDING,
                        'createdAt' => \DateTimeImmutable::createFromMutable($faker->dateTimeBetween('-2 weeks', 'now')),
                    ]);

                    // On ne met à jour le score dénormalisé que si l'action est VALIDATED
                    if ($isValidated) {
                        $currentScore += $points;
                    }
                }

                // Mise à jour du score final de la participation
                $participation->setScore($currentScore);
                $manager->persist($participation);
            }
        }
    }
}
