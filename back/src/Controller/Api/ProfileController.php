<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\Manager\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[Route('/api', name: 'api.profile.')]
final class ProfileController extends AbstractController
{
    /**
     * Récupère les informations de l'utilisateur actuellement connecté.
     * * Utile pour maintenir l'état du profil côté Front-end après un rafraîchissement.
     *
     * @return JsonResponse identifiant, rôles et nom d'affichage du joueur
     */
    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'message' => 'Non connecté',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json(
            $user,
            200,
            [],
            ['groups' => ['user:read']]
        );
    }

    #[Route('/me', name: 'update', methods: ['PATCH'])]
    public function updateProfile(
        Request $request,
        EntityManagerInterface $entityManager,
        UserManager $userManager,
        JWTTokenManagerInterface $jwtManager,
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'Non autorisé'], Response::HTTP_UNAUTHORIZED);
        }

        $violations = $userManager->updateProfile($user, $request->toArray());

        if (!empty($violations)) {
            return $this->json(['violations' => $violations], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $entityManager->flush();

        $newToken = $jwtManager->create($user);

        return $this->json(['user' => $user, 'token' => $newToken], Response::HTTP_OK, [], ['groups' => ['user:read']]);
    }
}
