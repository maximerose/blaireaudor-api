<?php

declare(strict_types=1);

namespace App\Repository;

use App\Constants\AppConstants;
use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
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
        ?string $playerId = null,
    ): array {
        $connection = $this->getEntityManager()->getConnection();

        $sortMap = [
            'dateAction' => 'a.date_action',
            'points' => 'a.points',
            'player' => 'p.display_name',
        ];

        $sortField = $sortMap[$sortBy] ?? 'a.date_action';
        $order = 'ASC' === strtoupper($order) ? 'ASC' : 'DESC';

        $sql = 'SELECT a.id, a.description, a.points, a.status, a.participation_id, a.created_by_id,
                TO_CHAR(a.date_action, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as date_action,
                p.display_name as player_name, 
                p.id as player_id,
                COALESCE(cp.display_name, u.username, null) as creator_name
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            JOIN player p ON part.player_id = p.id
            LEFT JOIN "user" u ON a.created_by_id = u.id
            LEFT JOIN player cp ON cp.associated_user_id = u.id
            WHERE part.competition_id = :comp_id
        ';

        $params = ['comp_id' => $competition->getId()];
        $filterConditions = [];

        if ($date) {
            $filterConditions[] = "DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = :targetDate";
            $params['tz'] = AppConstants::TIMEZONE;
            $params['targetDate'] = $date;
        }

        if ($playerId) {
            $filterConditions[] = 'p.id = :player_id';
            $params['player_id'] = $playerId;
        }

        if (!empty($filterConditions)) {
            $filtersSql = implode(' AND ', $filterConditions);
            $sql .= " AND ($filtersSql)";
        }

        $sql .= ' AND a.status != :status_pending';
        $params['status_pending'] = ActionStatus::PENDING->value;

        $sql .= " ORDER BY {$sortField} {$order}";

        if ($limit) {
            $sql .= ' LIMIT :limit OFFSET :offset';
            $params['limit'] = $limit;
            $params['offset'] = $offset;
        }

        return $connection->fetchAllAssociative($sql, $params);
    }

    public function countByCompetition(Competition $competition, ?string $date = null, ?string $playerId = null): int
    {
        $connection = $this->getEntityManager()->getConnection();

        $sql = 'SELECT COUNT(a.id)
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            WHERE p.competition_id = :comp_id
        ';

        $params = ['comp_id' => $competition->getId()];
        $filterConditions = [];

        if ($date) {
            $filterConditions[] = "DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = :targetDate";
            $params['tz'] = AppConstants::TIMEZONE;
            $params['targetDate'] = $date;
        }

        if ($playerId) {
            $filterConditions[] = 'p.player_id = :player_id';
            $params['player_id'] = $playerId;
        }

        if (!empty($filterConditions)) {
            $filtersSql = implode(' AND ', $filterConditions);
            $sql .= " AND ($filtersSql)";
        }

        $sql .= ' AND a.status != :status_pending';
        $params['status_pending'] = ActionStatus::PENDING->value;

        return (int) $connection->fetchOne($sql, $params);
    }

    public function findPendingByCompetition(Competition $competition): array
    {
        $connection = $this->getEntityManager()->getConnection();

        $sql = 'SELECT a.id, a.description, a.points, a.status, a.participation_id, a.created_by_id,
                TO_CHAR(a.date_action, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') as date_action,
                p.display_name as player_name, 
                p.id as player_id,
                COALESCE(cp.display_name, u.username, null) as creator_name
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            JOIN player p ON part.player_id = p.id
            LEFT JOIN "user" u ON a.created_by_id = u.id
            LEFT JOIN player cp ON cp.associated_user_id = u.id
            WHERE part.competition_id = :comp_id
            AND a.status = :status_pending
            ORDER BY a.date_action DESC
        ';

        return $connection->fetchAllAssociative($sql, [
            'comp_id' => $competition->getId(),
            'status_pending' => ActionStatus::PENDING->value,
        ]);
    }

    public function recalculateParticipationScore(Participation $participation): void
    {
        $comp = $participation->getCompetition();

        if (!$comp || !$comp->getId() || !$participation->getId()) {
            return;
        }

        $sql = "UPDATE participation
        SET score = (
            SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
            FROM action a
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date
                AND b.competition_id = :comp_id
            )
            WHERE a.participation_id = :part_id
            AND a.status = :status
        )
        WHERE id = :part_id
    ";

        $this->getEntityManager()->getConnection()->executeStatement($sql, [
            'comp_id' => (string) $participation->getCompetition()->getId(),
            'part_id' => (string) $participation->getId(),
            'status' => ActionStatus::VALIDATED->value,
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

        $sql = "UPDATE participation
            SET score = (
                SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
                FROM action a
                LEFT JOIN bonus_day b ON (
                    DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
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

        $sql = "SELECT DISTINCT DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) as date_day
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

    public function countPendingForReferee(Player $referee): int
    {
        return (int) $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->join('a.participation', 'p')
            ->join('p.competition', 'c')
            ->where(':referee MEMBER OF c.referees')
            ->andWhere('a.status = :status')
            ->setParameter('referee', $referee)
            ->setParameter('status', ActionStatus::PENDING)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
