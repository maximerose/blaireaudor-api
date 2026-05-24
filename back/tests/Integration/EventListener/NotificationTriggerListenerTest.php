<?php

declare(strict_types=1);

namespace App\Tests\Integration\EventListener;

use ApiPlatform\Metadata\Post;
use App\Constants\NotificationConstants;
use App\DTO\Action\ActionCreateInput;
use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\NotificationFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use App\State\Processor\Action\ActionCreateProcessor;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
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

    public function testValidatedActionWithFogOfWarTrueOnlyNotifiesTargetWithoutPoints(): void
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
            'message' => \sprintf(NotificationConstants::MSG_ACTION_VALIDATED_FOG, 'A repeint le gîte au vin rouge'),
        ]);

        NotificationFactory::assert()->count(0, [
            'recipient' => $otherUser,
            'type' => NotificationConstants::TYPE_ACTION_VALIDATED,
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

        // 🟢 Message cible dynamique via les constantes
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
}
