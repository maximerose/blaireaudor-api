<?php

namespace App\EventListener;

use App\Entity\Competition;
use App\Repository\CompetitionRepository;
use App\Trait\SluggerTrait;
use App\Service\UniqueValueGenerator;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsEntityListener(event: Events::prePersist, entity: Competition::class)]
class CompetitionListener
{
    use SluggerTrait;

    public function __construct(
        private UniqueValueGenerator $uniqueValueGenerator,
        private CompetitionRepository $competitionRepository
    ) {}
    
    public function prePersist(Competition $competition, PrePersistEventArgs $event): void
    {
        if (null === $competition->getSlug() && null !== $competition->getName()) {
            $baseSlugs = $this->uniqueValueGenerator->prepareBaseSlugs([$competition->getName()]);
            $existing = $this->competitionRepository->findPotentialCollisions($baseSlugs, 'slug');

            $competition->setSlug($this->uniqueValueGenerator->generateUniqueValue($competition->getName(), $existing));
        }

        if (null === $competition->getJoinCode()) {
            $this->generateUniqueJoinCode($competition);
        }
    }

    private function generateUniqueJoinCode(Competition $competition): void
    {
        $unique = false;
        $code = '';

        while (!$unique) {
            $code = $this->uniqueValueGenerator->generateRandomCode();
            
            if (!$this->competitionRepository->findOneBy(['joinCode' => $code])) {
                $competition->setJoinCode($code);
                $unique = true;
            }
        }
    }
}
