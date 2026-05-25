<?php

declare(strict_types=1);

namespace App\State\Provider\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Constants\ErrorMessages;
use App\DTO\User\PlayerRecordOutput;
use App\DTO\User\PlayerStatsOutput;
use App\Entity\User;
use App\Repository\ActionRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

final readonly class MeProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private ActionRepository $actionRepository,
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
            $raw = $this->actionRepository->getCareerStatsData($player, $user);
            $totalComps = $raw['totalCompetitions'];

            $statsDTO = new PlayerStatsOutput();
            $statsDTO->totalActionsCount = $raw['totalActionsCount'];
            $statsDTO->maxSeasonActions = $raw['maxSeasonActions'];
            $statsDTO->totalAccumulatedPoints = $raw['totalAccumulatedPoints'];
            $statsDTO->maxSeasonScore = $raw['maxSeasonScore'];
            $statsDTO->totalReportedCount = $raw['totalReportedCount'];
            $statsDTO->averagePoints = $totalComps > 0 ? round($raw['totalAccumulatedPoints'] / $totalComps, 1) : 0.0;
            $statsDTO->recidivismRatio = $totalComps > 0 ? round($raw['totalActionsCount'] / $totalComps, 1) : 0.0;
            $statsDTO->precisionRate = $raw['totalReportedJudged'] > 0
            ? round(($raw['totalReportedValid'] / $raw['totalReportedJudged']) * 100, 1)
            : null;
            $statsDTO->karmaIndex = $raw['totalActionsCount'] > 0
                ? round($raw['totalReportedCount'] / $raw['totalActionsCount'], 2)
                : (float) $raw['totalReportedCount'];
            $statsDTO->bestRank = $raw['ranks']['best_rank'] ?? null;
            $statsDTO->worstRank = $raw['ranks']['worst_rank'] ?? null;
            $statsDTO->record = $this->mapRecordOutput($raw['record']);
            $statsDTO->worstStab = $this->mapRecordOutput($raw['worstStab']);

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
