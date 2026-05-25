<?php

declare(strict_types=1);

namespace App\Tests\Unit\EventListener;

use App\Entity\Notification;
use App\Entity\PushSubscription;
use App\Entity\User;
use App\EventListener\WebPushNotificationListener;
use App\Repository\PushSubscriptionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Minishlink\WebPush\WebPush;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

#[AllowMockObjectsWithoutExpectations]
final class WebPushNotificationListenerTest extends TestCase
{
    public function testPostPersistQueuesAndFlushesWebPush(): void
    {
        $webPushMock = $this->createMock(WebPush::class);
        $repoMock = $this->createMock(PushSubscriptionRepository::class);
        $loggerMock = $this->createMock(LoggerInterface::class);

        $user = $this->createMock(User::class);

        $notification = new Notification();
        $notification->setRecipient($user);
        $notification->setTitle('🚨 Alerte Blaireau');
        $notification->setMessage('Ceci est un test de Web Push.');
        $notification->setTargetUrl('/competitions/TEST');

        // On simule un appareil enregistré pour ce joueur
        $sub1 = new PushSubscription();
        $sub1->setEndpoint('https://browser.push.com/abc');
        $sub1->setP256dh('p256dh-key');
        $sub1->setAuth('auth-key');

        $repoMock->expects($this->once())
            ->method('findBy')
            ->with(['user' => $user])
            ->willReturn([$sub1]);

        // Le WebPush doit formater le JSON et cibler l'appareil
        $webPushMock->expects($this->once())
            ->method('queueNotification')
            ->with(
                $this->callback(fn ($sub) => 'https://browser.push.com/abc' === $sub->getEndpoint()),
                $this->callback(function ($payload) {
                    $data = json_decode($payload, true);

                    return '🚨 Alerte Blaireau' === $data['title']
                        && 'Ceci est un test de Web Push.' === $data['message']
                        && '/competitions/TEST' === $data['targetUrl'];
                })
            );

        // Puis il doit déclencher l'envoi HTTP
        $webPushMock->expects($this->once())
            ->method('flush');

        $entityManagerMock = $this->createMock(EntityManagerInterface::class);
        $eventArgs = new PostPersistEventArgs($notification, $entityManagerMock);

        $listener = new WebPushNotificationListener($repoMock, $webPushMock, $loggerMock);
        $listener->postPersist($notification, $eventArgs);
    }
}
