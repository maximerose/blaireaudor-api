<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Competition;
use App\Repository\ActionRepository;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
use App\Security\Voter\CompetitionVoter;
use App\Service\ActionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
            return $this->json(['message' => 'Compétition introuvable'], Response::HTTP_NOT_FOUND);
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

    /**
     * Enregistre une nouvelle action pour une compétition donnée.
     *
     * @param Competition $competition La compétition concernée (injectée via le ParamConverter)
     *
     * @return JsonResponse L'action créée, sérialisée avec le groupe 'action:read'
     */
    #[Route('/{id}/actions', name: 'create', methods: 'POST')]
    #[IsGranted(CompetitionVoter::PLAYER, subject: 'competition')]
    public function createAction(
        Competition $competition,
        Request $request,
        EntityManagerInterface $entityManager,
        ActionManager $actionManager,
    ): JsonResponse {
        $data = $request->toArray();
        $user = $this->getUser();

        $action = $entityManager->wrapInTransaction(function () use ($competition, $user, $data, $actionManager, $entityManager) {
            $action = $actionManager->createActionFromPayload($competition, $user, $data);

            $entityManager->persist($action);
            $entityManager->flush();

            return $action;
        });

        return $this->json($action, Response::HTTP_CREATED, [], ['groups' => ['action:read']]);
    }

    #[Route('/{id}/actions', name: 'actions', methods: ['GET'])]
    public function getActions(Competition $competition, Request $request, CompetitionRepository $competitionRepository, ActionRepository $actionRepository): JsonResponse
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
        $actions = $actionRepository->findByCompetition($competition, $sortBy, $order, $limit, $offset, $date, $playerId);
        $total = $actionRepository->countByCompetition($competition, $date, $playerId);

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
    public function getActionDates(Competition $competition, ActionRepository $actionRepository): JsonResponse
    {
        return $this->json($actionRepository->findAllDatesByCompetition($competition));
    }

    #[Route('/{id}/pending-count', name: 'pending_count', methods: ['GET'])]
    public function getPendingCount(Competition $competition, ActionRepository $actionRepository): JsonResponse
    {
        return $this->json(['count' => $actionRepository->countPendingByCompetition($competition)]);
    }

    #[Route('/check/join-code', name: 'check_join_code', methods: ['GET'])]
    public function checkJoinCode(Request $request, CompetitionRepository $repository): JsonResponse
    {
        $code = $request->query->get('code');

        if (empty($code)) {
            return $this->json(['available' => true]);
        }

        $exists = $repository->count(['joinCode' => $code]) > 0;

        return $this->json(['available' => !$exists]);
    }
}
