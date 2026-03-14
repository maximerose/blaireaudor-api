<?php

declare(strict_types=1);

namespace App\Tests\Controller\Api;

use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class SearchControllerTest extends WebTestCase
{
  use ResetDatabase, Factories;

  public function testSearchPlayerWithUnlinkedFilter(): void
  {
    $client = static::createClient();

    PlayerFactory::createOne([
      'displayName' => 'Victorien occupé',
      'associatedUser' => UserFactory::new(),
    ]);

    PlayerFactory::createOne([
      'displayName' => 'Victorien libre',
      'associatedUser' => null,
    ]);

    $client->request('GET', '/api/search/players?displayName=Victorien');
    $this->assertResponseIsSuccessful();
    $data = json_decode($client->getResponse()->getContent(), true);
    $this->assertCount(2, $data, 'La recherche globale doit retourner les deux joueurs');

    $client->request('GET', '/api/search/players?displayName=Victorien&unlinked=true');
    $this->assertResponseIsSuccessful();
    $data = json_decode($client->getResponse()->getContent(), true);
    $this->assertCount(1, $data, 'La recherche unlinked ne doit retourner que le joueur libre');
    $this->assertSame('Victorien libre', $data[0]['display_name']);
  }
}
