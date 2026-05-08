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
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class BonusDayListenerTest extends TestCase
{
    private ActionManager|MockObject $actionManagerMock;
    private BonusDayListener $listener;

    protected function setUp(): void
    {
        // Le Manager reste un Mock car on veut vérifier ses appels (expects)
        $this->actionManagerMock = $this->createMock(ActionManager::class);
        $this->listener = new BonusDayListener($this->actionManagerMock);
    }

    public function testPostPersistTriggersScoreRecalculation(): void
    {
        // On utilise des Stubs pour les entités (plus de notices)
        $competition = $this->createStub(Competition::class);
        $bonusDay = $this->createStub(BonusDay::class);
        $bonusDay->method('getCompetition')->willReturn($competition);

        // On instancie la VRAIE classe au lieu de la moquer
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

        // Idem ici : instanciation réelle
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
