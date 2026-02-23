<?php

namespace App\Controller\Api\Admin;

use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
use App\Entity\User;
use App\Repository\ParticipationRepository;
use App\Repository\PlayerRepository;
use App\Service\PlayerManager;
use App\Service\UniqueValueGenerator;
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
        private EntityManagerInterface $em,
        private UniqueValueGenerator $uniqueValueGenerator
    ) { }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = $request->toArray();

        $user = $this->getUser();
        
        if (!$user instanceof User) {
            return $this->json([
                'error' => 'L\'utilisateur connecté n\'est pas un User',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $startDate = null;
        $endDate = null;

        if (!isset($data['start_date']) || null === $data['start_date']) {
            return $this->json([
                'error' => 'La date de début doit être renseignée',
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            $startDate = new \DateTimeImmutable($data['start_date']);
            $endDate = isset($data['end_date']) ? new \DateTimeImmutable($data['end_date']) : null;

            if ($endDate && $endDate < $startDate) {
                return $this->json([
                    'error' => 'La date de fin doit être postérieure à la date de début',
                ], Response::HTTP_BAD_REQUEST);
            }
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Format de date invalide',
            ], Response::HTTP_BAD_REQUEST);
        }

        $competition = new Competition();
        $competition->setName($data['name'] ?? 'Nouvelle compétition');
        $competition->setStartDate($startDate);
        $competition->setEndDate($endDate);

        // TODO: Automatiser ça via Gedmo Blameable
        $competition->setCreatedBy($user);
        $competition->setUpdatedBy($user);
        
        $customJoinCode = $data['join_code'] ?? null;

        if ($customJoinCode) {
            $competition->setJoinCode(strtoupper(trim($customJoinCode)));
        } else {
            $competition->setJoinCode($this->uniqueValueGenerator->generateRandomCode());
        }

        $errors = $validator->validate($competition);

        if (count($errors) > 0) {
            $errorsArray = [];

            foreach($errors as $error) {
                $errorsArray[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json([
                'errors' => $errorsArray,
            ], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['participate']) && true === $data['participate']) {
            $player = $user->getPlayer();
            
            if (!$player) {
                return $this->json([
                    'error' => 'Profil joueur manquant',
                ], Response::HTTP_BAD_REQUEST);
            }

            $participation = new Participation();
            $participation->setPlayer($player);
            $competition->addParticipation($participation);

            $this->em->persist($participation);
        }

        $this->em->persist($competition);
        $this->em->flush();

        return $this->json([
            'id' => $competition->getId(),
            'name' => $competition->getName(),
            'slug' => $competition->getSlug(),
            'join_code' => $competition->getJoinCode(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}/add-players', name: 'add_players', methods: ['POST'])]
    public function addPlayers(
        Competition $competition,
        Request $request,
        ParticipationRepository $participationRepository,
        PlayerRepository $playerRepository,
        ValidatorInterface $validator
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
        $newPlayers = $data['new_players'] ?? [];

        $players = $playerRepository->findBy(['id' => $existingPlayersIds]);
        
        $playersById = [];
        foreach ($players as $player) {
            $playersById[(string) $player->getId()] = $player;
        }

        $missingIds = array_diff($existingPlayersIds, array_keys($playersById));

        foreach ($missingIds as $id) {
            $errors[] = ['id' => $id, 'message' => 'Joueur introuvable'];
        }

        $alreadyExistsParticipations = $participationRepository->findBy([
            'competition' => $competition,
            'player' => $players
        ]);

        $alreadyParticipatingIds = array_map(
            fn($p) => (string) $p->getPlayer()->getId(), $alreadyExistsParticipations
        );

        foreach ($existingPlayersIds as $id) {
            $idStr = (string) $id;
            if (!array_key_exists($idStr, $playersById)) {
                $errors[] = ['id' => $id, 'message' => 'Joueur introuvable'];
            } elseif (in_array($idStr, $alreadyParticipatingIds)) {
                $errors[] = [
                    'id' => $id,
                    'name' => $playersById[$idStr]->getDisplayName(),
                    'message' => 'Déjà inscrit'
                ];
            } else {
                $currentPlayer = $playersById[$idStr];

                $participation = new Participation();
                $participation->setCompetition($competition);
                $participation->setPlayer($currentPlayer);

                $this->em->persist($participation);

                $successes[] = [
                    'id' => $id,
                    'name' => $currentPlayer->getDisplayName()
                ];
            }
        }

        if (!empty($newPlayers)) {
            $batchReport = $this->playerManager->createPlayersBatch($newPlayers, $competition, $user);

            $successes = array_merge($successes, $batchReport['successes']);
            $errors = array_merge($errors, $batchReport['errors']);
        }
        

        $this->em->flush();

        return $this->json([
            'summary' => [
                'total_processes' => count($successes) + count($errors),
                'success_count' => count($successes),
                'error_count' => count($errors),
            ],
            'successes' => $successes,
            'errors' => $errors
        ], count($errors) > 0 ? Response::HTTP_MULTI_STATUS : Response::HTTP_CREATED);
    }
}