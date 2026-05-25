<?php

declare(strict_types=1);

namespace App\Service\Manager;

use App\Constants\ErrorMessages;
use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use App\Repository\ActionRepository;
use App\Repository\ParticipationRepository;
use Doctrine\ORM\EntityManagerInterface;

class PlayerMerger
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ActionRepository $actionRepository,
        private readonly ParticipationRepository $participationRepository,
    ) {
    }

    public function merge(Competition $competition, Player $guestPlayer, User $realUser): void
    {
        $this->entityManager->wrapInTransaction(function () use ($competition, $guestPlayer, $realUser) {
            // 1. Récupération de la participation de l'invité
            $guestParticipation = $this->participationRepository->findOneBy([
                'competition' => $competition,
                'player' => $guestPlayer,
            ]);

            if (!$guestParticipation) {
                throw new \InvalidArgumentException(ErrorMessages::GUEST_PART_NOT_FOUND);
            }

            $realPlayer = $realUser->getPlayer();
            if (!$realPlayer) {
                throw new \LogicException(ErrorMessages::REAL_PLAYER_NOT_FOUND);
            }

            $realParticipation = $this->participationRepository->findOneBy([
                'competition' => $competition,
                'player' => $realPlayer,
            ]);

            // 2. Transfert chirurgical des actions
            if ($realParticipation) {
                foreach ($guestParticipation->getActions() as $action) {
                    $action->setParticipation($realParticipation);

                    // Sécurité anti-dossier vide : si l'action n'avait pas de créateur (fixtures),
                    // on lui attribue l'utilisateur réel pour éviter les crashs de listeners
                    if (null === $action->getCreatedBy()) {
                        $action->setCreatedBy($realUser);
                    }
                }

                // On vide la collection avant de supprimer pour couper les liaisons suspectes
                $guestParticipation->getActions()->clear();
                $this->entityManager->remove($guestParticipation);
            } else {
                $guestParticipation->setPlayer($realPlayer);
                $realParticipation = $guestParticipation;
            }

            // 3. Réattribution des signalements créés par le compte invité s'il en avait un
            $guestUser = $guestPlayer->getAssociatedUser();
            if ($guestUser && $guestUser !== $realUser) {
                $actionsCreatedByGuest = $this->actionRepository->findBy(['createdBy' => $guestUser]);
                foreach ($actionsCreatedByGuest as $action) {
                    $action->setCreatedBy($realUser);
                }
                $this->entityManager->remove($guestUser);
            }

            $this->entityManager->flush();

            // 4. Nettoyage final : Suppression du profil fantôme désormais isolé et sans liaisons
            $guestPlayer->setAssociatedUser(null);
            $this->entityManager->remove($guestPlayer);

            $this->entityManager->flush();

            // 5. Recalcul final du score de l'arène
            $this->actionRepository->recalculateParticipationScore($realParticipation);
        });
    }
}
