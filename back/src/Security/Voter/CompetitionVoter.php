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
            $vote?->addReason('Vous devez être connecté pour gérer cette compétition.');

            return false;
        }

        /** @var Competition $competition */
        $competition = $subject;

        $canManage = match ($attribute) {
            self::MANAGE => $this->canManage($competition, $user),
            default => false,
        };

        if (!$canManage) {
            $vote?->addReason('Seul un arbitre ou le créateur de la compétition peut effectuer cette action.');
        }

        return $canManage;
    }

    private function canManage(Competition $competition, User $user): bool
    {
        // 1. Le créateur originel a toujours tous les droits
        if ($competition->getCreatedBy() === $user) {
            return true;
        }

        // 2. Un arbitre nommé a également les droits
        $player = $user->getPlayer();
        if ($player && $competition->getReferees()->contains($player)) {
            return true;
        }

        return false;
    }
}
