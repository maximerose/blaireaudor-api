<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Competition;
use App\Repository\PlayerRepository;
use App\Security\Voter\CompetitionVoter;
use App\Service\Manager\CompetitionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/competitions/{id}/referees', name: 'api.competition.referee.')]
final class CompetitionRefereeController extends AbstractController
{
    public function __construct(
        private CompetitionManager $competitionManager,
        private PlayerRepository $playerRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/add', name: 'add', methods: ['POST'])]
    #[IsGranted(CompetitionVoter::MANAGE, subject: 'competition')]
    public function addReferee(Competition $competition, Request $request): JsonResponse
    {
        $data = $request->toArray();
        $player = $this->playerRepository->find($data['player_id'] ?? '');

        if (!$player) {
            return $this->json(['error' => 'Joueur introuvable'], Response::HTTP_NOT_FOUND);
        }

        $this->competitionManager->addReferee($competition, $player);
        $this->entityManager->flush();

        return $this->json($competition, Response::HTTP_OK, [], ['groups' => ['competition:read']]);
    }

    #[Route('/remove', name: 'remove', methods: ['POST'])]
    #[IsGranted(CompetitionVoter::MANAGE, subject: 'competition')]
    public function removeReferee(Competition $competition, Request $request): JsonResponse
    {
        $data = $request->toArray();
        $player = $this->playerRepository->find($data['player_id'] ?? '');

        if (!$player) {
            return $this->json(['error' => 'Joueur introuvable'], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->competitionManager->removeReferee($competition, $player);
            $this->entityManager->flush();
        } catch (\LogicException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return $this->json($competition, Response::HTTP_OK, [], ['groups' => ['competition:read']]);
    }
}
