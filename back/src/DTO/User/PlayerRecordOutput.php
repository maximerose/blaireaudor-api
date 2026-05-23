<?php

declare(strict_types=1);

namespace App\DTO\User;

use Symfony\Component\Serializer\Attribute\Groups;

final class PlayerRecordOutput
{
    #[Groups(['user:read'])]
    public int $points = 0;

    #[Groups(['user:read'])]
    public string $description = 'Aucun méfait';

    #[Groups(['user:read'])]
    public string $competitionName = 'N/A';

    #[Groups(['user:read'])]
    public ?string $involvedPlayerName = null;
}
