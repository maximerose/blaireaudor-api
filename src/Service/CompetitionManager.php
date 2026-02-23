<?php

namespace App\Service;

use App\Entity\Competition;
use App\Entity\User;
use App\Repository\CompetitionRepository;
use Doctrine\ORM\EntityManagerInterface;

class CompetitionManager
{
    public function __construct(
        private CompetitionRepository $competitionRepository,
        private UniqueValueGenerator $uniqueValueGenerator,
        private EntityManagerInterface $entityManager
    ) {}

    public function createCompetition(string $name, \DateTimeImmutable $startDate, User $creator, ?string $customJoinCode = null): Competition
    {
        $competition = new Competition();
        $competition->setName($name);
        $competition->setStartDate($startDate);

        $baseSlugs = $this->uniqueValueGenerator->prepareBaseSlugs([$name]);
        $existingSlugs = $this->competitionRepository->findPotentialCollisions($baseSlugs, 'slug');
        $finalSlug = $this->uniqueValueGenerator->generateUniqueValue($name, $existingSlugs);
        $competition->setSlug($finalSlug);

        if ($customJoinCode !== null) {
            $existing = $this->competitionRepository->findOneBy(['joinCode' => $customJoinCode]);
            
            if ($existing) {
                throw new \Exception('Ce code est déjà utilisé');
            }

            $competition->setJoinCode($customJoinCode);
        } else {
            $competition->setJoinCode($this->generateSafeJoinCode());
        }

        $this->entityManager->persist($competition);
        $this->entityManager->flush();

        return $competition;
    }

    private function generateSafeJoinCode(): string
    {
        $unique = false;
        $code = '';

        while (!$unique) {
            $code = $this->uniqueValueGenerator->generateRandomCode();
            
            if (!$this->competitionRepository->findOneBy(['joinCode' => $code])) {
                $unique = true;
            }
        }
        
        return $code;
    }
}
