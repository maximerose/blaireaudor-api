<?php

declare(strict_types=1);

namespace App\Service;

/**
 * Service utilitaire de génération de codes aléatoires.
 * * Utilisé principalement pour générer les codes d'invitation (joinCode)
 * uniques des compétitions.
 */
class CodeGenerator
{
    /**
     * Génère une chaîne de caractères aléatoire et alphanumérique.
     * * Utilise random_bytes() pour une sécurité cryptographique, garantissant
     * que les codes ne sont pas prévisibles par les joueurs.
     * @param int $length La longueur du code souhaitée (défaut: 6).
     * @return string Le code généré en majuscules.
     */
    public function generateRandomCode(int $length = 6): string
    {
        return strtoupper(substr(bin2hex(random_bytes($length)), 0, $length));
    }
}
