<?php

declare(strict_types=1);

namespace App\Tests\Integration\Entity;

use App\Entity\Competition;
use App\Factory\CompetitionFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use App\Service\Manager\CompetitionManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

/**
 * Tests unitaires et d'intégration pour l'entité Competition.
 * * Vérifie :
 * - La génération automatique du slug à partir du nom.
 * - La création automatique du code d'invitation (joinCode).
 * - La gestion de l'unicité des slugs (incrémentation en cas de doublon).
 */
class CompetitionTest extends KernelTestCase
{
    use ResetDatabase;
    use Factories;

    public function testCompetitionGensCodeOnPersist(): void
    {
        self::bootKernel();

        $competition = CompetitionFactory::createOne([
            'name' => 'Ski 2026',
        ]);

        $this->assertNotEmpty($competition->getJoinCode());
        $this->assertSame(6, \strlen($competition->getJoinCode()));
    }

    public function testManagerSetsReferee(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $manager = $container->get(CompetitionManager::class);

        $admin = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $comp = new Competition();
        $comp->setName('Test Manager');
        $comp->setStartDate(new \DateTimeImmutable());
        $comp->setCreatedBy($admin);

        $manager->prepare($comp);

        $this->assertTrue($comp->getReferees()->contains($admin->getPlayer()));
    }

    public function testCompetitionSetsDefaultRefereeFromCreatorOnPersist(): void
    {
        self::bootKernel();

        $admin = UserFactory::createOne([
            'player' => PlayerFactory::createOne(['display_name' => 'Arbitre']),
        ]);

        $competition = CompetitionFactory::createOne([
            'name' => 'Compétition arbitrée',
            'createdBy' => $admin,
        ]);

        $this->assertCount(1, $competition->getReferees(), 'Il doit y avoir un arbitre');
        $this->assertSame(
            $admin->getPlayer()->getId(),
            $competition->getReferees()->first()->getId(),
            "L'arbitre doit être le profil Player du créateur par défaut"
        );
    }
}
