<?php

namespace App\Factory;

use App\Entity\Competition;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Competition>
 */
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
        return [
            'createdBy' => UserFactory::new(),
            'endDate' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'isFinished' => self::faker()->boolean(),
            'name' => self::faker()->words(3, true),
            'startDate' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'joinCode' => strtoupper(self::faker()->bothify('??##?#')),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Competition $competition): void {})
        ;
    }
}
