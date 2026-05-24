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

final class CareerStatsTest extends WebTestCase
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

        $competition = CompetitionFactory::createOne();
        $participation = ParticipationFactory::createOne(['competition' => $competition, 'player' => $player]);

        // 1. Actions Subies (Calcul du Karma, total et record) - Créées par $otherUser !
        ActionFactory::createOne(['participation' => $participation, 'createdBy' => $otherUser, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'description' => 'Méfait 1']);
        ActionFactory::createOne(['participation' => $participation, 'createdBy' => $otherUser, 'points' => 50, 'status' => ActionStatus::VALIDATED, 'description' => 'Le Pire Record']);

        // Un jour bonus x2 sur l'action de 10 points (donc 10*2 = 20) => Total = 70 points
        $dateAction = new \DateTimeImmutable('2026-05-01');
        ActionFactory::createOne(['participation' => $participation, 'createdBy' => $otherUser, 'points' => 10, 'status' => ActionStatus::VALIDATED, 'dateAction' => $dateAction]);
        BonusDayFactory::createOne(['competition' => $competition, 'date' => $dateAction, 'multiplier' => 2]);

        // 2. Délation (Calcul de Précision) - Créées par le $user !
        $targetPart = ParticipationFactory::createOne(['competition' => $competition]);
        // 1 Validé, 1 Refusé, 1 En attente
        ActionFactory::createOne(['participation' => $targetPart, 'createdBy' => $user, 'points' => 30, 'status' => ActionStatus::VALIDATED]);
        ActionFactory::createOne(['participation' => $targetPart, 'createdBy' => $user, 'points' => 10, 'status' => ActionStatus::REJECTED]);
        ActionFactory::createOne(['participation' => $targetPart, 'createdBy' => $user, 'points' => 10, 'status' => ActionStatus::PENDING]);

        $client->request('GET', '/api/me');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $stats = $data['stats'];

        // --- ASSERTIONS POINTS & ACTIONS ---
        $this->assertEquals(3, $stats['total_actions_count']); // 3 subies
        $this->assertEquals(80, $stats['total_accumulated_points']); // 50 + 10 + (10*2)

        // --- ASSERTIONS DÉLATION ---
        $this->assertEquals(3, $stats['total_reported_count']); // 3 signalements émis au total
        // 1 validé / 2 tranchés (le pending n'est pas compté) = 50%
        $this->assertEquals(50.0, $stats['precision_rate']);
        // 3 émises / 3 subies = 1
        $this->assertEquals(1.0, $stats['karma_index']);

        // --- ASSERTIONS FOCUS ---
        $this->assertNotNull($stats['record']);
        $this->assertEquals(50, $stats['record']['points']);
        $this->assertEquals('Le Pire Record', $stats['record']['description']);

        $this->assertNotNull($stats['worst_stab']);
        $this->assertEquals(30, $stats['worst_stab']['points']);
    }
}
