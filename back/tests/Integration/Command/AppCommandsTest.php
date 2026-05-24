<?php

declare(strict_types=1);

namespace App\Tests\Integration\Command;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class AppCommandsTest extends KernelTestCase
{
    use ResetDatabase;
    use Factories;

    public function testLiftFogCommand(): void
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        // Création d'une compétition terminée hier avec le brouillard encore actif
        $competition = CompetitionFactory::createOne([
            'fogOfWar' => true,
            'endDate' => new \DateTimeImmutable('-1 day'),
        ]);

        $command = $application->find('app:competition:lift-fog');
        $commandTester = new CommandTester($command);

        // Exécution de la commande
        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('brouillard s\'est dissipé sur 1 compétition(s)', $output);

        // On vérifie que l'entité a bien été mise à jour en base
        $this->assertFalse($competition->hasFogOfWar());
    }

    public function testRefreshScoresCommand(): void
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        $competition = CompetitionFactory::createOne();
        // Le joueur démarre à 0
        $participation = ParticipationFactory::createOne(['competition' => $competition, 'score' => 0]);

        // On lui ajoute un méfait de 15 points
        ActionFactory::createOne([
            'participation' => $participation,
            'status' => ActionStatus::VALIDATED,
            'points' => 15,
        ]);

        $command = $application->find('app:scores:refresh');
        $commandTester = new CommandTester($command);

        // Exécution de la commande
        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();

        $output = $commandTester->getDisplay();
        $this->assertStringContainsString('Tous les scores ont été synchronisés', $output);

        $em = static::getContainer()->get(EntityManagerInterface::class);
        $em->refresh($participation);

        // On vérifie que le score a bien été recalculé par la commande
        $this->assertEquals(15, $participation->getScore());
    }
}
