<?php

declare(strict_types=1);

namespace App\Service\Manager;

use App\Constants\ErrorMessages;
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

    public function merge(Player $guestPlayer, User $realUser): void
    {
        $this->entityManager->wrapInTransaction(function () use ($guestPlayer, $realUser) {
            $realPlayer = $realUser->getPlayer();
            if (!$realPlayer) {
                throw new \LogicException(ErrorMessages::REAL_PLAYER_NOT_FOUND);
            }

            $guestPlayer->setUsername('deleted-guest-'.uniqid('', true));
            $this->entityManager->persist($guestPlayer);
            $this->entityManager->flush();

            $affectedCompetitions = [];

            // 1. Transférer le rôle d'arbitre sur toutes les arènes
            foreach ($guestPlayer->getRefereedCompetitions() as $competition) {
                $competition->removeReferee($guestPlayer);
                $competition->addReferee($realPlayer);
            }

            // 2. Transférer TOUTES les participations et les actions
            $participations = $guestPlayer->getParticipations()->toArray();

            foreach ($participations as $guestParticipation) {
                $competition = $guestParticipation->getCompetition();
                if ($competition) {
                    $affectedCompetitions[$competition->getId()->toString()] = $competition;
                }

                $realParticipation = $this->participationRepository->findOneBy([
                    'competition' => $competition,
                    'player' => $realPlayer,
                ]);

                // Transfert chirurgical des actions
                if ($realParticipation) {
                    foreach ($guestParticipation->getActions() as $action) {
                        $action->setParticipation($realParticipation);
                        if (null === $action->getCreatedBy()) {
                            $action->setCreatedBy($realUser);
                        }
                        $this->entityManager->persist($action);
                    }
                    $guestParticipation->getActions()->clear();
                    $this->entityManager->remove($guestParticipation);
                } else {
                    $guestParticipation->setPlayer($realPlayer);
                    $this->entityManager->persist($guestParticipation);
                }
            }

            // 3. Réattribution des signalements créés (si le fantôme avait un User qu'on écrase)
            $guestUser = $guestPlayer->getAssociatedUser();
            if ($guestUser && $guestUser !== $realUser) {
                $actionsCreatedByGuest = $this->actionRepository->findBy(['createdBy' => $guestUser]);
                foreach ($actionsCreatedByGuest as $action) {
                    $action->setCreatedBy($realUser);
                    $this->entityManager->persist($action);
                }
                $guestPlayer->setAssociatedUser(null);
                $this->entityManager->remove($guestUser);
            }

            // 4. Nettoyage final : Suppression du profil fantôme libéré de ses contraintes
            $guestPlayer->setAssociatedUser(null);
            $this->entityManager->remove($guestPlayer);

            $this->entityManager->flush();

            // 5. Recalcul final des scores
            foreach ($affectedCompetitions as $comp) {
                $this->actionRepository->updateAllScoresForCompetition($comp);
            }
        });
    }
}
