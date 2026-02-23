<?php

namespace App\Factory;

use App\Entity\Player;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Player>
 */
final class PlayerFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    #[\Override]
    public static function class(): string
    {
        return Player::class;
    }

    #[\Override]
    protected function defaults(): array|callable
    {
        return [
            'createdBy' => UserFactory::new(),
            'displayName' => self::faker()->unique()->name(),
            'username' => self::faker()->unique()->userName(),
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

    public function withoutUsername(): static
    {
        return $this->afterInstantiate(function(Player $player) {
            $player->setUsername('');
        });
    }
}
