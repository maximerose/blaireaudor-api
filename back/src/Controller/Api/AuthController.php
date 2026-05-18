<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\UserRepository;
use App\Service\Manager\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Gestion de l'authentification et de la session utilisateur.
 */
#[Route('/api', name: 'api.')]
final class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private JWTTokenManagerInterface $jwtManager,
    ) {
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): void
    {
    }

    #[Route('/logout', name: 'logout', methods: ['GET'])]
    public function logout(): JsonResponse
    {
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        UserManager $userManager,
        UserRepository $userRepository,
        CompetitionRepository $competitionRepository,
    ): JsonResponse {
        $data = $request->toArray();

        $result = $userManager->handleRegistration($data, $userRepository, $competitionRepository);

        if (isset($result['violations'])) {
            return $this->json(['violations' => $result['violations']], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        /** @var User $user */
        $user = $result['user'];

        $this->entityManager->flush();

        $token = $this->jwtManager->create($user);

        return $this->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => $user->getUserIdentifier(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/check-username', name: 'check-username', methods: ['GET'])]
    public function checkUsername(Request $request, UserRepository $userRepository, \App\Repository\PlayerRepository $playerRepository): JsonResponse
    {
        $username = $request->query->get('username');

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
                'id' => $player->getId(),
                'display_name' => $player->getDisplayName(),
                'username' => $player->getUsername(),
                'last_competition_name' => $player->getLastCompetitionName(),
            ] : null,
        ]);
    }

    #[Route('/check-email', name: 'check-email', methods: ['GET'])]
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
