<?php

declare(strict_types=1);

namespace App\DTO\Action;

use App\Constants\AppConstants;
use App\Constants\ErrorMessages;
use Symfony\Component\Validator\Constraints as Assert;

final class ActionCreateInput
{
    #[Assert\NotBlank(message: ErrorMessages::MISSING_ACTION_DESCRIPTION)]
    #[Assert\Length(
        min: AppConstants::ACTION_MIN_DESCRIPTION,
        minMessage: ErrorMessages::ACTION_MIN_DESCRIPTION
    )]
    public string $description = '';

    #[Assert\NotNull(message: ErrorMessages::MISSING_ACTION_POINTS)]
    public ?int $points = null;

    #[Assert\NotBlank(message: ErrorMessages::MISSING_ACTION_DATE)]
    public string $dateAction = '';

    #[Assert\NotBlank(message: ErrorMessages::MISSING_ACTION_PLAYER)]
    public string $player = ''; // Recevra l'IRI du joueur, ex: /api/players/123
}
