<?php

declare(strict_types=1);

namespace App\DTO\Action;

use App\Constants\AppConstants;
use Symfony\Component\Validator\Constraints as Assert;

final class ActionCreateInput
{
    #[Assert\NotBlank(message: 'La description est obligatoire.')]
    #[Assert\Length(
        min: AppConstants::ACTION_MIN_DESCRIPTION,
        minMessage: 'La description du méfait doit faire au moins {{ limit }} caractères.'
    )]
    public string $description = '';

    #[Assert\NotNull(message: 'Les points sont obligatoires.')]
    public ?int $points = null;

    #[Assert\NotBlank(message: 'La date de l\'action est obligatoire.')]
    public string $dateAction = '';

    #[Assert\NotBlank(message: 'Le joueur cible est obligatoire.')]
    public string $player = ''; // Recevra l'IRI du joueur, ex: /api/players/123
}
