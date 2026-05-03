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
 *
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
        $sortMap = [
            'dateAction' => 'a.dateAction',
            'points' => 'a.points',
            'player' => 'p.displayName',
        ];

        $sortField = $sortMap[$sortBy] ?? 'a.dateAction';
        $order = 'ASC' === strtoupper($order) ? 'ASC' : 'DESC';

        return $this->createQueryBuilder('a')
        ->join('a.participation', 'part')
        ->join('part.player', 'p')
        ->addSelect('part', 'p')
        ->where('part.competition = :comp')
        ->setParameter('comp', $competition)
        ->orderBy($sortField, $order)
        ->getQuery()
        ->getResult();
    }
}
