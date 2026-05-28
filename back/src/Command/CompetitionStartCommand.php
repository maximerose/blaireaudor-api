<?php

declare(strict_types=1);

namespace App\Command;

use App\Constants\NotificationConstants;
use App\Entity\Notification;
use App\Repository\CompetitionRepository;
use App\Service\Notification\NotificationBuilder;
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
        private NotificationBuilder $notificationBuilder,
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
        $content = NotificationConstants::CONTENT[NotificationConstants::TYPE_COMPETITION_STARTED];

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
                    $this->notificationBuilder->createAndPersist(
                        $recipient,
                        $content['title'],
                        \sprintf($content['msg'], $competition->getName()),
                        NotificationConstants::TYPE_COMPETITION_STARTED,
                        $competition
                    );
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
