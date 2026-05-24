<?php

declare(strict_types=1);

namespace App\Service\Manager;

use App\Constants\ErrorMessages;
use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\User;
use App\Enum\ActionStatus;
use App\Repository\ActionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

/**
 * Service de gestion des actions de jeu.
 * * Centralise la logique de création des actions et applique les règles métier
 * liées au statut (auto-validation par l'arbitre).
 */
class ActionManager
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ActionRepository $actionRepository,
    ) {
    }

    /**
     * Crée et persiste une nouvelle Action à partir des données de la requête.
     *
     * @param User $author L'utilisateur qui tente de créer l'action
     * @param array $data les données (description, points, IRI du joueur)
     *
     * @return Action L'entité Action créée et persistée
     *
     * @throws \InvalidArgumentException si le joueur spécifié est introuvable
     */
    public function createActionFromPayload(Competition $competition, User $author, array $data): Action
    {
        if (!isset($data['player'], $data['description'], $data['points'], $data['date_action'])) {
            throw new \InvalidArgumentException(ErrorMessages::MISSING_DATA);
        }

        $playerId = basename((string) $data['player']);

        if (!Uuid::isValid($playerId)) {
            throw new \InvalidArgumentException(ErrorMessages::PLAYER_NOT_FOUND);
        }

        $participation = $this->entityManager->getRepository(Participation::class)->findOneBy([
            'player' => $playerId,
            'competition' => $competition,
        ]);

        if (!$participation) {
            throw new \InvalidArgumentException(ErrorMessages::ACTION_PLAYER_NOT_FOUND);
        }

        $action = new Action();
        $action->setDescription($data['description']);
        $action->setPoints((int) $data['points']);
        $action->setParticipation($participation);

        try {
            $action->setDateAction(new \DateTimeImmutable($data['date_action']));
        } catch (\Exception $e) {
            throw new \InvalidArgumentException(ErrorMessages::INVALID_DATE_FORMAT);
        }

        $canAutoValidate = $this->canAutoValidate($competition, $author);
        $action->setStatus($canAutoValidate ? ActionStatus::VALIDATED : ActionStatus::PENDING);

        $this->entityManager->persist($action);

        return $action;
    }

    public function updateScore(Action $action): void
    {
        $participation = $action->getParticipation();
        if (!$participation) {
            return;
        }

        $this->actionRepository->recalculateParticipationScore($participation);
    }

    public function updateAllCompetitionScores(Competition $competition): void
    {
        $this->actionRepository->updateAllScoresForCompetition($competition);
    }

    public function canAutoValidate(Competition $competition, User $user): bool
    {
        $player = $user->getPlayer();

        $isCreator = $competition->getCreatedBy() === $user;
        $isReferee = $competition->getReferees()->contains($player);

        return $isCreator || $isReferee;
    }
}
