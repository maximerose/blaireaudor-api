<?php

declare(strict_types=1);

namespace App\DTO\Competition;

final class CompetitionAddPlayersInput
{
    /** @var string[] */
    public array $existingPlayersIds = [];

    /** @var string[] */
    public array $newPlayers = [];

    /** @var string[] */
    public array $existingRefereesIds = [];

    /** @var string[] */
    public array $newReferees = [];
}
