<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
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

        $user = UserFactory::createOne(['username' => 'victime', 'player' => PlayerFactory::new()]);
        $player = $user->getPlayer();
        $otherUser = UserFactory::createOne();
        $client->loginUser($user);

        // COMPÉTITION 1 : Clôturée dans le passé (Prise en compte pour le classement historique)
        $pastCompetition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('-10 days'),
            'endDate' => new \DateTimeImmutable('-2 days'),
        ]);
        $participationPastMe = ParticipationFactory::createOne(['competition' => $pastCompetition, 'player' => $player, 'score' => 40]);

        // Un concurrent fait un moins bon score (60 pts), un autre fait mieux (20 pts) -> "victime" doit être 2ème
        ParticipationFactory::createOne(['competition' => $pastCompetition, 'score' => 100]);
        ParticipationFactory::createOne(['competition' => $pastCompetition, 'score' => 20]);

        // COMPÉTITION 2 : En cours d'activité (Doit être IGNORÉE du calcul des rangs historiques)
        $activeCompetition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('-2 days'),
            'endDate' => new \DateTimeImmutable('+5 days'),
        ]);
        ParticipationFactory::createOne(['competition' => $activeCompetition, 'player' => $player, 'score' => 999]);

        // Actions Subies existantes pour le calcul du Karma
        ActionFactory::createOne(['participation' => $participationPastMe, 'createdBy' => $otherUser, 'points' => 50, 'status' => ActionStatus::VALIDATED, 'description' => 'Le Pire Record']);
        ActionFactory::createOne(['participation' => $participationPastMe, 'createdBy' => $otherUser, 'points' => 20, 'status' => ActionStatus::VALIDATED, 'description' => 'Méfait historique 2']);
        ActionFactory::createOne(['participation' => $participationPastMe, 'createdBy' => $otherUser, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'description' => 'Méfait historique 3']);

        // Délation (Calcul de Précision)
        $targetPart = ParticipationFactory::createOne(['competition' => $pastCompetition]);
        ActionFactory::createOne(['participation' => $targetPart, 'createdBy' => $user, 'points' => 30, 'status' => ActionStatus::VALIDATED]);
        ActionFactory::createOne(['participation' => $targetPart, 'createdBy' => $user, 'points' => 10, 'status' => ActionStatus::REJECTED]);
        ActionFactory::createOne(['participation' => $targetPart, 'createdBy' => $user, 'points' => 15, 'status' => ActionStatus::PENDING]);

        $client->request('GET', '/api/me');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $stats = $data['stats'];

        // --- ASSERTIONS POINTS & ACTIONS ---
        $this->assertEquals(3, $stats['total_actions_received']);
        $this->assertEquals(80, $stats['total_points_received']);

        // --- ASSERTIONS DÉLATION ---
        $this->assertEquals(3, $stats['total_actions_reported']);
        $this->assertEquals(50.0, $stats['report_approval_ratio']);
        $this->assertEquals(1.0, $stats['report_to_received_ratio']);

        // --- ASSERTIONS FOCUS ---
        $this->assertNotNull($stats['max_points_single_action_received']);
        $this->assertEquals(50, $stats['max_points_single_action_received']['points']);
        $this->assertEquals('Le Pire Record', $stats['max_points_single_action_received']['description']);

        $this->assertNotNull($stats['max_points_single_action_reported']);
        $this->assertEquals(30, $stats['max_points_single_action_reported']['points']);

        // --- ASSERTIONS DU TICKET [STA-01] ---
        $this->assertArrayHasKey('min_rank', $stats);
        $this->assertArrayHasKey('max_rank', $stats);

        // Le joueur doit être classé 2ème de la compétition archivée (Dense Rank : 60 > 40 > 20)
        $this->assertEquals(2, $stats['min_rank']);
        $this->assertEquals(2, $stats['max_rank']);
    }
}
