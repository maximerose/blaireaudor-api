<?php

namespace App\Controller\Api;

use App\Entity\Competition;
use App\Service\ActionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/competitions', name: 'api.actions.')]
final class ActionController extends AbstractController
{
    #[Route('/{id}/actions', name: 'create', methods: 'POST')]
    #[IsGranted('ACTION_CREATE', subject: 'competition')]
    public function create(
        Competition $competition,
        Request $request,
        EntityManagerInterface $entityManager,
        ActionManager $actionManager
    ) {
        $data = json_decode($request->getContent(), true);

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
