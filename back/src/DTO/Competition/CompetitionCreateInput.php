<?php

declare(strict_types=1);

namespace App\DTO\Competition;

use Symfony\Component\Validator\Constraints as Assert;

#[Assert\Expression(
    'this.endDate == null or this.endDate >= this.startDate',
    message: 'La date de fin doit être postérieure ou égale à la date de début.'
)]
final class CompetitionCreateInput
{
    #[Assert\NotBlank(message: 'Le nom de la compétition est obligatoire.')]
    public string $name = '';

    #[Assert\NotBlank(message: 'La date de début est obligatoire.')]
    public string $startDate = '';

    public ?string $endDate = null;

    #[Assert\Length(
        min: 3,
        minMessage: 'Le code d\'accès doit contenir au moins 3 caractères.'
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
