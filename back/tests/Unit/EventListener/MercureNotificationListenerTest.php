<?php

declare(strict_types=1);

namespace App\Tests\Unit\EventListener;

use App\Constants\NotificationConstants;
use App\Entity\Notification;
use App\Entity\User;
use App\EventListener\MercureNotificationListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\Uuid;

#[AllowMockObjectsWithoutExpectations]
final class MercureNotificationListenerTest extends TestCase
{
    public function testPostPersistPublishesToMercureHub(): void
    {
        // 1. Préparation des Mocks
        $hubMock = $this->createMock(HubInterface::class);
        $serializerMock = $this->createMock(SerializerInterface::class);

        $userId = Uuid::v4();
        $user = $this->createMock(User::class);
        $user->method('getId')->willReturn($userId);

        $notification = new Notification();
        $notification->setRecipient($user);
        $notification->setTitle('Test Alerte');

        $entityManagerMock = $this->createMock(EntityManagerInterface::class);
        $eventArgs = new PostPersistEventArgs($notification, $entityManagerMock);

        // 2. Définition du comportement attendu : Le sérialiseur doit formater la notification
        $expectedJson = '{"title":"Test Alerte"}';
        $serializerMock->expects($this->once())
            ->method('serialize')
            ->with($notification, 'json', ['groups' => ['notification:read']])
            ->willReturn($expectedJson);

        // 3. Définition du comportement attendu : Le Hub doit publier l'Update
        $expectedTopic = \sprintf(NotificationConstants::TOPIC_USER_NOTIFICATIONS, $userId->toString());

        $hubMock->expects($this->once())
            ->method('publish')
            ->with($this->callback(fn (Update $update) =>
             \in_array($expectedTopic, $update->getTopics(), true)
                    && $update->getData() === $expectedJson
                    && $update->isPrivate() === true
            ));

        // 4. Exécution
        $listener = new MercureNotificationListener($hubMock, $serializerMock);
        $listener->postPersist($notification, $eventArgs);
    }
}