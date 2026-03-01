<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Competition;
use App\Service\ActionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Gestion des actions de jeu au sein d'une compétition.
 * * Permet aux joueurs d'enregistrer des actions qui donnent ou enlèvent des points à d'autres joueurs.
 */
#[Route('/api/competitions', name: 'api.actions.')]
final class ActionController extends AbstractController
{
    /**
     * Enregistre une nouvelle action pour une compétition donnée.
     * @param Competition $competition La compétition concernée (injectée via le ParamConverter)
     * @IsGranted("ACTION_CREATE", subject="competition") 
     * * Vérifie via le Voter si l'utilisateur a le droit de poster dans cette compétition.
     * @return JsonResponse L'action créée, sérialisée avec le groupe 'action:read'.
     */
    #[Route('/{id}/actions', name: 'create', methods: 'POST')]
    #[IsGranted('ACTION_CREATE', subject: 'competition')]
    public function create(
        Competition $competition,
        Request $request,
        EntityManagerInterface $entityManager,
        ActionManager $actionManager
    ): JsonResponse {
        $data = $request->toArray();

        $action = $actionManager->createActionFromPayload($competition, $this->getUser(), $data);

        $entityManager->flush();

        return $this->json(
            $action, 
            Response::HTTP_CREATED, 
            [], 
            ['groups' => ['action:read']]
        );
    }
}
