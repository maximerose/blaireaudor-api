<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Factory\BonusDayFactory;
use App\Factory\CompetitionFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class BonusDayApiTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testRefereeCanManageBonusDays(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $refereeUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $competition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('2026-05-01'),
            'endDate' => new \DateTimeImmutable('2026-05-30'),
            'referees' => [$refereeUser->getPlayer()],
        ]);

        // Authentification de l'arbitre
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($refereeUser));

        // 1. POST (Création du bonus)
        $client->request('POST', '/api/bonus_days', [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode([
            'competition' => '/api/competitions/'.$competition->getId(),
            'date' => '2026-05-15',
            'multiplier' => 3,
        ]));

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $data = json_decode($client->getResponse()->getContent(), true);
        $bonusId = $data['id'];
        $this->assertEquals(3, $data['multiplier']);

        // 2. PATCH (Modification du bonus à x5)
        $client->request('PATCH', (string) '/api/bonus_days/'.$bonusId, [], [], ['CONTENT_TYPE' => 'application/merge-patch+json'], json_encode([
            'multiplier' => 5,
        ]));

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals(5, $data['multiplier']);

        // 3. DELETE (Suppression)
        $client->request('DELETE', '/api/bonus_days/'.$bonusId);
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);

        BonusDayFactory::assert()->count(0);
    }

    public function testStandardPlayerCannotCreateBonusDay(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $playerUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $competition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('2026-05-01'),
            'endDate' => new \DateTimeImmutable('2026-05-30'),
        ]);

        // Authentification du joueur lambda (non arbitre)
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($playerUser));

        $client->request('POST', '/api/bonus_days', [], [], ['CONTENT_TYPE' => 'application/ld+json'], json_encode([
            'competition' => '/api/competitions/'.$competition->getId(),
            'date' => '2026-05-15',
            'multiplier' => 2,
        ]));

        // Le CompetitionVoter doit bloquer (seul un REFEREE a le droit)
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
