<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Participation;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * Factory pour générer les inscriptions des joueurs aux compétitions.
 * * @extends PersistentObjectFactory<Participation>
 */
final class ParticipationFactory extends PersistentObjectFactory
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
        return Participation::class;
    }

    /**
     * Définit les valeurs par défaut d'une participation.
     * * Génère automatiquement une Competition et un Player associés.
     * * Le score est initialisé de manière aléatoire (utile pour tester les classements).
     */
    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'competition' => CompetitionFactory::new(),
            'player' => PlayerFactory::new(),
            'score' => self::faker()->randomNumber(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Participation $participation): void {})
        ;
    }
}
