<?php

declare(strict_types=1);

namespace App\Controller\Api\Competition;

use App\Entity\Competition;
use App\Repository\ActionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/competitions/{id}', name: 'api.competition.action.')]
final class CompetitionActionController extends AbstractController
{
    public function __construct(
        private ActionRepository $actionRepository,
    ) {
    }

    #[Route('/actions', name: 'list', methods: ['GET'])]
    public function getActions(Competition $competition, Request $request): JsonResponse
    {
        $date = $request->query->get('date');
        if (\in_array($date, ['undefined', 'null', ''], true)) {
            $date = null;
        }

        $playerId = $request->query->get('playerId');
        if (\in_array($playerId, ['undefined', 'null', ''], true)) {
            $playerId = null;
        }

        $page = $request->query->getInt('page', 1);
        $limit = 50;
        $offset = ($page - 1) * $limit;

        $sortBy = $request->query->get('sort', 'dateAction');
        $order = $request->query->get('order', 'DESC');

        $actions = $this->actionRepository->findByCompetition($competition, $sortBy, $order, $limit, $offset, $date, $playerId);
        $total = $this->actionRepository->countByCompetition($competition, $date, $playerId);

        return $this->json([
            'data' => $actions,
            'meta' => [
                'total' => $total,
                'page' => $page,
                'last_page' => (int) ceil($total / $limit),
            ],
        ], Response::HTTP_OK, [], ['groups' => ['action:read', 'player:read']]);
    }

    #[Route('/action-dates', name: 'dates', methods: ['GET'])]
    public function getActionDates(Competition $competition): JsonResponse
    {
        return $this->json($this->actionRepository->findAllDatesByCompetition($competition));
    }

    #[Route('/pending-count', name: 'pending_count', methods: ['GET'])]
    public function getPendingCount(Competition $competition): JsonResponse
    {
        return $this->json(['count' => $this->actionRepository->countPendingByCompetition($competition)]);
    }
}
