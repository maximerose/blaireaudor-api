<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Constants\AdminConstants;
use App\Constants\AppConstants;
use App\Constants\KpiConstants;
use App\Enum\ActionStatus;
use App\Repository\ActionRepository;
use App\Repository\CompetitionRepository;
use App\Repository\ParticipationRepository;
use App\Repository\PlayerRepository;
use App\Repository\UserRepository;
use Doctrine\DBAL\Connection;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminDashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;

#[AdminDashboard(routePath: '/admin', routeName: 'admin')]
final class DashboardController extends AbstractDashboardController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly CompetitionRepository $competitionRepository,
        private readonly ActionRepository $actionRepository,
        private readonly PlayerRepository $playerRepository,
        private readonly ParticipationRepository $participationRepository,
    ) {
    }

    public function index(): Response
    {
        $conn = $this->userRepository->getEntityManager()->getConnection();

        // 1. Calcul des données brutes avec gestion du format ['names' => [], 'args' => []]
        $rawValues = [
            'PENDING_ACTIONS' => ['value' => $this->actionRepository->count(['status' => ActionStatus::PENDING])],
            'ACTIVE_COMPETITIONS' => ['value' => $this->competitionRepository->count([])],
            'TOTAL_USERS' => ['value' => $this->userRepository->count([])],
            'TOTAL_PLAYERS' => ['value' => $this->playerRepository->count([])],
            'TOTAL_ACTIONS' => ['value' => $this->actionRepository->count([])],
            'VALIDATED_ACTIONS' => ['value' => $this->actionRepository->count(['status' => ActionStatus::VALIDATED])],
            'TOTAL_POINTS' => ['value' => number_format($this->calculateTotalPointsDistributed(), 0, ',', ' ')],
            'BONUS_ACTIONS_RATIO' => ['value' => $this->calculateBonusActionsRatio($conn)],

            'MAX_ACTIONS_RECEIVED' => $this->findMaxActionsReceived($conn),
            'MAX_ACTIONS_REPORTED' => $this->findMaxActionsReported($conn),
            'MIN_ACTIONS_RECEIVED' => $this->findMinActionsReceived($conn),

            'MAX_APPROVAL_RATIO' => $this->findMaxApprovalRatio($conn),
            'MAX_REJECTED_REPORTS' => $this->findMaxRejectedReports($conn),
            'MAX_DISTINCT_INFORMERS_RECEIVED' => $this->findMaxDistinctInformersReceived($conn),

            'MAX_ACTIONS_VALIDATED_BY_REFEREE' => $this->findMaxActionsValidatedByReferee($conn),
            'MAX_ACTIONS_REJECTED_BY_REFEREE' => $this->findMaxActionsRejectedByReferee($conn),
            'AVERAGE_SEVERITY' => ['value' => $this->calculateAveragePointsPerAction($conn)],

            'MAX_POINTS_COMPETITION' => $this->findMaxPointsCompetition($conn),
            'MOST_FREQUENT_TARGET_PAIR' => $this->findMostFrequentTargetPair($conn),
            'MAX_POINTS_SINGLE_ACTION' => $this->findMaxPointsSingleAction($conn),

            'MAX_TOTAL_POINTS_PLAYER' => $this->findMaxTotalPointsPlayer($conn),
            'MIN_TOTAL_POINTS_PLAYER' => $this->findMinTotalPointsPlayer($conn),
            'MAX_COMPETITION_SEVERITY' => $this->findMaxCompetitionSeverity($conn),
            'MIN_COMPETITION_SEVERITY' => $this->findMinCompetitionSeverity($conn),
            'MAX_COMPETITION_ACTIVITY' => $this->findMaxCompetitionActivity($conn),
            'MIN_COMPETITION_ACTIVITY' => $this->findMinCompetitionActivity($conn),
        ];

        // 2. Formatage dynamique via le dictionnaire de configuration (Zéro HTML ici)
        $sections = [];
        foreach (KpiConstants::CATEGORIES as $category) {
            $metrics = [];
            foreach ($category['kpis'] as $kpiKey) {
                if (isset(KpiConstants::KPIS[$kpiKey])) {
                    $config = KpiConstants::KPIS[$kpiKey];
                    $data = $rawValues[$kpiKey] ?? null;

                    $names = $data['names'] ?? null;
                    $value = $data ? ($data['value'] ?? null) : $config['empty_value'];
                    $args = $data['args'] ?? [];

                    $subtext = null;
                    if ($data && isset($config['subtext'])) {
                        $subtext = vsprintf($config['subtext'], $args);
                    } elseif (!$data && isset($config['empty_subtext'])) {
                        $subtext = $config['empty_subtext'];
                    }

                    $hint = $config['hint'];

                    $metrics[] = [
                        'id' => $kpiKey,
                        'title' => $config['title'],
                        'icon' => $config['icon'],
                        'color' => $config['color'],
                        'suffix' => $config['suffix'],
                        'hint' => $hint,
                        'value' => $value,
                        'names' => $names,
                        'subtext' => $subtext,
                    ];
                }
            }
            $sections[] = [
                'title' => $category['title'],
                'metrics' => $metrics,
            ];
        }

        return $this->render('admin/dashboard.html.twig', [
            'content_title' => AdminConstants::DASHBOARD_TITLE,
            'sections' => $sections,
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Le Blaireau d\'Or - Espace admin')
            ->setFaviconPath('/favicon.svg');
    }

    public function configureCrud(): Crud
    {
        return Crud::new()
            ->setDateFormat('dd/MM/yyyy')
            ->setDateTimeFormat('dd/MM/yyyy HH:mm:ss');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard(AdminConstants::MENU_DASHBOARD, 'fa fa-home');
        yield MenuItem::section(AdminConstants::MENU_SECTION_GAME);
        yield MenuItem::linkToRoute(AdminConstants::MENU_COMPETITIONS, 'fas fa-trophy', 'admin_competition_index');
        yield MenuItem::linkToRoute(AdminConstants::MENU_PLAYERS, 'fas fa-users', 'admin_player_index');
        yield MenuItem::section(AdminConstants::MENU_SECTION_PLATFORM);
        yield MenuItem::linkToRoute(AdminConstants::MENU_USERS, 'fas fa-user-shield', 'admin_user_index');
        yield MenuItem::section(AdminConstants::MENU_SECTION_BACK);
        yield MenuItem::linkToUrl(AdminConstants::MENU_BACK_TO_SITE, 'fas fa-arrow-left', $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173');
    }

    private function calculateTotalPointsDistributed(): int
    {
        return (int) $this->participationRepository->createQueryBuilder('p')->select('SUM(p.score)')->getQuery()->getSingleScalarResult() ?? 0;
    }

    private function calculateAveragePointsPerAction(Connection $conn): float
    {
        $avg = $conn->fetchOne('SELECT AVG(points) FROM action WHERE status = :status', ['status' => ActionStatus::VALIDATED->value]);

        return round((float) $avg, 1);
    }

    private function calculateBonusActionsRatio(Connection $conn): float
    {
        $data = $conn->fetchAssociative('SELECT COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as bonus_actions, COUNT(a.id) as total FROM action a JOIN participation part ON a.participation_id = part.id LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = part.competition_id)', ['tz' => AppConstants::TIMEZONE]);

        return $data && $data['total'] > 0 ? round(($data['bonus_actions'] / $data['total']) * 100, 1) : 0.0;
    }

    // --- GRANDS REQUISITEURS ---

    private function findMaxActionsReceived(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt FROM (SELECT p.display_name, COUNT(a.id) as cnt, RANK() OVER (ORDER BY COUNT(a.id) DESC) as rnk FROM action a JOIN participation part ON a.participation_id = part.id JOIN player p ON part.player_id = p.id WHERE a.status = :status GROUP BY p.id, p.display_name) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value]);

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['cnt']]];
    }

    private function findMaxActionsReported(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt FROM (SELECT pl.display_name, COUNT(a.id) as cnt, RANK() OVER (ORDER BY COUNT(a.id) DESC) as rnk FROM action a JOIN `user` u ON a.created_by_id = u.id JOIN player pl ON pl.associated_user_id = u.id GROUP BY pl.id, pl.display_name) t WHERE rnk = 1');

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['cnt']]];
    }

    private function findMinActionsReceived(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt FROM (SELECT p.display_name, COUNT(a.id) as cnt, RANK() OVER (ORDER BY COUNT(a.id) ASC) as rnk FROM player p JOIN participation part ON part.player_id = p.id LEFT JOIN action a ON a.participation_id = part.id AND a.status = :status GROUP BY p.id, p.display_name) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value]);

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['cnt']]];
    }

    private function findMaxApprovalRatio(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, ratio, total FROM (SELECT pl.display_name, ROUND(COUNT(CASE WHEN a.status = \'validated\' THEN 1 END) / COUNT(a.id) * 100, 1) as ratio, COUNT(a.id) as total, RANK() OVER (ORDER BY ROUND(COUNT(CASE WHEN a.status = \'validated\' THEN 1 END) / COUNT(a.id) * 100, 1) DESC, COUNT(a.id) DESC) as rnk FROM action a JOIN `user` u ON a.created_by_id = u.id JOIN player pl ON pl.associated_user_id = u.id WHERE a.status IN (\'validated\', \'rejected\') GROUP BY pl.id, pl.display_name HAVING COUNT(a.id) >= 3) t WHERE rnk = 1');

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['ratio'], $data[0]['total']]];
    }

    private function findMaxRejectedReports(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt FROM (SELECT pl.display_name, COUNT(a.id) as cnt, RANK() OVER (ORDER BY COUNT(a.id) DESC) as rnk FROM action a JOIN `user` u ON a.created_by_id = u.id JOIN player pl ON pl.associated_user_id = u.id WHERE a.status = :status GROUP BY pl.id, pl.display_name) t WHERE rnk = 1', ['status' => ActionStatus::REJECTED->value]);

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['cnt']]];
    }

    private function findMaxDistinctInformersReceived(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt FROM (SELECT p.display_name, COUNT(DISTINCT a.created_by_id) as cnt, RANK() OVER (ORDER BY COUNT(DISTINCT a.created_by_id) DESC) as rnk FROM action a JOIN participation part ON a.participation_id = part.id JOIN player p ON part.player_id = p.id WHERE a.created_by_id IS NOT NULL GROUP BY p.id, p.display_name) t WHERE rnk = 1');

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['cnt']]];
    }

    private function findMaxActionsValidatedByReferee(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt FROM (SELECT pl.display_name, COUNT(a.id) as cnt, RANK() OVER (ORDER BY COUNT(a.id) DESC) as rnk FROM action a JOIN `user` u ON a.updated_by_id = u.id JOIN player pl ON pl.associated_user_id = u.id WHERE a.status = :status GROUP BY pl.id, pl.display_name) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value]);

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['cnt']]];
    }

    private function findMaxActionsRejectedByReferee(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, cnt FROM (SELECT pl.display_name, COUNT(a.id) as cnt, RANK() OVER (ORDER BY COUNT(a.id) DESC) as rnk FROM action a JOIN `user` u ON a.updated_by_id = u.id JOIN player pl ON pl.associated_user_id = u.id WHERE a.status = :status GROUP BY pl.id, pl.display_name) t WHERE rnk = 1', ['status' => ActionStatus::REJECTED->value]);

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [$data[0]['cnt']]];
    }

    private function findMaxPointsCompetition(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT name, total_pts FROM (SELECT c.name, SUM(part.score) as total_pts, RANK() OVER (ORDER BY SUM(part.score) DESC) as rnk FROM competition c JOIN participation part ON part.competition_id = c.id GROUP BY c.id, c.name) t WHERE rnk = 1');

        return empty($data) ? null : ['names' => array_column($data, 'name'), 'args' => [number_format((int) $data[0]['total_pts'], 0, ',', ' ')]];
    }

    private function findMostFrequentTargetPair(Connection $conn): ?array
    {
        $sql = "SELECT p1_name, 
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
                   RANK() OVER (
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
            AND a.status = 'validated' 
            GROUP BY LEAST(r.id, t.id), 
                     GREATEST(r.id, t.id) 
            HAVING LEAST(
                COUNT(CASE WHEN r.id < t.id THEN 1 END), 
                COUNT(CASE WHEN r.id > t.id THEN 1 END)) > 0
        ) t 
        WHERE rnk = 1
    ";

        $data = $conn->fetchAllAssociative($sql);
        if (empty($data)) {
            return null;
        }

        return [
            'names' => [$data[0]['p1_name'], $data[0]['p2_name']],
            'args' => [
                (int) $data[0]['reciprocal_score'],
                (int) $data[0]['total_exchanges'],
            ],
        ];
    }

    private function findMaxPointsSingleAction(Connection $conn): ?array
    {
        $data = $conn->fetchAssociative('SELECT p.display_name, c.name as comp_name, a.description, (a.points * COALESCE(b.multiplier, 1)) as total_pts FROM action a JOIN participation part ON a.participation_id = part.id JOIN player p ON part.player_id = p.id JOIN competition c ON part.competition_id = c.id LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = part.competition_id) WHERE a.status = :status ORDER BY total_pts DESC, a.date_action DESC LIMIT 1', ['status' => ActionStatus::VALIDATED->value, 'tz' => AppConstants::TIMEZONE]);

        return $data ? [
            'value' => $data['display_name'],
            'args' => [$data['total_pts'], $data['description'], $data['comp_name']],
        ] : null;
    }

    private function findMaxTotalPointsPlayer(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, total_pts FROM (SELECT p.display_name, SUM(a.points * COALESCE(b.multiplier, 1)) as total_pts, RANK() OVER (ORDER BY SUM(a.points * COALESCE(b.multiplier, 1)) DESC) as rnk FROM action a JOIN participation part ON a.participation_id = part.id JOIN player p ON part.player_id = p.id LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = part.competition_id) WHERE a.status = :status GROUP BY p.id, p.display_name) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value, 'tz' => AppConstants::TIMEZONE]);

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [number_format((int) $data[0]['total_pts'], 0, ',', ' ')]];
    }

    private function findMinTotalPointsPlayer(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT display_name, total_pts FROM (SELECT p.display_name, SUM(a.points * COALESCE(b.multiplier, 1)) as total_pts, RANK() OVER (ORDER BY SUM(a.points * COALESCE(b.multiplier, 1)) ASC) as rnk FROM action a JOIN participation part ON a.participation_id = part.id JOIN player p ON part.player_id = p.id LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = part.competition_id) WHERE a.status = :status GROUP BY p.id, p.display_name) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value, 'tz' => AppConstants::TIMEZONE]);

        return empty($data) ? null : ['names' => array_column($data, 'display_name'), 'args' => [number_format((int) $data[0]['total_pts'], 0, ',', ' ')]];
    }

    private function findMaxCompetitionSeverity(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT name, severity FROM (SELECT c.name, ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as severity, RANK() OVER (ORDER BY ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) DESC) as rnk FROM action a JOIN participation part ON a.participation_id = part.id JOIN competition c ON part.competition_id = c.id LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = part.competition_id) WHERE a.status = :status GROUP BY c.id, c.name HAVING COUNT(a.id) > 0) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value, 'tz' => AppConstants::TIMEZONE]);

        return empty($data) ? null : ['names' => array_column($data, 'name'), 'args' => [$data[0]['severity']]];
    }

    private function findMinCompetitionSeverity(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT name, severity FROM (SELECT c.name, ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) as severity, RANK() OVER (ORDER BY ROUND(AVG(a.points * COALESCE(b.multiplier, 1)), 1) ASC) as rnk FROM action a JOIN participation part ON a.participation_id = part.id JOIN competition c ON part.competition_id = c.id LEFT JOIN bonus_day b ON (DATE(CONVERT_TZ(a.date_action, \'UTC\', :tz)) = b.date AND b.competition_id = part.competition_id) WHERE a.status = :status GROUP BY c.id, c.name HAVING COUNT(a.id) > 0) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value, 'tz' => AppConstants::TIMEZONE]);

        return empty($data) ? null : ['names' => array_column($data, 'name'), 'args' => [$data[0]['severity']]];
    }

    private function findMaxCompetitionActivity(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT name, activity FROM (SELECT c.name, ROUND(COUNT(a.id) / NULLIF(COUNT(DISTINCT part.player_id), 0), 1) as activity, RANK() OVER (ORDER BY ROUND(COUNT(a.id) / NULLIF(COUNT(DISTINCT part.player_id), 0), 1) DESC) as rnk FROM participation part JOIN competition c ON part.competition_id = c.id LEFT JOIN action a ON a.participation_id = part.id AND a.status = :status GROUP BY c.id, c.name HAVING COUNT(DISTINCT part.player_id) > 0) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value]);

        return empty($data) ? null : ['names' => array_column($data, 'name'), 'args' => [$data[0]['activity']]];
    }

    private function findMinCompetitionActivity(Connection $conn): ?array
    {
        $data = $conn->fetchAllAssociative('SELECT name, activity FROM (SELECT c.name, ROUND(COUNT(a.id) / NULLIF(COUNT(DISTINCT part.player_id), 0), 1) as activity, RANK() OVER (ORDER BY ROUND(COUNT(a.id) / NULLIF(COUNT(DISTINCT part.player_id), 0), 1) ASC) as rnk FROM participation part JOIN competition c ON part.competition_id = c.id LEFT JOIN action a ON a.participation_id = part.id AND a.status = :status GROUP BY c.id, c.name HAVING COUNT(DISTINCT part.player_id) > 0) t WHERE rnk = 1', ['status' => ActionStatus::VALIDATED->value]);

        return empty($data) ? null : ['names' => array_column($data, 'name'), 'args' => [$data[0]['activity']]];
    }
}
