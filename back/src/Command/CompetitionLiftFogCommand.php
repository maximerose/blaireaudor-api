<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\CompetitionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:competition:lift-fog',
    description: 'Lève automatiquement le brouillard de guerre sur les compétitions arrivées à terme.',
)]
class CompetitionLiftFogCommand extends Command
{
    public const string TITLE = 'Vérification des arènes et dissipation du Brouillard de Guerre';
    public const string NO_COMPETITION = 'Aucune arène terminée avec un brouillard de guerre actif à signaler.';
    public const string LIFT_FOG_SUCCESS = "Le secret est levé ! Le brouillard s'est dissipé sur %d compétition(s) terminée(s). 🏁👻";

    public function __construct(
        private CompetitionRepository $competitionRepository,
        private EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title(self::TITLE);

        $now = new \DateTimeImmutable();

        $competitions = $this->competitionRepository->createQueryBuilder('c')
            ->where('c.endDate IS NOT NULL')
            ->andWhere('c.endDate < :now')
            ->andWhere('c.fogOfWar = :fogActive')
            ->setParameter('now', $now)
            ->setParameter('fogActive', true)
            ->getQuery()
            ->getResult();

        if (empty($competitions)) {
            $io->info(self::NO_COMPETITION);

            return Command::SUCCESS;
        }

        $io->progressStart(\count($competitions));

        foreach ($competitions as $competition) {
            $competition->setFogOfWar(false);
            $io->progressAdvance();
        }

        $this->entityManager->flush();

        $io->progressFinish();

        $io->success(\sprintf(
            self::LIFT_FOG_SUCCESS,
            \count($competitions)
        ));

        return Command::SUCCESS;
    }
}
