<?php

declare(strict_types=1);

namespace App\Service\Stats;

use App\Constants\AppConstants;
use App\Entity\Player;
use App\Entity\User;
use App\Enum\ActionStatus;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;

final readonly class PlayerStatsService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    private function getTzOffsetStr(): string
    {
        $tz = new \DateTimeZone(AppConstants::TIMEZONE);
        $offset = $tz->getOffset(new \DateTime('now', new \DateTimeZone('UTC')));
        $hours = intdiv($offset, 3600);
        $minutes = abs(intdiv($offset % 3600, 60));

        return \sprintf('%+03d:%02d:00', $hours, $minutes);
    }

    public function getCareerStatsData(Player $player, User $user): array
    {
        $conn = $this->entityManager->getConnection();

        $playerIdBin = $player->getId()->toBinary();
        $userIdBin = $user->getId()->toBinary();
        $tzOffset = $this->getTzOffsetStr();

        $basicMetrics = $this->fetchBasicMetrics($conn, $playerIdBin);
        $reportedMetrics = $this->fetchReportedMetrics($conn, $userIdBin);

        return [
            'totalCompetitions' => (int) $basicMetrics['total_comps'],
            'totalPointsReceived' => (int) $basicMetrics['total_points'],
            'totalActionsReceived' => (int) $basicMetrics['total_actions'],

            'maxCompetitionScore' => $this->fetchMaxCompetitionScoreWithContext($conn, $playerIdBin),
            'maxCompetitionActionsReceived' => $this->fetchMaxCompetitionActionsWithContext($conn, $playerIdBin),
            'minCompetitionScore' => $this->fetchMinCompetitionScoreWithContext($conn, $playerIdBin),
            'minCompetitionActionsReceived' => $this->fetchMinCompetitionActionsWithContext($conn, $playerIdBin),

            'totalActionsReported' => (int) $reportedMetrics['total_reported'],
            'totalActionsReportedValid' => (int) $reportedMetrics['total_reported_valid'],
            'totalActionsReportedJudged' => (int) $reportedMetrics['total_reported_judged'],

            'maxPointsSingleActionReceived' => $this->fetchMaxPointsSingleActionReceived($conn, $playerIdBin, $tzOffset),
            'maxPointsSingleActionReported' => $this->fetchMaxPointsSingleActionReported($conn, $playerIdBin, $userIdBin, $tzOffset),
            'minAvgPointsReceived' => $this->fetchMinAvgPointsReceived($conn, $playerIdBin, $tzOffset),
            'maxAvgPointsReceived' => $this->fetchMaxAvgPointsReceived($conn, $playerIdBin, $tzOffset),
            'ranks' => $this->fetchHistoricalRanks($conn, $playerIdBin),
            'bonusActionsRatio' => $this->fetchBonusActionsRatio($conn, $userIdBin, $tzOffset),

            'maxReportsFromSingleActor' => $this->fetchMaxReportsFromSingleActor($conn, $playerIdBin),
            'maxReportsToSingleReceiver' => $this->fetchMaxReportsToSingleReceiver($conn, $playerIdBin, $userIdBin),
            'maxReciprocalReportsWithSinglePeer' => $this->fetchMaxReciprocalReportsWithSinglePeer($conn, $playerIdBin, $userIdBin),
            'totalDistinctTargets' => $this->fetchTotalDistinctTargets($conn, $playerIdBin, $userIdBin),
        ];
    }

    private function fetchBasicMetrics(Connection $conn, string $playerIdBin): array
    {
        return $conn->fetchAssociative('SELECT 
                (SELECT COUNT(id) FROM participation WHERE player_id = :player_id) as total_comps,
                (SELECT COALESCE(SUM(score), 0) FROM participation WHERE player_id = :player_id) as total_points,
                (SELECT COUNT(a.id) 
                 FROM action a
                 JOIN participation p ON a.participation_id = p.id
                 WHERE p.player_id = :player_id AND a.status = :status) as total_actions
        ', [
            'player_id' => $playerIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]) ?: [];
    }

    private function fetchReportedMetrics(Connection $conn, string $userIdBin): array
    {
        return $conn->fetchAssociative('SELECT 
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id) as total_reported,
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id AND status = :status) as total_reported_valid,
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id AND status IN (\'validated\', \'rejected\')) as total_reported_judged
        ', [
            'user_id' => $userIdBin,
            'status' => ActionStatus::VALIDATED->value,
        ]) ?: [];
    }

    private function fetchMaxPointsSingleActionReceived(Connection $conn, string $playerIdBin, string $tzOffset): ?array
    {
        $res = $conn->fetchAssociative('SELECT (a.points * COALESCE(b.multiplier, 1)) as points, a.description, c.name as competition_name, COALESCE(cp.display_name, u.username) as involved_name
            FROM action a
            JOIN participation p ON a.participation_id = p.id 
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (DATE(ADDTIME(a.date_action, :tz_offset)) = b.date AND b.competition_id = p.competition_id)
            LEFT JOIN `user` u ON a.created_by_id = u.id
            LEFT JOIN player cp ON cp.associated_user_id = u.id
            WHERE p.player_id = :player_id AND a.status = :status 
            ORDER BY points DESC, a.created_at DESC LIMIT 1
        ', [
            'player_id' => $playerIdBin,
            'status' => ActionStatus::VALIDATED->value,
            'tz_offset' => $tzOffset,
        ]);

        return $res ?: null;
    }

    private function fetchMaxPointsSingleActionReported(Connection $conn, string $playerIdBin, string $userIdBin, string $tzOffset): ?array
    {
        $res = $conn->fetchAssociative('SELECT (a.points * COALESCE(b.multiplier, 1)) as points, a.description, c.name as competition_name, tp.display_name as involved_name
            FROM action a
            JOIN participation p ON a.participation_id = p.id 
            JOIN player tp ON p.player_id = tp.id
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (DATE(ADDTIME(a.date_action, :tz_offset)) = b.date AND b.competition_id = p.competition_id)
            WHERE a.created_by_id = :user_id AND a.status = :status AND p.player_id != :player_id
            ORDER BY points DESC, a.created_at DESC LIMIT 1
        ', [
            'user_id' => $userIdBin,
            'player_id' => $playerIdBin,
            'status' => ActionStatus::VALIDATED->value,
            'tz_offset' => $tzOffset,
        ]);

        return $res ?: null;
    }

    private function fetchMinAvgPointsReceived(Connection $conn, string $playerIdBin, string $tzOffset): ?array
    {
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, 
                   ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as avg_pts, 
                   COUNT(a.id) as action_cnt 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (
                DATE(ADDTIME(a.date_action, :tz_offset)) = b.date 
                AND b.competition_id = p.competition_id)
            WHERE p.player_id = :player_id AND a.status = 'validated' 
            GROUP BY c.id, c.name
            HAVING COUNT(a.id) > 0
            ORDER BY avg_pts ASC LIMIT 1
        ", ['player_id' => $playerIdBin, 'tz_offset' => $tzOffset]);

        return $data ? ['competition_name' => $data['competition_name'], 'average' => (float) $data['avg_pts'], 'count' => (int) $data['action_cnt']] : null;
    }

    private function fetchMaxAvgPointsReceived(Connection $conn, string $playerIdBin, string $tzOffset): ?array
    {
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, 
                   ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as avg_pts, 
                   COUNT(a.id) as action_cnt 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (
                DATE(ADDTIME(a.date_action, :tz_offset)) = b.date 
                AND b.competition_id = p.competition_id)
            WHERE p.player_id = :player_id AND a.status = 'validated' 
            GROUP BY c.id, c.name
            HAVING COUNT(a.id) > 0
            ORDER BY avg_pts DESC LIMIT 1
        ", ['player_id' => $playerIdBin, 'tz_offset' => $tzOffset]);

        return $data ? ['competition_name' => $data['competition_name'], 'average' => (float) $data['avg_pts'], 'count' => (int) $data['action_cnt']] : null;
    }

    private function fetchHistoricalRanks(Connection $conn, string $playerIdBin): array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        // Le rang 1 est le meilleur score (DENSE_RANK DESC).
        // Donc MIN(rank) = Meilleur classement (ex: 1er)
        // Et MAX(rank) = Pire classement (ex: 10e)
        $res = $conn->fetchAssociative('WITH ranked_participations AS (
            SELECT p.player_id, 
                   c.name as competition_name, 
                   DENSE_RANK() OVER (PARTITION BY p.competition_id ORDER BY p.score DESC) as rank
            FROM participation p
            JOIN competition c ON p.competition_id = c.id
            WHERE c.end_date IS NOT NULL AND c.end_date < :now
        ),
        my_ranks AS (
            SELECT rank, competition_name FROM ranked_participations WHERE player_id = :player_id
        ),
        best_rnk AS (
            SELECT rank, competition_name FROM my_ranks ORDER BY rank ASC, competition_name ASC LIMIT 1
        ),
        worst_rnk AS (
            SELECT rank, competition_name FROM my_ranks ORDER BY rank DESC, competition_name ASC LIMIT 1
        )
        SELECT 
            (SELECT rank FROM best_rnk) as best_rank,
            (SELECT competition_name FROM best_rnk) as best_rank_competition_name,
            (SELECT rank FROM worst_rnk) as worst_rank,
            (SELECT competition_name FROM worst_rnk) as worst_rank_competition_name
    ', ['player_id' => $playerIdBin, 'now' => $nowStr]);

        return [
            'min_rank_data' => $res && $res['best_rank'] ? [
                'rank' => (int) $res['best_rank'],
                'competition_name' => $res['best_rank_competition_name'],
            ] : null,
            'max_rank_data' => $res && $res['worst_rank'] ? [
                'rank' => (int) $res['worst_rank'],
                'competition_name' => $res['worst_rank_competition_name'],
            ] : null,
        ];
    }

    private function fetchBonusActionsRatio(Connection $conn, string $userIdBin, string $tzOffset): float
    {
        $data = $conn->fetchAssociative("SELECT COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as bonus_actions, COUNT(a.id) as total
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            LEFT JOIN bonus_day b ON (DATE(ADDTIME(a.date_action, :tz_offset)) = b.date AND b.competition_id = p.competition_id)
            WHERE a.created_by_id = :user_id AND a.status = 'validated'
        ", ['user_id' => $userIdBin, 'tz_offset' => $tzOffset]);

        return $data && $data['total'] > 0 ? round(($data['bonus_actions'] / $data['total']) * 100, 1) : 0.0;
    }

    private function fetchMaxReportsFromSingleActor(Connection $conn, string $playerIdBin): ?array
    {
        $data = $conn->fetchAssociative("SELECT r.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN `user` u ON a.created_by_id = u.id
            JOIN player r ON r.associated_user_id = u.id
            JOIN participation p ON a.participation_id = p.id
            WHERE p.player_id = :player_id AND r.id != :player_id AND a.status = 'validated'
            GROUP BY r.id, r.display_name
            ORDER BY cnt DESC LIMIT 1
        ", ['player_id' => $playerIdBin]);

        return $data ? ['player_name' => $data['display_name'], 'count' => (int) $data['cnt']] : null;
    }

    private function fetchMaxReportsToSingleReceiver(Connection $conn, string $playerIdBin, string $userIdBin): ?array
    {
        $data = $conn->fetchAssociative("SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN player pl ON p.player_id = pl.id
            WHERE a.created_by_id = :user_id AND pl.id != :player_id AND a.status = 'validated'
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ", ['user_id' => $userIdBin, 'player_id' => $playerIdBin]);

        return $data ? ['player_name' => $data['display_name'], 'count' => (int) $data['cnt']] : null;
    }

    private function fetchMaxReciprocalReportsWithSinglePeer(Connection $conn, string $playerIdBin, string $userIdBin): ?array
    {
        $sql = "WITH sent_counts AS (
                SELECT p.player_id as other_id, COUNT(a.id) as sent_cnt
                FROM action a
                JOIN participation p ON a.participation_id = p.id
                WHERE a.created_by_id = :user_id AND a.status = 'validated'
                GROUP BY p.player_id
            ),
            received_counts AS (
                SELECT r.id as other_id, COUNT(a.id) as received_cnt
                FROM action a
                JOIN participation p ON a.participation_id = p.id
                JOIN `user` u ON a.created_by_id = u.id
                JOIN player r ON r.associated_user_id = u.id
                WHERE p.player_id = :player_id AND a.status = 'validated' AND r.id != :player_id
                GROUP BY r.id
            )
            SELECT 
                pl.display_name,
                LEAST(COALESCE(s.sent_cnt, 0), COALESCE(r.received_cnt, 0)) as reciprocal_score,
                COALESCE(s.sent_cnt, 0) as total_sent,
                COALESCE(r.received_cnt, 0) as total_received
            FROM player pl
            LEFT JOIN sent_counts s ON pl.id = s.other_id
            LEFT JOIN received_counts r ON pl.id = r.other_id
            WHERE pl.id != :player_id AND LEAST(COALESCE(s.sent_cnt, 0), COALESCE(r.received_cnt, 0)) > 0
            ORDER BY reciprocal_score DESC, (COALESCE(s.sent_cnt, 0) + COALESCE(r.received_cnt, 0)) DESC
            LIMIT 1
        ";

        $data = $conn->fetchAssociative($sql, [
            'player_id' => $playerIdBin,
            'user_id' => $userIdBin,
        ]);

        return $data ? [
            'player_name' => $data['display_name'],
            'reciprocal_score' => (int) $data['reciprocal_score'],
            'total_sent' => (int) $data['total_sent'],
            'total_received' => (int) $data['total_received'],
        ] : null;
    }

    private function fetchTotalDistinctTargets(Connection $conn, string $playerIdBin, string $userIdBin): int
    {
        return (int) $conn->fetchOne("SELECT COUNT(DISTINCT p.player_id)
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            WHERE a.created_by_id = :user_id 
            AND a.status = 'validated' 
            AND p.player_id != :player_id
        ", [
            'user_id' => $userIdBin,
            'player_id' => $playerIdBin,
        ]);
    }

    private function fetchMaxCompetitionScoreWithContext(Connection $conn, string $playerIdBin): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative('SELECT c.name as competition_name, p.score as points
            FROM participation p
            JOIN competition c ON p.competition_id = c.id
            WHERE p.player_id = :player_id AND c.end_date IS NOT NULL AND c.end_date < :now
            ORDER BY p.score DESC LIMIT 1
        ', ['player_id' => $playerIdBin, 'now' => $nowStr]);

        return $data ? ['competition_name' => $data['competition_name'], 'points' => (int) $data['points']] : null;
    }

    private function fetchMaxCompetitionActionsWithContext(Connection $conn, string $playerIdBin): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, COUNT(a.id) as points
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN competition c ON p.competition_id = c.id
            WHERE p.player_id = :player_id AND a.status = 'validated' AND c.end_date IS NOT NULL AND c.end_date < :now
            GROUP BY p.id, c.name
            ORDER BY points DESC LIMIT 1
        ", ['player_id' => $playerIdBin, 'now' => $nowStr]);

        return $data ?: null;
    }

    private function fetchMinCompetitionScoreWithContext(Connection $conn, string $playerIdBin): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative('SELECT c.name as competition_name, p.score as points
            FROM participation p
            JOIN competition c ON p.competition_id = c.id
            WHERE p.player_id = :player_id AND c.end_date IS NOT NULL AND c.end_date < :now
            ORDER BY p.score ASC LIMIT 1
        ', ['player_id' => $playerIdBin, 'now' => $nowStr]);

        return $data ? ['competition_name' => $data['competition_name'], 'points' => (int) $data['points']] : null;
    }

    private function fetchMinCompetitionActionsWithContext(Connection $conn, string $playerIdBin): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, COUNT(a.id) as points
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN competition c ON p.competition_id = c.id
            WHERE p.player_id = :player_id AND a.status = 'validated' AND c.end_date IS NOT NULL AND c.end_date < :now
            GROUP BY p.id, c.name
            ORDER BY points ASC LIMIT 1
        ", ['player_id' => $playerIdBin, 'now' => $nowStr]);

        return $data ?: null;
    }
}
