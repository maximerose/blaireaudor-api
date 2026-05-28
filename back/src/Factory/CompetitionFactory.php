<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Competition;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

final class CompetitionFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return Competition::class;
    }

    #[\Override]
    protected function defaults(): array|callable
    {
        $startDate = self::faker()->dateTimeBetween('-3 months', '+1 month');
        $endDate = (clone $startDate)->modify('+'.self::faker()->numberBetween(5, 15).' days');

        $startDateImmutable = \DateTimeImmutable::createFromMutable($startDate);
        $endDateImmutable = \DateTimeImmutable::createFromMutable($endDate);

        $now = new \DateTimeImmutable('now');
        $shouldFogBeDisabled = $endDateImmutable < $now;

        return [
            'createdBy' => UserFactory::new(),
            'name' => 'Arène '.self::faker()->city(),
            'startDate' => $startDateImmutable,
            'endDate' => $endDateImmutable,
            'joinCode' => strtoupper(self::faker()->bothify('??##?#')),
            'fogOfWar' => !$shouldFogBeDisabled,
        ];
    }

    #[\Override]
    protected function initialize(): static
    {
        return $this
            ->afterPersist(function (Competition $competition): void {
                if ($competition->getReferees()->isEmpty()) {
                    $owner = $competition->getCreatedBy();
                    if ($owner && $owner->getPlayer()) {
                        $competition->addReferee($owner->getPlayer());
                    } else {
                        $competition->addReferee(PlayerFactory::createOne());
                    }
                }
            })
        ;
    }
}
