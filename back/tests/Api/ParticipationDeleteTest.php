<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class ParticipationDeleteTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testUserCanLeaveCompetitionIfNoActions(): void
    {
        $client = static::createClient();
        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $client->loginUser($user);

        $competition = CompetitionFactory::createOne();
        $participation = ParticipationFactory::createOne(['competition' => $competition, 'player' => $user->getPlayer()]);

        $client->request('DELETE', '/api/participations/'.$participation->getId());

        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
        ParticipationFactory::assert()->notExists(['id' => $participation->getId()]);
    }

    public function testCannotDeleteIfHasActions(): void
    {
        $client = static::createClient();
        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $client->loginUser($user);

        $participation = ParticipationFactory::createOne(['player' => $user->getPlayer()]);
        ActionFactory::createOne(['participation' => $participation]);

        $client->request('DELETE', '/api/participations/'.$participation->getId());

        $this->assertResponseStatusCodeSame(Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
