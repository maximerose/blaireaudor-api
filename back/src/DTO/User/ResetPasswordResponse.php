<?php

declare(strict_types=1);

namespace App\DTO\User;

final class ResetPasswordResponse
{
    public function __construct(
        public string $message = '',
    ) {
    }
}
