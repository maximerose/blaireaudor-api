<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

/**
 * Tests fonctionnels pour l'inscription des utilisateurs.
 * * Vérifie :
 * - Le workflow complet d'inscription (User + Player + Participation via code).
 * - La gestion des erreurs de validation (doublons de username).
 * - La logique de "slugification" et d'incrémentation automatique des noms d'utilisateurs.
 */
final class RegistrationControllerTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testRegisterNewPlayerWithCompetitionCode(): void
    {
        $client = static::createClient();
        $entityManager = $client->getContainer()->get('doctrine')->getManager();

        $competition = CompetitionFactory::createOne([
            'name' => 'Compétition à code',
            'joinCode' => 'CODE',
        ]);

        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'blaireau36',
                'display_name' => 'Patrick Dupont',
                'plain_password' => 'password',
                'join_code' => 'CODE',
            ])
        );

        $this->assertResponseStatusCodeSame(201);
        
        UserFactory::assert()->exists(['username' => 'blaireau36']);
        PlayerFactory::assert()->exists(['username' => 'blaireau36']);
        
        $user = UserFactory::find(['username' => 'blaireau36']);
        $entityManager->refresh($user);

        $this->assertNotNull($user->getPlayer(), 'Le User doit être lié à un Player');
        $this->assertSame('Patrick Dupont', $user->getPlayer()->getDisplayName());
    
        $player = $user->getPlayer();

        ParticipationFactory::assert()->exists(criteria: [
            'competition' => $competition,
            'player' => $player,
        ]);

        $participationsInThisComp = $player->getParticipations()->filter(function($p) use ($competition) {
            return $p->getCompetition() === $competition;
        });

        $this->assertCount(1, $participationsInThisComp, 'Le joueur doit participer une et une seule fois à cette compétition.');
    }

    public function testRegisterTwoPlayersWithSameUsername(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne(['username' => 'deja-pris']);
        
        $client->request(
            'POST',
            '/api/register',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'deja-pris',
                'display_name' => 'Pascal Truc',
                'plain_password' => 'password',
            ])
        );
        
        $this->assertResponseStatusCodeSame(422);

        $responseContent = $client->getResponse()->getContent();
        $data = json_decode($responseContent, true);

        $this->assertArrayHasKey('username', $data['errors']);
    }

    public function testAutomaticUsernameIncrementForReferee(): void
    {
        PlayerFactory::createOne([
            'username' => 'joueur-cree',
            'displayName' => 'Joueur Créé',
        ]);

        $player2 = PlayerFactory::new()->withoutUsername()->create([
            'displayName' => 'Joueur Créé',
        ]);

        $this->assertSame('joueur-cree-1', $player2->getUsername());

        $player3 = PlayerFactory::new()->withoutUsername()->create([
            'displayName' => 'Joueur Créé',
        ]);

        $this->assertSame('joueur-cree-2', $player3->getUsername());
    }

    public function testCheckUsernameRoute(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne([
            'username' => 'pseudo-qui-existe-deja',
        ]);

        $client->request('GET', '/api/check-username/un-pseudo-qui-n-existe-pas');
        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertTrue($data['available']);

        $client->request('GET', '/api/check-username/pseudo-qui-existe-deja');
        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertFalse($data['available']);
    }
}
