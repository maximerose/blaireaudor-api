<?php

declare(strict_types=1);

namespace App\Tests\Api\Admin;

use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class AdminCompetitionControllerTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    private KernelBrowser $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    /**
     * Test de création nominale d'une compétition.
     */
    public function testCreateCompetitionSuccess(): void
    {
        $admin = $this->loginAsAdmin();
        $referee = PlayerFactory::createOne();

        $payload = [
            'name' => "Blaireau d'or 2026",
            'start_date' => '2026-02-21',
            'end_date' => '2026-02-27',
            'participate' => true,
            'referee' => '/api/players/'.$referee->getId(),
        ];

        $this->postJson('/api/admin/competition', $payload);

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = $this->getJsonResponse();

        $this->assertMatchesRegularExpression('/^[A-Z0-9]{6}$/', $data['join_code']);

        CompetitionFactory::assert()->exists(['name' => "Blaireau d'or 2026"]);
    }

    /**
     * Test de la sécurité : accès interdit si non connecté.
     */
    public function testUserNotConnected(): void
    {
        $this->postJson('/api/admin/competition', ['name' => 'Interdit']);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Test de validation : dates incohérentes.
     */
    public function testCreateCompetitionInvalidDatesOrder(): void
    {
        $this->loginAsAdmin();

        $this->postJson('/api/admin/competition', [
            'name' => 'Voyage dans le temps',
            'start_date' => '2026-02-20',
            'end_date' => '2026-02-18',
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    /**
     * Test de l'ajout massif de joueurs (existants et nouveaux).
     */
    public function testAddPlayersToCompetitionSuccess(): void
    {
        $admin = $this->loginAsAdmin();
        $competition = CompetitionFactory::createOne(['createdBy' => $admin]);
        $existingPlayer = PlayerFactory::createOne(['displayName' => 'Ancien blaireau']);

        $payload = [
            'existing_players_ids' => [$existingPlayer->getId()],
            'new_players' => ['Nouveau Grimpeur'],
        ];

        $this->postJson(sprintf('/api/admin/competition/%s/add-players', $competition->getId()), $payload);

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = $this->getJsonResponse();
        $this->assertEquals(2, $data['summary']['success_count']);

        ParticipationFactory::assert()->count(2, ['competition' => $competition]);
    }

    /**
     * Crée un utilisateur admin et le connecte.
     */
    private function loginAsAdmin(): object
    {
        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $this->client->loginUser($user);

        return $user;
    }

    /**
     * Centralise les appels POST JSON.
     */
    private function postJson(string $url, array $data): void
    {
        $this->client->request(
            'POST',
            $url,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($data)
        );
    }

    /**
     * Décode la réponse JSON.
     */
    private function getJsonResponse(): array
    {
        return json_decode($this->client->getResponse()->getContent(), true);
    }
}
