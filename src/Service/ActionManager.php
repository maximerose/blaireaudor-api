<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use App\Enum\ActionStatus;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;

/**
 * Service de gestion des actions de jeu.
 * * Centralise la logique de création des actions et applique les règles métier
 * liées au statut (auto-validation par l'arbitre).
 */
final class ActionManager
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    /**
     * Crée et persiste une nouvelle Action à partir des données de la requête.
     * @param Competition $competition La compétition concernée.
     * @param User $author L'utilisateur qui tente de créer l'action.
     * @param array $data Les données (description, points, IRI du joueur).
     * @throws InvalidArgumentException Si le joueur spécifié est introuvable.
     * @return Action L'entité Action créée et persistée.
     */
    public function createActionFromPayload(Competition $competition, User $author, array $data): Action
    {
        $playerId = basename($data['player']);
        $player = $this->entityManager->getRepository(Player::class)->find($playerId);

        if (!$player) {
            throw new InvalidArgumentException('Le joueur n\'existe pas');
        }

        $action = new Action();
        $action->setDescription($data['description']);
        $action->setPoints((int) $data['points']);
        $action->setPlayer($player);
        $action->setCompetition($competition);

        if ($competition->getCreatedBy() === $author) {
            $action->setStatus(ActionStatus::VALIDATED);
        } else {
            $action->setStatus(ActionStatus::PENDING);
        }

        $this->entityManager->persist($action);

        return $action;
    }
}
