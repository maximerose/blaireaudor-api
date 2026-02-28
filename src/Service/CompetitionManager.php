<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Competition;
use App\Repository\CompetitionRepository;
use Doctrine\ORM\EntityManagerInterface;

class CompetitionManager
{
    public function __construct(
        private CompetitionRepository $competitionRepository,
        private CodeGenerator $codeGenerator,
        private EntityManagerInterface $entityManager
    ) {}

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
