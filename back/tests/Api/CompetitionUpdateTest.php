<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Factory\BonusDayFactory;
use App\Factory\CompetitionFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class CompetitionUpdateTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testUpdateCompetitionEnforcesDateRules(): void
    {
        $client = static::createClient();
        $admin = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $client->loginUser($admin);

        $competition = CompetitionFactory::createOne([
            'createdBy' => $admin,
            'startDate' => new \DateTimeImmutable('2026-01-01'),
            'endDate' => new \DateTimeImmutable('2026-01-10'),
            'fogOfWar' => true,
        ]);

        // Un jour bonus valide, un jour bonus qui va devenir invalide
        BonusDayFactory::createOne(['competition' => $competition, 'date' => new \DateTimeImmutable('2026-01-05')]);
        $outOfBoundsBonus = BonusDayFactory::createOne(['competition' => $competition, 'date' => new \DateTimeImmutable('2026-01-09')]);

        // On modifie la date de fin au 08 Janvier (le 2eme bonus devient invalide)
        // Et on met une date dans le passé (la compétition est finie, le fog of war doit sauter)
        $payload = [
            'end_date' => '2026-01-08T23:59:59Z',
        ];

        $client->request('PATCH', '/api/competitions/'.$competition->getId(), [], [], [
            'CONTENT_TYPE' => 'application/merge-patch+json',
        ], json_encode($payload));

        $this->assertResponseIsSuccessful();

        $data = json_decode($client->getResponse()->getContent(), true);

        // Vérification 1 : Le fog of war a été forcé à false (date de fin < now)
        $this->assertFalse($data['fog_of_war']);

        // Vérification 2 : Le bonus hors limite a été supprimé
        BonusDayFactory::assert()->count(1, ['competition' => $competition]);
        BonusDayFactory::assert()->notExists(['id' => $outOfBoundsBonus->getId()]);
    }
}
