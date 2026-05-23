<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\Action;
use App\Entity\User;
use App\Enum\ActionStatus;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class ActionVoter extends Voter
{
    public const string EDIT = 'ACTION_EDIT';
    public const string DELETE = 'ACTION_DELETE';

    public function __construct(
        private Security $security,
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return \in_array($attribute, [self::EDIT, self::DELETE]) && $subject instanceof Action;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        /** @var Action $action */
        $action = $subject;
        $competition = $action->getCompetition();

        if (!$competition) {
            return false;
        }

        // L'arbitre / gestionnaire a tous les droits de modification sur les actions de sa compétition
        if ($this->security->isGranted(CompetitionVoter::MANAGE, $competition)) {
            return true;
        }

        // Si l'action est déjà validée ou rejetée, le joueur standard ne peut plus y toucher
        if (ActionStatus::PENDING !== $action->getStatus()) {
            return false;
        }

        // Un joueur standard ne peut modifier/supprimer un signalement EN ATTENTE que s'il en est l'auteur initial
        return $action->getCreatedBy() === $user;
    }
}
