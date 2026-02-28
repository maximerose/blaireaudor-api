<?php

namespace App\Factory;

use App\Entity\Action;
use App\Enum\ActionStatus;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Action>
 */
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
            'competition' => CompetitionFactory::new(),
            'description' => self::faker()->text(255),
            'player' => PlayerFactory::new(),
            'points' => self::faker()->numberBetween(-50, 100),
            'status' => ActionStatus::PENDING,
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Action $action): void {})
        ;
    }
}
