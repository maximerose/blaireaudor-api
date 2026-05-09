<?php

declare(strict_types=1);

namespace App\Repository;

use App\Constants\AppConstants;
use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Participation;
use App\Enum\ActionStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
        $connection = $this->getEntityManager()->getConnection();

        $sortMap = [
            'dateAction' => 'a.date_action',
            'points' => 'a.points',
            'player' => 'p.display_name',
        ];

        $sortField = $sortMap[$sortBy] ?? 'a.date_action';
        $order = 'ASC' === strtoupper($order) ? 'ASC' : 'DESC';

        $sql = '
            SELECT a.id, a.description, a.points, a.status, a.participation_id, a.created_by_id,
                TO_CHAR(a.date_action, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as date_action,
                p.display_name as player_name, 
                u.username as creator_name
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            JOIN player p ON part.player_id = p.id
            LEFT JOIN "user" u ON a.created_by_id = u.id
            WHERE part.competition_id = :comp_id
        ';

        $params = ['comp_id' => $competition->getId()];

        if ($date) {
            $sql .= " AND DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = :targetDate";
            $params['tz'] = AppConstants::TIMEZONE;
            $params['targetDate'] = $date;
        }

        $sql .= " ORDER BY {$sortField} {$order}";

        if ($limit) {
            $sql .= ' LIMIT :limit OFFSET :offset';
            $params['limit'] = $limit;
            $params['offset'] = $offset;
        }

        return $connection->fetchAllAssociative($sql, $params);
    }

    public function countByCompetition(Competition $competition, ?string $date = null): int
    {
        $connection = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT COUNT(a.id)
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            WHERE p.competition_id = :comp_id
        ';

        $params = ['comp_id' => $competition->getId()];

        if ($date) {
            $sql .= " AND DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = :targetDate";
            $params['tz'] = AppConstants::TIMEZONE;
            $params['targetDate'] = $date;
        }

        return (int) $connection->fetchOne($sql, $params);
    }

    public function incrementParticipationScoreSql(Participation $participation, int $points, \DateTimeInterface $date): void
    {
        $sql = "
            UPDATE participation 
            SET score = score + (:points * COALESCE(
                (SELECT multiplier FROM bonus_day 
                WHERE competition_id = :comp_id 
                AND date = DATE(:date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) LIMIT 1), 
                1
            ))
            WHERE id = :part_id
        ";

        $this->getEntityManager()->getConnection()->executeStatement($sql, [
            'points' => $points,
            'comp_id' => $participation->getCompetition()->getId(),
            'part_id' => $participation->getId(),
            'date_action' => $date->format('Y-m-d H:i:s'),
            'tz' => AppConstants::TIMEZONE,
        ]);
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

    public function updateAllScoresForCompetition(Competition $competition): void
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            UPDATE participation
            SET score = (
                SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
                FROM action a
                LEFT JOIN bonus_day b ON (
                    DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = b.date 
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
            'tz' => AppConstants::TIMEZONE,
        ]);
    }

    public function findAllDatesByCompetition(Competition $competition): array
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = "
            SELECT DISTINCT DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) as date_day
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            WHERE p.competition_id = :comp_id
            ORDER BY date_day DESC
        ";

        $results = $conn->fetchAllAssociative($sql, [
            'comp_id' => $competition->getId(),
            'tz' => AppConstants::TIMEZONE,
        ]);

        return array_column($results, 'date_day');
    }
}
