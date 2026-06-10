<?php

declare(strict_types=1);

namespace App\Controller\Api\Competition;

use App\Constants\ErrorMessages;
use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
use App\Service\Manager\ParticipationManager;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
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
            throw new UnauthorizedHttpException('Bearer', ErrorMessages::AUTH_REQUIRED);
        }

        $data = json_decode($request->getContent(), true);
        $joinCode = strtoupper(trim($data['joinCode'] ?? ''));

        $competition = $repository->findOneBy(['joinCode' => $joinCode]);

        if (!$competition) {
            throw new NotFoundHttpException(ErrorMessages::COMP_NOT_FOUND);
        }

        if ($competition->getIsFinished()) {
            throw new BadRequestHttpException(ErrorMessages::COMP_FINISHED);
        }

        $participation = $participationManager->joinCompetition($user->getPlayer(), $competition);
        $entityManager->flush();

        return $this->json($participation, Response::HTTP_CREATED, [], ['groups' => ['competition:read']]);
    }

    #[Route('/by-code/{code}', name: 'by_code', methods: ['GET'])]
    public function getByCode(string $code, CompetitionRepository $repository, ParticipationRepository $partRepo, LoggerInterface $logger): JsonResponse
    {
        $cleanCode = strtoupper(trim($code));
        $competition = $repository->findOneBy(['joinCode' => $cleanCode]);

        if (!$competition) {
            throw new NotFoundHttpException(ErrorMessages::COMP_NOT_FOUND);
        }

        $leaderboard = $partRepo->findLeaderboard($competition);

        $logger->critical('=== DEBUG LEADERBOARD ===');
        $logger->critical('Nombre de participations trouvées : '.\count($leaderboard));

        if (\count($leaderboard) > 0) {
            $first = $leaderboard[0];
            $logger->critical('Premier joueur : '.$first->getPlayer()->getDisplayName());
            $logger->critical('Score du premier : '.$first->getScore());
        } else {
            $logger->critical('Le leaderboard est vide depuis la base de données !');
        }

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
            throw new NotFoundHttpException(ErrorMessages::COMP_NOT_FOUND);
        }

        $leaderboard = $participationRepository->findLeaderboard($competition);

        return $this->json($leaderboard, Response::HTTP_OK, [], ['groups' => ['competition:read']]);
    }

    #[Route('/check/join-code', name: 'check_join_code', methods: ['GET'])]
    public function checkJoinCode(Request $request, CompetitionRepository $repository): JsonResponse
    {
        $code = strtoupper(trim($request->query->get('code', '')));
        if (empty($code)) {
            return $this->json(['available' => true]);
        }

        $exists = $repository->count(['joinCode' => $code]) > 0;

        return $this->json(['available' => !$exists]);
    }
}
