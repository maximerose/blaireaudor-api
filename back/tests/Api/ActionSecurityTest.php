<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class ActionSecurityTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testStandardPlayerCannotEditValidatedAction(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $playerUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($playerUser));

        $competition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('2026-01-01'),
            'endDate' => new \DateTimeImmutable('2026-12-31'),
        ]);

        $participation = ParticipationFactory::createOne(['competition' => $competition, 'player' => $playerUser->getPlayer()]);

        // Le joueur a créé cette action, mais elle est DÉJÀ VALIDÉE
        $action = ActionFactory::createOne([
            'participation' => $participation,
            'createdBy' => $playerUser,
            'status' => ActionStatus::VALIDATED,
            'dateAction' => new \DateTimeImmutable('2026-06-01'),
        ]);

        $client->request('PATCH', '/api/actions/'.$action->getId(), [], [], ['CONTENT_TYPE' => 'application/merge-patch+json'], json_encode([
            'points' => 0, // Tentative de triche
        ]));

        // Le Voter (ActionVoter) doit bloquer (403)
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRefereeCanEditAnyActionButCannotDeleteCompetition(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $creatorUser = UserFactory::createOne();
        $refereeUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $competition = CompetitionFactory::createOne([
            'createdBy' => $creatorUser,
            'referees' => [$refereeUser->getPlayer()],
            'startDate' => new \DateTimeImmutable('2026-01-01'),
            'endDate' => new \DateTimeImmutable('2026-12-31'),
        ]);

        $participation = ParticipationFactory::createOne(['competition' => $competition]);
        $action = ActionFactory::createOne([
            'participation' => $participation,
            'status' => ActionStatus::PENDING,
            'dateAction' => new \DateTimeImmutable('2026-06-01'),
        ]);

        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($refereeUser));

        // 1. L'arbitre valide l'action (PATCH)
        $client->request('PATCH', '/api/actions/'.$action->getId(), [], [], ['CONTENT_TYPE' => 'application/merge-patch+json'], json_encode([
            'status' => ActionStatus::VALIDATED->value,
        ]));
        $this->assertResponseIsSuccessful();

        // 2. L'arbitre tente de supprimer la compétition entière (DELETE)
        $client->request('DELETE', '/api/competitions/'.$competition->getId());

        // Le Voter (CompetitionVoter) doit bloquer car il n'est pas le CREATOR
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
