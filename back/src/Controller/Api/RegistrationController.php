<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\CompetitionRepository;
use App\Repository\PlayerRepository;
use App\Repository\UserRepository;
use App\Service\UserManager;
use App\Service\ValidationHelper;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Gestion de l'inscription des nouveaux utilisateurs.
 * * Permet de créer un compte utilisateur complet et, optionnellement,
 * d'inscrire immédiatement le nouveau joueur à une compétition via son code.
 */
#[Route('/api', name: 'api.')]
final class RegistrationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private CompetitionRepository $competitionRepository,
        private JWTTokenManagerInterface $jwtManager,
        private ValidatorInterface $validator,
        private ValidationHelper $validationHelper,
    ) {
    }

    /**
     * Inscrit un nouvel utilisateur et son profil joueur.
     * * Si un 'join_code' est fourni, le système vérifie l'existence de la compétition
     * avant de procéder à la création du compte pour lier le joueur dès son inscription.
     *
     * @param Request $request contient username, plain_password, display_name et optionnellement join_code
     * @param UserManager $userManager service gérant la logique de création User/Player
     *
     * @return JsonResponse message de succès (201) ou erreurs de validation (422)
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, UserManager $userManager, UserRepository $userRepository): JsonResponse
    {
        $data = $request->toArray();

        $username = $data['username'] ?? '';
        $joinCode = $data['join_code'] ?? null;
        $playerId = $data['player_id'] ?? null;
        $competition = null;

        if ($userRepository->count(['username' => $username]) > 0) {
            return $this->json([
                'errors' => [
                    'username' => 'Ce pseudo est déjà utilisé',
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($joinCode) {
            $competition = $this->competitionRepository->findOneBy(['joinCode' => $joinCode]);

            if (null === $competition) {
                return $this->json([
                    'message' => 'La compétition n\'existe pas.',
                ], Response::HTTP_NOT_FOUND);
            }
        }

        $user = $userManager->registerUser(
            $data['username'] ?? '',
            $data['plain_password'] ?? '',
            $data['display_name'] ?? '',
            $competition,
            $playerId
        );

        $errors = $this->validator->validate($user);

        if (count($errors) > 0) {
            return $this->json([
                'errors' => $this->validationHelper->formatErrors($errors),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->flush();

        $token = $this->jwtManager->create($user);

        return $this->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => $user->getUserIdentifier(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/check-username/{username}', name: 'check-username', methods: ['GET'])]
    public function checkUsername(string $username, UserRepository $userRepository, PlayerRepository $playerRepository): JsonResponse
    {
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

    #[Route('/check-player/{username}', name: 'check-player', methods: ['GET'])]
    public function checkPlayer(string $username, PlayerRepository $playerRepository): JsonResponse
    {
        $player = $playerRepository->findOneBy([
            'username' => $username,
            'associatedUser' => null,
        ]);

        return $this->json([
            'exists' => null !== $player,
            'player' => $player ? [
                'id' => $player->getId(),
                'display_name' => $player->getDisplayName(),
                'username' => $player->getUsername(),
            ] : null,
        ]);
    }
}
