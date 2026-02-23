<?php

namespace App\Repository;

use App\Entity\Competition;
use App\Repository\Trait\CollisionCheckTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Competition>
 */
class CompetitionRepository extends ServiceEntityRepository
{
    use CollisionCheckTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Competition::class);
    }
}
