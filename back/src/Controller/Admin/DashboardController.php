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

        $labels = [
            'PENDING_ACTIONS' => KpiConstants::PENDING_ACTIONS,
            'ACTIVE_COMPETITIONS' => KpiConstants::ACTIVE_COMPETITIONS,
            'TOTAL_USERS' => KpiConstants::TOTAL_USERS,
            'TOTAL_PLAYERS' => KpiConstants::TOTAL_PLAYERS,
            'TOTAL_ACTIONS' => KpiConstants::TOTAL_ACTIONS,
            'VALIDATED_ACTIONS' => KpiConstants::VALIDATED_ACTIONS,
            'TOTAL_POINTS' => KpiConstants::TOTAL_POINTS,
            'FALSE_REPORTS' => KpiConstants::FALSE_REPORTS_RATE,
            'AVG_SEVERITY' => KpiConstants::AVERAGE_SEVERITY,
            'HELL_ARENA' => KpiConstants::MAX_POINTS_COMPETITION,
            'AUBAINE' => KpiConstants::BONUS_ACTIONS_RATIO,
            'GRAND_RECIDIVIST' => KpiConstants::MAX_ACTIONS_RECEIVED,
            'GOLDEN_BALANCE' => KpiConstants::MAX_ACTIONS_REPORTED,
            'ANGEL_ARENA' => KpiConstants::MIN_ACTIONS_RECEIVED,
            'SNIPER' => KpiConstants::MAX_APPROVAL_RATIO,
            'CALOMNIATEUR' => KpiConstants::MAX_REJECTED_REPORTS,
            'PARIA' => KpiConstants::MAX_DISTINCT_INFORMERS_RECEIVED,
            'RIVALRY' => KpiConstants::MOST_FREQUENT_TARGET_PAIR,
            'CASSE_SIECLE' => KpiConstants::MAX_POINTS_SINGLE_ACTION,
            'IRON_REFEREE' => KpiConstants::MAX_ACTIONS_VALIDATED_BY_REFEREE,
            'ANGEL_REFEREE' => KpiConstants::MAX_ACTIONS_REJECTED_BY_REFEREE,
        ];

        return $this->render('admin/dashboard.html.twig', [
            'content_title' => AdminConstants::DASHBOARD_TITLE,
            'labels' => $labels,
            'count_users' => $this->userRepository->count([]),
            'count_competitions' => $this->competitionRepository->count([]),
            'count_players' => $this->playerRepository->count([]),
            'count_total_actions' => $this->actionRepository->count([]),
            'count_pending_actions' => $this->actionRepository->count(['status' => ActionStatus::PENDING]),
            'count_validated_actions' => $this->actionRepository->count(['status' => ActionStatus::VALIDATED]),

            'total_points_distributed' => $this->calculateTotalPointsDistributed(),
            'recidivist' => $this->findGrandRecidivist($conn),
            'balance_or' => $this->findGoldenBalance($conn),
            'angel' => $this->findAngelOfArena($conn),
            'false_reports_rate' => $this->calculateFalseReportsRate($conn),
            'avg_severity' => $this->calculateAverageSeverity($conn),
            'hell_arena' => $this->findHellArena($conn),
            'sniper' => $this->findSniper($conn),
            'calomniateur' => $this->findCalomniateur($conn),
            'paria' => $this->findParia($conn),
            'rivalry' => $this->findWorstRivalry($conn),
            'casse_siecle' => $this->findCasseDuSiecle($conn),
            'effet_aubaine' => $this->calculateEffetAubaine($conn),
            'iron_referee' => $this->findIronReferee($conn),
            'angel_referee' => $this->findAngelReferee($conn),
        ]);
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('🦡 Le Blaireau d\'Or')
            ->setFaviconPath('/favicon.ico');
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
        return (int) $this->participationRepository->createQueryBuilder('p')
            ->select('SUM(p.score)')
            ->getQuery()
            ->getSingleScalarResult() ?? 0;
    }

    private function findGrandRecidivist(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT p.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            JOIN player p ON part.player_id = p.id
            WHERE a.status = :status
            GROUP BY p.id, p.display_name
            ORDER BY cnt DESC LIMIT 1
        ', ['status' => ActionStatus::VALIDATED->value]);

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('%d actions validées subies', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function findGoldenBalance(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN "user" u ON a.created_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ');

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('%d dénonciations envoyées', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function findAngelOfArena(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT p.display_name, COUNT(a.id) as cnt
            FROM player p
            JOIN participation part ON part.player_id = p.id
            LEFT JOIN action a ON a.participation_id = part.id AND a.status = :status
            GROUP BY p.id, p.display_name
            ORDER BY cnt ASC LIMIT 1
        ', ['status' => ActionStatus::VALIDATED->value]);

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('%d méfait subi au total', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function calculateFalseReportsRate(Connection $conn): float
    {
        $data = $conn->fetchAssociative('
            SELECT COUNT(CASE WHEN status = \'rejected\' THEN 1 END) as rejected, COUNT(CASE WHEN status IN (\'validated\', \'rejected\') THEN 1 END) as judged FROM action
        ');

        return $data && $data['judged'] > 0 ? round(($data['rejected'] / $data['judged']) * 100, 1) : 0.0;
    }

    private function calculateAverageSeverity(Connection $conn): float
    {
        $avg = $conn->fetchOne('SELECT AVG(points) FROM action WHERE status = :status', ['status' => ActionStatus::VALIDATED->value]);

        return round((float) $avg, 1);
    }

    private function findHellArena(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT c.name, SUM(part.score) as total_pts
            FROM competition c
            JOIN participation part ON part.competition_id = c.id
            GROUP BY c.id, c.name
            ORDER BY total_pts DESC LIMIT 1
        ');

        return $data ? ['value' => $data['name'], 'subtext' => \sprintf('%s pts cumulés', number_format((int) $data['total_pts'], 0, ',', ' '))] : ['value' => 'Aucune', 'subtext' => ''];
    }

    private function findSniper(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT pl.display_name, ROUND(COUNT(CASE WHEN a.status = \'validated\' THEN 1 END)::numeric / COUNT(a.id) * 100, 1) as ratio, COUNT(a.id) as total
            FROM action a
            JOIN "user" u ON a.created_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            WHERE a.status IN (\'validated\', \'rejected\')
            GROUP BY pl.id, pl.display_name
            HAVING COUNT(a.id) >= 3
            ORDER BY ratio DESC, total DESC LIMIT 1
        ');

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('<strong>%s%%</strong> de réussite sur %d rapports', $data['ratio'], $data['total'])] : ['value' => 'Aucun', 'subtext' => 'Min. 3 jugés requis'];
    }

    private function findCalomniateur(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN "user" u ON a.created_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            WHERE a.status = :status
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ', ['status' => ActionStatus::REJECTED->value]);

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('%d signalements rejetés par l\'arbitre', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function findParia(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT p.display_name, COUNT(DISTINCT a.created_by_id) as cnt
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            JOIN player p ON part.player_id = p.id
            WHERE a.created_by_id IS NOT NULL
            GROUP BY p.id, p.display_name
            ORDER BY cnt DESC LIMIT 1
        ');

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('Ciblé par <strong>%d balances</strong> différentes', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function findWorstRivalry(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT r.display_name as reporter, t.display_name as target, COUNT(a.id) as cnt
            FROM action a
            JOIN "user" u ON a.created_by_id = u.id
            JOIN player r ON r.associated_user_id = u.id
            JOIN participation part ON a.participation_id = part.id
            JOIN player t ON part.player_id = t.id
            WHERE r.id != t.id
            GROUP BY r.id, r.display_name, t.id, t.display_name
            ORDER BY cnt DESC LIMIT 1
        ');

        return $data ? ['value' => \sprintf('%s ➔ %s', $data['reporter'], $data['target']), 'subtext' => \sprintf('A harcelé sa cible avec <strong>%d signalements</strong>', $data['cnt'])] : ['value' => 'Aucune', 'subtext' => ''];
    }

    private function findCasseDuSiecle(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT p.display_name, c.name as comp_name, a.description, (a.points * COALESCE(b.multiplier, 1)) as total_pts
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            JOIN player p ON part.player_id = p.id
            JOIN competition c ON part.competition_id = c.id
            LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE \'UTC\' AT TIME ZONE :tz) = b.date AND b.competition_id = part.competition_id)
            WHERE a.status = :status
            ORDER BY total_pts DESC, a.date_action DESC LIMIT 1
        ', ['status' => ActionStatus::VALIDATED->value, 'tz' => AppConstants::TIMEZONE]);

        return $data ? [
            'value' => $data['display_name'],
            'subtext' => \sprintf('<strong class="text-danger">+%d pts</strong> (Bonus Inclus) — %s <span class="text-muted">(%s)</span>', $data['total_pts'], $data['description'], $data['comp_name']),
        ] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function calculateEffetAubaine(Connection $conn): float
    {
        $data = $conn->fetchAssociative('
            SELECT COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as bonus_actions, COUNT(a.id) as total
            FROM action a
            JOIN participation part ON a.participation_id = part.id
            LEFT JOIN bonus_day b ON (DATE(a.date_action AT TIME ZONE \'UTC\' AT TIME ZONE :tz) = b.date AND b.competition_id = part.competition_id)
        ', ['tz' => AppConstants::TIMEZONE]);

        return $data && $data['total'] > 0 ? round(($data['bonus_actions'] / $data['total']) * 100, 1) : 0.0;
    }

    private function findIronReferee(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN "user" u ON a.updated_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            WHERE a.status = :status
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ', ['status' => ActionStatus::VALIDATED->value]);

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('%d sentences validées de sa propre main', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }

    private function findAngelReferee(Connection $conn): array
    {
        $data = $conn->fetchAssociative('
            SELECT pl.display_name, COUNT(a.id) as cnt
            FROM action a
            JOIN "user" u ON a.updated_by_id = u.id
            JOIN player pl ON pl.associated_user_id = u.id
            WHERE a.status = :status
            GROUP BY pl.id, pl.display_name
            ORDER BY cnt DESC LIMIT 1
        ', ['status' => ActionStatus::REJECTED->value]);

        return $data ? ['value' => $data['display_name'], 'subtext' => \sprintf('%d dossiers classés sans suite (rejetés)', $data['cnt'])] : ['value' => 'Aucun', 'subtext' => ''];
    }
}
