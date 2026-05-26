<?php

declare(strict_types=1);

namespace App\State\Provider\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Constants\ErrorMessages;
use App\DTO\User\PlayerRecordOutput;
use App\DTO\User\PlayerStatsOutput;
use App\Entity\User;
use App\Service\Stats\PlayerStatsService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

final readonly class MeProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private PlayerStatsService $playerStatsService,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?User
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new UnauthorizedHttpException('Bearer', ErrorMessages::AUTH_REQUIRED);
        }

        $player = $user->getPlayer();
        if ($player) {
            $raw = $this->playerStatsService->getCareerStatsData($player, $user);
            $totalComps = $raw['totalCompetitions'];

            $statsDTO = new PlayerStatsOutput();
            $statsDTO->totalActionsReceived = $raw['totalActionsReceived'];
            $statsDTO->maxCompetitionActionsReceived = $raw['maxCompetitionActionsReceived'];
            $statsDTO->totalPointsReceived = $raw['totalPointsReceived'];
            $statsDTO->maxCompetitionScore = $raw['maxCompetitionScore'];
            $statsDTO->totalActionsReported = $raw['totalActionsReported'];

            $statsDTO->averagePointsPerCompetition = $totalComps > 0 ? round($raw['totalPointsReceived'] / $totalComps, 1) : 0.0;
            $statsDTO->averageActionsReceivedPerCompetition = $totalComps > 0 ? round($raw['totalActionsReceived'] / $totalComps, 1) : 0.0;

            $statsDTO->reportApprovalRatio = $raw['totalActionsReportedJudged'] > 0
                ? round(($raw['totalActionsReportedValid'] / $raw['totalActionsReportedJudged']) * 100, 1)
                : null;

            $statsDTO->reportToReceivedRatio = $raw['totalActionsReceived'] > 0
                ? round($raw['totalActionsReported'] / $raw['totalActionsReceived'], 2)
                : (float) $raw['totalActionsReported'];

            $statsDTO->minRank = $raw['ranks']['min_rank'] ?? null;
            $statsDTO->maxRank = $raw['ranks']['max_rank'] ?? null;

            $statsDTO->maxPointsSingleActionReceived = $this->mapRecordOutput($raw['maxPointsSingleActionReceived']);
            $statsDTO->maxPointsSingleActionReported = $this->mapRecordOutput($raw['maxPointsSingleActionReported']);

            $statsDTO->bonusActionsRatio = $raw['bonusActionsRatio'];

            $statsDTO->maxReportsFromSingleActor = $raw['maxReportsFromSingleActor'];
            $statsDTO->maxReportsToSingleReceiver = $raw['maxReportsToSingleReceiver'];
            $statsDTO->maxReciprocalReportsWithSinglePeer = $raw['maxReciprocalReportsWithSinglePeer'];

            $user->stats = $statsDTO;
        }

        return $user;
    }

    private function mapRecordOutput(?array $data): ?PlayerRecordOutput
    {
        if (!$data) {
            return null;
        }

        $dto = new PlayerRecordOutput();
        $dto->points = (int) $data['points'];
        $dto->description = (string) $data['description'];
        $dto->competitionName = (string) $data['competition_name'];
        $dto->involvedPlayerName = $data['involved_name'] ? (string) $data['involved_name'] : null;

        return $dto;
    }
}
