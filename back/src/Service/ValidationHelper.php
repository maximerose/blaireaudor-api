<?php

declare(strict_types=1);

namespace App\Service;

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
     * @param ConstraintViolationListInterface $violations La liste brute de Symfony.
     * @return array<string, string> Un tableau au format ['champ' => 'message d'erreur'].
     */
    public function formatErrors(ConstraintViolationListInterface $violations): array
    {
        $errors = [];

        foreach ($violations as $violation) {
            $errors[$violation->getPropertyPath()] = $violation->getMessage();
        }

        return $errors;
    }
}
