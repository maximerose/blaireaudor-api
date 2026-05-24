<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\ActionRepository;
use App\Repository\CompetitionRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:scores:refresh',
    description: 'Recalcule les scores de toutes les compétitions en fonction des actions validées.',
)]
class RefreshScoresCommand extends Command
{
    public const string REFRESH_SUCCESS = 'Tous les scores ont été synchronisés avec succès.';

    public function __construct(
        private CompetitionRepository $competitionRepository,
        private ActionRepository $actionRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $competitions = $this->competitionRepository->findAll();

        $io->progressStart(\count($competitions));

        foreach ($competitions as $competition) {
            $this->actionRepository->updateAllScoresForCompetition($competition);
            $io->progressAdvance();
        }

        $io->progressFinish();
        $io->success(self::REFRESH_SUCCESS);

        return Command::SUCCESS;
    }
}
