<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Factory\CompetitionFactory;
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
    use ResetDatabase, Factories;

    public function testCompetitionGensSlugAndCodeOnPersist(): void
    {
        self::bootKernel();

        $competition = CompetitionFactory::createOne([
            'name' => 'Ski 2026',
        ]);

        $this->assertSame('ski-2026', $competition->getSlug());

        $this->assertNotNull($competition->getJoinCode());
        $this->assertSame(6, strlen($competition->getJoinCode()));
        $this->assertMatchesRegularExpression('/^[A-Z0-9]+$/', $competition->getJoinCode());
    }

    public function testSlugIncrementsIfDuplicate(): void
    {
        self::bootKernel();

        $comp1 = CompetitionFactory::createOne(['name' => 'Doublon']);
        $comp2 = CompetitionFactory::createOne(['name' => 'Doublon']);

        $this->assertSame('doublon', $comp1->getSlug());
        $this->assertSame('doublon-1', $comp2->getSlug());
    }
}