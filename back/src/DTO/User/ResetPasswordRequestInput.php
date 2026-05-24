<?php

declare(strict_types=1);

namespace App\DTO\User;

use App\Constants\ErrorMessages;
use Symfony\Component\Validator\Constraints as Assert;

final class ResetPasswordRequestInput
{
    #[Assert\NotBlank(message: ErrorMessages::MISSING_EMAIL)]
    #[Assert\Email(message: ErrorMessages::INVALID_EMAIL)]
    public string $email = '';
}
