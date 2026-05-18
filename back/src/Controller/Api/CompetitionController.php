<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Competition;
use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
use App\Service\Manager\CompetitionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Accès public aux informations des compétitions.
 * * Permet principalement aux joueurs de rejoindre une compétition
 * ou d'en vérifier l'existence via un code d'invitation.
 */
#[Route('/api/competitions', name: 'api.competition.')]
final class CompetitionController extends AbstractController
{
    public function __construct(
        private CompetitionManager $competitionManager,
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('', name: 'create', methods: ['POST'], priority: 10)]
    public function create(Request $request, #[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['error' => 'Non autorisé'], Response::HTTP_UNAUTHORIZED);
        }

        $result = $this->competitionManager->handleCreation($request->toArray(), $user);

        if (isset($result['violations'])) {
            return $this->json(['violations' => $result['violations']], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($result['competition'], Response::HTTP_CREATED, [], ['groups' => ['competition:read']]);
    }

    #[Route('/{id}/add-players', name: 'add_players', methods: ['POST'])]
    public function addPlayers(Competition $competition, Request $request): JsonResponse
    {
        $user = $this->getUser();
        /** @var User $user */
        $report = $this->competitionManager->handlePlayersAndRefereesBatch($competition, $request->toArray(), $user);

        $this->entityManager->flush();

        return $this->json(
            $report,
            \count($report['errors']) > 0 ? Response::HTTP_MULTI_STATUS : Response::HTTP_CREATED,
            [],
            ['groups' => ['competition:read']]
        );
    }

    #[Route('/by-code/{code}', name: 'by_code', methods: ['GET'])]
    public function getByCode(string $code, CompetitionRepository $repository, ParticipationRepository $partRepo): JsonResponse
    {
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
