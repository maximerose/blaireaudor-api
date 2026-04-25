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
    private const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    /**
     * Génère un code alphanumérique lisible.
     * * On exclut les caractères ambigus : 0, O, I, 1, L.
     * @param int $length La longueur du code souhaitée (défaut: 6).
     * @return string Le code généré en majuscules.
     */
    public function generateRandomCode(int $length = 6): string
    {
        $code = '';
        $max = strlen(self::ALPHABET) - 1;

        for ($i = 0; $i < $length; $i++) {
            $code .= self::ALPHABET[random_int(0, $max)];
        }

        return $code;
    }
}
