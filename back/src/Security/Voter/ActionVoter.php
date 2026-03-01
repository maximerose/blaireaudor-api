<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\Competition;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * Voter de sécurité pour les actions de jeu.
 * * Détermine si un utilisateur a le droit de créer une action au sein d'une compétition.
 * Le droit est accordé si l'utilisateur est soit l'arbitre (créateur), 
 * soit un participant actif.
 */
final class ActionVoter extends Voter
{
    public const CREATE = 'ACTION_CREATE';

    /**
     * Vérifie si le voter doit intervenir.
     * * Intervient uniquement pour l'attribut 'ACTION_CREATE' sur un objet 'Competition'.
     */
    protected function supports(string $attribute, mixed $subject): bool
    {
        return $attribute === self::CREATE && $subject instanceof Competition;
    }

    /**
     * Logique de décision du droit de création.
     * @param Competition $subject La compétition concernée.
     * @return bool True si l'utilisateur est le créateur ou un participant inscrit.
     */
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
