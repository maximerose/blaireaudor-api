<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class CompetitionCreateTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    public function testCreateCompetitionSuccess(): void
    {
        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $this->client->loginUser($user);

        $payload = [
            'name' => "Blaireau d'or 2026",
            'start_date' => '2026-02-21',
            'end_date' => '2026-02-27',
            'participate' => true,
            'is_creator_referee' => true,
        ];

        $this->client->request('POST', '/api/competitions', [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode($payload));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $data = json_decode($this->client->getResponse()->getContent(), true);

        $this->assertMatchesRegularExpression('/^[A-Z0-9]{6}$/', $data['join_code']);
        CompetitionFactory::assert()->exists(['name' => "Blaireau d'or 2026"]);
    }

    public function testUserNotConnected(): void
    {
        $this->client->request('POST', '/api/competitions', [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode(['name' => 'Interdit']));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testAddPlayersToCompetitionSuccess(): void
    {
        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $this->client->loginUser($user);

        $competition = CompetitionFactory::createOne(['createdBy' => $user]);
        $existingPlayer = PlayerFactory::createOne(['displayName' => 'Ancien blaireau']);

        $payload = [
            'existing_players_ids' => [$existingPlayer->getId()->toString()],
            'new_players' => ['Nouveau Joueur'],
        ];

        $this->client->request('POST', \sprintf('/api/competitions/%s/add-players', $competition->getId()), [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode($payload));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        ParticipationFactory::assert()->count(2, ['competition' => $competition]);
    }
}
