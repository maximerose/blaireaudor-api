<?php

declare(strict_types=1);

namespace App\Service\Stats;

use App\Constants\AppConstants;
use App\Entity\Competition;
use App\Enum\ActionStatus;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;

final readonly class CompetitionStatsService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function getCompetitionKpis(Competition $competition): array
    {
        $conn = $this->entityManager->getConnection();
        $compId = $competition->getId()->toString();

        return [
            'total_players' => $this->fetchTotalPlayers($conn, $compId),
            'total_actions' => $this->fetchTotalActions($conn, $compId),
            'total_points' => $this->fetchTotalPoints($conn, $compId),
            'bonus_actions_ratio' => $this->fetchBonusActionsRatio($conn, $compId),
            'max_actions_received' => $this->fetchMaxActionsReceived($conn, $compId),
            'max_actions_reported' => $this->fetchMaxActionsReported($conn, $compId),
            'min_actions_received' => $this->fetchMinActionsReceived($conn, $compId),
            'min_actions_reported' => $this->fetchMinActionsReported($conn, $compId),
            'max_approval_ratio' => $this->fetchMaxApprovalRatio($conn, $compId),
            'max_rejected_reports' => $this->fetchMaxRejectedReports($conn, $compId),
            'max_distinct_informers_received' => $this->fetchMaxDistinctInformersReceived($conn, $compId),
            'average_points_per_action' => $this->fetchAveragePointsPerAction($conn, $compId),
            'max_reciprocal_target_pair' => $this->fetchMaxReciprocalTargetPair($conn, $compId),
            'max_unique_targets_reported' => $this->fetchMaxUniqueTargetsReported($conn, $compId),
            'max_points_reported' => $this->fetchMaxPointsReported($conn, $compId),
            'max_avg_points_received' => $this->fetchMaxAvgPointsReceived($conn, $compId),
            'min_avg_points_received' => $this->fetchMinAvgPointsReceived($conn, $compId),
            'max_points_single_action' => $this->fetchMaxPointsSingleAction($conn, $compId),
        ];
    }

    public function getDailyEvolution(Competition $competition): array
    {
        $conn = $this->entityManager->getConnection();

        $sql = "SELECT DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) as date_day,
                part.player_id,
                SUM(a.points * COALESCE(b.multiplier, 1)) as daily_points
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date AND b.competition_id = part.competition_id)
            WHERE part.competition_id = :comp_id AND a.status = :status
            GROUP BY date_day, part.player_id
            ORDER BY date_day ASC
        ";

        $results = $conn->fetchAllAssociative($sql, [
            'comp_id' => $competition->getId()->toString(),
            'status' => ActionStatus::VALIDATED->value,
            'tz' => AppConstants::TIMEZONE,
        ]);

        $dates = array_unique(array_column($results, 'date_day'));
        sort($dates);

        $runningTotals = [];
        foreach ($competition->getParticipations() as $p) {
            $runningTotals[$p->getPlayer()->getId()->toString()] = 0;
        }

        $chartData = [];
        foreach ($dates as $date) {
            $daySnapshot = ['date' => $date];

            foreach ($results as $row) {
                if ($row['date_day'] === $date) {
                    $runningTotals[$row['player_id']] += (int) $row['daily_points'];
                }
            }

            foreach ($runningTotals as $pId => $total) {
                $daySnapshot[$pId] = $total;
            }

            $chartData[] = $daySnapshot;
        }

        return $chartData;
    }

    // ─── PRIVATE KPI FETCHERS ───────────────────────────────────────────────

    private function fetchTotalPlayers(Connection $conn, string $compId): int
    {
        return (int) $conn->fetchOne('SELECT COUNT(id) 
            FROM participation 
            WHERE competition_id = :comp_id
        ', ['comp_id' => $compId]);
    }

    private function fetchTotalActions(Connection $conn, string $compId): int
    {
        return (int) $conn->fetchOne("SELECT COUNT(a.id)
            FROM action a
            JOIN participation p ON a.participation_id = p.id 
            WHERE p.competition_id = :comp_id 
            AND a.status = 'validated'
        ", ['comp_id' => $compId]);
    }

    private function fetchTotalPoints(Connection $conn, string $compId): int
    {
        return (int) $conn->fetchOne("SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0) 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                AND b.competition_id = p.competition_id) 
            WHERE p.competition_id = :comp_id 
            AND a.status = 'validated'
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);
    }

    private function fetchBonusActionsRatio(Connection $conn, string $compId): float
    {
        $data = $conn->fetchAssociative("SELECT COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as bonus_actions, COUNT(a.id) as total 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date
                AND b.competition_id = p.competition_id) 
            WHERE p.competition_id = :comp_id 
            AND a.status = 'validated'
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);

        return $data && $data['total'] > 0 ? round(($data['bonus_actions'] / $data['total']) * 100, 1) : 0.0;
    }

    private function fetchAveragePointsPerAction(Connection $conn, string $compId): float
    {
        return (float) round((float) $conn->fetchOne("SELECT AVG(points) 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                AND b.competition_id = p.competition_id) 
            WHERE a.status = 'validated' 
            AND p.competition_id = :comp_id
        ", [
            'comp_id' => $compId,
            'tz' => AppConstants::TIMEZONE,
        ]), 1);
    }

    // --- RECORDS AVEC GESTION DES EX-AEQUO (RANK) ---

    private function fetchMaxActionsReceived(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, cnt 
            FROM (
                SELECT pl.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN participation p ON a.participation_id = p.id 
                JOIN player pl ON p.player_id = pl.id 
                WHERE a.status = 'validated' 
                AND p.competition_id = :comp_id 
                GROUP BY pl.id, pl.display_name) t 
            WHERE rnk = 1
        ", ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxActionsReported(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, cnt 
            FROM (
                SELECT pl.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN \"user\" u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                WHERE p.competition_id = :comp_id 
                AND a.status = 'validated' 
                GROUP BY pl.id, pl.display_name) t
            WHERE rnk = 1
        ", ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMinActionsReceived(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, cnt 
            FROM (
                SELECT p.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) ASC) as rnk 
                FROM player p 
                JOIN participation part ON part.player_id = p.id 
                LEFT JOIN action a ON a.participation_id = part.id 
                AND a.status = 'validated' 
                WHERE part.competition_id = :comp_id 
                GROUP BY p.id, p.display_name) t 
            WHERE rnk = 1
        ", ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMinActionsReported(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, cnt 
            FROM (
                SELECT p.display_name, COUNT(a.id) as cnt, RANK() 
                OVER (ORDER BY COUNT(a.id) ASC) as rnk 
                FROM player p 
                JOIN participation part ON part.player_id = p.id 
                JOIN \"user\" u ON p.associated_user_id = u.id 
                LEFT JOIN action a ON a.created_by_id = u.id 
                AND a.status = 'validated' 
                AND a.participation_id IN (
                    SELECT id 
                    FROM participation 
                    WHERE competition_id = :comp_id) 
                WHERE part.competition_id = :comp_id 
                GROUP BY p.id, p.display_name) t 
            WHERE rnk = 1
        ", ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxPointsReported(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, total_pts 
            FROM (
                SELECT pl.display_name, SUM(a.points * COALESCE(b.multiplier, 1)) as total_pts, RANK() 
                OVER (ORDER BY SUM(a.points * COALESCE(b.multiplier, 1)) DESC) as rnk 
                FROM action a 
                JOIN \"user\" u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                LEFT JOIN bonus_day b ON (
                    DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                    AND b.competition_id = p.competition_id)
                WHERE p.competition_id = :comp_id 
                AND a.status = 'validated' 
                GROUP BY pl.id, pl.display_name) t 
            WHERE rnk = 1
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'points' => (int) $data[0]['total_pts']];
    }

    private function fetchMaxAvgPointsReceived(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, avg_pts, action_cnt 
            FROM (
                SELECT pl.display_name, 
                ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as avg_pts, 
                COUNT(a.id) as action_cnt, 
                RANK() OVER (ORDER BY ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) DESC) as rnk 
                FROM action a 
                JOIN participation p ON a.participation_id = p.id 
                JOIN player pl ON p.player_id = pl.id 
                LEFT JOIN bonus_day b ON (
                    DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                    AND b.competition_id = p.competition_id)
                WHERE p.competition_id = :comp_id AND a.status = 'validated' 
                GROUP BY pl.id, pl.display_name
            ) t WHERE rnk = 1
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'average' => (float) $data[0]['avg_pts'], 'count' => (int) $data[0]['action_cnt']];
    }

    private function fetchMinAvgPointsReceived(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, avg_pts, action_cnt
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
                    DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                    AND b.competition_id = p.competition_id)
                WHERE p.competition_id = :comp_id AND a.status = 'validated' 
                GROUP BY pl.id, pl.display_name
            ) t WHERE rnk = 1
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'average' => (float) $data[0]['avg_pts'], 'count' => (int) $data[0]['action_cnt']];
    }

    private function fetchMaxApprovalRatio(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, ratio, total 
            FROM (
                SELECT pl.display_name, 
                ROUND(COUNT(CASE WHEN a.status = 'validated' THEN 1 END)::numeric / COUNT(a.id) * 100, 1) as ratio, 
                COUNT(a.id) as total, 
                RANK() 
                OVER (ORDER BY ROUND(COUNT(CASE WHEN a.status = 'validated' THEN 1 END)::numeric / COUNT(a.id) * 100, 1) DESC, 
                    COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN \"user\" u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                WHERE a.status IN ('validated', 'rejected') 
                AND p.competition_id = :comp_id 
                GROUP BY pl.id, pl.display_name 
                HAVING COUNT(a.id) >= 2) t 
            WHERE rnk = 1
        ", ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'ratio' => (float) $data[0]['ratio'], 'total' => (int) $data[0]['total']];
    }

    private function fetchMaxRejectedReports(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, cnt 
            FROM (
                SELECT pl.display_name, 
                COUNT(a.id) as cnt, 
                RANK() 
                OVER (ORDER BY COUNT(a.id) DESC) as rnk 
                FROM action a 
                JOIN \"user\" u ON a.created_by_id = u.id 
                JOIN player pl ON pl.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                WHERE a.status = 'rejected' 
                AND p.competition_id = :comp_id 
                GROUP BY pl.id, pl.display_name) t 
            WHERE rnk = 1
        ", ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxDistinctInformersReceived(Connection $conn, string $compId): ?array
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
        ', ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['cnt']];
    }

    private function fetchMaxUniqueTargetsReported(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT display_name, unique_targets 
            FROM (
                SELECT r.display_name, 
                COUNT(DISTINCT t.id) as unique_targets, 
                RANK()
                OVER (
                    ORDER BY COUNT(DISTINCT t.id) DESC) as rnk
                    FROM action a
                    JOIN \"user\" u ON a.created_by_id = u.id 
                    JOIN player r ON r.associated_user_id = u.id 
                    JOIN participation p ON a.participation_id = p.id 
                    JOIN player t ON p.player_id = t.id 
                    WHERE p.competition_id = :comp_id 
                    AND a.status = 'validated' 
                    GROUP BY r.id, r.display_name) t 
                WHERE rnk = 1
            ", ['comp_id' => $compId]);

        return empty($data) ? null : ['player_names' => array_column($data, 'display_name'), 'count' => (int) $data[0]['unique_targets']];
    }

    private function fetchMaxReciprocalTargetPair(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAllAssociative("SELECT p1_name, 
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
                JOIN \"user\" u ON a.created_by_id = u.id 
                JOIN player r ON r.associated_user_id = u.id 
                JOIN participation p ON a.participation_id = p.id 
                JOIN player t ON p.player_id = t.id 
                WHERE r.id != t.id 
                AND p.competition_id = :comp_id 
                AND a.status = 'validated' 
                GROUP BY LEAST(r.id, t.id), 
                    GREATEST(r.id, t.id) 
                    HAVING LEAST(
                        COUNT(CASE WHEN r.id < t.id THEN 1 END), 
                        COUNT(CASE WHEN r.id > t.id THEN 1 END)) > 0) t 
            WHERE rnk = 1
        ", ['comp_id' => $compId]);
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

    private function fetchMaxPointsSingleAction(Connection $conn, string $compId): ?array
    {
        $data = $conn->fetchAssociative("SELECT pl.display_name, 
            a.description, 
            a.date_action,
            (a.points * COALESCE(b.multiplier, 1)) as total_pts 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            JOIN player pl ON p.player_id = pl.id 
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                AND b.competition_id = p.competition_id) 
            WHERE a.status = 'validated' 
            AND p.competition_id = :comp_id 
            ORDER BY total_pts DESC, 
            a.date_action DESC LIMIT 1
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);

        return $data ? ['player_name' => $data['display_name'], 'points' => (int) $data['total_pts'], 'description' => $data['description'], 'date_action' => $data['date_action']] : null;
    }
}