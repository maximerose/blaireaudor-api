<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\PushSubscription;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<PushSubscription>
 */
final class PushSubscriptionFactory extends PersistentObjectFactory
{
    public static function class(): string
    {
        return PushSubscription::class;
    }

    protected function defaults(): array|callable
    {
        return [
            'user' => UserFactory::new(),
            'endpoint' => self::faker()->url(),
            'p256dh' => self::faker()->sha256(),
            'auth' => self::faker()->sha1(),
        ];
    }
}
