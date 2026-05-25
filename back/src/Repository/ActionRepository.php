<?php

declare(strict_types=1);

namespace App\Repository;

use App\Constants\AppConstants;
use App\Entity\Action;
use App\Entity\Competition;
use App\Entity\Participation;
use App\Entity\Player;
use App\Entity\User;
use App\Enum\ActionStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Connection;
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

        $sql = '
            SELECT a.id, a.description, a.points, a.status, a.participation_id, a.created_by_id,
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

        if ($date) {
            $sql .= " AND DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = :targetDate";
            $params['tz'] = AppConstants::TIMEZONE;
            $params['targetDate'] = $date;
        }

        if ($playerId) {
            $sql .= ' AND p.id = :player_id';
            $params['player_id'] = $playerId;
        }

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

        if ($playerId) {
            $sql .= ' AND p.player_id = :player_id';
            $params['player_id'] = $playerId;
        }

        return (int) $connection->fetchOne($sql, $params);
    }

    public function recalculateParticipationScore(Participation $participation): void
    {
        $sql = "
        UPDATE participation
        SET score = (
            SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
            FROM action a
            LEFT JOIN bonus_day b ON (
                DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = b.date 
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

    /**
     * Compile l'intégralité du profil statistique d'un joueur de manière optimisée.
     */
    public function getCareerStatsData(Player $player, User $user): array
    {
        $conn = $this->getEntityManager()->getConnection();
        $playerId = $player->getId()->toString();
        $userId = $user->getId()->toString();

        $basicMetrics = $this->fetchBasicMetrics($conn, $playerId);
        $reportedMetrics = $this->fetchReportedMetrics($conn, $userId);

        return [
            'totalCompetitions' => $basicMetrics['total_comps'],
            'totalAccumulatedPoints' => $basicMetrics['total_points'],
            'maxSeasonScore' => $basicMetrics['max_season_score'],
            'totalActionsCount' => $basicMetrics['total_actions'],
            'maxSeasonActions' => $basicMetrics['max_season_actions'],

            'totalReportedCount' => $reportedMetrics['total_reported'],
            'totalReportedValid' => $reportedMetrics['total_reported_valid'],
            'totalReportedJudged' => $reportedMetrics['total_reported_judged'],

            'record' => $this->fetchWorstRecordReceived($conn, $playerId),
            'worstStab' => $this->fetchWorstStabSent($conn, $playerId, $userId),
            'ranks' => $this->fetchHistoricalRanks($conn, $playerId),
        ];
    }

    // ─── SOUS-MÉTHODES PRIVÉES DE REQUÊTAGE ─────────────────────────────────

    private function fetchBasicMetrics(Connection $conn, string $playerId): array
    {
        return $conn->fetchAssociative('
            SELECT 
                (SELECT COUNT(id) FROM participation WHERE player_id = :player_id) as total_comps,
                (
                    SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
                    FROM action a
                    JOIN participation p ON a.participation_id = p.id
                    LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE \'UTC\' AT TIME ZONE :tz) = b.date AND b.competition_id = p.competition_id)
                    WHERE p.player_id = :player_id AND a.status = :status
                ) as total_points,
                (
                    SELECT COALESCE(MAX(season_score), 0) FROM (
                        SELECT SUM(a.points * COALESCE(b.multiplier, 1)) as season_score
                        FROM participation p
                        JOIN action a ON a.participation_id = p.id
                        LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE \'UTC\' AT TIME ZONE :tz) = b.date AND b.competition_id = p.competition_id)
                        WHERE p.player_id = :player_id AND a.status = :status
                        GROUP BY p.id
                    ) as sub_score
                ) as max_season_score,
                (SELECT COUNT(id) FROM action WHERE participation_id IN (SELECT id FROM participation WHERE player_id = :player_id) AND status = :status) as total_actions,
                (
                    SELECT COALESCE(MAX(action_count), 0) FROM (
                        SELECT COUNT(a.id) as action_count FROM participation p
                        JOIN action a ON a.participation_id = p.id
                        WHERE p.player_id = :player_id AND a.status = :status GROUP BY p.id
                    ) as sub_act
                ) as max_season_actions
        ', [
            'player_id' => $playerId,
            'status' => ActionStatus::VALIDATED->value,
            'tz' => AppConstants::TIMEZONE,
        ]) ?: [];
    }

    private function fetchReportedMetrics(Connection $conn, string $userId): array
    {
        return $conn->fetchAssociative('
            SELECT 
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id) as total_reported,
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id AND status = :status) as total_reported_valid,
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id AND status IN (\'validated\', \'rejected\')) as total_reported_judged
        ', [
            'user_id' => $userId,
            'status' => ActionStatus::VALIDATED->value,
        ]) ?: [];
    }

    private function fetchWorstRecordReceived(Connection $conn, string $playerId): ?array
    {
        $res = $conn->fetchAssociative('
            SELECT a.points, a.description, c.name as competition_name, COALESCE(cp.display_name, u.username) as involved_name
            FROM action a
            JOIN participation p ON a.participation_id = p.id 
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN "user" u ON a.created_by_id = u.id
            LEFT JOIN player cp ON cp.associated_user_id = u.id
            WHERE p.player_id = :player_id AND a.status = :status 
            ORDER BY a.points DESC, a.created_at DESC LIMIT 1
        ', ['player_id' => $playerId, 'status' => ActionStatus::VALIDATED->value]);

        return $res ?: null;
    }

    private function fetchWorstStabSent(Connection $conn, string $playerId, string $userId): ?array
    {
        $res = $conn->fetchAssociative('
            SELECT a.points, a.description, c.name as competition_name, tp.display_name as involved_name
            FROM action a
            JOIN participation p ON a.participation_id = p.id 
            JOIN player tp ON p.player_id = tp.id
            JOIN competition c ON p.competition_id = c.id
            WHERE a.created_by_id = :user_id AND a.status = :status AND p.player_id != :player_id
            ORDER BY a.points DESC, a.created_at DESC LIMIT 1
        ', ['user_id' => $userId, 'player_id' => $playerId, 'status' => ActionStatus::VALIDATED->value]);

        return $res ?: null;
    }

    private function fetchHistoricalRanks(Connection $conn, string $playerId): array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $res = $conn->fetchAssociative('
            WITH ranked_participations AS (
                SELECT p.player_id, DENSE_RANK() OVER (PARTITION BY p.competition_id ORDER BY p.score DESC) as rank
                FROM participation p
                JOIN competition c ON p.competition_id = c.id
                WHERE c.end_date IS NOT NULL AND c.end_date < :now
            )
            SELECT MIN(rank) as best_rank, MAX(rank) as worst_rank FROM ranked_participations WHERE player_id = :player_id
        ', ['player_id' => $playerId, 'now' => $nowStr]);

        return $res ?: ['best_rank' => null, 'worst_rank' => null];
    }
}
