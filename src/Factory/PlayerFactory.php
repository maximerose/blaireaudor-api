<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Player;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * Factory pour générer les profils de joueurs.
 * @extends PersistentObjectFactory<Player>
 */
final class PlayerFactory extends PersistentObjectFactory
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
        return Player::class;
    }

    /**
     * Définit les attributs par défaut d'un joueur.
     * * Génère un nom d'affichage unique via Faker et lie le profil 
     * à un utilisateur créateur par défaut.
     */
    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'createdBy' => UserFactory::new(),
            'displayName' => self::faker()->unique()->name(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    #[\Override]
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Player $player): void {})
        ;
    }

    /**
     * Force la création d'un joueur sans nom d'utilisateur.
     * * Utile pour tester le comportement des profils "invités" qui n'ont 
     * pas encore de compte User lié.
     */
    public function withoutUsername(): static
    {
        return $this->afterInstantiate(function(Player $player) {
            $player->setUsername(null);
        });
    }
}
