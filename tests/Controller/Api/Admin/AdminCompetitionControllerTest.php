<?php

namespace App\Tests\Controller\Api\Admin;

use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class AdminCompetitionControllerTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testCreateCompetitionSuccess(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $client->loginUser($user);

        $client->request(
            'POST',
            '/api/admin/competition',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Blaireau d\'or',
                'start_date' => '2026-02-21',
                'end_date' => '2026-02-27',
                'participate' => true,
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent(), true);
        $competitionId = $data['id'];

        CompetitionFactory::assert()->exists(['id' => $competitionId]);
        ParticipationFactory::assert()->exists([
            'competition' => $competitionId,
            'player' => $user->getPlayer()->getId(),
        ]);

        $this->assertArrayHasKey('join_code', $data);
        $this->assertNotNull($data['join_code']);
    }

    public function testUserNotConnected(): void 
    {
        $client = static::createClient();

        $client->request(
            'POST',
            '/api/admin/competition',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Compétition sans utilisateur connecté',
            ]),
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testCreateCompetitionMissingDates(): void
    {
        $client = static::createClient();
        
        $user = UserFactory::createOne();
        $client->loginUser($user);

        $client->request(
            'POST',
            '/api/admin/competition',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Compétition non datée',
            ]),
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }
}
