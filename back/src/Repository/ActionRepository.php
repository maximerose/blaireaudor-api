<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Participation;
use App\Enum\ActionStatus;
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

    public function findByCompetition(
        Competition $competition,
        string $sortBy = 'dateAction',
        string $order = 'DESC',
        ?int $limit = null,
        ?int $offset = null,
        ?string $date = null,
    ): array {
        $sortMap = [
            'dateAction' => 'a.dateAction',
            'points' => 'a.points',
            'player' => 'p.displayName',
        ];

        $sortField = $sortMap[$sortBy] ?? 'a.dateAction';
        $order = 'ASC' === strtoupper($order) ? 'ASC' : 'DESC';

        $qb = $this->createQueryBuilder('a')
        ->join('a.participation', 'part')
        ->join('part.player', 'p')
        ->leftJoin('p.associatedUser', 'u')
        ->addSelect('part', 'p', 'u')
        ->where('part.competition = :comp')
        ->setParameter('comp', $competition);

        if ($date) {
            $tz = new \DateTimeZone('Europe/Paris');
            $startDate = new \DateTimeImmutable($date.' 00:00:00', $tz);
            $endDate = new \DateTimeImmutable($date.' 23:59:59', $tz);
            $qb->andWhere('a.dateAction BETWEEN :start AND :end')
               ->setParameter('start', $startDate)
               ->setParameter('end', $endDate);
        }

        $qb->orderBy($sortField, $order);

        if (null !== $limit) {
            $qb->setMaxResults($limit);
        }
        if (null !== $offset) {
            $qb->setFirstResult($offset);
        }

        return $qb->getQuery()->getResult();
    }

    public function countByCompetition(Competition $competition, ?string $date = null): int
    {
        $qb = $this->createQueryBuilder('a')
        ->select('COUNT(a.id)')
        ->join('a.participation', 'p')
        ->where('p.competition = :comp')
        ->setParameter('comp', $competition);

        if ($date) {
            $tz = new \DateTimeZone('Europe/Paris');
            $startDate = new \DateTimeImmutable($date.' 00:00:00', $tz);
            $endDate = new \DateTimeImmutable($date.' 23:59:59', $tz);
            $qb->andWhere('a.dateAction BETWEEN :start AND :end')
            ->setParameter('start', $startDate)
            ->setParameter('end', $endDate);
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function countPendingByCompetition(Competition $competition): int
    {
        return (int) $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->join('a.participation', 'p')
            ->where('p.competition = :comp')
            ->andWhere('a.status = :status')
            ->setParameter('comp', $competition)
            ->setParameter('status', ActionStatus::PENDING)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function incrementParticipationScoreSql(Participation $participation, int $basePoints, \DateTimeInterface $dateAction): void
    {
        $conn = $this->getEntityManager()->getConnection();

        // 1. On cherche le multiplicateur pour la date de l'action
        $sqlBonus = 'SELECT multiplier FROM bonus_day WHERE competition_id = :comp_id AND date = :date LIMIT 1';
        $multiplier = $conn->fetchOne($sqlBonus, [
            'comp_id' => $participation->getCompetition()->getId(),
            'date' => $dateAction->format('Y-m-d'),
        ]) ?: 1;

        $finalPoints = $basePoints * (int) $multiplier;

        // 2. On incrémente le score (Atomic Update)
        $sqlIncrement = 'UPDATE participation SET score = score + :points WHERE id = :id';
        $conn->executeStatement($sqlIncrement, [
            'points' => $finalPoints,
            'id' => $participation->getId(),
        ]);
    }

    public function updateAllScoresForCompetition(Competition $competition): void
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            UPDATE participation
            SET score = (
                SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
                FROM action a
                LEFT JOIN bonus_day b ON (
                    DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris') = b.date 
                    AND b.competition_id = participation.competition_id
                )
                WHERE a.participation_id = participation.id
                AND a.status = :status
            )
            WHERE competition_id = :competition_id
        ";

        $conn->executeStatement($sql, [
            'competition_id' => (string) $competition->getId(),
            'status' => ActionStatus::VALIDATED->value,
        ]);
    }
}
