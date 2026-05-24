<?php

declare(strict_types=1);

namespace App\Tests\Integration\Service;

use App\Factory\CompetitionFactory;
use App\Factory\UserFactory;
use App\Service\Manager\ActionManager;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class ActionManagerTest extends KernelTestCase
{
    use ResetDatabase;
    use Factories;

    private ActionManager $manager;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->manager = static::getContainer()->get(ActionManager::class);
    }

    public function testCreateActionThrowsExceptionIfParticipationNotFound(): void
    {
        $competition = CompetitionFactory::new()->create();
        $author = UserFactory::new()->create();

        $fakeUuid = '018d3e16-0f5c-7120-b3b4-e2d1f4b5a6c7';
        $data = ['player' => (string) '/api/players/'.$fakeUuid, 'description' => 'Test', 'points' => 10, 'date_action' => '2025-05-08'];

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Le joueur ne participe pas à cette compétition.');

        $this->manager->createActionFromPayload($competition, $author, $data);
    }

    public function testCreateActionThrowsExceptionForMissingData(): void
    {
        $competition = CompetitionFactory::new()->create();
        $author = UserFactory::new()->create();
        $data = ['player' => '/api/players/018d3e16-0f5c-7120-b3b4-e2d1f4b5a6c7'];

        $this->expectException(\InvalidArgumentException::class);

        $this->manager->createActionFromPayload($competition, $author, $data);
    }
}
