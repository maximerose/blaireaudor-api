<?php

namespace App\Enum;

enum ActionStatus: string
{
    case PENDING = 'pending';
    case VALIDATED = 'validated';
    case REJECTED = 'rejected';

    public function getLabel(): string
    {
        return match($this) {
            self::PENDING => 'En attente',
            self::VALIDATED => 'Validée',
            self::REJECTED => 'Refusée',
        };
    }
}
