<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class CompetitionControllerTest extends WebTestCase
{
    use ResetDatabase, Factories;

    public function testGetCompetitionByCodeSuccess(): void
    {
        $client = static::createClient();

        $competition = CompetitionFactory::createOne([
            'name' => 'Tournoi de blaireaux',
            'joinCode' => 'SUCCESS',
        ]);

        $user = UserFactory::createOne();
        $playerWithUser = PlayerFactory::createOne([
            'displayName' => 'Maxime Connecté',
            'associatedUser' => $user,
        ]);
        ParticipationFactory::createOne([
            'competition' => $competition,
            'player' => $playerWithUser,
        ]);

        $ghostPlayer = PlayerFactory::createOne([
            'displayName' => 'Joueur Fantôme',
            'associatedUser' => null
        ]);
        ParticipationFactory::createOne([
            'competition' => $competition, 
            'player' => $ghostPlayer
        ]);

        $client->request('GET','/api/competitions/check-code/SUCCESS');

        $this->assertResponseIsSuccessful();

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertEquals('Tournoi de blaireaux', $data['name']);
        $this->assertEquals('SUCCESS', $data['join_code']);

        $this->assertCount(2, $data['players'], 'Le JSON doit contenir tous es joueurs');
        
        $this->assertEquals('Maxime Connecté', $data['players'][0]['display_name']);
        $this->assertTrue($data['players'][0]['has_account']);

        $this->assertEquals('Joueur Fantôme', $data['players'][1]['display_name']);
        $this->assertFalse($data['players'][1]['has_account']);
    }

    public function testGetCompetitionByCodeNotFound(): void
    {
        $client = static::createClient();

        $client->request('GET', '/api/competitions/check-code/EXISTE_PAS');

        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
