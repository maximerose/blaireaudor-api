<?php

declare(strict_types=1);

namespace App\Tests\Integration\Service;

use App\Entity\Competition;
use App\Factory\BonusDayFactory;
use App\Factory\CompetitionFactory;
use App\Service\Manager\CompetitionManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

/**
 * Test d'intégration pur pour s'assurer que les règles métier du Manager
 * s'appliquent correctement à l'entité avant la sauvegarde.
 */
final class CompetitionManagerTest extends KernelTestCase
{
    use ResetDatabase;
    use Factories;

    public function testEnforceDateRulesRemovesOutOfBoundsBonusDays(): void
    {
        self::bootKernel();
        $manager = static::getContainer()->get(CompetitionManager::class);

        $competition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('2026-05-01'),
            'endDate' => new \DateTimeImmutable('2026-05-10'),
            'fogOfWar' => true,
        ]);

        // Bonus valide (le 5 Mai)
        $validBonus = BonusDayFactory::createOne(['date' => new \DateTimeImmutable('2026-05-05')]);
        $competition->addBonusDay($validBonus);

        // Bonus invalide car après la date de fin (le 12 Mai)
        $invalidBonus = BonusDayFactory::createOne(['date' => new \DateTimeImmutable('2026-05-12')]);
        $competition->addBonusDay($invalidBonus);

        $this->assertCount(2, $competition->getBonusDays());

        // Exécution de la règle métier pure
        $manager->enforceDateRules($competition);

        $this->assertCount(1, $competition->getBonusDays(), 'Le jour bonus hors limite doit être retiré de la collection.');
        $this->assertTrue($competition->getBonusDays()->contains($validBonus));
    }

    public function testEnforceDateRulesLiftsFogOfWarIfFinished(): void
    {
        self::bootKernel();
        $manager = static::getContainer()->get(CompetitionManager::class);

        $competition = new Competition();
        $competition->setStartDate(new \DateTimeImmutable('2025-01-01'));
        $competition->setEndDate(new \DateTimeImmutable('2025-01-10')); // Date dans le passé
        $competition->setFogOfWar(true);

        $manager->enforceDateRules($competition);

        $this->assertFalse($competition->hasFogOfWar(), 'Le brouillard doit être levé si la compétition est terminée.');
    }
}
