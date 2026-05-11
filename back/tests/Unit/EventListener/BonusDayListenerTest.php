<?php

declare(strict_types=1);

namespace App\Tests\Unit\EventListener;

use App\Entity\BonusDay;
use App\Entity\Competition;
use App\EventListener\BonusDayListener;
use App\Service\ActionManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Event\PostRemoveEventArgs;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

#[AllowMockObjectsWithoutExpectations]
class BonusDayListenerTest extends TestCase
{
    private ActionManager|MockObject $actionManagerMock;
    private EntityManagerInterface|MockObject $entityManagerMock;
    private BonusDayListener $listener;

    protected function setUp(): void
    {
        $this->actionManagerMock = $this->createMock(ActionManager::class);
        $this->entityManagerMock = $this->createMock(EntityManagerInterface::class);
        $this->entityManagerMock->method('contains')->willReturn(true);
        $this->listener = new BonusDayListener($this->actionManagerMock, $this->entityManagerMock);
    }

    public function testPostPersistTriggersScoreRecalculation(): void
    {
        $competition = $this->createStub(Competition::class);
        $bonusDay = $this->createStub(BonusDay::class);
        $bonusDay->method('getCompetition')->willReturn($competition);

        $eventArgs = new PostPersistEventArgs(
            $bonusDay,
            $this->createStub(EntityManagerInterface::class)
        );

        $this->actionManagerMock->expects($this->once())
            ->method('updateAllCompetitionScores')
            ->with($competition);

        $this->listener->postPersist($bonusDay, $eventArgs);
    }

    public function testPostRemoveTriggersScoreRecalculation(): void
    {
        $competition = $this->createStub(Competition::class);
        $bonusDay = $this->createStub(BonusDay::class);
        $bonusDay->method('getCompetition')->willReturn($competition);

        $eventArgs = new PostRemoveEventArgs(
            $bonusDay,
            $this->createStub(EntityManagerInterface::class)
        );

        $this->actionManagerMock->expects($this->once())
            ->method('updateAllCompetitionScores')
            ->with($competition);

        $this->listener->postRemove($bonusDay, $eventArgs);
    }
}
