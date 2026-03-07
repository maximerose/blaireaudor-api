<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Competition;
use App\Entity\Participation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository gérant l'accès aux données des Participations.
 * * C'est ici que sera gérée la logique d'affichage du classement (Leaderboard)
 * en filtrant les scores par compétition.
 * @extends ServiceEntityRepository<Participation>
 */
class ParticipationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Participation::class);
    }

    public function countHigherScores(Competition $competition, int $score): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('count(p.id)')
            ->where('p.competition = :competition')
            ->andWhere('p.score > :score')
            ->setParameter('competition', $competition)
            ->setParameter('score', $score)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
