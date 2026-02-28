<?php

declare(strict_types=1);

namespace App\Controller\Api\Admin;

use App\Entity\Competition;
use App\Entity\User;
use App\Repository\ParticipationRepository;
use App\Repository\PlayerRepository;
use App\Service\CompetitionManager;
use App\Service\ParticipationManager;
use App\Service\PlayerManager;
use App\Service\ValidationHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/admin/competition', name: 'api.admin.competition.')]
final class AdminCompetitionController extends AbstractController
{
    public function __construct(
        private PlayerManager $playerManager,
        private CompetitionManager $competitionManager,
        private ParticipationManager $participationManager,
        private ValidationHelper $validationHelper,
        private EntityManagerInterface $entityManager,
    ) { }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = $request->toArray();
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return $this->json([
                'error' => 'Non autorisé',
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (!isset($data['start_date'])) {
            return $this->json(['error' => 'La date de début est obligatoire'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $startDate = new \DateTimeImmutable($data['start_date']);
            $endDate = isset($data['end_date']) ? new \DateTimeImmutable($data['end_date']) : null;
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Format de date invalide',
            ], Response::HTTP_BAD_REQUEST);
        }

        $competition = $this->competitionManager->createCompetition(
            $data['name'] ?? 'Nouvelle compétition',
            $startDate,
            $endDate,
            $data['join_code'] ?? null
        );

        $errors = $validator->validate($competition);

        if (count($errors) > 0) {
            return $this->json([
                'errors' => $this->validationHelper->formatErrors($errors)
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['participate']) && true === $data['participate']) {
            $player = $user->getPlayer();
            
            if (!$player) {
                return $this->json([
                    'error' => 'Profil joueur manquant',
                ], Response::HTTP_BAD_REQUEST);
            }

            $this->participationManager->joinCompetition($player, $competition);
        }

        $this->entityManager->flush();

        return $this->json(
            $competition, 
            Response::HTTP_CREATED,
            [],
            ['groups' => ['competition:read']]
        );
    }

    #[Route('/{id}/add-players', name: 'add_players', methods: ['POST'])]
    public function addPlayers(
        Competition $competition,
        Request $request,
        ParticipationRepository $participationRepository,
        PlayerRepository $playerRepository,
    ): JsonResponse
    {
        $user = $this->getUser();

        if ($competition->getCreatedBy() !== $user) {
            return $this->json(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        $data = $request->toArray();
        $successes = [];
        $errors = [];

        $existingPlayersIds = $data['existing_players_ids'] ?? [];

        if (!empty($existingPlayersIds)) {
            $players = $playerRepository->findBy(['id' => $existingPlayersIds]);
            $playersById = [];

            foreach ($players as $player) {
                $playersById[(string) $player->getId()] = $player;
            }

            foreach ($existingPlayersIds as $id) {
                $idStr = (string) $id;

                if (!isset($playersById[$idStr])) {
                    $errors[] = ['id' => $id, 'message' => 'Joueur introuvable'];
                    continue;
                }

                $currentPlayer = $playersById[$idStr];

                 $isAlreadyIn = $participationRepository->findOneBy([
                    'competition' => $competition,
                    'player' => $currentPlayer
                ]);

                if ($isAlreadyIn) {
                    $errors[] = [
                        'id' => $id,
                        'name' => $currentPlayer->getDisplayName(),
                        'message' => 'Déjà inscrit'
                    ];
                } else {
                    $this->participationManager->joinCompetition($currentPlayer, $competition);

                    $successes[]  = [
                        'id' => $id,
                        'name' => $currentPlayer->getDisplayName()
                    ];
                }
            }
        }

        if (!empty($data['new_players'])) {
            $batchReport = $this->playerManager->createPlayersBatch($data['new_players'], $competition, $user);
            $successes = array_merge($successes, $batchReport['successes']);
            $errors = array_merge($errors, $batchReport['errors']);
        }

        $this->entityManager->flush();

        return $this->json(
            [
                'summary' => [
                    'total_processes' => count($successes) + count($errors),
                    'success_count' => count($successes),
                    'error_count' => count($errors),
                ],
                'successes' => $successes,
                'errors' => $errors
            ], 
            count($errors) > 0 ? Response::HTTP_MULTI_STATUS : Response::HTTP_CREATED,
            [],
            ['groups' => ['competition:read']]
        );
    }
}