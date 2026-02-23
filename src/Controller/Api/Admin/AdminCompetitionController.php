<?php

namespace App\Controller\Api\Admin;

use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
use App\Entity\User;
use App\Repository\ParticipationRepository;
use App\Repository\PlayerRepository;
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
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
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
            ], 400);
        }

        $competition = new Competition();
        $competition->setName($data['name'] ?? 'Nouvelle compétition');
        $competition->setStartDate($startDate);
        $competition->setEndDate($endDate);
        $competition->setCreatedBy($user);
        $competition->setUpdatedBy($user);

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
                    'error' => 'Vous ne pouvez pas participer car vous n\'avez pas de profil joueur',
                ], Response::HTTP_BAD_REQUEST);
            }

            $participation = new Participation();
            $participation->setPlayer($player);
            $competition->addParticipation($participation);

            $em->persist($participation);
        }

        $em->persist($competition);
        $em->flush();

        return $this->json([
            'id' => $competition->getId(),
            'name' => $competition->getName(),
            'join_code' => $competition->getJoinCode(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}/add-players', name: 'add_players', methods: ['POST'])]
    public function addPlayers(
        Competition $competition,
        Request $request,
        EntityManagerInterface $em,
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

        $existingPlayersIds = $data['existing_players_ids'];
        $newPlayers = $data['new_players'];

        foreach ($existingPlayersIds as $id) {
            $player = $playerRepository->find($id);

            if (!$player) {
                $errors[] = ['id' => $id, 'message' => 'Joueur introuvable'];
                continue;
            }

            $alreadyExists = $participationRepository->findOneBy([
                'competition' => $competition,
                'player' => $player
            ]);

            if ($alreadyExists) {
                $errors[] = [
                    'id' => $id,
                    'name' => $player->getDisplayName(),
                    'message' => 'Déjà inscrit'
                ];
            } else {
                $participation = new Participation();
                $participation->setCompetition($competition);
                $participation->setPlayer($player);

                $em->persist($participation);

                $successes[] = [
                    'id' => $id,
                    'name' => $player->getDisplayName()
                ];
            }
        }

        foreach ($newPlayers as $newPlayerName) {
            $player = new Player();
            $player->setDisplayName($newPlayerName);
            $player->setCreatedBy($user);

            $violations = $validator->validate($player);

            if (count($violations) > 0) {
                foreach ($violations as $violation) {
                    $errors[] = [
                        'name' => $newPlayerName,
                        'message' => $violation->getMessage()
                    ];
                }
                
                continue;
            }

            $em->persist($player);
            
            $participation = new Participation();
            $participation->setCompetition($competition);
            $participation->setPlayer($player);

            $em->persist($participation);

            $successes[] = ['name' => $player->getDisplayName()];
        }

        $em->flush();

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