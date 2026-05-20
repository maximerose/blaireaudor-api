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
    public const string MANAGE = 'COMPETITION_MANAGE';
    public const string CREATOR = 'COMPETITION_CREATOR';
    public const string REFEREE = 'COMPETITION_REFEREE';
    public const string PLAYER = 'COMPETITION_PLAYER';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return \in_array($attribute, [self::MANAGE, self::CREATOR, self::REFEREE, self::PLAYER])
               && $subject instanceof Competition;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            error_log('!user instanceof User');
            $vote?->addReason('Vous devez être connecté.');

            return false;
        }

        $player = $user->getPlayer();

        /** @var Competition $competition */
        $competition = $subject;

        $isCreator = $competition->getCreatedBy() === $user;
        $isReferee = $player && $competition->getReferees()->contains($player);
        $isPlayer = $player && $competition->getParticipations()->exists(
            fn ($k, $p) => $p->getPlayer() === $player
        );

        return match ($attribute) {
            self::CREATOR => $isCreator,
            self::REFEREE => $isReferee,
            self::PLAYER => $isPlayer,
            self::MANAGE => $isCreator || $isReferee,
            default => false,
        };
    }
}
