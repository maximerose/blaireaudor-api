<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Action;
use App\Enum\ActionStatus;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * Factory pour générer des actions de jeu dans les tests.
 * @extends PersistentObjectFactory<Action>
 */
final class ActionFactory extends PersistentObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     */
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return Action::class;
    }

    /**
     * Définit les valeurs par défaut pour une Action.
     * * Par défaut, l'action est créée avec le statut PENDING et
     * génère automatiquement une nouvelle Competition et un nouveau Player
     * via leurs factories respectives si aucune valeur n'est fournie.
     */
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
