<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Factory\CompetitionFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class RefereeManagementTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testManageRefereesSuccess(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $creator = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['createdBy' => $creator]);
        $otherPlayer = PlayerFactory::createOne();

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($creator));

        // Ajout d'un arbitre
        $client->request('POST', '/api/competitions/'.$competition->getId().'/referees/add', [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode([
            'playerId' => $otherPlayer->getId()->toString(),
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertCount(2, $data['referees']); // Le créateur par défaut + le nouveau

        // Révocation de l'arbitre
        $client->request('POST', '/api/competitions/'.$competition->getId().'/referees/remove', [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode([
            'playerId' => $otherPlayer->getId()->toString(),
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertCount(1, $data['referees']);
    }
}
