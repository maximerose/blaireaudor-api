<?php

declare(strict_types=1);

namespace App\Service\Manager;

use App\Constants\ErrorMessages;
use App\Entity\Competition;
use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
use App\Repository\PlayerRepository;
use App\Service\Helper\CodeGenerator;
use App\Service\Helper\ValidationHelper;
use App\Service\Notification\RefereeNotifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Service de gestion du cycle de vie des compétitions.
 * * Responsable de l'instanciation des compétitions et de la garantie
 * d'unicité des codes d'accès (joinCode).
 */
class CompetitionManager
{
    public function __construct(
        private CompetitionRepository $competitionRepository,
        private ParticipationRepository $participationRepository,
        private PlayerRepository $playerRepository,
        private CodeGenerator $codeGenerator,
        private PlayerManager $playerManager,
        private ParticipationManager $participationManager,
        private ValidatorInterface $validator,
        private ValidationHelper $validationHelper,
        private EntityManagerInterface $entityManager,
        private RefereeNotifier $refereeNotifier,
    ) {
    }

    /**
     * Gère la validation et l'instanciation complète d'une compétition.
     */
    public function handleCreation(array $data, User $user): array
    {
        try {
            $startDate = new \DateTimeImmutable($data['start_date'] ?? 'now');
            $endDate = isset($data['end_date']) ? new \DateTimeImmutable($data['end_date']) : null;
        } catch (\Exception $e) {
            return ['violations' => [['propertyPath' => 'start_date', 'message' => ErrorMessages::INVALID_DATE_FORMAT]]];
        }

        $competition = new Competition();
        $competition->setName($data['name'] ?? 'Nouvelle compétition');
        $competition->setStartDate($startDate);
        $competition->setEndDate($endDate);
        $competition->setFogOfWar($data['fog_of_war'] ?? true);
        $competition->setCreatedBy($user);

        if ($data['is_creator_referee'] ?? true) {
            if ($user->getPlayer()) {
                $competition->addReferee($user->getPlayer());
            }
        }

        if (null !== ($data['join_code'] ?? null)) {
            $competition->setJoinCode(strtoupper(trim($data['join_code'])));
        } else {
            $competition->setJoinCode($this->generateSafeJoinCode());
        }

        $errors = $this->validator->validate($competition);
        if (\count($errors) > 0) {
            return ['violations' => $this->validationHelper->formatErrors($errors)];
        }

        $this->entityManager->persist($competition);

        if ($data['participate'] ?? false) {
            $player = $user->getPlayer();
            if ($player) {
                $this->participationManager->joinCompetition($player, $competition);
            }
        }

        return ['competition' => $competition];
    }

    /**
     * Traite en bloc l'ajout des participants (existants et nouveaux) et des arbitres.
     */
    public function handlePlayersAndRefereesBatch(Competition $competition, array $data, User $currentUser): array
    {
        $successes = [];
        $errors = [];

        $existingPlayersIds = $data['existing_players_ids'] ?? [];
        $newPlayersNames = $data['new_players'] ?? [];
        $existingRefereesIds = $data['existing_referees_ids'] ?? [];
        $newRefereesNames = $data['new_referees'] ?? [];

        $createdPlayersByName = [];

        // 1. Joueurs existants
        if (!empty($existingPlayersIds)) {
            $players = $this->playerRepository->findBy(['id' => $existingPlayersIds]);
            $playersById = [];
            foreach ($players as $player) {
                $playersById[(string) $player->getId()] = $player;
            }

            foreach ($existingPlayersIds as $id) {
                $idStr = (string) $id;
                if (!isset($playersById[$idStr])) {
                    $errors[] = ['id' => $id, 'message' => ErrorMessages::PLAYER_NOT_FOUND];
                    continue;
                }

                $currentPlayer = $playersById[$idStr];
                $isAlreadyIn = $this->participationRepository->findOneBy(['competition' => $competition, 'player' => $currentPlayer]);

                if ($isAlreadyIn) {
                    $errors[] = ['id' => $id, 'name' => $currentPlayer->getDisplayName(), 'message' => ErrorMessages::COMP_ALREADY_IN];
                } else {
                    $this->participationManager->joinCompetition($currentPlayer, $competition);
                    $successes[] = ['id' => $id, 'name' => $currentPlayer->getDisplayName()];
                }
            }
        }

        // 2. Nouveaux joueurs
        if (!empty($newPlayersNames)) {
            $batchReport = $this->playerManager->createPlayersBatch($newPlayersNames, $competition, $currentUser, true);
            foreach ($batchReport['successes'] as $success) {
                $createdPlayersByName[$success['name']] = $success['entity'];
                $successes[] = ['name' => $success['name']];
            }
            $errors = [...$errors, ...$batchReport['errors']];
        }

        // 3. Arbitres existants
        if (!empty($existingRefereesIds)) {
            $referees = $this->playerRepository->findBy(['id' => $existingRefereesIds]);
            foreach ($referees as $ref) {
                $this->addReferee($competition, $ref);
            }
        }

        // 4. Nouveaux arbitres
        if (!empty($newRefereesNames)) {
            $refereesToCreate = [];
            foreach ($newRefereesNames as $refName) {
                $trimmed = trim($refName);
                if (isset($createdPlayersByName[$trimmed])) {
                    $this->addReferee($competition, $createdPlayersByName[$trimmed]);
                } else {
                    $refereesToCreate[] = $trimmed;
                }
            }

            if (!empty($refereesToCreate)) {
                $refBatchReport = $this->playerManager->createPlayersBatch($refereesToCreate, $competition, $currentUser, false);
                foreach ($refBatchReport['successes'] as $success) {
                    $this->addReferee($competition, $success['entity']);
                    $successes[] = ['name' => $success['name'], 'info' => 'Arbitre externe ajouté'];
                }
                $errors = [...$errors, ...$refBatchReport['errors']];
            }
        }

        return [
            'summary' => [
                'total_processes' => \count($successes) + \count($errors),
                'success_count' => \count($successes),
                'error_count' => \count($errors),
            ],
            'successes' => $successes,
            'errors' => $errors,
        ];
    }

    public function addReferee(Competition $competition, \App\Entity\Player $player): void
    {
        if (!$competition->getReferees()->contains($player)) {
            $competition->addReferee($player);
            if ($competition->getId()) {
                $this->refereeNotifier->notifyRoleChanged($competition, $player, true);
            }
        }
    }

    public function removeReferee(Competition $competition, \App\Entity\Player $player): void
    {
        if (!$competition->getReferees()->contains($player)) {
            return;
        }

        if ($competition->getReferees()->count() <= 1) {
            throw new \LogicException(ErrorMessages::COMP_LAST_REFEREE);
        }

        $competition->removeReferee($player);
        $this->refereeNotifier->notifyRoleChanged($competition, $player, false);
    }

    private function generateSafeJoinCode(): string
    {
        $unique = false;
        $code = '';
        while (!$unique) {
            $code = $this->codeGenerator->generateRandomCode();
            if (!$this->competitionRepository->findOneBy(['joinCode' => $code])) {
                $unique = true;
            }
        }

        return $code;
    }

    /**
     * Applique les règles de gestion temporelles (Brouillard de guerre et Jours Bonus)
     * à appeler avant de sauvegarder une modification de la compétition.
     */
    public function enforceDateRules(Competition $competition): void
    {
        // 1. Si la compétition est terminée, on lève obligatoirement le brouillard
        if ($competition->getIsFinished()) {
            $competition->setFogOfWar(false);
        }

        // 2. Nettoyage des jours bonus hors limites
        $startStr = $competition->getStartDate()?->format('Y-m-d');
        $endStr = $competition->getEndDate()?->format('Y-m-d');

        foreach ($competition->getBonusDays() as $bonusDay) {
            $bonusDateStr = $bonusDay->getDate()->format('Y-m-d');

            $isBeforeStart = null !== $startStr && $bonusDateStr < $startStr;
            $isAfterEnd = null !== $endStr && $bonusDateStr > $endStr;

            if ($isBeforeStart || $isAfterEnd) {
                $competition->removeBonusDay($bonusDay);
                $this->entityManager->remove($bonusDay);
            }
        }
    }
}
