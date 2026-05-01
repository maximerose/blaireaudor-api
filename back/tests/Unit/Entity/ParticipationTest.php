<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\BonusDayFactory;
use App\Factory\ParticipationFactory;
use PHPUnit\Framework\TestCase;

class ParticipationTest extends TestCase
{
    public function testUpdateScoreWithoutBonusDay(): void
    {
        $participation = ParticipationFactory::new()->withoutPersisting()->create();
        $competition = $participation->getCompetition();
        $player = $participation->getPlayer();

        // On injecte les actions manuellement dans l'entité Player en mémoire
        // pour que Participation::getActions() les trouve lors du filtrage.
        $player->addAction(ActionFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'points' => 10,
            'dateAction' => new \DateTimeImmutable('2026-05-14'),
            'status' => ActionStatus::VALIDATED,
        ]));

        $player->addAction(ActionFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'points' => 15,
            'dateAction' => new \DateTimeImmutable('2026-05-15'),
            'status' => ActionStatus::VALIDATED,
        ]));

        $participation->updateScore();

        // 10 + 15 = 25
        $this->assertEquals(25, $participation->getScore());
    }

    public function testUpdateScoreWithMatchingBonusDay(): void
    {
        $participation = ParticipationFactory::new()->withoutPersisting()->create();
        $competition = $participation->getCompetition();
        $player = $participation->getPlayer();

        $player->addAction(ActionFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'points' => 10, // Sera multipliée par 3
            'dateAction' => new \DateTimeImmutable('2026-05-14'),
            'status' => ActionStatus::VALIDATED,
        ]));

        $player->addAction(ActionFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'points' => 15, // Reste normale
            'dateAction' => new \DateTimeImmutable('2026-05-15'),
            'status' => ActionStatus::VALIDATED,
        ]));

        $competition->addBonusDay(BonusDayFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'date' => new \DateTimeImmutable('2026-05-14'),
            'multiplier' => 3,
        ]));

        $participation->updateScore();

        // (10 * 3) + 15 = 45
        $this->assertEquals(45, $participation->getScore());
    }

    public function testUpdateScoreIgnoresNonValidatedActions(): void
    {
        $participation = ParticipationFactory::new()->withoutPersisting()->create();
        $competition = $participation->getCompetition();
        $player = $participation->getPlayer();

        // Action valide le jour du bonus (10 * 2 = 20)
        $player->addAction(ActionFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'points' => 10,
            'dateAction' => new \DateTimeImmutable('2026-05-14'),
            'status' => ActionStatus::VALIDATED,
        ]));

        // Actions ignorées (Pending & Refused)
        $player->addAction(ActionFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'points' => 50,
            'dateAction' => new \DateTimeImmutable('2026-05-14'),
            'status' => ActionStatus::PENDING,
        ]));

        $player->addAction(ActionFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'points' => 20,
            'dateAction' => new \DateTimeImmutable('2026-05-14'),
            'status' => ActionStatus::REJECTED,
        ]));

        $competition->addBonusDay(BonusDayFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'date' => new \DateTimeImmutable('2026-05-14'),
            'multiplier' => 2,
        ]));

        $participation->updateScore();

        // Seule la première action est comptabilisée : 10 * 2 = 20
        $this->assertEquals(20, $participation->getScore());
    }
}
