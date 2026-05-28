<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\BonusDayFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use App\Service\Notification\NotificationBuilder;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Style\SymfonyStyle;

class AppFixtures extends Fixture
{
    public function __construct(private readonly NotificationBuilder $notificationBuilder)
    {
    }

    public function load(ObjectManager $manager): void
    {
        // Initialisation de la console pour l'affichage
        $io = new SymfonyStyle(new ArgvInput(), new ConsoleOutput());
        $io->title('🌱 Génération des Fixtures du Blaireau d\'Or (Environnement de Dev)');

        // 🔇 On coupe les notifications pour ne pas spammer pendant la génération des fixtures
        $this->notificationBuilder->mute();
        $io->info('Moteur de notifications rendu silencieux.');

        // -------------------------------------------------------------------
        // 1. IMPORTATION DE L'HISTORIQUE RÉEL (Depuis le JSON)
        // -------------------------------------------------------------------
        $io->section("1. Importation de l'historique réel");
        $jsonPath = dirname(__DIR__, 2).'/import/history.json';
        $data = json_decode(file_get_contents($jsonPath), true);

        // Création de l'admin à partir du JSON
        $admin = UserFactory::new()->withPlayer(['displayName' => $data['admin']['displayName']])->create([
            'username' => $data['admin']['username'],
            'email' => 'admin@blaireau.fr',
            'plainPassword' => 'password',
            'roles' => ['ROLE_SUPER_ADMIN'],
        ]);
        $io->note('Super Admin de dev créé : admin@blaireau.fr / password');

        $playersMap = [];
        $participationsMap = [];

        // On associe directement ton joueur "Maxime" à ton compte Admin
        $playersMap[$data['admin']['displayName']] = $admin->getPlayer();

        // Étape de pré-création de TOUS les joueurs du JSON pour gérer proprement les arbitres
        foreach ($data['competitions'] as $compData) {
            foreach (array_merge($compData['referees'], array_column($compData['actions'], 'playerName')) as $name) {
                if (!isset($playersMap[$name])) {
                    $playersMap[$name] = PlayerFactory::createOne(['displayName' => $name]);
                }
            }
        }

        $io->text('Chargement des compétitions historiques...');
        $io->progressStart(count($data['competitions']));

        foreach ($data['competitions'] as $compData) {
            $currentReferees = [];
            foreach ($compData['referees'] as $refName) {
                $currentReferees[] = $playersMap[$refName];
            }

            $competition = CompetitionFactory::createOne([
                'name' => $compData['name'],
                'joinCode' => $compData['joinCode'],
                'startDate' => new \DateTimeImmutable($compData['startDate']),
                'endDate' => new \DateTimeImmutable($compData['endDate']),
                'fogOfWar' => false,
                'createdBy' => null, // ❌ Aucun créateur sur l'historique
                'referees' => $currentReferees, // 🔒 Liste d'arbitres stricte
            ]);

            foreach ($compData['bonusDays'] as $bdData) {
                BonusDayFactory::createOne([
                    'competition' => $competition,
                    'date' => new \DateTimeImmutable($bdData['date']),
                    'multiplier' => $bdData['multiplier'],
                ]);
            }

            foreach ($compData['actions'] as $actData) {
                $player = $playersMap[$actData['playerName']];
                $partKey = $competition->getId()->toString().'_'.$player->getId()->toString();

                if (!isset($participationsMap[$partKey])) {
                    $participationsMap[$partKey] = ParticipationFactory::createOne([
                        'competition' => $competition,
                        'player' => $player,
                        'score' => 0,
                    ]);
                }

                ActionFactory::createOne([
                    'participation' => $participationsMap[$partKey],
                    'points' => $actData['points'],
                    'description' => $actData['description'],
                    'dateAction' => new \DateTimeImmutable($actData['dateAction']),
                    'status' => ActionStatus::VALIDATED,
                    'createdBy' => null,
                ]);
            }

            $io->progressAdvance();
        }
        $io->progressFinish();
        $io->success(count($data['competitions']).' arènes historiques importées !');

        // -------------------------------------------------------------------
        // 2. GÉNÉRATION DU BAC À SABLE DE DÉVELOPPEMENT (Données Faker)
        // -------------------------------------------------------------------
        $io->section('2. Génération du bac à sable (Faker)');

        $nbFakePlayers = random_int(5, 12);
        $io->text("Création de $nbFakePlayers faux profils joueurs (avec comptes rattachés)...");

        $allPlayers = array_values($playersMap);
        $allUsers = [$admin];

        for ($j = 0; $j < $nbFakePlayers; ++$j) {
            $fakeUser = UserFactory::new()->withPlayer()->create();
            $allUsers[] = $fakeUser;
            $allPlayers[] = $fakeUser->getPlayer();
        }

        $nbFakeComps = random_int(3, 8);
        $io->text("Création de $nbFakeComps fausses compétitions et de leur activité...");
        $io->progressStart($nbFakeComps);

        $fakeCompetitions = CompetitionFactory::createMany($nbFakeComps, function () use ($allUsers) {
            return [
                'createdBy' => $allUsers[array_rand($allUsers)],
            ];
        });

        foreach ($fakeCompetitions as $competition) {
            foreach ($allPlayers as $player) {
                if (random_int(1, 100) > 60) {
                    $participation = ParticipationFactory::createOne([
                        'competition' => $competition,
                        'player' => $player,
                        'score' => 0,
                    ]);

                    ActionFactory::createMany(random_int(1, 15), [
                        'participation' => $participation,
                        'status' => ActionStatus::VALIDATED,
                        'createdBy' => $allUsers[array_rand($allUsers)],
                    ]);

                    if (random_int(1, 100) > 85) {
                        ActionFactory::createMany(random_int(1, 3), [
                            'participation' => $participation,
                            'status' => ActionStatus::PENDING,
                        ]);
                    }

                    if (random_int(1, 100) > 85) {
                        ActionFactory::createMany(random_int(1, 2), [
                            'participation' => $participation,
                            'status' => ActionStatus::REJECTED,
                            'createdBy' => $allUsers[array_rand($allUsers)],
                        ]);
                    }
                }
            }

            $nbBonusDays = random_int(0, 2);
            for ($k = 0; $k < $nbBonusDays; ++$k) {
                $start = $competition->getStartDate();
                $bonusDate = $start->modify('+'.($k + 2).' days');

                BonusDayFactory::createOne([
                    'competition' => $competition,
                    'date' => $bonusDate,
                ]);
            }

            $io->progressAdvance();
        }

        $io->progressFinish();
        $manager->flush();

        $io->success('Fixtures chargées avec succès ! Ton environnement de développement est propre. 🦡');
    }
}
