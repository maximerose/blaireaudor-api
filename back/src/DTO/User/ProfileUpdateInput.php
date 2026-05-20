<?php

declare(strict_types=1);

namespace App\DTO\User;

final class ProfileUpdateInput
{
    public ?string $displayName = null;
    public ?string $username = null;
    public ?string $email = null;
    public ?string $currentPassword = null;
    public ?string $newPassword = null;
}
