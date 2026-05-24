<?php

declare(strict_types=1);

namespace App\DTO\User;

use App\Constants\AppConstants;
use App\Constants\ErrorMessages;
use Symfony\Component\Validator\Constraints as Assert;

final class RegistrationInput
{
    #[Assert\NotBlank(message: ErrorMessages::MISSING_USERNAME)]
    #[Assert\Length(
        min: AppConstants::AUTH_MIN_USERNAME,
        minMessage: ErrorMessages::AUTH_MIN_USERNAME
    )]
    public string $username = '';

    #[Assert\NotBlank(message: ErrorMessages::MISSING_EMAIL)]
    #[Assert\Email(message: ErrorMessages::INVALID_EMAIL)]
    public string $email = '';

    #[Assert\NotBlank(message: ErrorMessages::MISSING_PASSWORD)]
    #[Assert\Length(
        min: AppConstants::AUTH_MIN_PASSWORD,
        minMessage: ErrorMessages::AUTH_MIN_PASSWORD
    )]
    public string $plainPassword = '';

    #[Assert\NotBlank(message: ErrorMessages::MISSING_DISPLAY_NAME)]
    #[Assert\Length(
        min: AppConstants::AUTH_MIN_DISPLAY_NAME,
        minMessage: ErrorMessages::AUTH_MIN_DISPLAY_NAME
    )]
    public string $displayName = '';

    public ?string $joinCode = null;

    public ?string $playerId = null;
}
