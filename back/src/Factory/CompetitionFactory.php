<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Competition;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * Factory pour générer des compétitions dans les tests.
 * @extends PersistentObjectFactory<Competition>
 */
final class CompetitionFactory extends PersistentObjectFactory
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
        return Competition::class;
    }

    /**
     * Définit les réglages par défaut d'une compétition de test.
     * * Génère un code d'invitation (joinCode) au format Alphanumérique (ex: AB12C3).
     * * Lie automatiquement un créateur (User) via la UserFactory.
     */
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
            'fogOfWar' => true,
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
