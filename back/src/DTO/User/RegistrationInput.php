<?php

declare(strict_types=1);

namespace App\DTO\User;

use App\Constants\AppConstants;
use Symfony\Component\Validator\Constraints as Assert;

final class RegistrationInput
{
    #[Assert\NotBlank(message: "Le nom d'utilisateur est obligatoire.")]
    #[Assert\Length(
        min: AppConstants::AUTH_MIN_USERNAME,
        minMessage: 'Le pseudo doit contenir au moins {{ limit }} caractères.'
    )]
    public string $username = '';

    #[Assert\NotBlank(message: "L'email est obligatoire.")]
    #[Assert\Email(message: "L'email n'est pas valide.")]
    public string $email = '';

    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
    #[Assert\Length(
        min: AppConstants::AUTH_MIN_PASSWORD,
        minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.'
    )]
    public string $plainPassword = '';

    #[Assert\NotBlank(message: "Le nom d'affichage est obligatoire.")]
    #[Assert\Length(
        min: AppConstants::AUTH_MIN_DISPLAY_NAME,
        minMessage: "Le nom d'affichage doit contenir au moins {{ limit }} caractères."
    )]
    public string $displayName = '';

    public ?string $joinCode = null;

    public ?string $playerId = null;
}
