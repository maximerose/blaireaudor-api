<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\BonusDayFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class PlayerStatsTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testMeProviderReturnsCalculatedStats(): void
    {
        $client = static::createClient();

        // 1. GÉNÉRATION DES 4 ENTITÉS JOUEURS DISTINCTS
        $userMe = UserFactory::createOne(['username' => 'me', 'player' => PlayerFactory::new(['displayName' => 'Moi'])]);
        $playerMe = $userMe->getPlayer();

        $userRival = UserFactory::createOne(['username' => 'rival', 'player' => PlayerFactory::new(['displayName' => 'Mon Grand Rival'])]);
        $playerRival = $userRival->getPlayer();

        $userBourreau = UserFactory::createOne(['username' => 'bourreau', 'player' => PlayerFactory::new(['displayName' => 'Mon Bourreau'])]);
        $playerBourreau = $userBourreau->getPlayer();

        $userSouffre = UserFactory::createOne(['username' => 'souffre_douleur', 'player' => PlayerFactory::new(['displayName' => 'Mon Souffre Douleur'])]);
        $playerSouffre = $userSouffre->getPlayer();

        $client->loginUser($userMe);

        // CONFIGURATION DES ARÈNES HISTORIQUES
        $competition1 = CompetitionFactory::createOne(['startDate' => new \DateTimeImmutable('-30 days'), 'endDate' => new \DateTimeImmutable('-20 days')]);
        $participationMe1 = ParticipationFactory::createOne(['competition' => $competition1, 'player' => $playerMe, 'score' => 80]);

        $participationRival1 = ParticipationFactory::createOne(['competition' => $competition1, 'player' => $playerRival]);
        $participationSouffre1 = ParticipationFactory::createOne(['competition' => $competition1, 'player' => $playerSouffre]);
        $participationBourreau1 = ParticipationFactory::createOne(['competition' => $competition1, 'player' => $playerBourreau]);

        $competition2 = CompetitionFactory::createOne(['startDate' => new \DateTimeImmutable('-19 days'), 'endDate' => new \DateTimeImmutable('-2 days')]);
        $participationMe2 = ParticipationFactory::createOne(['competition' => $competition2, 'player' => $playerMe, 'score' => 150]);
        ParticipationFactory::createOne(['competition' => $competition2, 'score' => 50]);
        ParticipationFactory::createOne(['competition' => $competition2, 'score' => 30]);

        // COMPÉTITION ACTIVE (Ignorée du calcul de carrière)
        $activeCompetition = CompetitionFactory::createOne(['startDate' => new \DateTimeImmutable('-2 days'), 'endDate' => new \DateTimeImmutable('+5 days')]);
        ParticipationFactory::createOne(['competition' => $activeCompetition, 'player' => $playerMe, 'score' => 999]);

        // 2. CONFIGURATION DE LA MÊLÉE GÉNÉRALE (MUTUAL ATTACKS)
        // Mon Bourreau m'attaque 5 fois
        for ($i = 0; $i < 5; ++$i) {
            ActionFactory::createOne(['participation' => $participationMe1, 'createdBy' => $userBourreau, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'description' => 'Attaque Bourreau']);
        }
        ActionFactory::createOne(['participation' => $participationBourreau1, 'createdBy' => $userMe, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'dateAction' => new \DateTimeImmutable('-25 days 08:00:00')]);

        // Mon Souffre-douleur subit mes attaques
        for ($i = 0; $i < 5; ++$i) {
            ActionFactory::createOne(['participation' => $participationSouffre1, 'createdBy' => $userMe, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'dateAction' => new \DateTimeImmutable('-25 days 09:00:00')]);
        }

        // Ajout du jour bonus (déclenche un recalcule interne global sur les infractions existantes)
        BonusDayFactory::createOne(['competition' => $competition1, 'date' => new \DateTimeImmutable('-22 days'), 'multiplier' => 3]);
        ActionFactory::createOne(['participation' => $participationSouffre1, 'createdBy' => $userMe, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'dateAction' => new \DateTimeImmutable('-22 days 10:00:00')]);

        // Mon Grand Rival (Échange symétrique réciproque)
        for ($i = 0; $i < 3; ++$i) {
            ActionFactory::createOne(['participation' => $participationRival1, 'createdBy' => $userMe, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'dateAction' => new \DateTimeImmutable('-25 days 10:00:00')]);
        }
        for ($i = 0; $i < 3; ++$i) {
            ActionFactory::createOne(['participation' => $participationMe1, 'createdBy' => $userRival, 'points' => 10, 'status' => ActionStatus::VALIDATED]);
        }

        ActionFactory::createOne(['participation' => $participationSouffre1, 'createdBy' => $userMe, 'points' => 5, 'status' => ActionStatus::REJECTED]);

        // SANCTUARISATION : On injecte les scores fixes après tous les traitements d'écouteurs
        ParticipationFactory::createOne(['competition' => $competition1, 'score' => 100]); // Te pousse à la 2ème place
        ParticipationFactory::createOne(['competition' => $competition1, 'score' => 20]);  // Reste en bas

        // 3. APPEL DU PROVIDER DE SESSION
        $client->request('GET', '/api/me');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $stats = $data['stats'];

        // --- ASSERTIONS DES SÉCURITÉS RELATIONNELLES ---
        $this->assertEquals('Mon Bourreau', $stats['max_reports_from_single_actor']['player_name']);
        $this->assertEquals('Mon Souffre Douleur', $stats['max_reports_to_single_receiver']['player_name']);
        $this->assertEquals('Mon Grand Rival', $stats['max_reciprocal_reports_with_single_peer']['player_name']);
        $this->assertEquals(3, $stats['max_reciprocal_reports_with_single_peer']['reciprocal_score']);

        // --- ASSERTIONS VOLUMÉTRIE & EFFET D'AUBAINE ---
        $this->assertEquals(8, $stats['total_actions_received']); // 5 Bourreau + 3 Rival
        $this->assertEquals(80, $stats['total_points_received']); // 50 + 30
        $this->assertEquals(11, $stats['total_actions_reported']); // 1 Bourreau + 6 Souffre + 3 Rival + 1 Rejetée
        $this->assertEquals(90.9, $stats['report_approval_ratio']); // 10 validées / 11 jugées = 90.9%
        $this->assertEquals(1.38, $stats['report_to_received_ratio']); // 11 émis / 8 subis = 1.375 -> 1.38
        $this->assertEquals(10.0, $stats['bonus_actions_ratio']); // 1 action bonus / 10 validées émanant de moi = 10.0%

        // --- ASSERTIONS DES RANGS DISTINCTS EXTRACTIBLES ---
        $this->assertEquals(1, $stats['min_rank']); // 1er à l'arène 2
        $this->assertEquals(2, $stats['max_rank']); // 2ème à l'arène 1
    }
}
