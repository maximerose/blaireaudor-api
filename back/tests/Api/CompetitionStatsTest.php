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
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class CompetitionStatsTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testParticipantCannotViewStatsIfFogOfWarIsActive(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $playerUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['fogOfWar' => true]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $playerUser->getPlayer()]);

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($playerUser));

        $client->request('GET', '/api/competitions/'.$competition->getId().'/stats');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);

        $client->request('GET', '/api/competitions/'.$competition->getId().'/daily-evolution');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRefereeCanViewStatsAndKpis(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $refereeUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne([
            'fogOfWar' => true,
            'referees' => [$refereeUser->getPlayer()],
        ]);

        $part = ParticipationFactory::createOne(['competition' => $competition]);

        ActionFactory::createOne([
            'participation' => $part,
            'points' => 20,
            'status' => ActionStatus::VALIDATED,
            'createdBy' => $refereeUser,
        ]);

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($refereeUser));

        $client->request('GET', '/api/competitions/'.$competition->getId().'/stats');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $expectedKeys = [
            'total_players',
            'total_actions',
            'total_points',
            'bonus_actions_ratio',
            'max_actions_received',
            'max_actions_reported',
            'min_actions_received',
            'min_actions_reported',
            'max_approval_ratio',
            'max_rejected_reports',
            'max_distinct_informers_received',
            'average_points_per_action',
            'max_reciprocal_target_pair',
            'max_unique_targets_reported',
            'max_points_reported',
            'max_avg_points_received',
            'min_avg_points_received',
            'max_points_single_action',
        ];

        foreach ($expectedKeys as $key) {
            $this->assertArrayHasKey($key, $data, "Le KPI '$key' manque dans la réponse.");
        }
    }

    public function testDailyEvolutionCalculatesCumulativePointsCorrectlyWithBonus(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $creatorUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['createdBy' => $creatorUser, 'fogOfWar' => false]);

        $player1 = PlayerFactory::createOne(['displayName' => 'Blaireau A']);
        $part1 = ParticipationFactory::createOne(['competition' => $competition, 'player' => $player1]);

        // Jour 1 : Action standard de 10 pts
        ActionFactory::createOne([
            'participation' => $part1,
            'points' => 10,
            'status' => ActionStatus::VALIDATED,
            'dateAction' => new \DateTimeImmutable('2026-05-01 10:00:00'),
        ]);

        // Jour 2 : Jour Bonus (x3) - Action de 15 pts (15 * 3 = 45 pts)
        BonusDayFactory::createOne(['competition' => $competition, 'date' => new \DateTimeImmutable('2026-05-02'), 'multiplier' => 3]);
        ActionFactory::createOne([
            'participation' => $part1,
            'points' => 15,
            'status' => ActionStatus::VALIDATED,
            'dateAction' => new \DateTimeImmutable('2026-05-02 15:00:00'),
        ]);

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($creatorUser));
        $client->request('GET', '/api/competitions/'.$competition->getId().'/daily-evolution');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertCount(2, $data);

        // Le 01 Mai (Index 0)
        $this->assertEquals('2026-05-01', $data[0]['date']);
        $this->assertEquals(10, $data[0][$player1->getId()->toString()]);

        // Le 02 Mai (Index 1) : 10 de la veille + 45 du jour bonus (15 * 3) = 55
        $this->assertEquals('2026-05-02', $data[1]['date']);
        $this->assertEquals(55, $data[1][$player1->getId()->toString()]);
    }
}
