<?php

declare(strict_types=1);

namespace App\Service\Helper;

/**
 * Service utilitaire de génération de codes aléatoires.
 * * Utilisé principalement pour générer les codes d'invitation (joinCode)
 * uniques des compétitions.
 */
class CodeGenerator
{
    private const string ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

    /**
     * Génère un code alphanumérique lisible.
     * * On exclut les caractères ambigus : 0, O, I, 1, L.
     *
     * @param int $length la longueur du code souhaitée (défaut: 6)
     *
     * @return string le code généré en majuscules
     */
    public function generateRandomCode(int $length = 6): string
    {
        $code = '';
        $max = \strlen(self::ALPHABET) - 1;

        for ($i = 0; $i < $length; ++$i) {
            $code .= self::ALPHABET[random_int(0, $max)];
        }

        return $code;
    }
}
