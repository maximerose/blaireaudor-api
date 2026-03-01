<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Competition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository gérant l'accès aux données des Compétitions.
 * @extends ServiceEntityRepository<Competition>
 */
class CompetitionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Competition::class);
    }

    /**
     * Récupère une compétition par son code avec toutes ses relations chargées.
     * * Optimisation : Utilise des jointures (Eager Loading) pour récupérer en une
     * seule requête SQL : la compétition, les participations, les profils joueurs
     * et les comptes utilisateurs associés.
     * @param string $code Le code d'invitation (joinCode).
     * @return Competition|null
     */
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
