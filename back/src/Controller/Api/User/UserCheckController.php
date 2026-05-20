<?php

declare(strict_types=1);

namespace App\Controller\Api\User;

use App\Repository\PlayerRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api.check.')]
final class UserCheckController extends AbstractController
{
    #[Route('/check-username', name: 'username', methods: ['GET'])]
    public function checkUsername(Request $request, UserRepository $userRepository, PlayerRepository $playerRepository): JsonResponse
    {
        $username = $request->query->get('username', '');

        if (empty($username)) {
            return $this->json(['available' => true]);
        }

        $userExists = $userRepository->count(['username' => $username]) > 0;
        $player = $playerRepository->findOneBy(['username' => $username]);
        $playerIsClaimed = (null !== $player && null !== $player->getAssociatedUser());

        $isGuest = (null !== $player && !$playerIsClaimed);
        $available = !$userExists && !$playerIsClaimed;

        return $this->json([
            'available' => $available,
            'is_guest_profile' => $isGuest,
            'player' => $player ? [
                'id' => (string) $player->getId(),
                'display_name' => $player->getDisplayName(),
                'username' => $player->getUsername(),
                'last_competition_name' => $player->getLastCompetitionName(),
            ] : null,
        ]);
    }

    #[Route('/check-email', name: 'email', methods: ['GET'])]
    public function checkEmail(Request $request, UserRepository $userRepository): JsonResponse
    {
        $email = $request->query->get('email', '');

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['available' => true]);
        }

        $userExists = $userRepository->count(['email' => $email]) > 0;

        return $this->json([
            'available' => !$userExists,
        ]);
    }
}
