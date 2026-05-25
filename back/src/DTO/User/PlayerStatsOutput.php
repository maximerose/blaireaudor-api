<?php

declare(strict_types=1);

namespace App\DTO\User;

use Symfony\Component\Serializer\Attribute\Groups;

final class PlayerStatsOutput
{
    #[Groups(['user:read'])]
    public int $totalActionsCount = 0;

    #[Groups(['user:read'])]
    public int $maxSeasonActions = 0;

    #[Groups(['user:read'])]
    public int $totalAccumulatedPoints = 0;

    #[Groups(['user:read'])]
    public int $maxSeasonScore = 0;

    #[Groups(['user:read'])]
    public float $averagePoints = 0.0;

    #[Groups(['user:read'])]
    public float $recidivismRatio = 0.0;

    #[Groups(['user:read'])]
    public int $totalReportedCount = 0;

    #[Groups(['user:read'])]
    public ?float $precisionRate = null;

    #[Groups(['user:read'])]
    public float $karmaIndex = 0.0;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $record = null;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $worstStab = null;
    #[Groups(['user:read'])]
    public ?int $bestRank = null;

    #[Groups(['user:read'])]
    public ?int $worstRank = null;
}
