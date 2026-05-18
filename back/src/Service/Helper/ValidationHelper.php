<?php

declare(strict_types=1);

namespace App\Service\Helper;

use Symfony\Component\Validator\ConstraintViolationListInterface;

/**
 * Service utilitaire pour la gestion des erreurs de validation.
 * * Standardise le format des violations de contraintes pour les rendre
 * facilement exploitables par les réponses API (JSON).
 */
class ValidationHelper
{
    /**
     * Convertit une liste de violations en un tableau associatif simple.
     *
     * @param ConstraintViolationListInterface $violations la liste brute de Symfony
     *
     * @return array<string, string> un tableau au format ['champ' => 'message d'erreur']
     */
    public function formatErrors(ConstraintViolationListInterface $violations): array
    {
        $formattedErrors = [];

        foreach ($violations as $violation) {
            $formattedErrors[] = [
                'propertyPath' => $violation->getPropertyPath(),
                'message' => $violation->getMessage(),
            ];
        }

        return $formattedErrors;
    }
}
