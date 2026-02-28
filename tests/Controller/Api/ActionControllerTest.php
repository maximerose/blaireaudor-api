<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class ActionControllerTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testUserCanCreateActionAsPending(): void
    {
        $client = static::createClient();

        $createdBy = UserFactory::createOne();
        $competition = CompetitionFactory::createOne(['createdBy' => $createdBy]);

        $userA = UserFactory::createOne(); // Le dénonciateur
        $userB = UserFactory::createOne(); // La victime

        $playerA = PlayerFactory::createOne(['associatedUser' => $userA]);
        $playerB = PlayerFactory::createOne(['associatedUser' => $userB]);

        ParticipationFactory::createOne(['competition' => $competition, 'player' => $playerA]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $playerB]);

        $client->loginUser($userA);

        $this->assertCount(2, $competition->getParticipations());

        $client->request(
            'POST',
            '/api/competitions/' . $competition->getId() . '/actions',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'description' => 'Chute à ski',
                'points' => 10,
                'player' => '/api/players/' . $playerB->getId(),
                'competition' => '/api/competitions/' . $competition->getId(),
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        ActionFactory::assert()->exists([
            'description' => 'Chute à ski',
            'status' => ActionStatus::PENDING,
        ]);
    }

    public function testStrangerCannotCreateAction(): void
    {
        $client = static::createClient();

        $stranger = UserFactory::createOne();
        $competition = CompetitionFactory::createOne();
        $player = PlayerFactory::createOne();

        $client->loginUser($stranger);

        $client->request(
            'POST',
            '/api/competitions/' . $competition->getId() . '/actions',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'description' => 'Troll',
                'points' => 100,
                'player' => '/api/players/' . $player->getId(),
                'competition' => '/api/competitions/' . $competition->getId(),
            ])
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
