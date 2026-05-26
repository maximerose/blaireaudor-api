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
            'max_approval_ratio' => $this->fetchMaxApprovalRatio($conn, $compId),
            'max_rejected_reports' => $this->fetchMaxRejectedReports($conn, $compId),
            'max_distinct_informers_received' => $this->fetchMaxDistinctInformersReceived($conn, $compId),
            'average_points_per_action' => $this->fetchAveragePointsPerAction($conn, $compId),
            'most_frequent_target_pair' => $this->fetchMostFrequentTargetPair($conn, $compId),
            'max_points_single_action' => $this->fetchMaxPointsSingleAction($conn, $compId),
        ];
    }

    public function getDailyEvolution(Competition $competition): array
    {
        $conn = $this->entityManager->getConnection();

        $sql = "
            SELECT 
                DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) as date_day,
                part.player_id,
                SUM(a.points * COALESCE(b.multiplier, 1)) as daily_points
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = b.date AND b.competition_id = part.competition_id)
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
        return (int) $conn->fetchOne('SELECT COUNT(id) FROM participation WHERE competition_id = :comp_id', ['comp_id' => $compId]);
    }

    private function fetchTotalActions(Connection $conn, string $compId): int
    {
        return (int) $conn->fetchOne("SELECT COUNT(a.id) FROM action a JOIN participation p ON a.participation_id = p.id WHERE p.competition_id = :comp_id AND a.status = 'validated'", ['comp_id' => $compId]);
    }

    private function fetchTotalPoints(Connection $conn, string $compId): int
    {
        return (int) $conn->fetchOne("
            SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = b.date AND b.competition_id = p.competition_id)
            WHERE p.competition_id = :comp_id AND a.status = 'validated'
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);
    }

    private function fetchBonusActionsRatio(Connection $conn, string $compId): float
    {
        $data = $conn->fetchAssociative("
            SELECT COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as bonus_actions, COUNT(a.id) as total
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = b.date AND b.competition_id = p.competition_id)
            WHERE p.competition_id = :comp_id AND a.status = 'validated'
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);

        return $data && $data['total'] > 0 ? round(($data['bonus_actions'] / $data['total']) * 100, 1) : 0.0;
    }

    private function fetchMaxActionsReceived(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative("
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN player pl ON p.player_id = pl.id
            WHERE a.status = 'validated' AND p.competition_id = :comp_id
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ", ['comp_id' => $compId]);

        return $data ? ['value' => $data['display_name'], 'subtext' => sprintf('%d actions subies', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function fetchMaxActionsReported(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative("
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN \"user\" u ON a.created_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            JOIN participation p ON a.participation_id = p.id
            WHERE p.competition_id = :comp_id AND a.status = 'validated'
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ", ['comp_id' => $compId]);

        return $data ? ['value' => $data['display_name'], 'subtext' => sprintf('%d dénonciations', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function fetchMinActionsReceived(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative("
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM player pl
            JOIN participation p ON p.player_id = pl.id
            LEFT JOIN action a ON a.participation_id = p.id AND a.status = 'validated'
            WHERE p.competition_id = :comp_id
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt ASC LIMIT 1
        ", ['comp_id' => $compId]);

        return $data ? ['value' => $data['display_name'], 'subtext' => sprintf('%d méfait subi', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function fetchMaxApprovalRatio(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative("
            SELECT pl.display_name, ROUND(COUNT(CASE WHEN a.status = 'validated' THEN 1 END)::numeric / COUNT(a.id) * 100, 1) as ratio, COUNT(a.id) as total
            FROM action a
            JOIN \"user\" u ON a.created_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            JOIN participation p ON a.participation_id = p.id
            WHERE a.status IN ('validated', 'rejected') AND p.competition_id = :comp_id
            GROUP BY pl.id, pl.display_name
            HAVING COUNT(a.id) >= 2
            ORDER BY ratio DESC, total DESC LIMIT 1
        ", ['comp_id' => $compId]);

        return $data ? ['value' => $data['display_name'], 'subtext' => sprintf('%s%% de réussite', $data['ratio'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function fetchMaxRejectedReports(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative("
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN \"user\" u ON a.created_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            JOIN participation p ON a.participation_id = p.id
            WHERE a.status = 'rejected' AND p.competition_id = :comp_id
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ", ['comp_id' => $compId]);

        return $data ? ['value' => $data['display_name'], 'subtext' => sprintf('%d rejets', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function fetchMaxDistinctInformersReceived(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative('
            SELECT pl.display_name, COUNT(DISTINCT a.created_by_id) as cnt
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN player pl ON p.player_id = pl.id
            WHERE a.created_by_id IS NOT NULL AND p.competition_id = :comp_id
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ', ['comp_id' => $compId]);

        return $data ? ['value' => $data['display_name'], 'subtext' => sprintf('Ciblé par %d balances', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function fetchAveragePointsPerAction(Connection $conn, string $compId): float
    {
        return (float) round((float) $conn->fetchOne("SELECT AVG(points) FROM action a JOIN participation p ON a.participation_id = p.id WHERE a.status = 'validated' AND p.competition_id = :comp_id", ['comp_id' => $compId]), 1);
    }

    private function fetchMostFrequentTargetPair(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative('
            SELECT r.display_name as reporter, t.display_name as target, COUNT(a.id) as cnt
            FROM action a
            JOIN "user" u ON a.created_by_id = u.id
            JOIN player r ON r.associated_user_id = u.id
            JOIN participation p ON a.participation_id = p.id
            JOIN player t ON p.player_id = t.id
            WHERE r.id != t.id AND p.competition_id = :comp_id
            GROUP BY r.id, r.display_name, t.id, t.display_name
            ORDER BY cnt DESC LIMIT 1
        ', ['comp_id' => $compId]);

        return $data ? ['value' => sprintf('%s ➔ %s', $data['reporter'], $data['target']), 'subtext' => sprintf('%d signalements', $data['cnt'])] : ['value' => 'Aucune', 'subtext' => ''];
    }

    private function fetchMaxPointsSingleAction(Connection $conn, string $compId): array
    {
        $data = $conn->fetchAssociative("
            SELECT pl.display_name, a.description, (a.points * COALESCE(b.multiplier, 1)) as total_pts
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN player pl ON p.player_id = pl.id
            LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE 'UTC' AT TIME ZONE :tz) = b.date AND b.competition_id = p.competition_id)
            WHERE a.status = 'validated' AND p.competition_id = :comp_id
            ORDER BY total_pts DESC, a.date_action DESC LIMIT 1
        ", ['comp_id' => $compId, 'tz' => AppConstants::TIMEZONE]);

        return $data ? ['value' => $data['display_name'], 'subtext' => sprintf('+%d pts — %s', $data['total_pts'], $data['description'])] : ['value' => 'Aucun', 'subtext' => ''];
    }
}
