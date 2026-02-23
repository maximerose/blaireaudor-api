<?php

namespace App\Tests\Entity;

use App\Factory\CompetitionFactory;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

class CompetitionListenerTest extends KernelTestCase
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