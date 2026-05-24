<?php

declare(strict_types=1);

namespace App\DTO\User;

use App\Constants\AppConstants;
use App\Constants\ErrorMessages;
use Symfony\Component\Validator\Constraints as Assert;

final class ResetPasswordResetInput
{
    #[Assert\NotBlank(message: ErrorMessages::MISSING_PASSWORD)]
    #[Assert\Length(min: AppConstants::AUTH_MIN_PASSWORD, minMessage: ErrorMessages::AUTH_MIN_PASSWORD)]
    public string $plainPassword = '';
}
