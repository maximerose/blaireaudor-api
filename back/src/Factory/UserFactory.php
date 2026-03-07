<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\User;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * Factory pour générer les comptes utilisateurs (User).
 * @extends PersistentObjectFactory<User>
 */
final class UserFactory extends PersistentObjectFactory
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
        return User::class;
    }

    /**
     * Définit les attributs par défaut d'un compte utilisateur.
     * * Le mot de passe est généré en clair (plainPassword) pour être
     * ensuite haché automatiquement par le UserPasswordHasherListener.
     */
    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'plainPassword' => 'password',
            'roles' => [],
            'username' => self::faker()->text(180),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(User $user): void {})
        ;
    }
}
