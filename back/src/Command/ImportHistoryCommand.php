<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Action;
use App\Entity\BonusDay;
use App\Entity\Competition;
use App\Entity\Participation;
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

        // Registres de mémoire pour centraliser les entités de manière unique
        $playersRegistry = [];
        $participationsRegistry = [];

        if ($adminUser->getPlayer()) {
            $playersRegistry[$adminUser->getPlayer()->getDisplayName()] = $adminUser->getPlayer();
        }

        foreach ($flatActions as $act) {
            $comp = $this->entityManager->getRepository(Competition::class)->findOneBy(['joinCode' => $act['compCode']]);
            $pName = $act['playerName'];

            // Récupération ou création unique du joueur
            if (!isset($playersRegistry[$pName])) {
                $player = $this->entityManager->getRepository(Player::class)->findOneBy(['displayName' => $pName]);
                if (!$player) {
                    $player = $this->playerManager->createPlayer($pName);
                    $this->entityManager->persist($player);
                }
                $playersRegistry[$pName] = $player;
            }
            $player = $playersRegistry[$pName];

            if ($act['isReferee'] && !$comp->getReferees()->contains($player)) {
                $comp->addReferee($player);
            }

            // Récupération ou création unique de la participation
            $partKey = $comp->getJoinCode().'_'.$pName;
            if (!isset($participationsRegistry[$partKey])) {
                $participation = $this->entityManager->getRepository(Participation::class)->findOneBy([
                    'player' => $player,
                    'competition' => $comp,
                ]);
                if (!$participation) {
                    $participation = $this->participationManager->joinCompetition($player, $comp);
                }
                $participationsRegistry[$partKey] = $participation;
            }
            $participation = $participationsRegistry[$partKey];

            // Création de l'action
            $action = new Action();
            $action->setParticipation($participation);
            $action->setPoints($act['points']);
            $action->setDescription($act['description']);
            $action->setDateAction(new \DateTimeImmutable($act['dateAction']));
            $action->setStatus(ActionStatus::VALIDATED);
            $action->setCreatedBy(null);

            $this->entityManager->persist($action);
            $io->progressAdvance();
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
