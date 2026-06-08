<?php

declare(strict_types=1);

namespace App\Controller\Api\Player;

use App\Repository\PlayerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/players', name: 'api.players.')]
final class PlayerController extends AbstractController
{
    public function __construct(
        private PlayerRepository $playerRepository,
    ) {
    }

    #[Route('/search', name: 'search', methods: ['GET'], priority: 10)]
    public function searchPlayers(Request $request): JsonResponse
    {
        $query = trim($request->query->get('displayName', ''));
        $unlinkedOnly = $request->query->getBoolean('unlinked', false);

        $players = $this->playerRepository->searchByName($query, $unlinkedOnly);

        return $this->json($players, Response::HTTP_OK, [], [
            'groups' => ['player:read'],
        ]);
    }
}
