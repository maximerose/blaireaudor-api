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

final class PlayerMergeTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testRefereeCanMergeGuestPlayerIntoRealUser(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        // 1. Initialisation propre via les states des factories
        $refereeUser = UserFactory::new()->withPlayer()->create();
        $competition = CompetitionFactory::createOne(['referees' => [$refereeUser->getPlayer()]]);

        // Profil invité (sans user lié)
        $guestPlayer = PlayerFactory::createOne(['displayName' => 'Ghost Player', 'associatedUser' => null]);
        $guestPart = ParticipationFactory::createOne(['competition' => $competition, 'player' => $guestPlayer, 'score' => 0]);

        // Utilisateur réel cible
        $realUser = UserFactory::new()->withPlayer()->create();
        $realPart = ParticipationFactory::createOne(['competition' => $competition, 'player' => $realUser->getPlayer(), 'score' => 0]);

        // Attribution d'un méfait de 30 pts sur le fantôme
        ActionFactory::createOne(['participation' => $guestPart, 'points' => 30, 'status' => ActionStatus::VALIDATED]);

        // 2. Authentification de l'arbitre
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($refereeUser));

        // 3. Exécution de la fusion
        $client->request(
            'POST',
            '/api/competitions/'.$competition->getId().'/merge-players',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'guestPlayerId' => $guestPlayer->getId()->toString(),
                'realUserId' => $realUser->getId()->toString(),
            ])
        );

        // 4. Assertions de réussite
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // L'utilisateur réel doit avoir hérité du score
        $this->getContainer()->get('doctrine')->getManager()->refresh($realPart);
        $this->assertEquals(30, $realPart->getScore());

        // Le profil fantôme doit être nettoyé de la base
        PlayerFactory::assert()->notExists(['id' => $guestPlayer->getId()]);
    }
}
