<?php

declare(strict_types=1);

namespace App\Controller\Api\Competition;

use App\Constants\ErrorMessages;
use App\Entity\Competition;
use App\Security\Voter\CompetitionVoter;
use App\Service\Stats\CompetitionStatsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/competitions/{id}', name: 'api.competition.stats.')]
#[IsGranted('ROLE_USER', message: ErrorMessages::AUTH_REQUIRED)]
final class CompetitionStatsController extends AbstractController
{
    public function __construct(
        private readonly CompetitionStatsService $competitionStatsService,
    ) {
    }

    #[Route('/stats', name: 'kpis', methods: ['GET'])]
    public function getStats(Competition $competition): JsonResponse
    {
        $this->checkFogOfWarAccess($competition);

        $kpis = $this->competitionStatsService->getCompetitionKpis($competition);

        return $this->json($kpis, Response::HTTP_OK);
    }

    #[Route('/daily-evolution', name: 'daily_evolution', methods: ['GET'])]
    public function getDailyEvolution(Competition $competition): JsonResponse
    {
        $this->checkFogOfWarAccess($competition);

        $chartData = $this->competitionStatsService->getDailyEvolution($competition);

        return $this->json($chartData, Response::HTTP_OK);
    }

    private function checkFogOfWarAccess(Competition $competition): void
    {
        if (!$this->isGranted(CompetitionVoter::VIEW, $competition)) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_DENIED);
        }

        if ($competition->hasFogOfWar() && !$this->isGranted(CompetitionVoter::MANAGE, $competition)) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_DENIED);
        }
    }
}
