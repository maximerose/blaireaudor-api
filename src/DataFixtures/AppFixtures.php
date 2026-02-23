<?php

namespace App\DataFixtures;

use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $adminPlayer = new Player();
        $adminPlayer->setDisplayName('Maxime Rose');

        $admin = new User();
        $admin->setUsername('maxime-rose');
        $admin->setPlainPassword('password');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setIsActive(true);
        
        $admin->setPlayer($adminPlayer);
        $adminPlayer->setAssociatedUser($admin);
        $adminPlayer->setCreatedBy($admin);

        $manager->persist($adminPlayer);
        $manager->persist($admin);
        $manager->flush();

        $playersPool = [];

        // Initialisation de Faker
        $faker = \Faker\Factory::create('fr_FR');

        for ($i = 0; $i < 50; $i++) {
            $player = new Player();
            $player->setDisplayName($faker->unique()->name());
            $player->setCreatedBy($admin);

            $manager->persist($player);
            $playersPool[] = $player;
        }

        $manager->flush();

        // 1. On crée une dizaine de compétitions
        for ($i = 0; $i < 10; $i++) {
            $year = $faker->year();

            $competition = new Competition();
            $competition->setName("Le blaireau d'or " . $year);
            $competition->setStartDate(new \DateTimeImmutable($year . '-02-01'));
            $competition->setEndDate(new \DateTimeImmutable($year . '-02-07'));
            $competition->setCreatedBy($admin);
            
            $manager->persist($competition);
            $manager->flush();

            $nbPlayers = $faker->numberBetween(5, 15);
            $randomPlayerKeys = array_rand($playersPool, $nbPlayers);

            foreach ($randomPlayerKeys as $key) {
                $player = $playersPool[$key];
                
                $participation = new Participation();
                $participation->setCompetition($competition);
                $participation->setPlayer($player);
                $participation->setScore(random_int(0, 500));

                $manager->persist($participation);
            }
        }
        
        // Envoi final en bdd
        $manager->flush();
    }
}
