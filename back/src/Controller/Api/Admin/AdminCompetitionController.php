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
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Gestion administrative des compétitions.
 * * Permet la création de compétitions et l'inscription massive de joueurs
 * (existants ou nouveaux comptes invités).
 */
#[Route('/api/admin/competition', name: 'api.admin.competition.')]
final class AdminCompetitionController extends AbstractController
{
    public function __construct(
        private PlayerManager $playerManager,
        private CompetitionManager $competitionManager,
        private ParticipationManager $participationManager,
        private ValidationHelper $validationHelper,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * Crée une nouvelle compétition.
     * * Si l'option 'participate' est à true, le créateur est automatiquement
     * inscrit en tant que joueur à la copétition créée.
     */
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

        $competition->setCreatedBy($user);

        $isCreatorReferee = $data['is_creator_referee'] ?? true;
        if ($isCreatorReferee && $user->getPlayer()) {
            $competition->addReferee($user->getPlayer());
        }

        $errors = $validator->validate($competition);

        if (count($errors) > 0) {
            return $this->json([
                'errors' => $this->validationHelper->formatErrors($errors),
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

    /**
     * Ajoute des joueurs à une compétition existante.
     * * Gère deux types d'entrées :
     * 1. 'existing_players_ids': Liste d'IDs de joueurs déjà enregistrés
     * 2. 'new_players': Liste de noms pour créer de nouveaux profils à la volée.
     *
     * @return JsonResponse retourne un rapport détaillé (successes/errors) avec un code 207 (Multi-Status)
     *                      si au moins une erreur survient
     */
    #[Route('/{id}/add-players', name: 'add_players', methods: ['POST'])]
    #[IsGranted('MANAGE', subject: 'competition')]
    public function addPlayers(
        Competition $competition,
        Request $request,
        ParticipationRepository $participationRepository,
        PlayerRepository $playerRepository,
    ): JsonResponse {
        $user = $this->getUser();

        $data = $request->toArray();
        $successes = [];
        $errors = [];

        $existingPlayersIds = $data['existing_players_ids'] ?? [];
        $newPlayersNames = $data['new_players'] ?? [];
        $existingRefereesIds = $data['existing_referees_ids'] ?? [];
        $newRefereesNames = $data['new_referees'] ?? [];

        $createdPlayersByName = [];

        // --- 1. JOUEURS EXISTANTS ---
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
                $isAlreadyIn = $participationRepository->findOneBy(['competition' => $competition, 'player' => $currentPlayer]);

                if ($isAlreadyIn) {
                    $errors[] = ['id' => $id, 'name' => $currentPlayer->getDisplayName(), 'message' => 'Déjà inscrit'];
                } else {
                    $this->participationManager->joinCompetition($currentPlayer, $competition);
                    $successes[] = ['id' => $id, 'name' => $currentPlayer->getDisplayName()];
                }
            }
        }

        // --- 2. NOUVEAUX JOUEURS ---
        if (!empty($newPlayersNames)) {
            // true = ils rejoignent la compétition en tant que participants
            $batchReport = $this->playerManager->createPlayersBatch($newPlayersNames, $competition, $user, true);
            foreach ($batchReport['successes'] as $success) {
                // On met l'entité de côté pour la suite
                $createdPlayersByName[$success['name']] = $success['entity'];
                $successes[] = ['name' => $success['name']];
            }
            $errors = array_merge($errors, $batchReport['errors']);
        }

        // --- 3. ARBITRES EXISTANTS ---
        if (!empty($existingRefereesIds)) {
            $referees = $playerRepository->findBy(['id' => $existingRefereesIds]);
            foreach ($referees as $ref) {
                $competition->addReferee($ref);
            }
        }

        // --- 4. NOUVEAUX ARBITRES ---
        if (!empty($newRefereesNames)) {
            $refereesToCreate = [];

            foreach ($newRefereesNames as $refName) {
                $trimmed = trim($refName);
                if (isset($createdPlayersByName[$trimmed])) {
                    $competition->addReferee($createdPlayersByName[$trimmed]);
                } else {
                    $refereesToCreate[] = $trimmed;
                }
            }

            if (!empty($refereesToCreate)) {
                // false = on crée le profil, mais on NE L'INSCRIT PAS comme participant au tournoi
                $refBatchReport = $this->playerManager->createPlayersBatch($refereesToCreate, $competition, $user, false);
                foreach ($refBatchReport['successes'] as $success) {
                    $competition->addReferee($success['entity']);
                    $successes[] = ['name' => $success['name'], 'info' => 'Arbitre externe ajouté'];
                }
                $errors = array_merge($errors, $refBatchReport['errors']);
            }
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
                'errors' => $errors,
            ],
            count($errors) > 0 ? Response::HTTP_MULTI_STATUS : Response::HTTP_CREATED,
            [],
            ['groups' => ['competition:read']]
        );
    }

    /**
     * Ajoute un arbitre à la compétition.
     */
    #[Route('/{id}/referees/add', name: 'add_referee', methods: ['POST'])]
    #[IsGranted('MANAGE', subject: 'competition')]
    public function addReferee(
        Competition $competition,
        Request $request,
        PlayerRepository $playerRepository,
    ): JsonResponse {
        $data = $request->toArray();
        $player = $playerRepository->find($data['player_id'] ?? '');

        if (!$player) {
            return $this->json(['error' => 'Joueur introuvable'], Response::HTTP_NOT_FOUND);
        }

        $this->competitionManager->addReferee($competition, $player);
        $this->entityManager->flush();

        return $this->json($competition, Response::HTTP_OK, [], ['groups' => ['competition:read']]);
    }

    /**
     * Retire un arbitre de la compétition.
     */
    #[Route('/{id}/referees/remove', name: 'remove_referee', methods: ['POST'])]
    #[IsGranted('MANAGE', subject: 'competition')]
    public function removeReferee(
        Competition $competition,
        Request $request,
        PlayerRepository $playerRepository,
    ): JsonResponse {
        $data = $request->toArray();
        $player = $playerRepository->find($data['player_id'] ?? '');

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
