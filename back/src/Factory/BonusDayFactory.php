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

    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'competition' => CompetitionFactory::new(),
            'multiplier' => self::faker()->numberBetween(2, 5),
        ];
    }

    #[\Override]
    protected function initialize(): static
    {
        return $this->afterInstantiate(function (BonusDay $bonusDay, array $attributes): void {
            if (!isset($attributes['date']) && $comp = $bonusDay->getCompetition()) {
                $start = $comp->getStartDate();
                $end = $comp->getEndDate() ?? new \DateTimeImmutable('+1 month');

                if ($start > $end) {
                    $end = (clone $start)->modify('+1 day');
                }

                $randomDate = self::faker()->dateTimeBetween(
                    $start->format('Y-m-d H:i:s'),
                    $end->format('Y-m-d H:i:s')
                );
                $bonusDay->setDate(\DateTimeImmutable::createFromMutable($randomDate));
            }
        });
    }
}
