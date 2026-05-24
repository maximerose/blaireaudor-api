<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class ResetPasswordTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testRequestResetPasswordSendsEmail(): void
    {
        $client = static::createClient();
        UserFactory::createOne(['email' => 'blaireau@test.com']);

        $client->request('POST', '/api/reset-password', [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode([
            'email' => 'blaireau@test.com',
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertEmailCount(1); // Vérifie que Symfony a bien mis un email en file d'attente
    }

    public function testValidateTokenAndResetPassword(): void
    {
        $client = static::createClient();
        $user = UserFactory::createOne(['plainPassword' => 'old_password']);

        // On génère un token "à la main" via le service pour tester les étapes 2 et 3
        $resetHelper = static::getContainer()->get(ResetPasswordHelperInterface::class);
        $token = $resetHelper->generateResetToken($user)->getToken();

        // Étape 2 : Vérification du lien (GET)
        $client->request('GET', (string) '/api/reset-password/'.$token);
        $this->assertResponseIsSuccessful();

        // Étape 3 : Changement du mot de passe (POST)
        $client->request('POST', (string) '/api/reset-password/'.$token, [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode([
            'plainPassword' => 'new_secure_password',
        ]));
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        // On vérifie que l'on peut se connecter avec le NOUVEAU mot de passe
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode([
            'username' => $user->getUsername(),
            'password' => 'new_secure_password',
        ]));
        $this->assertResponseIsSuccessful();
    }
}
