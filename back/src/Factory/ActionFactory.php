<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Action;
use App\Enum\ActionStatus;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

final class ActionFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return Action::class;
    }

    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'participation' => ParticipationFactory::new(),
            'description' => rtrim(self::faker()->sentence(random_int(2, 3)), '.'),
            'points' => self::faker()->numberBetween(-50, 100),
            'status' => ActionStatus::PENDING,
        ];
    }

    #[\Override]
    protected function initialize(): static
    {
        return $this->afterInstantiate(function (Action $action, array $attributes): void {
            // Si aucune date n'a été forcée (via les fixtures historiques par exemple)
            if (!isset($attributes['dateAction']) && $participation = $action->getParticipation()) {
                $comp = $participation->getCompetition();

                if ($comp) {
                    $start = $comp->getStartDate();
                    $end = $comp->getEndDate() ?? new \DateTimeImmutable('+1 month');

                    if ($start > $end) {
                        $end = (clone $start)->modify('+1 day');
                    }

                    $randomDate = self::faker()->dateTimeBetween(
                        $start->format('Y-m-d H:i:s'),
                        $end->format('Y-m-d H:i:s')
                    );
                    $action->setDateAction(\DateTimeImmutable::createFromMutable($randomDate));
                }
            }
        });
    }
}
