<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\ActionRepository;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Accès public aux informations des compétitions.
 * * Permet principalement aux joueurs de rejoindre une compétition
 * ou d'en vérifier l'existence via un code d'invitation.
 */
#[Route('/api/competitions', name: 'api.competition.')]
final class CompetitionController extends AbstractController
{
    /**
     * Vérifie la validité d'un code de participation et retourne les détails de la compétition.
     * * Cette méthode utilise une jointure optimisée pour récupérer la liste
     * des joueurs inscrits afin d'éviter les requêtes N+1 lors de la sérialisation.
     *
     * @param string $code le code d'invitation (join_code) saisi par le joueur
     *
     * @return JsonResponse la compétition avec ses joueurs ou une erreur 404
     */
    #[Route('/by-code/{code}', name: 'by_code', methods: 'GET')]
    public function getByCode(
        string $code,
        CompetitionRepository $repository,
        ParticipationRepository $partRepo,
    ): JsonResponse {
        $competition = $repository->findOneBy(['joinCode' => $code]);

        if (!$competition) {
            return $this->json(['message' => 'Compétition introuvable'], 404);
        }

        $leaderboard = $partRepo->findLeaderboard($competition);

        return $this->json([
            'competition' => $competition,
            'leaderboard' => $leaderboard,
        ], Response::HTTP_OK, [], ['groups' => ['competition:read']]);
    }

    #[Route('/{id}/leaderboard', name: 'leaderboard', methods: ['GET'])]
    public function getLeaderboard(string $id, CompetitionRepository $competitionRepository, ParticipationRepository $participationRepository): JsonResponse
    {
        $competition = $competitionRepository->find($id);

        if (!$competition) {
            return $this->json(['message' => 'Compétition introuvable'], Response::HTTP_NOT_FOUND);
        }

        $leaderboard = $participationRepository->findLeaderboard($competition);

        return $this->json($leaderboard, Response::HTTP_OK, [], ['groups' => ['competition:read']]);
    }

    #[Route('/{id}/actions', name: 'actions', methods: ['GET'])]
    public function getActions(string $id, Request $request, CompetitionRepository $competitionRepository, ActionRepository $actionRepository): JsonResponse
    {
        $competition = $competitionRepository->find($id);

        if (!$competition) {
            return $this->json(['message' => 'Compétition introuvable'], Response::HTTP_NOT_FOUND);
        }

        $date = $request->query->get('date');

        if (in_array($date, ['undefined', 'null', ''], true)) {
            $date = null;
        }

        $page = $request->query->getInt('page', 1);
        $limit = 50;
        $offset = ($page - 1) * $limit;

        $sortBy = $request->query->get('sort', 'dateAction');
        $actions = $actionRepository->findByCompetition($competition, $sortBy, 'DESC', $limit, $offset, $date);
        $total = $actionRepository->countByCompetition($competition, $date);

        return $this->json([
            'data' => $actions,
            'meta' => [
                'total' => $total,
                'page' => $page,
                'last_page' => ceil($total / $limit),
            ],
        ], Response::HTTP_OK, [], ['groups' => ['action:read', 'player:read']]);
    }

    #[Route('/{id}/action-dates', name: 'action_dates', methods: ['GET'])]
    public function getActionDates(string $id, CompetitionRepository $compRepo, EntityManagerInterface $em): JsonResponse
    {
        $competition = $compRepo->find($id);
        if (!$competition) {
            return $this->json(['message' => 'Not found'], 404);
        }

        $results = $em->createQuery('
            SELECT a.dateAction 
            FROM App\Entity\Action a 
            JOIN a.participation p 
            WHERE p.competition = :comp 
            ORDER BY a.dateAction DESC
        ')
        ->setParameter('comp', $competition)
        ->getResult();

        $dates = [];
        foreach ($results as $row) {
            $dateStr = $row['dateAction']->format('Y-m-d');
            $dates[$dateStr] = true;
        }

        return $this->json(array_keys($dates));
    }

    #[Route('/{id}/pending-count', name: 'pending_count', methods: ['GET'])]
    public function getPendingCount(string $id, CompetitionRepository $compRepo, ActionRepository $actionRepo): JsonResponse
    {
        $competition = $compRepo->find($id);
        if (!$competition) {
            return $this->json(['message' => 'Not found'], 404);
        }

        $count = $actionRepo->countPendingByCompetition($competition);

        return $this->json(['count' => $count]);
    }
}
