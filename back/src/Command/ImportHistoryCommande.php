<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Action;
use App\Entity\BonusDay;
use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\User;
use App\Enum\ActionStatus;
use App\Repository\ActionRepository;
use App\Service\Manager\ParticipationManager;
use App\Service\Manager\PlayerManager;
use App\Service\Notification\NotificationBuilder;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:import:history',
    description: 'Importe l\'historique des saisons précédentes depuis un fichier JSON.',
)]
class ImportHistoryCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $hasher,
        private readonly NotificationBuilder $notificationBuilder,
        private readonly PlayerManager $playerManager,
        private readonly ParticipationManager $participationManager,
        private readonly ActionRepository $actionRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('📦 Importation des Saisons Historiques (Seed Production)');

        $jsonPath = dirname(__DIR__, 2).'/import/history.json';

        if (!file_exists($jsonPath)) {
            $io->error("Le fichier $jsonPath est introuvable. Avez-vous bien copié le fichier ?");

            return Command::FAILURE;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        $this->notificationBuilder->mute();
        $io->info("Moteur de notifications désactivé pour l'import.");

        $io->section('Configuration du Super Admin');
        $adminEmail = $io->ask('Email de l\'administrateur', $data['admin']['email']);
        $adminPassword = $io->askHidden('Mot de passe de l\'administrateur (caché)');

        if (empty($adminPassword)) {
            $io->error('Le mot de passe est obligatoire pour sécuriser le compte.');

            return Command::FAILURE;
        }

        $adminUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $adminEmail]);

        if (!$adminUser) {
            $adminUser = new User();
            $adminUser->setEmail($adminEmail);
            $adminUser->setUsername($data['admin']['username']);
            $adminUser->setRoles(['ROLE_SUPER_ADMIN']);
            $adminUser->setPassword($this->hasher->hashPassword($adminUser, $adminPassword));

            $adminPlayer = $this->playerManager->createPlayer($data['admin']['displayName']);
            $adminPlayer->setUsername($data['admin']['username']);
            $adminPlayer->setAssociatedUser($adminUser);
            $adminUser->setPlayer($adminPlayer);

            $this->entityManager->persist($adminUser);
            $this->entityManager->persist($adminPlayer);
            $this->entityManager->flush();

            $io->success("Super Admin {$data['admin']['displayName']} créé avec l'email $adminEmail.");
        } else {
            $io->note('Super Admin trouvé. Mise à jour du mot de passe...');
            $adminUser->setPassword($this->hasher->hashPassword($adminUser, $adminPassword));
            $this->entityManager->flush();
        }

        $flatActions = [];
        $batchSize = 50;

        foreach ($data['competitions'] as $compData) {
            $competition = $this->entityManager->getRepository(Competition::class)->findOneBy(['joinCode' => $compData['joinCode']]);
            if ($competition) {
                $io->warning("La compétition {$compData['name']} existe déjà. On l'ignore.");
                continue;
            }

            $competition = new Competition();
            $competition->setName($compData['name']);
            $competition->setJoinCode($compData['joinCode']);
            $competition->setStartDate(new \DateTimeImmutable($compData['startDate']));
            $competition->setEndDate(new \DateTimeImmutable($compData['endDate']));
            $competition->setFogOfWar(false);
            $competition->setCreatedBy(null);
            $this->entityManager->persist($competition);

            foreach ($compData['bonusDays'] as $bdData) {
                $bonus = new BonusDay();
                $bonus->setCompetition($competition);
                $bonus->setDate(new \DateTimeImmutable($bdData['date']));
                $bonus->setMultiplier($bdData['multiplier']);
                $this->entityManager->persist($bonus);
            }

            $this->entityManager->flush();
            $io->success("Arène {$compData['name']} créée avec succès.");

            foreach ($compData['actions'] as $actData) {
                $flatActions[] = [
                    'compCode' => $compData['joinCode'],
                    'playerName' => $actData['playerName'],
                    'points' => $actData['points'],
                    'description' => $actData['description'],
                    'dateAction' => $actData['dateAction'],
                    'isReferee' => \in_array($actData['playerName'], $compData['referees']),
                ];
            }
        }

        $io->section('Traitement par lots de '.\count($flatActions).' actions...');
        $io->progressStart(\count($flatActions));

        foreach ($flatActions as $i => $act) {
            $comp = $this->entityManager->getRepository(Competition::class)->findOneBy(['joinCode' => $act['compCode']]);
            $player = $this->entityManager->getRepository(Player::class)->findOneBy(['displayName' => $act['playerName']]);

            if (!$player) {
                $player = $this->playerManager->createPlayer($act['playerName']);
                $this->entityManager->persist($player);
                $this->entityManager->flush();
            }

            if ($act['isReferee'] && !$comp->getReferees()->contains($player)) {
                $comp->addReferee($player);
            }

            $participation = $this->participationManager->joinCompetition($player, $comp);

            $action = new Action();
            $action->setParticipation($participation);
            $action->setPoints($act['points']);
            $action->setDescription($act['description']);
            $action->setDateAction(new \DateTimeImmutable($act['dateAction']));
            $action->setStatus(ActionStatus::VALIDATED);
            $action->setCreatedBy(null);

            $this->entityManager->persist($action);
            $io->progressAdvance();

            if (($i + 1) % $batchSize === 0) {
                $this->entityManager->flush();
                $this->entityManager->clear();
            }
        }

        $this->entityManager->flush();
        $io->progressFinish();

        $io->text("\nRecalcul final des scores pour toutes les arènes...");
        $allComps = $this->entityManager->getRepository(Competition::class)->findAll();
        foreach ($allComps as $comp) {
            $this->actionRepository->updateAllScoresForCompetition($comp);
        }

        $io->success('Importation de l\'historique terminée. Vous pouvez passer en production ! 🏆');

        return Command::SUCCESS;
    }
}
