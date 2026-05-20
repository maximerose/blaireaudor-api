<?php

declare(strict_types=1);

namespace App\DTO\Competition;

use Symfony\Component\Validator\Constraints as Assert;

final class CompetitionRefereeInput
{
    #[Assert\NotBlank(message: 'L\'identifiant du joueur est obligatoire.')]
    public string $playerId = '';
}
