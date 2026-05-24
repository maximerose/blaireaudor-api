<?php

declare(strict_types=1);

namespace App\DTO\Competition;

use App\Constants\ErrorMessages;
use Symfony\Component\Validator\Constraints as Assert;

final class CompetitionRefereeInput
{
    #[Assert\NotBlank(message: ErrorMessages::MISSING_COMP_REFEREE_ID)]
    public string $playerId = '';
}
