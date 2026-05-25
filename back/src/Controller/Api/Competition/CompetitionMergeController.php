<?php

declare(strict_types=1);

namespace App\Controller\Api\Competition;

use App\Constants\ErrorMessages;
use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use App\Security\Voter\CompetitionVoter;
use App\Service\Manager\PlayerMerger;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/competitions/{id}', name: 'api.competition.')]
#[IsGranted('ROLE_USER', message: ErrorMessages::AUTH_REQUIRED)]
final class CompetitionMergeController extends AbstractController
{
    public function __construct(
        private readonly PlayerMerger $playerMerger,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/merge-players', name: 'merge_players', methods: ['POST'])]
    public function mergePlayers(Competition $competition, Request $request): JsonResponse
    {
        if (!$this->isGranted(CompetitionVoter::MANAGE, $competition)) {
            return $this->json(['message' => ErrorMessages::AUTH_DENIED], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        $guestPlayerId = $data['guestPlayerId'] ?? null;
        $realUserId = $data['realUserId'] ?? null;

        if (!$guestPlayerId || !$realUserId) {
            return $this->json(['message' => ErrorMessages::MISSING_DATA], Response::HTTP_BAD_REQUEST);
        }

        $guestPlayer = $this->entityManager->getRepository(Player::class)->find($guestPlayerId);
        $realUser = $this->entityManager->getRepository(User::class)->find($realUserId);

        if (!$guestPlayer) {
            return $this->json(['message' => ErrorMessages::PLAYER_NOT_FOUND], Response::HTTP_NOT_FOUND);
        }

        if (!$realUser) {
            return $this->json(['message' => ErrorMessages::REAL_USER_NOT_FOUND], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->playerMerger->merge($competition, $guestPlayer, $realUser);
        } catch (\Exception $e) {
            return $this->json(['message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(['success' => true], Response::HTTP_OK);
    }
}
