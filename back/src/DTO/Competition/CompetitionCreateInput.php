<?php

declare(strict_types=1);

namespace App\DTO\Competition;

use Symfony\Component\Validator\Constraints as Assert;

final class CompetitionCreateInput
{
    #[Assert\NotBlank(message: 'Le nom de la compétition est obligatoire.')]
    public string $name = '';

    #[Assert\NotBlank(message: 'La date de début est obligatoire.')]
    public string $startDate = '';

    public ?string $endDate = null;

    public ?string $joinCode = null;

    public bool $fogOfWar = true;

    public bool $participate = false;

    public bool $isCreatorReferee = true;

    /** @var string[] */
    public array $players = [];

    /** @var string[] */
    public array $referees = [];
}
