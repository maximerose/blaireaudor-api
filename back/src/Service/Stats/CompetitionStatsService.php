<?php

declare(strict_types=1);

namespace App\Service\Stats;

use App\Constants\AppConstants;
use App\Entity\Competition;
use App\Enum\ActionStatus;
use Doctrine\DBAL\Connection;
use Symfony\Component\Uid\Uuid;

final readonly class CompetitionStatsService
{
    public function __construct(
        private Connection $connection,
    ) {
    }

    private function getTzOffsetStr(): string
    {
        $tz = new \DateTimeZone(AppConstants::TIMEZONE);
        $offset = $tz->getOffset(new \DateTime('now', new \DateTimeZone('UTC')));
        $hours = intdiv($offset, 3600);
        $minutes = abs(intdiv($offset % 3600, 60));

        return \sprintf('%+03d:%02d', $hours, $minutes);
    }

    public function getCompetitionKpis(Competition $competition): array
    {
        $compIdBin = $competition->getId()->toBinary();
        $tzOffset = $this->getTzOffsetStr();

        // Single query fetch for basic global metrics
        $globalMetrics = $this->fetchGlobalMetrics($this->connection, $compIdBin, $tzOffset);

        return array_merge($globalMetrics, [
            'max_actions_received' => $this->fetchMaxActionsReceived($this->connection, $compIdBin),
            'max_actions_reported' => $this->fetchMaxActionsReported($this->connection, $compIdBin),
            'min_actions_received' => $this->fetchMinActionsReceived($this->connection, $compIdBin),
            'min_actions_reported' => $this->fetchMinActionsReported($this->connection, $compIdBin),
            'max_approval_ratio' => $this->fetchMaxApprovalRatio($this->connection, $compIdBin),
            'max_rejected_reports' => $this->fetchMaxRejectedReports($this->connection, $compIdBin),
            'max_distinct_informers_received' => $this->fetchMaxDistinctInformersReceived($this->connection, $compIdBin),
            'max_reciprocal_target_pair' => $this->fetchMaxReciprocalTargetPair($this->connection, $compIdBin),
            'max_unique_targets_reported' => $this->fetchMaxUniqueTargetsReported($this->connection, $compIdBin),
            'max_points_reported' => $this->fetchMaxPointsReported($this->connection, $compIdBin, $tzOffset),
            'max_avg_points_received' => $this->fetchMaxAvgPointsReceived($this->connection, $compIdBin, $tzOffset),
            'min_avg_points_received' => $this->fetchMinAvgPointsReceived($this->connection, $compIdBin, $tzOffset),
            'max_points_single_action' => $this->fetchMaxPointsSingleAction($this->connection, $compIdBin, $tzOffset),
        ]);
    }

    public function getDailyEvolution(Competition $competition): array
    {
        $compIdBin = $competition->getId()->toBinary();
        $tzOffset = $this->getTzOffsetStr();

        $sql = 'SELECT DATE(CONVERT_TZ(a.date_action, \'+00:00\', :tz_offset)) as date_day,
                part.player_id,
                SUM(a.points * COALESCE(b.multiplier, 1)) as daily_points
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'+00:00\', :tz_offset)) = b.date AND b.competition_id = part.competition_id)
            WHERE part.competition_id = :comp_id AND a.status = :status
            GROUP BY date_day, part.player_id
            ORDER BY date_day ASC
        ';

        $results = $this->connection->fetchAllAssociative($sql, [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::VALIDATED->value,
            'tz_offset' => $tzOffset,
        ]);

        if (empty($results)) {
            return [];
        }

        $dates = array_values(array_unique(array_column($results, 'date_day')));
        sort($dates);

        // Map points by date and player (O(N) lookup speed)
        $dailyPointsMap = [];
        foreach ($results as $row) {
            $pId = Uuid::fromBinary($row['player_id'])->toString();
            $dailyPointsMap[$row['date_day']][$pId] = (int) $row['daily_points'];
        }

        $runningTotals = [];
        foreach ($competition->getParticipations() as $p) {
            $runningTotals[$p->getPlayer()->getId()->toString()] = 0;
        }

        $chartData = [];
        foreach ($dates as $date) {
            $daySnapshot = ['date' => $date];

            foreach ($runningTotals as $pId => &$total) {
                if (isset($dailyPointsMap[$date][$pId])) {
                    $total += $dailyPointsMap[$date][$pId];
                }
                $daySnapshot[$pId] = $total;
            }
            unset($total);

            $chartData[] = $daySnapshot;
        }

        return $chartData;
    }

    // ─── PRIVATE KPI FETCHERS ───────────────────────────────────────────────

    private function fetchGlobalMetrics(Connection $conn, string $compIdBin, string $tzOffset): array
    {
        $sql = 'SELECT 
            (SELECT COUNT(id) FROM participation WHERE competition_id = :comp_id) as total_players,
            COUNT(a.id) as total_actions,
            COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0) as total_points,
            ROUND((COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) / NULLIF(COUNT(a.id), 0)) * 100, 1) as bonus_actions_ratio,
            ROUND(AVG(a.points), 1) as average_points_per_action
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, \'+00:00\', :tz_offset)) = b.date
                AND b.competition_id = p.competition_id
            )
            WHERE p.competition_id = :comp_id 
            AND a.status = :status
        ';

        $data = $conn->fetchAssociative($sql, [
            'comp_id' => $compIdBin,
            'tz_offset' => $tzOffset,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return [
            'total_players' => (int) ($data['total_players'] ?? 0),
            'total_actions' => (int) ($data['total_actions'] ?? 0),
            'total_points' => (int) ($data['total_points'] ?? 0),
            'bonus_actions_ratio' => (float) ($data['bonus_actions_ratio'] ?? 0.0),
            'average_points_per_action' => (float) ($data['average_points_per_action'] ?? 0.0),
        ];
    }

    private function fetchMaxActionsReceived(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt 
            FROM (
                SELECT pl.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN participation p ON a.participation_id = p.id 
                JOIN player pl ON p.player_id = pl.id 
                WHERE a.status = :status 
                AND p.competition_id = :comp_id 
                GROUP BY pl.id, pl.display_name) t 
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxActionsReported(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt 
            FROM (
                SELECT pl.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN `user` u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                WHERE p.competition_id = :comp_id 
                AND a.status = :status 
                GROUP BY pl.id, pl.display_name) t
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMinActionsReceived(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt 
            FROM (
                SELECT p.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) ASC) as rnk 
                FROM player p 
                JOIN participation part ON part.player_id = p.id 
                LEFT JOIN action a ON a.participation_id = part.id 
                AND a.status = :status 
                WHERE part.competition_id = :comp_id 
                GROUP BY p.id, p.display_name) t 
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMinActionsReported(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt 
            FROM (
                SELECT p.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) ASC) as rnk 
                FROM player p 
                JOIN participation part ON part.player_id = p.id 
                JOIN `user` u ON p.associated_user_id = u.id 
                LEFT JOIN action a ON a.created_by_id = u.id 
                AND a.status = :status 
                AND a.participation_id IN (
                    SELECT id 
                    FROM participation 
                    WHERE competition_id = :comp_id) 
                WHERE part.competition_id = :comp_id 
                GROUP BY p.id, p.display_name) t 
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxPointsReported(Connection $conn, string $compIdBin, string $tzOffset): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, total_pts 
            FROM (
                SELECT pl.display_name, SUM(a.points * COALESCE(b.multiplier, 1)) as total_pts, RANK() 
                OVER (ORDER BY SUM(a.points * COALESCE(b.multiplier, 1)) DESC) as rnk 
                FROM action a 
                JOIN `user` u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                LEFT JOIN bonus_day b ON (
                    DATE(CONVERT_TZ(a.date_action, \'+00:00\', :tz_offset)) = b.date 
                    AND b.competition_id = p.competition_id)
                WHERE p.competition_id = :comp_id 
                AND a.status = :status 
                GROUP BY pl.id, pl.display_name) t 
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'tz_offset' => $tzOffset,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'points' => (int) $data[0]['total_pts']];
    }

    private function fetchMaxAvgPointsReceived(Connection $conn, string $compIdBin, string $tzOffset): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, avg_pts, action_cnt 
            FROM (
                SELECT pl.display_name, 
                ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as avg_pts, 
                COUNT(a.id) as action_cnt, 
                RANK() OVER (ORDER BY ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) DESC) as rnk 
                FROM action a 
                JOIN participation p ON a.participation_id = p.id 
                JOIN player pl ON p.player_id = pl.id 
                LEFT JOIN bonus_day b ON (
                    DATE(CONVERT_TZ(a.date_action, \'+00:00\', :tz_offset)) = b.date 
                    AND b.competition_id = p.competition_id)
                WHERE p.competition_id = :comp_id AND a.status = :status 
                GROUP BY pl.id, pl.display_name
            ) t WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'tz_offset' => $tzOffset,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'average' => (float) $data[0]['avg_pts'], 'count' => (int) $data[0]['action_cnt']];
    }

    private function fetchMinAvgPointsReceived(Connection $conn, string $compIdBin, string $tzOffset): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, avg_pts, action_cnt
            FROM (
                SELECT pl.display_name, 
                ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as avg_pts, 
                COUNT(a.id) as action_cnt, 
                RANK() 
                OVER (ORDER BY ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) ASC) as rnk 
                FROM action a 
                JOIN participation p ON a.participation_id = p.id 
                JOIN player pl ON p.player_id = pl.id 
                LEFT JOIN bonus_day b ON (
                    DATE(CONVERT_TZ(a.date_action, \'+00:00\', :tz_offset)) = b.date 
                    AND b.competition_id = p.competition_id)
                WHERE p.competition_id = :comp_id AND a.status = :status 
                GROUP BY pl.id, pl.display_name
            ) t WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'tz_offset' => $tzOffset,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'average' => (float) $data[0]['avg_pts'], 'count' => (int) $data[0]['action_cnt']];
    }

    private function fetchMaxApprovalRatio(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, ratio, total 
            FROM (
                SELECT pl.display_name, 
                ROUND(COUNT(CASE WHEN a.status = :status_validated THEN 1 END) / COUNT(a.id) * 100, 1) as ratio, 
                COUNT(a.id) as total, 
                RANK() 
                OVER (ORDER BY ROUND(COUNT(CASE WHEN a.status = :status_validated THEN 1 END) / COUNT(a.id) * 100, 1) DESC, 
                    COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN `user` u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                WHERE a.status IN (:status_validated, :status_rejected) 
                AND p.competition_id = :comp_id 
                GROUP BY pl.id, pl.display_name 
                HAVING COUNT(a.id) >= 2) t 
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'status_validated' => ActionStatus::VALIDATED->value,
            'status_rejected' => ActionStatus::REJECTED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'ratio' => (float) $data[0]['ratio'], 'total' => (int) $data[0]['total']];
    }

    private function fetchMaxRejectedReports(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt 
            FROM (
                SELECT pl.display_name, 
                COUNT(a.id) as cnt, 
                RANK() 
                OVER (ORDER BY COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN `user` u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                WHERE a.status = :status 
                AND p.competition_id = :comp_id 
                GROUP BY pl.id, pl.display_name) t 
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::REJECTED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxDistinctInformersReceived(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt 
            FROM (
                SELECT pl.display_name, COUNT(DISTINCT a.created_by_id) as cnt, RANK() 
                OVER (ORDER BY COUNT(DISTINCT a.created_by_id) DESC) as rnk 
                FROM action a
                JOIN participation p ON a.participation_id = p.id 
                JOIN player pl ON p.player_id = pl.id 
                WHERE a.created_by_id IS NOT NULL 
                AND p.competition_id = :comp_id 
                GROUP BY pl.id, pl.display_name) t 
            WHERE rnk = 1
        ', ['comp_id' => $compIdBin]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxUniqueTargetsReported(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, unique_targets 
            FROM (
                SELECT r.display_name, 
                COUNT(DISTINCT t.id) as unique_targets, 
                RANK()
                OVER (
                    ORDER BY COUNT(DISTINCT t.id) DESC) as rnk
                    FROM action a
                    JOIN `user` u ON a.created_by_id = u.id 
                    JOIN player r ON r.associated_user_id = u.id 
                    JOIN participation p ON a.participation_id = p.id 
                    JOIN player t ON p.player_id = t.id 
                    WHERE p.competition_id = :comp_id 
                    AND a.status = :status 
                    GROUP BY r.id, r.display_name) t 
                WHERE rnk = 1
            ', [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['unique_targets']];
    }

    private function fetchMaxReciprocalTargetPair(Connection $conn, string $compIdBin): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT p1_name, 
            p2_name,
            reciprocal_score, 
            total_exchanges 
            FROM (
                SELECT MAX(CASE WHEN r.id < t.id THEN r.display_name ELSE t.display_name END) as p1_name, 
                MAX(CASE WHEN r.id > t.id THEN r.display_name ELSE t.display_name END) as p2_name, 
                LEAST(
                    COUNT(CASE WHEN r.id < t.id THEN 1 END), 
                    COUNT(CASE WHEN r.id > t.id THEN 1 END)) as reciprocal_score, 
                COUNT(a.id) as total_exchanges, 
                RANK() 
                OVER (
                    ORDER BY LEAST(
                        COUNT(CASE WHEN r.id < t.id THEN 1 END), 
                        COUNT(CASE WHEN r.id > t.id THEN 1 END)) DESC, 
                    COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN `user` u ON a.created_by_id = u.id 
                JOIN player r ON r.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                JOIN player t ON p.player_id = t.id 
                WHERE r.id != t.id 
                AND p.competition_id = :comp_id 
                AND a.status = :status 
                GROUP BY LEAST(r.id, t.id), 
                    GREATEST(r.id, t.id) 
                    HAVING LEAST(
                        COUNT(CASE WHEN r.id < t.id THEN 1 END), 
                        COUNT(CASE WHEN r.id > t.id THEN 1 END)) > 0) t 
            WHERE rnk = 1
        ', [
            'comp_id' => $compIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        if (empty($data)) {
            return null;
        }

        $pairs = array_map(fn ($row) => [
            'player1' => $row['p1_name'],
            'player2' => $row['p2_name'],
        ], $data);

        return [
            'pairs' => $pairs,
            'reciprocal_score' => (int) $data[0]['reciprocal_score'],
            'total_exchanges' => (int) $data[0]['total_exchanges'],
        ];
    }

    private function fetchMaxPointsSingleAction(Connection $conn, string $compIdBin, string $tzOffset): ?array
    {
        $data = $conn->fetchAssociative('SELECT pl.display_name, 
            a.description, 
            a.date_action,
            (a.points * COALESCE(b.multiplier, 1)) as total_pts 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            JOIN player pl ON p.player_id = pl.id 
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, \'+00:00\', :tz_offset)) = b.date 
                AND b.competition_id = p.competition_id) 
            WHERE a.status = :status 
            AND p.competition_id = :comp_id 
            ORDER BY total_pts DESC, 
            a.date_action DESC LIMIT 1
        ', [
            'comp_id' => $compIdBin,
            'tz_offset' => $tzOffset,
            'status' => ActionStatus::VALIDATED->value,
        ]);

        return $data ? [
            'player_name' => $data['display_name'],
            'points' => (int) $data['total_pts'],
            'description' => $data['description'],
            'date_action' => $data['date_action'],
        ] : null;
    }
}
