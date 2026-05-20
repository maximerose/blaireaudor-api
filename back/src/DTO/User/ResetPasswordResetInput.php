<?php

declare(strict_types=1);

namespace App\DTO\User;

use App\Constants\AppConstants;
use Symfony\Component\Validator\Constraints as Assert;

final class ResetPasswordResetInput
{
    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
    #[Assert\Length(min: AppConstants::AUTH_MIN_PASSWORD, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.')]
    public string $plainPassword = '';
}
