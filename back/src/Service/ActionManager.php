<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\User;
use App\Enum\ActionStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Uid\Uuid;

/**
 * Service de gestion des actions de jeu.
 * * Centralise la logique de création des actions et applique les règles métier
 * liées au statut (auto-validation par l'arbitre).
 */
final class ActionManager
{
    public function __construct(
        private EntityManagerInterface $entityManager,
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
            throw new \InvalidArgumentException('Données incomplètes pour créer l\'action.');
        }

        $playerId = basename((string) $data['player']);

        if (!Uuid::isValid($playerId)) {
            throw new \InvalidArgumentException('Le joueur ne participe pas à cette compétition.');
        }

        $participation = $this->entityManager->getRepository(Participation::class)->findOneBy([
            'player' => $playerId,
            'competition' => $competition,
        ]);

        if (!$participation) {
            throw new \InvalidArgumentException('Le joueur ne participe pas à cette compétition.');
        }

        $action = new Action();
        $action->setDescription($data['description']);
        $action->setPoints((int) $data['points']);
        $action->setParticipation($participation);

        try {
            $action->setDateAction(new \DateTimeImmutable($data['date_action']));
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Format de date invalide.');
        }

        $isAdmin = $competition->getCreatedBy() === $author;
        $action->setStatus($isAdmin ? ActionStatus::VALIDATED : ActionStatus::PENDING);

        $this->entityManager->persist($action);

        return $action;
    }

    public function updateScore(Participation $participation): void
    {
        $repo = $this->entityManager->getRepository(Action::class);
        $newScore = $repo->getCalculatedScore($participation);

        $participation->setScore($newScore);

        $this->entityManager->persist($participation);
    }

    public function updateAllCompetitionScores(Competition $competition): void
    {
        $repo = $this->entityManager->getRepository(Action::class);

        $repo->updateAllScoresForCompetition($competition);

        $this->entityManager->clear();
    }
}
