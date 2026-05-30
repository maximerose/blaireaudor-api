<?php

declare(strict_types=1);

namespace App\DTO\User;

use Symfony\Component\Serializer\Attribute\Groups;

final class PlayerStatsOutput
{
    #[Groups(['user:read'])]
    public int $ongoingCompetitions = 0;

    #[Groups(['user:read'])]
    public int $upcomingCompetitions = 0;

    #[Groups(['user:read'])]
    public int $finishedCompetitions = 0;

    #[Groups(['user:read'])]
    public int $createdCompetitions = 0;

    #[Groups(['user:read'])]
    public int $refereedCompetitions = 0;

    #[Groups(['user:read'])]
    public int $totalActionsReceived = 0;

    #[Groups(['user:read'])]
    public int $totalPointsReceived = 0;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $maxCompetitionScore = null;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $maxCompetitionActionsReceived = null;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $minCompetitionScore = null;

    #[Groups(['user:read'])]
    public ?PlayerRecordOutput $minCompetitionActionsReceived = null;

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
    public ?array $minAvgPointsReceived = null;

    #[Groups(['user:read'])]
    public ?array $maxAvgPointsReceived = null;

    #[Groups(['user:read'])]
    public ?array $minRank = null;

    #[Groups(['user:read'])]
    public ?array $maxRank = null;

    #[Groups(['user:read'])]
    public float $bonusActionsRatio = 0.0;

    #[Groups(['user:read'])]
    public ?array $maxReportsFromSingleActor = null;

    #[Groups(['user:read'])]
    public ?array $maxReportsToSingleReceiver = null;

    #[Groups(['user:read'])]
    public ?array $maxReciprocalReportsWithSinglePeer = null;

    #[Groups(['user:read'])]
    public int $totalDistinctTargets = 0;
}
