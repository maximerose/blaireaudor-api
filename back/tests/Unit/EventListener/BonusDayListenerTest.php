<?php

declare(strict_types=1);

namespace App\Tests\Unit\EventListener;

use App\Entity\BonusDay;
use App\Entity\Participation;
use App\EventListener\BonusDayListener;
use App\Factory\BonusDayFactory;
use App\Factory\CompetitionFactory;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\UnitOfWork;
use Doctrine\Persistence\Event\LifecycleEventArgs; // Utilise le parent non-final
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class BonusDayListenerTest extends TestCase
{
    private EntityManagerInterface|MockObject $entityManagerMock;
    private UnitOfWork|MockObject $uowMock;
    private BonusDayListener $listener;

    protected function setUp(): void
    {
        $this->entityManagerMock = $this->createMock(EntityManagerInterface::class);
        $this->uowMock = $this->createMock(UnitOfWork::class);

        $this->entityManagerMock->method('getUnitOfWork')->willReturn($this->uowMock);
        $this->entityManagerMock->method('getClassMetadata')->willReturn($this->createMock(ClassMetadata::class));

        $this->listener = new BonusDayListener($this->entityManagerMock);
    }

    public function testPrePersistTriggersScoreRecalculationAndChangeSet(): void
    {
        $bonusDay = $this->createBonusDayWithParticipations();

        // On mocke la classe parente LifecycleEventArgs au lieu de la classe final
        $eventArgs = $this->createMock(LifecycleEventArgs::class);
        $eventArgs->method('getObjectManager')->willReturn($this->entityManagerMock);

        $this->uowMock->expects($this->once())->method('computeChangeSet');

        $this->listener->prePersist($bonusDay, $this->castToDoctrineEvent($eventArgs));
    }

    public function testPreRemoveTriggersScoreRecalculationAndChangeSet(): void
    {
        $bonusDay = $this->createBonusDayWithParticipations();
        $eventArgs = $this->createMock(LifecycleEventArgs::class);
        $eventArgs->method('getObjectManager')->willReturn($this->entityManagerMock);

        $this->uowMock->expects($this->once())->method('computeChangeSet');

        $this->listener->preRemove($bonusDay, $this->castToDoctrineEvent($eventArgs));
    }

    /**
     * Helper pour contourner le typage strict dans les tests.
     */
    private function castToDoctrineEvent(MockObject $mock): mixed
    {
        return $mock;
    }

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
