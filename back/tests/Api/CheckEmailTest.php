<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class CheckEmailTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testCheckEmailAvailable(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/check-email?email=nouveau@blaireau.com');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertTrue($data['available']);
    }

    public function testCheckEmailTaken(): void
    {
        $client = static::createClient();
        UserFactory::createOne(['email' => 'deja-pris@blaireau.com']);

        $client->request('GET', '/api/check-email?email=deja-pris@blaireau.com');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertFalse($data['available']);
    }

    public function testCheckEmailInvalidFormat(): void
    {
        $client = static::createClient();

        // Un format invalide est ignoré par le contrôleur (renvoie available => true par défaut pour ne pas bloquer le front)
        $client->request('GET', '/api/check-email?email=ceci-nest-pas-un-email');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertTrue($data['available']);
    }
}
