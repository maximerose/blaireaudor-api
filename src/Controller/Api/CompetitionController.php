<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\CompetitionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/competitions', name: 'api.competition.')]
final class CompetitionController extends AbstractController
{
    #[Route('/check-code/{code}', name: 'check_code', methods: 'GET')]
    public function checkCode(string $code, CompetitionRepository $repository): JsonResponse
    {
        $competition = $repository->findByCodeWithAllPlayers($code);

        if (null === $competition) {
            return $this->json(['message' => 'Compétition introuvable'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(
            $competition,
            Response::HTTP_OK,
            [],
            ['groups' => ['competition:read']]
        );
    }
}
