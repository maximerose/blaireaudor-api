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
            'totalCompetitions' => $basicMetrics['total_comps'],
            'totalPointsReceived' => $basicMetrics['total_points'],
            'maxCompetitionScore' => $basicMetrics['max_competition_score'],
            'totalActionsReceived' => $basicMetrics['total_actions'],
            'maxCompetitionActionsReceived' => $basicMetrics['max_competition_actions'],

            'totalActionsReported' => $reportedMetrics['total_reported'],
            'totalActionsReportedValid' => $reportedMetrics['total_reported_valid'],
            'totalActionsReportedJudged' => $reportedMetrics['total_reported_judged'],

            'maxPointsSingleActionReceived' => $this->fetchMaxPointsSingleActionReceived($conn, $playerId),
            'maxPointsSingleActionReported' => $this->fetchMaxPointsSingleActionReported($conn, $playerId, $userId),
            'ranks' => $this->fetchHistoricalRanks($conn, $playerId),
        ];
    }

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
                    SELECT COALESCE(MAX(competition_score), 0) FROM (
                        SELECT SUM(a.points * COALESCE(b.multiplier, 1)) as competition_score
                        FROM participation p
                        JOIN action a ON a.participation_id = p.id
                        LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE \'UTC\' AT TIME ZONE :tz) = b.date AND b.competition_id = p.competition_id)
                        WHERE p.player_id = :player_id AND a.status = :status
                        GROUP BY p.id
                    ) as sub_score
                ) as max_competition_score,
                (SELECT COUNT(id) FROM action WHERE participation_id IN (SELECT id FROM participation WHERE player_id = :player_id) AND status = :status) as total_actions,
                (
                    SELECT COALESCE(MAX(action_count), 0) FROM (
                        SELECT COUNT(a.id) as action_count FROM participation p
                        JOIN action a ON a.participation_id = p.id
                        WHERE p.player_id = :player_id AND a.status = :status GROUP BY p.id
                    ) as sub_act
                ) as max_competition_actions
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

    private function fetchMaxPointsSingleActionReceived(Connection $conn, string $playerId): ?array
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

    private function fetchMaxPointsSingleActionReported(Connection $conn, string $playerId, string $userId): ?array
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
            SELECT MIN(rank) as min_rank, MAX(rank) as max_rank FROM ranked_participations WHERE player_id = :player_id
        ', ['player_id' => $playerId, 'now' => $nowStr]);

        return $res ?: ['min_rank' => null, 'max_rank' => null];
    }
}
