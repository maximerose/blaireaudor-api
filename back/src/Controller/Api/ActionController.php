<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\ActionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Gestion des actions de jeu au sein d'une compétition.
 * * Permet aux joueurs d'enregistrer des actions qui donnent ou enlèvent des points à d'autres joueurs.
 */
#[Route('/api/actions', name: 'api.actions.')]
final class ActionController extends AbstractController
{
    #[Route('/pending-referee', name: 'pending_referee', methods: ['GET'])]
    public function getGlobalPendingCount(ActionRepository $actionRepository): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User || !$user->getPlayer()) {
            return $this->json(['count' => 0]);
        }

        $count = $actionRepository->countPendingForReferee($user->getPlayer());

        return $this->json(['count' => $count]);
    }
}
