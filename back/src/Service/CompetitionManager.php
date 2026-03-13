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
     * Prépare une instance de compétition avant sa persistance.
     * Cette méthode centralise la logique de configuration initiale, notamment
     * la génération ou l'assignation du code d'accès unique.
     *
     * @param Competition $competition     L'instance de compétition à configurer.
     * @param string|null $customJoinCode  Un code personnalisé optionnel (sera nettoyé et passé en majuscules).
     * @return void
     */
    public function prepare(Competition $competition, ?string $customJoinCode = null): void
    {
        if ($customJoinCode !== null) {
            $competition->setJoinCode(strtoupper(trim($customJoinCode)));
        } else {
            $competition->setJoinCode($this->generateSafeJoinCode());
        }
    }

    /**
     * Crée une nouvelle compétition avec les paramètres fournis.
     * * Si aucun code d'invitation n'est fourni, un code sécurisé et unique
     * est automatiquement généré.
     */
    public function createCompetition(string $name, \DateTimeImmutable $startDate, ?\DateTimeImmutable $endDate = null, ?string $customJoinCode = null, ?bool $fogOfWar = false): Competition
    {
        $competition = new Competition();

        $competition->setName($name);
        $competition->setStartDate($startDate);
        $competition->setEndDate($endDate);
        $competition->setFogOfWar($fogOfWar);

        $this->prepare($competition, $customJoinCode);

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
