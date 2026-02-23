<?php

namespace App\EventListener;

use App\Entity\Competition;
use App\Repository\CompetitionRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsEntityListener(event: Events::prePersist, entity: Competition::class)]
class CompetitionListener
{
    public function __construct(
        private SluggerInterface $slugger,
        private CompetitionRepository $competitionRepository
    ) {}
    
    public function prePersist(Competition $competition, PrePersistEventArgs $event): void
    {
        if ($competition->getSlug() === null) {
            $this->generateUniqueSlug($competition);
        }

        if ($competition->getJoinCode() === null) {
            $this->generateUniqueJoinCode($competition);
        }
    }

    private function generateUniqueSlug(Competition $competition): void 
    {
        $name = $competition->getName();
    
        if (empty($name)) {
            return;
        }

        $baseSlug = strtolower($this->slugger->slug($name)->toString());
        $slug = $baseSlug;
        $i = 1;

        // Tant qu'un Player possède déjà ce username, on cherche le suivant
        while ($this->competitionRepository->findOneBy(['slug' => $slug])) {
            $slug = $baseSlug . '-' . $i;
            $i++;
        }

        $competition->setSlug($slug);
    }

    private function generateUniqueJoinCode(Competition $competition): void
    {
        $unique = false;
        $code = '';

        while (!$unique) {
            $code = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));

            $existing = $this->competitionRepository->findOneBy(['joinCode' => $code]);
            
            if (!$existing) {
                $unique = true;
            }
        }

        $competition->setJoinCode($code);
    }
}