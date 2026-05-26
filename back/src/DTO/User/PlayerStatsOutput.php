<?php

declare(strict_types=1);

namespace App\DTO\User;

use Symfony\Component\Serializer\Attribute\Groups;

final class PlayerStatsOutput
{
    #[Groups(['user:read'])]
    public int $totalActionsReceived = 0;

    #[Groups(['user:read'])]
    public int $maxCompetitionActionsReceived = 0;

    #[Groups(['user:read'])]
    public int $totalPointsReceived = 0;

    #[Groups(['user:read'])]
    public int $maxCompetitionScore = 0;

    #[Groups(['user:read'])]
    public float $averagePointsPerCompetition = 0.0;

    #[Groups(['user:read'])]
    public float $averageActionsReceivedPerCompetition = 0.0;

    #[Groups(['user:read'])]
    public int $totalActionsReported = 0;

    #[Groups(['user:read'])]
    public ?float $reportApprovalRatio = null;

    #[Groups(['user:read'])]
    public float $reportToReceivedRatio = 0.0;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $maxPointsSingleActionReceived = null;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $maxPointsSingleActionReported = null;

    #[Groups(['user:read'])]
    public ?int $minRank = null;

    #[Groups(['user:read'])]
    public ?int $maxRank = null;
}
