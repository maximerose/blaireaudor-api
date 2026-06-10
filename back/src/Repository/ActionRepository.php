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
        $qb = $this->createQueryBuilder('a')
            ->select('a', 'p', 'player', 'cb', 'cbPlayer')
            ->join('a.participation', 'p')
            ->join('p.player', 'player')
            ->leftJoin('a.createdBy', 'cb')
            ->leftJoin('cb.player', 'cbPlayer')
            ->where('p.competition = :comp')
            ->andWhere('a.status != :status_pending')
            // C'est ICI la magie : on ajoute 'uuid' !
            ->setParameter('comp', $competition->getId(), 'uuid')
            ->setParameter('status_pending', ActionStatus::PENDING);

        if ($date) {
            $start = new \DateTimeImmutable($date.' 00:00:00', new \DateTimeZone(AppConstants::TIMEZONE));
            $end = new \DateTimeImmutable($date.' 23:59:59', new \DateTimeZone(AppConstants::TIMEZONE));

            $qb->andWhere('a.dateAction BETWEEN :start AND :end')
               ->setParameter('start', $start)
               ->setParameter('end', $end);
        }

        if ($playerId) {
            $qb->andWhere('player.id = :playerId')
               ->setParameter('playerId', $playerId, 'uuid');
        }

        $sortMap = [
            'dateAction' => 'a.dateAction',
            'points' => 'a.points',
            'player' => 'player.displayName',
        ];

        $sortField = $sortMap[$sortBy] ?? 'a.dateAction';
        $qb->orderBy($sortField, 'ASC' === strtoupper($order) ? 'ASC' : 'DESC');

        if (null !== $limit) {
            $qb->setMaxResults($limit);
            $qb->setFirstResult($offset ?? 0);
        }

        return $qb->getQuery()->getResult();
    }

    public function countByCompetition(Competition $competition, ?string $date = null, ?string $playerId = null): int
    {
        $qb = $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->join('a.participation', 'p')
            ->join('p.player', 'player')
            ->where('p.competition = :comp')
            ->andWhere('a.status != :status_pending')
            ->setParameter('comp', $competition->getId(), 'uuid')
            ->setParameter('status_pending', ActionStatus::PENDING);

        if ($date) {
            $start = new \DateTimeImmutable($date.' 00:00:00', new \DateTimeZone(AppConstants::TIMEZONE));
            $end = new \DateTimeImmutable($date.' 23:59:59', new \DateTimeZone(AppConstants::TIMEZONE));

            $qb->andWhere('a.dateAction BETWEEN :start AND :end')
               ->setParameter('start', $start)
               ->setParameter('end', $end);
        }

        if ($playerId) {
            $qb->andWhere('player.id = :playerId')
               ->setParameter('playerId', $playerId, 'uuid');
        }

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    public function findPendingByCompetition(Competition $competition): array
    {
        return $this->createQueryBuilder('a')
            ->select('a', 'p', 'player', 'cb', 'cbPlayer')
            ->join('a.participation', 'p')
            ->join('p.player', 'player')
            ->leftJoin('a.createdBy', 'cb')
            ->leftJoin('cb.player', 'cbPlayer')
            ->where('p.competition = :comp')
            ->andWhere('a.status = :status_pending')
            ->setParameter('comp', $competition->getId(), 'uuid')
            ->setParameter('status_pending', ActionStatus::PENDING)
            ->orderBy('a.dateAction', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function countPendingByCompetition(Competition $competition): int
    {
        return (int) $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->join('a.participation', 'p')
            ->where('p.competition = :comp')
            ->andWhere('a.status = :status')
            ->setParameter('comp', $competition->getId(), 'uuid')
            ->setParameter('status', ActionStatus::PENDING)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findAllDatesByCompetition(Competition $competition): array
    {
        $actions = $this->createQueryBuilder('a')
            ->select('a.dateAction')
            ->join('a.participation', 'p')
            ->where('p.competition = :comp')
            ->setParameter('comp', $competition->getId(), 'uuid')
            ->getQuery()
            ->getResult();

        $dates = [];
        $tz = new \DateTimeZone(AppConstants::TIMEZONE);

        foreach ($actions as $action) {
            $date = $action['dateAction']->setTimezone($tz)->format('Y-m-d');
            $dates[$date] = true;
        }

        $uniqueDates = array_keys($dates);
        rsort($uniqueDates);

        return $uniqueDates;
    }

    public function recalculateParticipationScore(Participation $participation): void
    {
        $comp = $participation->getCompetition();
        if (!$comp || !$comp->getId() || !$participation->getId()) {
            return;
        }

        $bonusDays = $comp->getBonusDays();
        $bonusMap = [];
        $tz = new \DateTimeZone(AppConstants::TIMEZONE);

        foreach ($bonusDays as $bd) {
            $bonusMap[$bd->getDate()->format('Y-m-d')] = $bd->getMultiplier();
        }

        $score = 0;
        /** @var Action $action */
        foreach ($participation->getActions() as $action) {
            if (ActionStatus::VALIDATED === $action->getStatus()) {
                $dateStr = $action->getDateAction()->setTimezone($tz)->format('Y-m-d');
                $multiplier = $bonusMap[$dateStr] ?? 1;
                $score += $action->getPoints() * $multiplier;
            }
        }

        $participation->setScore($score);
        $this->getEntityManager()->flush();
    }

    public function updateAllScoresForCompetition(Competition $competition): void
    {
        $participations = $competition->getParticipations();
        $bonusDays = $competition->getBonusDays();
        $tz = new \DateTimeZone(AppConstants::TIMEZONE);

        $bonusMap = [];
        foreach ($bonusDays as $bd) {
            $bonusMap[$bd->getDate()->format('Y-m-d')] = $bd->getMultiplier();
        }

        foreach ($participations as $participation) {
            $score = 0;
            /** @var Action $action */
            foreach ($participation->getActions() as $action) {
                if (ActionStatus::VALIDATED === $action->getStatus()) {
                    $dateStr = $action->getDateAction()->setTimezone($tz)->format('Y-m-d');
                    $multiplier = $bonusMap[$dateStr] ?? 1;
                    $score += $action->getPoints() * $multiplier;
                }
            }
            $participation->setScore($score);
        }

        $this->getEntityManager()->flush();
    }

    public function countPendingForReferee(Player $referee): int
    {
        return (int) $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->join('a.participation', 'p')
            ->join('p.competition', 'c')
            ->where(':referee MEMBER OF c.referees')
            ->andWhere('a.status = :status')
            ->setParameter('referee', $referee->getId(), 'uuid')
            ->setParameter('status', ActionStatus::PENDING)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
