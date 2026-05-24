<?php

declare(strict_types=1);

namespace App\Controller\Api\User;

use App\Constants\ErrorMessages;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Gestion de l'authentification et de la session utilisateur.
 */
#[Route('/api', name: 'api.')]
final class AuthController extends AbstractController
{
    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(): void
    {
    }

    #[Route('/logout', name: 'logout', methods: ['GET'])]
    public function logout(): JsonResponse
    {
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/token/refresh', name: 'refresh', methods: ['POST'])]
    public function refresh(): void
    {
        throw new UnauthorizedHttpException('Bearer', ErrorMessages::INVALID_REFRESH_TOKEN);
    }
}
