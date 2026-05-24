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

            // Calculs des moyennes par compétition
            $statsDTO->averagePoints = $totalComps > 0 ? round($raw['totalAccumulatedPoints'] / $totalComps, 1) : 0.0;
            $statsDTO->recidivismRatio = $totalComps > 0 ? round($raw['totalActionsCount'] / $totalComps, 1) : 0.0;

            $statsDTO->precisionRate = $raw['totalReportedJudged'] > 0
            ? round(($raw['totalReportedValid'] / $raw['totalReportedJudged']) * 100, 1)
            : null;

            $statsDTO->karmaIndex = $raw['totalActionsCount'] > 0
                ? round($raw['totalReportedCount'] / $raw['totalActionsCount'], 2)
                : (float) $raw['totalReportedCount'];

            if ($raw['record']) {
                $recordDTO = new PlayerRecordOutput();
                $recordDTO->points = (int) $raw['record']['points'];
                $recordDTO->description = (string) $raw['record']['description'];
                $recordDTO->competitionName = (string) $raw['record']['competition_name'];
                $recordDTO->involvedPlayerName = (string) $raw['record']['involved_name'];
                $statsDTO->record = $recordDTO;
            }

            // Reconstruction du Focus 2 (Envoyé)
            if ($raw['worstStab']) {
                $stabDTO = new PlayerRecordOutput();
                $stabDTO->points = (int) $raw['worstStab']['points'];
                $stabDTO->description = (string) $raw['worstStab']['description'];
                $stabDTO->competitionName = (string) $raw['worstStab']['competition_name'];
                $stabDTO->involvedPlayerName = (string) $raw['worstStab']['involved_name'];
                $statsDTO->worstStab = $stabDTO;
            }

            $user->stats = $statsDTO;
        }

        return $user;
    }
}
