<?php

namespace App\Security\Voter;

use App\Entity\Competition;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class ActionVoter extends Voter
{
    public const CREATE = 'ACTION_CREATE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $attribute === self::CREATE && $subject instanceof Competition;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) return false;

        /** @var Competition $competition */
        $competition = $subject;

        // Cas 1 : C'est l'arbitre (le créateur de la compétition)
        if ($competition->getCreatedBy() === $user) return true;

        // Cas 2 : C'est un participant
        return $competition->getParticipations()->exists(fn($key, $participation) => $participation->getPlayer()->getAssociatedUser() === $user);
    }
}
