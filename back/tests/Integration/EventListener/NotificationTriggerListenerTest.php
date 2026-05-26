<?php

declare(strict_types=1);

namespace App\Tests\Integration\EventListener;

use ApiPlatform\Metadata\Post;
use App\Constants\NotificationConstants;
use App\DTO\Action\ActionCreateInput;
use App\Entity\BonusDay;
use App\Entity\Participation;
use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\NotificationFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use App\State\Processor\Action\ActionCreateProcessor;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class NotificationTriggerListenerTest extends KernelTestCase
{
    use ResetDatabase;
    use Factories;

    public function testCreatingPendingActionTriggersNotificationForReferees(): void
    {
        self::bootKernel();
        $container = static::getContainer();

        $creator = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $referee = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $targetUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $competition = CompetitionFactory::createOne([
            'createdBy' => $creator,
            'referees' => [$referee->getPlayer()],
        ]);

        ParticipationFactory::createOne([
            'competition' => $competition,
            'player' => $targetUser->getPlayer(),
        ]);

        $authorUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        ParticipationFactory::createOne([
            'competition' => $competition,
            'player' => $authorUser->getPlayer(),
        ]);

        $actionInput = new ActionCreateInput();
        $actionInput->description = 'A mordu le tapis de luge';
        $actionInput->points = 30;
        $actionInput->dateAction = '2026-02-22T14:00:00Z';
        $actionInput->player = '/api/players/'.$targetUser->getPlayer()->getId();

        $container->get('security.token_storage')->setToken(
            new UsernamePasswordToken(
                $authorUser,
                'main',
                $authorUser->getRoles()
            )
        );

        $container->get(ActionCreateProcessor::class)->process($actionInput, new Post(), ['competitionId' => $competition->getId()->toString()]);

        NotificationFactory::assert()->count(1, [
            'recipient' => $referee,
            'type' => NotificationConstants::TYPE_NEW_SUBMISSION,
            'title' => NotificationConstants::TITLE_NEW_SUBMISSION,
            'message' => \sprintf(NotificationConstants::MSG_NEW_SUBMISSION, $targetUser->getPlayer()->getDisplayName()),
        ]);
    }

    public function testValidatedActionWithFogOfWarTrueNotifiesEveryoneWithoutPoints(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);

        $targetUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $otherUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $competition = CompetitionFactory::createOne(['fogOfWar' => true]);

        $targetPart = ParticipationFactory::createOne(['competition' => $competition, 'player' => $targetUser->getPlayer()]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $otherUser->getPlayer()]);

        $action = ActionFactory::createOne([
            'participation' => $targetPart,
            'status' => ActionStatus::PENDING,
            'points' => 50,
            'description' => 'A repeint le gîte au vin rouge',
        ]);

        $action->setStatus(ActionStatus::VALIDATED);
        $em->flush();

        NotificationFactory::assert()->count(1, [
            'recipient' => $targetUser,
            'type' => NotificationConstants::TYPE_ACTION_VALIDATED,
            'title' => NotificationConstants::TITLE_ACTION_VALIDATED,
            'message' => \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_FOG_TARGET, 'A repeint le gîte au vin rouge'),
        ]);

        NotificationFactory::assert()->count(1, [
            'recipient' => $otherUser,
            'type' => NotificationConstants::TYPE_ACTION_VALIDATED,
            'title' => NotificationConstants::TITLE_ACTION_VALIDATED,
            'message' => \sprintf(
                NotificationConstants::MSG_ACTION_VALIDATED_FOG_OTHERS,
                $targetUser->getPlayer()->getDisplayName()
            ),
        ]);
    }

    public function testValidatedActionWithFogOfWarFalseNotifiesEveryoneWithCustomMessages(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);

        $targetUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $otherUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $competition = CompetitionFactory::createOne(['fogOfWar' => false]);

        $targetPart = ParticipationFactory::createOne(['competition' => $competition, 'player' => $targetUser->getPlayer()]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $otherUser->getPlayer()]);

        $action = ActionFactory::createOne([
            'participation' => $targetPart,
            'status' => ActionStatus::PENDING,
            'points' => 30,
            'description' => 'S\'est trompé de gîte',
        ]);

        $action->setStatus(ActionStatus::VALIDATED);
        $em->flush();

        NotificationFactory::assert()->exists([
            'recipient' => $targetUser,
            'type' => NotificationConstants::TYPE_ACTION_VALIDATED,
            'title' => NotificationConstants::TITLE_ACTION_VALIDATED,
            'message' => \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_TARGET, 30, 'S\'est trompé de gîte'),
        ]);

        NotificationFactory::assert()->exists([
            'recipient' => $otherUser,
            'type' => NotificationConstants::TYPE_ACTION_VALIDATED,
            'title' => NotificationConstants::TITLE_ACTION_VALIDATED,
            'message' => \sprintf(
                NotificationConstants::MSG_ACTION_VALIDATED_OTHERS,
                $targetUser->getPlayer()->getDisplayName(),
                30,
                'S\'est trompé de gîte'
            ),
        ]);
    }

    public function testPlayerSelfJoinTriggersPlayerJoinedNotificationForOthers(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);

        $competition = CompetitionFactory::createOne();
        $oldUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $oldUser->getPlayer()]);

        // Nouvel utilisateur qui effectue le raccordement direct /join
        $joiningUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        // On injecte le joueur qui rejoint dans le token de sécurité pour simuler son action
        $container->get('security.token_storage')->setToken(
            new UsernamePasswordToken($joiningUser, 'main', $joiningUser->getRoles())
        );

        // Action : Création de la participation
        $participation = new Participation();
        $participation->setCompetition($competition);
        $participation->setPlayer($joiningUser->getPlayer());

        $em->persist($participation);
        $em->flush();

        // 🐣 L'ancien joueur doit être notifié de l'arrivée du nouveau concurrent
        NotificationFactory::assert()->count(1, [
            'recipient' => $oldUser,
            'type' => NotificationConstants::TYPE_PLAYER_JOINED,
            'message' => \sprintf(NotificationConstants::MSG_PLAYER_JOINED, $joiningUser->getPlayer()->getDisplayName()),
        ]);
    }

    public function testRefereeMassEnrollmentTriggersAddedByRefereeNotificationForImportedPlayer(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);

        $refereeUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['createdBy' => $refereeUser]);
        $importedUser = UserFactory::createOne(['player' => PlayerFactory::new()]);

        // L'arbitre est connecté et pilote l'action
        $container->get('security.token_storage')->setToken(
            new UsernamePasswordToken($refereeUser, 'main', $refereeUser->getRoles())
        );

        $participation = new Participation();
        $participation->setCompetition($competition);
        $participation->setPlayer($importedUser->getPlayer());

        $em->persist($participation);
        $em->flush();

        // 📋 Le joueur importé doit recevoir sa notification nominative
        NotificationFactory::assert()->count(1, [
            'recipient' => $importedUser,
            'type' => NotificationConstants::TYPE_ADDED_BY_REFEREE,
            'message' => \sprintf(
                NotificationConstants::MSG_ADDED_BY_REFEREE,
                $refereeUser->getPlayer()->getDisplayName(),
                $competition->getName()
            ),
        ]);
    }

    public function testSwitchingFogOfWarTriggersFogNotificationsForAllParticipants(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);

        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['fogOfWar' => true]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $user->getPlayer()]);

        // Action : L'arbitre désactive le brouillard
        $competition->setFogOfWar(false);
        $em->flush();

        // 👁️ Tous les participants doivent recevoir l'alerte de dissipation
        NotificationFactory::assert()->count(1, [
            'recipient' => $user,
            'type' => NotificationConstants::TYPE_FOG_DISABLED,
            'title' => NotificationConstants::TITLE_FOG_DISABLED,
        ]);
    }

    public function testCreatingBonusDayTriggersBonusNotificationForAllParticipants(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);

        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne();
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $user->getPlayer()]);

        // Action : Ajout d'un jour bonus multiplicateur x3
        $bonusDay = new BonusDay();
        $bonusDay->setCompetition($competition);
        $bonusDay->setDate(new \DateTimeImmutable('2026-05-24'));
        $bonusDay->setMultiplier(3);

        $em->persist($bonusDay);
        $em->flush();

        // 🔥 Tous les participants reçoivent le flash bonus
        NotificationFactory::assert()->count(1, [
            'recipient' => $user,
            'type' => NotificationConstants::TYPE_BONUS_TRIGGERED,
            'message' => \sprintf(NotificationConstants::MSG_BONUS_TRIGGERED, 3), // x3
        ]);
    }

    public function testCompetitionStartCommandTriggersNotificationsForParticipants(): void
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);
        // Création d'une compétition qui commence aujourd'hui/maintenant
        $competition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('now'),
            'endDate' => new \DateTimeImmutable('+7 days'),
            'name' => 'Saison des Blaireaux Sauvages',
        ]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $user->getPlayer()]);

        $command = $application->find('app:competition:start');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);
        $commandTester->assertCommandIsSuccessful();

        // 🏁 L'utilisateur doit avoir reçu le toast de lancement de saison
        NotificationFactory::assert()->count(1, [
            'recipient' => $user,
            'type' => NotificationConstants::TYPE_COMPETITION_STARTED,
            'title' => NotificationConstants::TITLE_COMPETITION_STARTED,
            'message' => \sprintf(NotificationConstants::MSG_COMPETITION_STARTED, 'Saison des Blaireaux Sauvages'),
        ]);
    }

    public function testFinishedCompetitionDoesNotTriggerStartNotification(): void
    {
        self::bootKernel();
        $application = new Application(self::$kernel);

        $user = UserFactory::createOne(['player' => PlayerFactory::new()]);

        // 🏁 Compétition commencée il y a 5 jours et terminée hier
        $competition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('-5 days'),
            'endDate' => new \DateTimeImmutable('-1 day'),
            'name' => 'Arène Historique Révolue',
        ]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $user->getPlayer()]);

        $command = $application->find('app:competition:start');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);
        $commandTester->assertCommandIsSuccessful();

        // 🛑 Assertion : Le compteur doit rester à 0, aucune alerte de lancement pour une arène close !
        NotificationFactory::assert()->count(0, [
            'recipient' => $user,
            'type' => NotificationConstants::TYPE_COMPETITION_STARTED,
        ]);
    }
}
