<?php

declare(strict_types=1);

namespace App\Command;

use App\Constants\NotificationConstants;
use App\Entity\Notification;
use App\EventListener\NotificationTriggerListener;
use App\Repository\CompetitionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:competition:start',
    description: 'Vérifie et lance officiellement les saisons ouvertes à la date du jour en notifiant les concurrents.',
)]
class CompetitionStartCommand extends Command
{
    public function __construct(
        private CompetitionRepository $competitionRepository,
        private NotificationTriggerListener $triggerListener,
        private EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Vérification et ouverture matinale des arènes');

        $now = new \DateTimeImmutable();
        $notificationRepo = $this->entityManager->getRepository(Notification::class);

        // Récupération des compétitions ouvertes
        $competitions = $this->competitionRepository->createQueryBuilder('c')
            ->where('c.startDate <= :now')
            ->setParameter('now', $now)
            ->getQuery()
            ->getResult();

        $notificationsGeneratedCount = 0;

        foreach ($competitions as $competition) {
            foreach ($competition->getParticipations() as $participation) {
                if ($competition->getIsFinished()) {
                    continue;
                }

                $recipient = $participation->getPlayer()?->getAssociatedUser();
                if (!$recipient) {
                    continue;
                }

                $alreadyNotified = $notificationRepo->count([
                    'recipient' => $recipient,
                    'type' => NotificationConstants::TYPE_COMPETITION_STARTED,
                    'targetUrl' => '/competitions/'.$competition->getJoinCode(),
                ]) > 0;

                if (!$alreadyNotified) {
                    $notification = $this->triggerListener->buildNotification(
                        $recipient,
                        NotificationConstants::TITLE_COMPETITION_STARTED,
                        \sprintf(NotificationConstants::MSG_COMPETITION_STARTED, $competition->getName()),
                        NotificationConstants::TYPE_COMPETITION_STARTED,
                        $competition
                    );

                    $this->entityManager->persist($notification);
                    ++$notificationsGeneratedCount;
                }
            }
        }

        $this->entityManager->flush();

        if ($notificationsGeneratedCount > 0) {
            $io->success(\sprintf('%d alertes de lancement de saison envoyées aux concurrents ! 🏁⚔️', $notificationsGeneratedCount));
        } else {
            $io->info('Aucune nouvelle arène à démarrer ce matin.');
        }

        return Command::SUCCESS;
    }
}
