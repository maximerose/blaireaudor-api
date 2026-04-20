<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Action;
use App\Entity\Competition;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repository gérant l'accès aux données des Actions de jeu.
 * * Contient les méthodes de récupération personnalisées pour les statistiques
 * et les historiques d'actions par joueur ou compétition.
 * @extends ServiceEntityRepository<Action>
 */
class ActionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Action::class);
    }

    public function findByCompetition(Competition $competition, string $sortBy = 'dateAction', string $order = 'DESC'): array
    {
        $allowedFields = ['dateAction', 'points', 'player'];
        $sortBy = in_array($sortBy, $allowedFields) ? "a.$sortBy" : 'a.dateAction';
        $order = strtoupper($order) === 'ASC' ? 'ASC' : 'DESC';

        return $this->createQueryBuilder('a')
            ->join('a.player', 'p')
            ->addSelect('p')
            ->where('a.competition = :comp')
            ->setParameter('comp', $competition)
            ->orderBy($sortBy, $order)
            ->getQuery()
            ->getResult();
    }
}
