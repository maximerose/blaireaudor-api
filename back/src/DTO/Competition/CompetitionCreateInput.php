<?php

declare(strict_types=1);

namespace App\DTO\Competition;

use App\Constants\AppConstants;
use App\Constants\ErrorMessages;
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\Expression(
    'this.endDate == null or this.endDate >= this.startDate',
    message: ErrorMessages::END_DATE_BEFORE_START_DATE
)]
final class CompetitionCreateInput
{
    #[Assert\NotBlank(message: ErrorMessages::MISSING_COMP_NAME)]
    public string $name = '';

    #[Assert\NotBlank(message: ErrorMessages::MISSING_COMP_START_DATE)]
    public string $startDate = '';

    public ?string $endDate = null;

    #[Assert\Length(
        min: AppConstants::COMPETITION_MIN_JOIN_CODE,
        minMessage: ErrorMessages::COMP_MIN_JOIN_CODE
    )]
    public ?string $joinCode = null;

    public bool $fogOfWar = true;

    public bool $participate = false;

    public bool $isCreatorReferee = true;

    /** @var string[] */
    public array $players = [];

    /** @var string[] */
    public array $referees = [];
}
