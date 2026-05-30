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
use App\Service\Notification\RefereeNotifier;
use App\State\Processor\Action\ActionCreateProcessor;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class NotificationSystemTest extends KernelTestCase
{
    use ResetDatabase;
    use Factories;

    #[DataProvider('preferenceProvider')]
    public function testActionCreationNotifiesReferees(bool $isPrefEnabled): void
    {
        self::bootKernel();
        $container = static::getContainer();

        $refereePrefs = $isPrefEnabled ? [] : [NotificationConstants::TYPE_NEW_SUBMISSION => false];
        $referee = UserFactory::createOne(['notificationPreferences' => $refereePrefs, 'player' => PlayerFactory::new()]);

        $targetUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $competition = CompetitionFactory::createOne(['referees' => [$referee->getPlayer()]]);

        ParticipationFactory::createOne(['competition' => $competition, 'player' => $targetUser->getPlayer()]);
        $author = UserFactory::createOne(['player' => PlayerFactory::new()]);
        ParticipationFactory::createOne(['competition' => $competition, 'player' => $author->getPlayer()]);

        $input = new ActionCreateInput();
        $input->description = 'A mordu le tapis';
        $input->points = 30;
        $input->dateAction = '2026-02-22T14:00:00Z';
        $input->player = '/api/players/'.$targetUser->getPlayer()->getId();

        $container->get('security.token_storage')->setToken(new UsernamePasswordToken($author, 'main', $author->getRoles()));
        $container->get(ActionCreateProcessor::class)->process($input, new Post(), ['competitionId' => $competition->getId()->toString()]);

        NotificationFactory::assert()->count($isPrefEnabled ? 1 : 0, ['recipient' => $referee, 'type' => NotificationConstants::TYPE_NEW_SUBMISSION]);
    }

    #[DataProvider('preferenceProvider')]
    public function testActionValidationWithFogNotifiesEveryoneWithoutPoints(bool $isPrefEnabled): void
    {
        self::bootKernel();
        $em = static::getContainer()->get(EntityManagerInterface::class);

        $targetPrefs = $isPrefEnabled ? [] : [NotificationConstants::TYPE_ACTION_VALIDATED => false];
        $targetUser = UserFactory::createOne(['notificationPreferences' => $targetPrefs, 'player' => PlayerFactory::new()]);

        $otherUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $comp = CompetitionFactory::createOne(['fogOfWar' => true]);

        $part = ParticipationFactory::createOne(['competition' => $comp, 'player' => $targetUser->getPlayer()]);
        ParticipationFactory::createOne(['competition' => $comp, 'player' => $otherUser->getPlayer()]);

        $action = ActionFactory::createOne(['participation' => $part, 'status' => ActionStatus::PENDING, 'description' => 'Test Fog']);
        $action->setStatus(ActionStatus::VALIDATED);
        $em->flush();

        $c = NotificationConstants::CONTENT[NotificationConstants::TYPE_ACTION_VALIDATED];

        NotificationFactory::assert()->count($isPrefEnabled ? 1 : 0, ['recipient' => $targetUser, 'type' => NotificationConstants::TYPE_ACTION_VALIDATED, 'message' => \sprintf($c['msg_fog_target'], 'Test Fog')]);
        NotificationFactory::assert()->exists(['recipient' => $otherUser, 'type' => NotificationConstants::TYPE_ACTION_VALIDATED, 'message' => \sprintf($c['msg_fog_others'], $targetUser->getPlayer()->getDisplayName())]);
    }

    #[DataProvider('preferenceProvider')]
    public function testPlayerJoinNotifiesOthers(bool $isPrefEnabled): void
    {
        self::bootKernel();
        $em = static::getContainer()->get(EntityManagerInterface::class);

        $comp = CompetitionFactory::createOne();

        $oldUserPrefs = $isPrefEnabled ? [] : [NotificationConstants::TYPE_PLAYER_JOINED => false];
        $oldUser = UserFactory::createOne(['notificationPreferences' => $oldUserPrefs, 'player' => PlayerFactory::new()]);

        ParticipationFactory::createOne(['competition' => $comp, 'player' => $oldUser->getPlayer()]);

        $joiningUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        static::getContainer()->get('security.token_storage')->setToken(new UsernamePasswordToken($joiningUser, 'main', $joiningUser->getRoles()));

        $participation = new Participation();
        $participation->setCompetition($comp);
        $participation->setPlayer($joiningUser->getPlayer());

        $em->persist($participation);
        $em->flush();

        NotificationFactory::assert()->count($isPrefEnabled ? 1 : 0, ['recipient' => $oldUser, 'type' => NotificationConstants::TYPE_PLAYER_JOINED]);
    }

    #[DataProvider('preferenceProvider')]
    public function testBonusDayCreatedNotifiesEveryone(bool $isPrefEnabled): void
    {
        self::bootKernel();
        $em = static::getContainer()->get(EntityManagerInterface::class);

        $userPrefs = $isPrefEnabled ? [] : [NotificationConstants::TYPE_BONUS_TRIGGERED => false];
        $user = UserFactory::createOne(['notificationPreferences' => $userPrefs, 'player' => PlayerFactory::new()]);

        $comp = CompetitionFactory::createOne();
        ParticipationFactory::createOne(['competition' => $comp, 'player' => $user->getPlayer()]);

        $bonus = new BonusDay();
        $bonus->setCompetition($comp);
        $bonus->setDate(new \DateTimeImmutable());
        $bonus->setMultiplier(3);

        $em->persist($bonus);
        $em->flush();

        NotificationFactory::assert()->count($isPrefEnabled ? 1 : 0, ['recipient' => $user, 'type' => NotificationConstants::TYPE_BONUS_TRIGGERED]);
    }

    #[DataProvider('preferenceProvider')]
    public function testRefereePromotedNotifiesTargetAndOthers(bool $isPrefEnabled): void
    {
        self::bootKernel();

        $initiator = UserFactory::createOne(['player' => PlayerFactory::new()]);

        $targetPrefs = $isPrefEnabled ? [] : [NotificationConstants::TYPE_REFEREE_PROMOTED => false];
        $target = UserFactory::createOne(['notificationPreferences' => $targetPrefs, 'player' => PlayerFactory::new()]);

        $bystander = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $comp = CompetitionFactory::createOne();

        ParticipationFactory::createOne(['competition' => $comp, 'player' => $target->getPlayer()]);
        ParticipationFactory::createOne(['competition' => $comp, 'player' => $bystander->getPlayer()]);

        static::getContainer()->get('security.token_storage')->setToken(new UsernamePasswordToken($initiator, 'main', $initiator->getRoles()));

        $notifier = static::getContainer()->get(RefereeNotifier::class);
        $notifier->notifyRoleChanged($comp, $target->getPlayer(), true);

        NotificationFactory::assert()->count($isPrefEnabled ? 1 : 0, ['recipient' => $target, 'type' => NotificationConstants::TYPE_REFEREE_PROMOTED]);
        NotificationFactory::assert()->exists(['recipient' => $bystander, 'type' => NotificationConstants::TYPE_REFEREE_PROMOTED]);
    }

    #[DataProvider('preferenceProvider')]
    public function testGuestClaimingProfileNotifiesRefereesWithoutDuplication(bool $isPrefEnabled): void
    {
        self::bootKernel();
        $em = static::getContainer()->get(EntityManagerInterface::class);

        $guestPlayer = PlayerFactory::createOne(['displayName' => 'Fantôme', 'associatedUser' => null]);

        $refereeA = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $refB_Prefs = $isPrefEnabled ? [] : [NotificationConstants::TYPE_GUEST_CLAIMED => false];
        $refereeB = UserFactory::createOne(['notificationPreferences' => $refB_Prefs, 'player' => PlayerFactory::new()]);

        $comp1 = CompetitionFactory::createOne(['referees' => [$refereeA->getPlayer(), $refereeB->getPlayer()]]);
        ParticipationFactory::createOne(['competition' => $comp1, 'player' => $guestPlayer]);

        $comp2 = CompetitionFactory::createOne(['referees' => [$refereeA->getPlayer()]]);
        ParticipationFactory::createOne(['competition' => $comp2, 'player' => $guestPlayer]);

        $realUser = UserFactory::createOne();
        $guestPlayer->setAssociatedUser($realUser);
        $em->flush();

        NotificationFactory::assert()->count(1, ['recipient' => $refereeA, 'type' => NotificationConstants::TYPE_GUEST_CLAIMED]);
        NotificationFactory::assert()->count($isPrefEnabled ? 1 : 0, ['recipient' => $refereeB, 'type' => NotificationConstants::TYPE_GUEST_CLAIMED]);
    }

    #[DataProvider('preferenceProvider')]
    public function testRefereeAddingPlayerNotifiesTargetOnly(bool $isPrefEnabled): void
    {
        self::bootKernel();
        $em = static::getContainer()->get(EntityManagerInterface::class);

        $refereeUser = UserFactory::createOne(['player' => PlayerFactory::new()]);
        $comp = CompetitionFactory::createOne(['referees' => [$refereeUser->getPlayer()]]);
        ParticipationFactory::createOne(['competition' => $comp, 'player' => $refereeUser->getPlayer()]);

        $bystander = UserFactory::createOne(['player' => PlayerFactory::new()]);
        ParticipationFactory::createOne(['competition' => $comp, 'player' => $bystander->getPlayer()]);

        $targetPrefs = $isPrefEnabled ? [] : [NotificationConstants::TYPE_ADDED_BY_REFEREE => false];
        $targetUser = UserFactory::createOne(['notificationPreferences' => $targetPrefs, 'player' => PlayerFactory::new()]);

        static::getContainer()->get('security.token_storage')->setToken(new UsernamePasswordToken($refereeUser, 'main', $refereeUser->getRoles()));

        $participation = new Participation();
        $participation->setCompetition($comp);
        $participation->setPlayer($targetUser->getPlayer());

        $em->persist($participation);
        $em->flush();

        NotificationFactory::assert()->count($isPrefEnabled ? 1 : 0, [
            'recipient' => $targetUser,
            'type' => NotificationConstants::TYPE_ADDED_BY_REFEREE,
        ]);

        NotificationFactory::assert()->count(0, [
            'type' => NotificationConstants::TYPE_PLAYER_JOINED,
        ]);
    }

    public static function preferenceProvider(): array
    {
        return [
            'Avec Préférences Activées (Défaut)' => [true],
            'Avec Préférences Bloquées (Désactivé)' => [false],
        ];
    }
}
