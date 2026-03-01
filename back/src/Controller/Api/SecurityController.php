<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

/**
 * Gestion de l'authentification et de la session utilisateur.
 * * Fournit les points d'entrée pour la connexion, la déconnexion
 * et la récupération du profil de l'utilisateur connecté.
 */
#[Route('/api', name: 'api.')]
final class SecurityController extends AbstractController
{
    /**
     * Point d'entrée pour la connexion (JSON Login).
     * * L'authentification est gérée par le firewall Symfony via le 'json_login'.
     * Si les identifiants sont corrects, Symfony injecte l'objet User dans cette méthode.
     * @param User|null $user L'utilisateur authentifié par le firewall.
     * @return JsonResponse Les informations de base du profil et les rôles.
     */
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        if (null === $user) {
            return $this->json([
                'message' => 'Identifiants invalides ou format JSON incorrect.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'user' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'display_name' => $user->getPlayer()?->getDisplayName(),
            'id' => $user->getId(),
        ]);
    }

    /**
     * Point de déconnexion.
     * * Cette route est interceptée par le firewall avant l'exécution du contrôleur.
     * @throws \LogicException Cette méthode ne doit jamais être appelée.
     */
    #[Route('/logout', name: 'logout', methods: ['GET'])]
    public function logout(): void
    {
        throw new \LogicException('Cette méthode peut rester vide, elle sera interceptée par le logout du firewall.');
    }

    /**
     * Récupère les informations de l'utilisateur actuellement connecté.
     * * Utile pour maintenir l'état du profil côté Front-end après un rafraîchissement.
     * @return JsonResponse Identifiant, rôles et nom d'affichage du joueur.
     */
    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'message' => 'Non connecté',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'user' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'display_name' => $user->getPlayer()?->getDisplayName(),
        ]);
    }
}
