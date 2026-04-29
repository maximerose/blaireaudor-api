<?php

declare(strict_types=1);

namespace App\Tests\Api\Admin;

use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

/**
 * Tests fonctionnels pour la gestion administrative des compétitions.
 * * Vérifie :
 * - La création de compétitions (avec/sans date de fin).
 * - La sécurité des accès (authentification requise).
 * - La validation des données (formats de date, logique chronologique).
 * - L'ajout massif de joueurs (existants et nouveaux).
 * - La robustesse face aux doublons de noms.
 */
final class AdminCompetitionControllerTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testCreateCompetitionSuccess(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $client->loginUser($user);

        $player = PlayerFactory::createOne();

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
                'referee' => '/api/players/'.$player->getId(),
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('slug', $data);
        $this->assertEquals('blaireau-d-or', $data['slug']);

        $this->assertArrayHasKey('join_code', $data);
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{6}$/', $data['join_code']);

        CompetitionFactory::assert()->exists(['slug' => 'blaireau-d-or']);
    }

    public function testCreateCompetitionWithoutEndDateSuccess(): void
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
                'participate' => true,
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent(), true);
        $competitionId = $data['id'];

        CompetitionFactory::assert()->exists([
            'id' => $competitionId,
            'endDate' => null,
        ]);

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

    public function testCreateCompetitionMissingStartDate(): void
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

    public function testCreateCompetitionInvalidDatesOrder(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne();
        $client->loginUser($user);

        $client->request(
            'POST',
            'api/admin/competition',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Compétition qui finit avant de commencer',
                'start_date' => '2026-02-20',
                'end_date' => '2026-02-18',
            ]),
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    public function testCreateCompetitionInvalidDateFormat(): void
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
                'name' => 'Compétition format date invalide',
                'start_date' => 'date-invalide',
                'end_date' => '2026-02-28',
            ]),
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    public function testCreateCompetitionParticipateWithoutPlayerProfile(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne(['player' => null]);
        $client->loginUser($user);

        $client->request(
            'POST',
            '/api/admin/competition',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Compétition fantôme',
                'start_date' => '2026-02-21',
                'end_date' => '2026-02-27',
                'participate' => true,
            ]),
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    public function testAddPlayersToCompetitionSuccess(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['createdBy' => $admin]);
        $existingPlayer = PlayerFactory::createOne(['displayName' => 'Ancien joueur']);

        $client->loginUser($admin);

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/add-players', $competition->getId()),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'existing_players_ids' => [$existingPlayer->getId()],
                'new_players' => ['Nouveau joueur fantôme'],
            ]),
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals(2, $data['summary']['success_count']);
        ParticipationFactory::assert()->count(2, ['competition' => $competition]);
    }

    public function testAddPlayersWithDuplicateShouldReportError(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['createdBy' => $admin]);
        $existingPlayer = PlayerFactory::createOne();
        ParticipationFactory::createOne([
            'competition' => $competition,
            'player' => $existingPlayer,
        ]);

        $client->loginUser($admin);

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/add-players', $competition->getId()),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'existing_players_ids' => [$existingPlayer->getId()], // Doublon
                'new_players' => ['Nouveau Joueur'], // Doit passer
            ])
        );

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertResponseStatusCodeSame(Response::HTTP_MULTI_STATUS);
        $this->assertEquals(1, $data['summary']['error_count']);
        $this->assertCount(1, $data['errors']);
        $this->assertCount(1, $data['successes']);

        $errorIds = array_column($data['errors'], 'id');
        $this->assertContains((string) $existingPlayer->getId(), $errorIds);
    }

    public function testAddPlayersValidationError(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne();
        $competition = CompetitionFactory::createOne(['createdBy' => $admin]);

        $client->loginUser($admin);

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/add-players', $competition->getId()),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'existing_players_ids' => [],
                'new_players' => [''], // Nom vide qui devrait échouer
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_MULTI_STATUS);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals(1, $data['summary']['error_count']);
        $this->assertNotEmpty($data['errors']);
        $this->assertEquals('', $data['errors'][0]['name']);

        PlayerFactory::assert()->notExists(['displayName' => '']);
    }

    public function testAddNewPlayerWithSameNameThanExistingPlayer(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne();
        $competition = CompetitionFactory::createOne(['createdBy' => $admin]);

        PlayerFactory::createOne([
            'displayName' => 'Nom Identique',
        ]);

        $client->loginUser($admin);

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/add-players', $competition->getId()),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'existing_players_ids' => [],
                'new_players' => ['Nom Identique'],
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        PlayerFactory::assert()->exists(['username' => 'nom-identique']);
        PlayerFactory::assert()->exists(['username' => 'nom-identique-1']);

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(1, $data['summary']['success_count']);
        $this->assertNotEmpty($data['successes']);
        $this->assertEquals('Nom Identique', $data['successes'][0]['name']);
    }

    public function testAddNewPlayersWithSameName(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne();
        $competition = CompetitionFactory::createOne(['createdBy' => $admin]);

        $client->loginUser($admin);

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/add-players', $competition->getId()),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'existing_players_ids' => [],
                'new_players' => ['Même Nom', 'Même Nom'],
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        PlayerFactory::assert()->exists(['username' => 'meme-nom']);
        PlayerFactory::assert()->exists(['username' => 'meme-nom-1']);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals(2, $data['summary']['success_count']);
    }

    public function testAddRefereeSuccess(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne();
        $client->loginUser($admin);

        $competition = CompetitionFactory::createOne(['createdBy' => $admin]);
        $newReferee = PlayerFactory::createOne();

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/referees/add', $competition->getId()),
            [], [], ['CONTENT_TYPE' => 'application/json'],
            json_encode(['player_id' => $newReferee->getId()])
        );

        $this->assertResponseIsSuccessful();

        $this->assertCount(2, $competition->getReferees());
        $this->assertTrue($competition->getReferees()->contains($newReferee));
    }

    public function testRemoveLastRefereeFails(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne();
        $client->loginUser($admin);

        $referee = PlayerFactory::createOne();
        $competition = CompetitionFactory::createOne([
            'createdBy' => $admin,
            'referees' => [$referee],
        ]);

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/referees/remove', $competition->getId()),
            [], [], ['CONTENT_TYPE' => 'application/json'],
            json_encode(['player_id' => $referee->getId()])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        $content = json_decode($client->getResponse()->getContent(), true);
        $this->assertStringContainsString('dernier arbitre', $content['error']);
    }

    public function testRemoveRefereeSuccess(): void
    {
        $client = static::createClient();

        $admin = UserFactory::createOne();
        $client->loginUser($admin);

        $referee1 = PlayerFactory::createOne();
        $referee2 = PlayerFactory::createOne();

        $competition = CompetitionFactory::createOne([
            'createdBy' => $admin,
            'referees' => [$referee1, $referee2],
        ]);

        $client->request(
            'POST',
            sprintf('/api/admin/competition/%s/referees/remove', $competition->getId()),
            [], [], ['CONTENT_TYPE' => 'application/json'],
            json_encode(['player_id' => $referee1->getId()])
        );

        $this->assertResponseIsSuccessful();

        $this->assertCount(1, $competition->getReferees());
        $this->assertFalse($competition->getReferees()->contains($referee1));
    }
}
