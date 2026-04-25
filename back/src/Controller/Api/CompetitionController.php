<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\ActionRepository;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
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
    #[Route('/check-code/{code}', name: 'check_code', methods: 'GET')]
    public function checkCode(string $code, CompetitionRepository $repository): JsonResponse
    {
        $competition = $repository->findByCodeWithAllPlayers($code);

        if (null === $competition) {
            return $this->json(['message' => 'Compétition introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(
            $competition,
            Response::HTTP_OK,
            [],
            ['groups' => ['competition:read']]
        );
    }

    #[Route('/{id}/leaderboard', name: 'leaderboard', methods: ['GET'])]
    public function getLeaderboard(string $id, CompetitionRepository $competitionRepository, ParticipationRepository $participationRepository): JsonResponse
    {
        $competition = $competitionRepository->find($id);

        if (!$competition) {
            return $this->json(['message' => 'Compétition introuvable'], Response::HTTP_NOT_FOUND);
        }

        $leaderboard = $participationRepository->findLeaderboard($competition);

        return $this->json($leaderboard, Response::HTTP_OK, [], ['groups' => ['competition:read', 'player:read']]);
    }

    #[Route('/{id}/actions', name: 'actions', methods: ['GET'])]
    public function getActions(string $id, Request $request, CompetitionRepository $competitionRepository, ActionRepository $actionRepository): JsonResponse
    {
        $competition = $competitionRepository->find($id);

        if (!$competition) {
            return $this->json(['message' => 'Compétition introuvable'], Response::HTTP_NOT_FOUND);
        }

        $sortBy = $request->query->get('sort', 'dateAction');
        $actions = $actionRepository->findByCompetition($competition, $sortBy);

        return $this->json($actions, Response::HTTP_OK, [], ['groups' => ['action:read', 'competition:read', 'player:read']]);
    }
}
