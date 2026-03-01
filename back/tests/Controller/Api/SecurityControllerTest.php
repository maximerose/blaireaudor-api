<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

/**
 * Tests fonctionnels pour la sécurité (Authentification et Session).
 * * Vérifie :
 * - Le succès du login avec retour des infos utilisateur (JSON).
 * - L'échec du login (401 Unauthorized).
 * - La déconnexion (204 No Content via le LogoutListener).
 * - La récupération du profil de l'utilisateur connecté (/api/me).
 */
final class SecurityControllerTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testLoginSuccess(): void
    {
        $client = static::createClient();

        UserFactory::createOne([
            'username' => 'admin',
            'plainPassword' => 'password',
            'player' => PlayerFactory::new([
                'username' => 'admin',
                'displayName' => 'Prénom Nom',
            ]),
        ]);

        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'username' => 'admin',
                'password' => 'password',
            ])
        );

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);
        
        $this->assertSame('admin', $data['user']);
        $this->assertSame('Prénom Nom', $data['display_name']);
        $this->assertContains('ROLE_USER', $data['roles']);
    }

    public function testLoginFailure(): void
    {
        $client = static::createClient();
        UserFactory::createOne(['username' => 'admin', 'plainPassword' => 'password']);

        $client->request(
            'POST',
            '/api/login',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode(['username' => 'admin', 'password' => 'wrong'])
        );

        $this->assertResponseStatusCodeSame(401);
    }

    public function testLogout(): void
    {
        $client = static::createClient();
        
        $client->request('GET', '/api/logout');

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT); 
    }

    public function testGetMe(): void
    {
        $client = static::createClient();
        
        $user = UserFactory::createOne([
            'username' => 'martin',
            'plainPassword' => 'test',
        ]);

        $client->loginUser($user);

        $client->request('GET', '/api/me');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertSame('martin', $data['user']);
    }
}
