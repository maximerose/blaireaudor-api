<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Competition;
use App\Entity\Participation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ParticipationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Participation::class);
    }

    public function countDistinctHigherScores(Competition $competition, int $score): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('count(DISTINCT p.score)')
            ->where('p.competition = :competition')
            ->andWhere('p.score > :score')
            ->setParameter('competition', $competition->getId(), 'uuid') // <-- ICI
            ->setParameter('score', $score)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findLeaderboard(Competition $competition): array
    {
        $results = $this->createQueryBuilder('p')
            ->select('p', 'player', 'user', 'actions')
            ->join('p.player', 'player')
            ->leftJoin('player.associatedUser', 'user')
            ->leftJoin('p.actions', 'actions')
            ->where('p.competition = :competition')
            ->setParameter('competition', $competition->getId(), 'uuid') // <-- ET ICI
            ->orderBy('p.score', 'DESC')
            ->addOrderBy('player.slug', 'ASC')
            ->getQuery()
            ->getResult();

        $currentRank = 0;
        $lastScore = null;

        foreach ($results as $participation) {
            if ($participation->getScore() !== $lastScore) {
                ++$currentRank;
                $lastScore = $participation->getScore();
            }
            $participation->setRank($currentRank);
        }

        return $results;
    }
}
