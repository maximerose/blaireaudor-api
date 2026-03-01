<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Competition;
use App\Repository\CompetitionRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Service de gestion du cycle de vie des compétitions.
 * * Responsable de l'instanciation des compétitions et de la garantie
 * d'unicité des codes d'accès (joinCode).
 */
class CompetitionManager
{
    public function __construct(
        private CompetitionRepository $competitionRepository,
        private CodeGenerator $codeGenerator,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Crée une nouvelle compétition avec les paramètres fournis.
     * * Si aucun code d'invitation n'est fourni, un code sécurisé et unique
     * est automatiquement généré.
     */
    public function createCompetition(string $name, \DateTimeImmutable $startDate, ?\DateTimeImmutable $endDate, ?string $customJoinCode = null): Competition
    {
        $competition = new Competition();

        $competition->setName($name);
        $competition->setStartDate($startDate);
        $competition->setEndDate($endDate ?? null);

        if ($customJoinCode !== null) {
            $competition->setJoinCode(strtoupper(trim($customJoinCode)));
        } else {
            $competition->setJoinCode($this->generateSafeJoinCode());
        }

        $this->entityManager->persist($competition);

        return $competition;
    }

    /**
     * Génère un code d'invitation unique.
     * * Boucle jusqu'à trouver un code qui n'existe pas encore en base de données
     * pour éviter les collisions.
     */
    private function generateSafeJoinCode(): string
    {
        $unique = false;
        $code = '';

        while (!$unique) {
            $code = $this->codeGenerator->generateRandomCode();

            if (!$this->competitionRepository->findOneBy(['joinCode' => $code])) {
                $unique = true;
            }
        }

        return $code;
    }
}
