<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\Competition;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class CompetitionVoter extends Voter
{
    public const MANAGE = 'MANAGE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return self::MANAGE === $attribute && $subject instanceof Competition;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            $vote?->addReason('Vous devez être connecté.');

            return false;
        }

        $player = $user->getPlayer();
        if (!$player) {
            $vote?->addReason('Vous devez être lié à un joueur.');

            return false;
        }

        /** @var Competition $competition */
        $competition = $subject;

        if ($competition->getReferees()->contains($player)) {
            return true;
        }

        return $competition->getParticipations()->exists(
            fn ($key, $participation) => $participation->getPlayer() === $player
        );
    }
}
