<?php

declare(strict_types=1);

namespace App\Tests\Unit\EventListener;

use App\Entity\BonusDay;
use App\Entity\Participation;
use App\EventListener\BonusDayListener;
use App\Factory\BonusDayFactory;
use App\Factory\CompetitionFactory;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use Doctrine\ORM\Event\PostUpdateEventArgs;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class BonusDayListenerTest extends TestCase
{
    private EntityManagerInterface|MockObject $entityManagerMock;
    private BonusDayListener $listener;

    protected function setUp(): void
    {
        $this->entityManagerMock = $this->createMock(EntityManagerInterface::class);
        $this->listener = new BonusDayListener($this->entityManagerMock);
    }

    public function testPostPersistTriggersScoreRecalculationAndFlush(): void
    {
        $bonusDay = $this->createBonusDayWithParticipations();
        $eventArgs = new PostPersistEventArgs($bonusDay, $this->entityManagerMock);

        $this->entityManagerMock->expects($this->once())->method('flush');

        $this->listener->postPersist($bonusDay, $eventArgs);
    }

    public function testPostUpdateTriggersScoreRecalculationAndFlush(): void
    {
        $bonusDay = $this->createBonusDayWithParticipations();
        $eventArgs = new PostUpdateEventArgs($bonusDay, $this->entityManagerMock);

        $this->entityManagerMock->expects($this->once())->method('flush');

        $this->listener->postUpdate($bonusDay, $eventArgs);
    }

    public function testPostRemoveTriggersScoreRecalculationAndFlush(): void
    {
        $bonusDay = $this->createBonusDayWithParticipations();
        $eventArgs = new PostRemoveEventArgs($bonusDay, $this->entityManagerMock);

        $this->entityManagerMock->expects($this->once())->method('flush');

        $this->listener->postRemove($bonusDay, $eventArgs);
    }

    /**
     * Helper pour créer un BonusDay lié à une Compétition contenant des Participations.
     */
    private function createBonusDayWithParticipations(): BonusDay
    {
        $competition = CompetitionFactory::new()->withoutPersisting()->create();

        $participationMock = $this->createMock(Participation::class);
        $participationMock->expects($this->once())->method('updateScore');

        $competition->addParticipation($participationMock);

        return BonusDayFactory::new()->withoutPersisting()->create([
            'competition' => $competition,
            'multiplier' => 2,
        ]);
    }
}
