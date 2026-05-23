<?php

declare(strict_types=1);

namespace App\Controller\Api\Competition;

use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
use App\Service\Manager\ParticipationManager;
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
    #[Route('/join', name: 'join_by_code', methods: ['POST'])]
    public function joinByCode(
        Request $request,
        CompetitionRepository $repository,
        ParticipationManager $participationManager,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user instanceof User || !$user->getPlayer()) {
            return $this->json(['message' => 'Non autorisé'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $joinCode = strtoupper(trim($data['joinCode'] ?? ''));

        $competition = $repository->findOneBy(['joinCode' => $joinCode]);

        if (!$competition) {
            return $this->json(['message' => 'Code d\'accès invalide ou expiré.'], Response::HTTP_FORBIDDEN);
        }

        $participation = $participationManager->joinCompetition($user->getPlayer(), $competition);
        $entityManager->flush();

        return $this->json($participation, Response::HTTP_CREATED, [], ['groups' => ['competition:read']]);
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
