<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\PlayerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/search', name: 'api.search.')]
final class SearchController extends AbstractController
{
    #[Route('/players', name: 'players', methods: ['GET'])]
    public function searchPlayers(Request $request, PlayerRepository $playerRepository): JsonResponse
    {
        $query = $request->query->get('displayName', '');
        $unlinkedOnly = $request->query->getBoolean('unlinked', false);

        $players = $playerRepository->searchByName($query, $unlinkedOnly);

        return $this->json($players, Response::HTTP_OK, [], [
            'groups' => ['player:read']
        ]);
    }
}
