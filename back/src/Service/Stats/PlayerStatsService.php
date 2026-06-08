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

    /**
     * Compile l'intégralité du profil statistique de carrière d'un joueur.
     */
    public function getCareerStatsData(Player $player, User $user): array
    {
        $conn = $this->entityManager->getConnection();
        $playerId = $player->getId()->toString();
        $userId = $user->getId()->toString();

        $basicMetrics = $this->fetchBasicMetrics($conn, $playerId);
        $reportedMetrics = $this->fetchReportedMetrics($conn, $userId);

        return [
            'totalCompetitions' => (int) $basicMetrics['total_comps'],
            'totalPointsReceived' => (int) $basicMetrics['total_points'],
            'totalActionsReceived' => (int) $basicMetrics['total_actions'],

            'maxCompetitionScore' => $this->fetchMaxCompetitionScoreWithContext($conn, $playerId),
            'maxCompetitionActionsReceived' => $this->fetchMaxCompetitionActionsWithContext($conn, $playerId),
            'minCompetitionScore' => $this->fetchMinCompetitionScoreWithContext($conn, $playerId),
            'minCompetitionActionsReceived' => $this->fetchMinCompetitionActionsWithContext($conn, $playerId),

            'totalActionsReported' => (int) $reportedMetrics['total_reported'],
            'totalActionsReportedValid' => (int) $reportedMetrics['total_reported_valid'],
            'totalActionsReportedJudged' => (int) $reportedMetrics['total_reported_judged'],

            'maxPointsSingleActionReceived' => $this->fetchMaxPointsSingleActionReceived($conn, $playerId),
            'maxPointsSingleActionReported' => $this->fetchMaxPointsSingleActionReported($conn, $playerId, $userId),
            'minAvgPointsReceived' => $this->fetchMinAvgPointsReceived($conn, $playerId),
            'maxAvgPointsReceived' => $this->fetchMaxAvgPointsReceived($conn, $playerId),
            'ranks' => $this->fetchHistoricalRanks($conn, $playerId),
            'bonusActionsRatio' => $this->fetchBonusActionsRatio($conn, $userId),

            'maxReportsFromSingleActor' => $this->fetchMaxReportsFromSingleActor($conn, $playerId),
            'maxReportsToSingleReceiver' => $this->fetchMaxReportsToSingleReceiver($conn, $playerId, $userId),
            'maxReciprocalReportsWithSinglePeer' => $this->fetchMaxReciprocalReportsWithSinglePeer($conn, $playerId, $userId),
            'totalDistinctTargets' => $this->fetchTotalDistinctTargets($conn, $playerId, $userId),
        ];
    }

    private function fetchBasicMetrics(Connection $conn, string $playerId): array
    {
        return $conn->fetchAssociative('SELECT 
                (SELECT COUNT(id) FROM participation WHERE player_id = :player_id) as total_comps,
                (SELECT COALESCE(SUM(a.points * COALESCE(b.multiplier, 1)), 0)
                    FROM action a
                    JOIN participation p ON a.participation_id = p.id
                    LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = p.competition_id)
                    WHERE p.player_id = :player_id AND a.status = :status
                ) as total_points,
                (SELECT COUNT(id) 
                FROM action 
                WHERE participation_id IN (
                    SELECT id 
                    FROM participation 
                    WHERE player_id = :player_id) 
            AND status = :status) as total_actions
        ', [
            'player_id' => $playerId,
            'status' => ActionStatus::VALIDATED->value,
            'tz' => AppConstants::TIMEZONE,
        ]) ?: [];
    }

    private function fetchReportedMetrics(Connection $conn, string $userId): array
    {
        return $conn->fetchAssociative('SELECT 
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id) as total_reported,
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id AND status = :status) as total_reported_valid,
                (SELECT COUNT(id) FROM action WHERE created_by_id = :user_id AND status IN (\'validated\', \'rejected\')) as total_reported_judged
        ', [
            'user_id' => $userId,
            'status' => ActionStatus::VALIDATED->value,
        ]) ?: [];
    }

    private function fetchMaxPointsSingleActionReceived(Connection $conn, string $playerId): ?array
    {
        $res = $conn->fetchAssociative('SELECT (a.points * COALESCE(b.multiplier, 1)) as points, a.description, c.name as competition_name, COALESCE(cp.display_name, u.username) as involved_name
            FROM action a
            JOIN participation p ON a.participation_id = p.id 
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = p.competition_id)
            LEFT JOIN `user` u ON a.created_by_id = u.id
            LEFT JOIN player cp ON cp.associated_user_id = u.id
            WHERE p.player_id = :player_id AND a.status = :status 
            ORDER BY points DESC, a.created_at DESC LIMIT 1
        ', [
            'player_id' => $playerId,
            'status' => ActionStatus::VALIDATED->value,
            'tz' => AppConstants::TIMEZONE,
        ]);

        return $res ?: null;
    }

    private function fetchMaxPointsSingleActionReported(Connection $conn, string $playerId, string $userId): ?array
    {
        $res = $conn->fetchAssociative('SELECT (a.points * COALESCE(b.multiplier, 1)) as points, a.description, c.name as competition_name, tp.display_name as involved_name
            FROM action a
            JOIN participation p ON a.participation_id = p.id 
            JOIN player tp ON p.player_id = tp.id
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = p.competition_id)
            WHERE a.created_by_id = :user_id AND a.status = :status AND p.player_id != :player_id
            ORDER BY points DESC, a.created_at DESC LIMIT 1
        ', [
            'user_id' => $userId,
            'player_id' => $playerId,
            'status' => ActionStatus::VALIDATED->value,
            'tz' => AppConstants::TIMEZONE,
        ]);

        return $res ?: null;
    }

    private function fetchMinAvgPointsReceived(Connection $conn, string $playerId): ?array
    {
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, 
                   ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as avg_pts, 
                   COUNT(a.id) as action_cnt 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                AND b.competition_id = p.competition_id)
            WHERE p.player_id = :player_id AND a.status = 'validated' 
            GROUP BY c.id, c.name
            HAVING COUNT(a.id) > 0
            ORDER BY avg_pts ASC LIMIT 1
        ", ['player_id' => $playerId, 'tz' => AppConstants::TIMEZONE]);

        return $data ? ['competition_name' => $data['competition_name'], 'average' => (float) $data['avg_pts'], 'count' => (int) $data['action_cnt']] : null;
    }

    private function fetchMaxAvgPointsReceived(Connection $conn, string $playerId): ?array
    {
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, 
                   ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as avg_pts, 
                   COUNT(a.id) as action_cnt 
            FROM action a 
            JOIN participation p ON a.participation_id = p.id 
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (
                DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date 
                AND b.competition_id = p.competition_id)
            WHERE p.player_id = :player_id AND a.status = 'validated' 
            GROUP BY c.id, c.name
            HAVING COUNT(a.id) > 0
            ORDER BY avg_pts DESC LIMIT 1
        ", ['player_id' => $playerId, 'tz' => AppConstants::TIMEZONE]);

        return $data ? ['competition_name' => $data['competition_name'], 'average' => (float) $data['avg_pts'], 'count' => (int) $data['action_cnt']] : null;
    }

    private function fetchHistoricalRanks(Connection $conn, string $playerId): array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $res = $conn->fetchAssociative('WITH ranked_participations AS (
            SELECT p.player_id, c.name as competition_name, DENSE_RANK() OVER (PARTITION BY p.competition_id ORDER BY p.score DESC) as rank
            FROM participation p
            JOIN competition c ON p.competition_id = c.id
            WHERE c.end_date IS NOT NULL AND c.end_date < :now
        ),
        my_ranks AS (
            SELECT rank, competition_name FROM ranked_participations WHERE player_id = :player_id
        ),
        min_rnk AS (
            SELECT rank, competition_name FROM my_ranks ORDER BY rank ASC LIMIT 1
        ),
        max_rnk AS (
            SELECT rank, competition_name FROM my_ranks ORDER BY rank DESC LIMIT 1
        )
        SELECT 
            (SELECT rank FROM min_rnk) as min_rank,
            (SELECT competition_name FROM min_rnk) as min_rank_competition_name,
            (SELECT rank FROM max_rnk) as max_rank,
            (SELECT competition_name FROM max_rnk) as max_rank_competition_name
        ', ['player_id' => $playerId, 'now' => $nowStr]);

        return [
            'min_rank_data' => $res && $res['min_rank'] ? ['rank' => (int) $res['min_rank'], 'competition_name' => $res['min_rank_competition_name']] : null,
            'max_rank_data' => $res && $res['max_rank'] ? ['rank' => (int) $res['max_rank'], 'competition_name' => $res['max_rank_competition_name']] : null,
        ];
    }

    private function fetchBonusActionsRatio(Connection $conn, string $userId): float
    {
        // % d'actions émises par le joueur lors des jours bonus
        $data = $conn->fetchAssociative("SELECT COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as bonus_actions, COUNT(a.id) as total
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date AND b.competition_id = p.competition_id)
            WHERE a.created_by_id = :user_id AND a.status = 'validated'
        ", ['user_id' => $userId, 'tz' => AppConstants::TIMEZONE]);

        return $data && $data['total'] > 0 ? round(($data['bonus_actions'] / $data['total']) * 100, 1) : 0.0;
    }

    private function fetchMaxReportsFromSingleActor(Connection $conn, string $playerId): ?array
    {
        $data = $conn->fetchAssociative("SELECT r.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN `user` u ON a.created_by_id = u.id
            JOIN player r ON r.associated_user_id = u.id
            JOIN participation p ON a.participation_id = p.id
            WHERE p.player_id = :player_id AND r.id != :player_id AND a.status = 'validated'
            GROUP BY r.id, r.display_name
            ORDER BY cnt DESC LIMIT 1
        ", ['player_id' => $playerId]);

        return $data ? ['player_name' => $data['display_name'], 'count' => (int) $data['cnt']] : null;
    }

    private function fetchMaxReportsToSingleReceiver(Connection $conn, string $playerId, string $userId): ?array
    {
        $data = $conn->fetchAssociative("SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN player pl ON p.player_id = pl.id
            WHERE a.created_by_id = :user_id AND pl.id != :player_id AND a.status = 'validated'
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ", ['user_id' => $userId, 'player_id' => $playerId]);

        return $data ? ['player_name' => $data['display_name'], 'count' => (int) $data['cnt']] : null;
    }

    private function fetchMaxReciprocalReportsWithSinglePeer(Connection $conn, string $playerId, string $userId): ?array
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
            'player_id' => $playerId,
            'user_id' => $userId,
        ]);

        return $data ? [
            'player_name' => $data['display_name'],
            'reciprocal_score' => (int) $data['reciprocal_score'],
            'total_sent' => (int) $data['total_sent'],
            'total_received' => (int) $data['total_received'],
        ] : null;
    }

    private function fetchTotalDistinctTargets(Connection $conn, string $playerId, string $userId): int
    {
        return (int) $conn->fetchOne("SELECT COUNT(DISTINCT p.player_id)
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            WHERE a.created_by_id = :user_id 
            AND a.status = 'validated' 
            AND p.player_id != :player_id
        ", [
            'user_id' => $userId,
            'player_id' => $playerId,
        ]);
    }

    private function fetchMaxCompetitionScoreWithContext(Connection $conn, string $playerId): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, SUM(a.points * COALESCE(b.multiplier, 1)) as points
          FROM action a
          JOIN participation p ON a.participation_id = p.id
          JOIN competition c ON p.competition_id = c.id
          LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date AND b.competition_id = p.competition_id)
          WHERE p.player_id = :player_id AND a.status = 'validated' AND c.end_date IS NOT NULL AND c.end_date < :now
          GROUP BY p.id, c.name
          ORDER BY points DESC LIMIT 1
      ", ['player_id' => $playerId, 'tz' => AppConstants::TIMEZONE, 'now' => $nowStr]);

        return $data ?: null;
    }

    private function fetchMaxCompetitionActionsWithContext(Connection $conn, string $playerId): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, COUNT(a.id) as points
          FROM action a
          JOIN participation p ON a.participation_id = p.id
          JOIN competition c ON p.competition_id = c.id
          WHERE p.player_id = :player_id AND a.status = 'validated' AND c.end_date IS NOT NULL AND c.end_date < :now
          GROUP BY p.id, c.name
          ORDER BY points DESC LIMIT 1
      ", ['player_id' => $playerId, 'now' => $nowStr]);

        return $data ?: null;
    }

    private function fetchMinCompetitionScoreWithContext(Connection $conn, string $playerId): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, SUM(a.points * COALESCE(b.multiplier, 1)) as points
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN competition c ON p.competition_id = c.id
            LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, 'UTC', :tz)) = b.date AND b.competition_id = p.competition_id)
            WHERE p.player_id = :player_id AND a.status = 'validated' AND c.end_date IS NOT NULL AND c.end_date < :now
            GROUP BY p.id, c.name
            ORDER BY points ASC LIMIT 1
        ", ['player_id' => $playerId, 'tz' => AppConstants::TIMEZONE, 'now' => $nowStr]);

        return $data ?: null;
    }

    private function fetchMinCompetitionActionsWithContext(Connection $conn, string $playerId): ?array
    {
        $nowStr = (new \DateTimeImmutable())->format('Y-m-d H:i:s');
        $data = $conn->fetchAssociative("SELECT c.name as competition_name, COUNT(a.id) as points
            FROM action a
            JOIN participation p ON a.participation_id = p.id
            JOIN competition c ON p.competition_id = c.id
            WHERE p.player_id = :player_id AND a.status = 'validated' AND c.end_date IS NOT NULL AND c.end_date < :now
            GROUP BY p.id, c.name
            ORDER BY points ASC LIMIT 1
        ", ['player_id' => $playerId, 'now' => $nowStr]);

        return $data ?: null;
    }
}