<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\BonusDay;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * Factory pour générer des jours bonus dans les tests.
 *
 * @extends PersistentObjectFactory<BonusDay>
 */
final class BonusDayFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return BonusDay::class;
    }

    /**
     * Définit les réglages par défaut d'un jour bonus de test.
     */
    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'competition' => CompetitionFactory::new(),
            'date' => \DateTimeImmutable::createFromMutable(self::faker()->dateTimeBetween('-1 month', '+1 month')),
            'multiplier' => self::faker()->numberBetween(2, 5),
        ];
    }

    #[\Override]
    protected function initialize(): static
    {
        return $this;
    }
}
