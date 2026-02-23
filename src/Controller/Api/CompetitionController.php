<?php

namespace App\Controller\Api;

use App\Repository\CompetitionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/competition', name: 'api.competition.')]
final class CompetitionController extends AbstractController
{
    #[Route('/check-code/{code}', name: 'check_code', methods: 'GET')]
    public function checkCode(string $code, CompetitionRepository $repository): JsonResponse
    {
        $competition = $repository->findOneBy(['joinCode' => $code]);

        if (null === $competition) {
            return $this->json([], 404);
        }

        $arrayPlayers = [];

        $participations = $competition->getParticipations();

        foreach ($participations as $participation) {
            if ($participation->getPlayer()->getAssociatedUser() === null) {
                $player = $participation->getPlayer();
                $arrayPlayers[] = [
                    'display_name' => $player->getDisplayName(),
                    'username' => $player->getUsername(),
                ];
            }
        }

        return $this->json([
            'name' => $competition->getName(),
            'join_code' => $competition->getJoinCode(),
            'start_date' => $competition->getStartDate(),
            'end_date' => $competition->getEndDate(),
            'players' => $arrayPlayers,
        ]);
    }
}
