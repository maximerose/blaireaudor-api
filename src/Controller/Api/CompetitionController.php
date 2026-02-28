<?php

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

        $players = [];

        foreach ($competition->getParticipations() as $participation) {
            $player = $participation->getPlayer();
            $players[] = [
                'display_name' => $player->getDisplayName(),
                'username' => $player->getUsername(),
                'has_account' => $player->getAssociatedUser() !== null,
            ];
        }

        return $this->json([
            'name' => $competition->getName(),
            'join_code' => $competition->getJoinCode(),
            'start_date' => $competition->getStartDate(),
            'end_date' => $competition->getEndDate(),
            'slug' => $competition->getSlug(),
            'players' => $players,
        ]);
    }
}
