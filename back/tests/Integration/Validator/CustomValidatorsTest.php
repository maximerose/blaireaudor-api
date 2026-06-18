<?php

declare(strict_types=1);

namespace App\Tests\Integration\Validator;

use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Participation;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class CustomValidatorsTest extends KernelTestCase
{
    private ValidatorInterface $validator;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->validator = static::getContainer()->get(ValidatorInterface::class);
    }

    public function testValidActionDateValidator(): void
    {
        $competition = new Competition();
        $competition->setStartDate(new \DateTimeImmutable('2026-05-01 10:00:00'));
        $competition->setEndDate(new \DateTimeImmutable('2026-05-10 18:00:00'));

        $participation = new Participation();
        $participation->setCompetition($competition);

        $action = new Action();
        $action->setParticipation($participation);
        $action->setDescription('Action test');
        $action->setPoints(10);

        // 1. Date valide
        $action->setDateAction(new \DateTimeImmutable('2026-05-05 12:00:00'));
        $errors = $this->validator->validate($action);
        $this->assertCount(0, $errors);

        // 2. Date hors limites (Trop tôt)
        $action->setDateAction(new \DateTimeImmutable('2026-04-30 12:00:00'));
        $errors = $this->validator->validate($action);
        $this->assertGreaterThan(0, \count($errors));
        $this->assertEquals('dateAction', $errors[0]->getPropertyPath());
    }
}
