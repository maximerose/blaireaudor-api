<?php

namespace App\Repository;

use App\Entity\Competition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Competition>
 */
class CompetitionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Competition::class);
    }

    public function findByCodeWithAllPlayers(string $code): ?Competition
    {
        return $this->createQueryBuilder('c')
            ->addSelect('p', 'pl', 'u')
            ->leftJoin('c.participations', 'p')
            ->leftJoin('p.player', 'pl')
            ->leftJoin('pl.associatedUser', 'u')
            ->where('c.joinCode = :code')
            ->setParameter('code', $code)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
