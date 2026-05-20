<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final class RegistrationInput
{
    #[Assert\NotBlank(message: "Le nom d'utilisateur est obligatoire.")]
    public string $username = '';

    #[Assert\NotBlank(message: "L'email est obligatoire.")]
    #[Assert\Email(message: "L'email n'est pas valide.")]
    public string $email = '';

    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
    public string $plainPassword = '';

    #[Assert\NotBlank(message: "Le nom d'affichage est obligatoire.")]
    public string $displayName = '';

    public ?string $joinCode = null;

    public ?string $playerId = null;
}
