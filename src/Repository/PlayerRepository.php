<?php

namespace App\Repository;

use App\Entity\Player;
use App\Repository\Trait\CollisionCheckTrait;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Player>
 */
class PlayerRepository extends ServiceEntityRepository
{
    use CollisionCheckTrait;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Player::class);
    }
}
