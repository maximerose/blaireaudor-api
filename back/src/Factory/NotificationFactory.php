<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Notification;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Notification>
 */
final class NotificationFactory extends PersistentObjectFactory
{
    public static function class(): string
    {
        return Notification::class;
    }

    protected function defaults(): array|callable
    {
        return [
            'recipient' => UserFactory::new(),
            'title' => self::faker()->sentence(3),
            'message' => self::faker()->paragraph(),
            'type' => 'NEW_SUBMISSION',
            'isRead' => false,
            'targetUrl' => '/competitions/ABC',
        ];
    }
}
