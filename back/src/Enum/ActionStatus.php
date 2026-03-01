<?php

declare(strict_types=1);

namespace App\Enum;

/**
 * Représente les différents états possibles d'une action de jeu.
 * * PENDING : L'action vient d'être créée, les points ne sont pas encore comptabilisés.
 * * VALIDATED : L'action est confirmée par un admin, les points sont ajoutés au score.
 * * REJECTED : L'action est contestée ou invalide, elle ne rapporte rien.
 */
enum ActionStatus: string
{
    case PENDING = 'pending';
    case VALIDATED = 'validated';
    case REJECTED = 'rejected';

    /**
     * Retourne la version lisible du statut pour l'affichage (Front-end ou Back-office).
     */
    public function getLabel(): string
    {
        return match($this) {
            self::PENDING => 'En attente',
            self::VALIDATED => 'Validée',
            self::REJECTED => 'Refusée',
        };
    }
}
