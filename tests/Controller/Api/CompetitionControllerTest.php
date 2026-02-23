<?php

namespace App\Tests\Controller\Api;

use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class CompetitionControllerTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testGetCompetitionByCodeSuccess(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne();

        $player = PlayerFactory::createOne([
            'displayName' => 'Maxime Rose',
            'associatedUser' => $user,
        ]);

        $competition = CompetitionFactory::createOne([
            'name' => 'Tournoi de blaireaux',
            'joinCode' => 'SUCCESS',
        ]);

        $participation = ParticipationFactory::createOne([
            'competition' => $competition,
            'player' => $player,
        ]);

        $client->request('GET','/api/competition/check-code/SUCCESS');

        $this->assertResponseIsSuccessful();

        $data = json_decode($client->getResponse()->getContent(), true);
        
        $this->assertNotNull($data['players']);  
    }

    public function testGetCompetitionByCodeNotFound(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/competition/check-code/EXISTE_PAS');

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
