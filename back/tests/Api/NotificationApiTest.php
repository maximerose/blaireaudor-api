<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Entity\PushSubscription;
use App\Factory\NotificationFactory;
use App\Factory\UserFactory;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class NotificationApiTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testUnauthenticatedUserCannotReadNotifications(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/notifications');

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testUserCanOnlyFetchTheirOwnNotifications(): void
    {
        $client = static::createClient();

        $userMe = UserFactory::createOne();
        $userOther = UserFactory::createOne();

        NotificationFactory::createMany(2, ['recipient' => $userMe]);
        NotificationFactory::createOne(['recipient' => $userOther]);

        $client->loginUser($userMe);

        $client->request('GET', '/api/notifications', [], [], ['HTTP_ACCEPT' => 'application/ld+json']);

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $members = $data['hydra:member'] ?? $data['member'] ?? null;

        if (null === $members) {
            foreach ($data as $value) {
                if (\is_array($value)) {
                    $members = $value;
                    break;
                }
            }
        }

        if (null === $members) {
            $members = $data;
        }

        $this->assertCount(2, $members);
    }

    public function testUserCanMarkNotificationAsRead(): void
    {
        $client = static::createClient();
        $user = UserFactory::createOne();
        $notification = NotificationFactory::createOne(['recipient' => $user, 'isRead' => false]);

        $client->loginUser($user);

        $client->request(
            'PATCH',
            '/api/notifications/'.$notification->getId(),
            [],
            [],
            ['CONTENT_TYPE' => 'application/merge-patch+json', 'HTTP_ACCEPT' => 'application/ld+json'],
            json_encode(['is_read' => true])
        );

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertTrue($data['is_read']);
    }

    public function testUserCanSubscribeToWebPushWithoutDuplicates(): void
    {
        $client = static::createClient();
        $tokenManager = static::getContainer()->get(JWTTokenManagerInterface::class);

        $user = UserFactory::createOne();

        $client->loginUser($user);
        $client->setServerParameter('HTTP_AUTHORIZATION', 'Bearer '.$tokenManager->create($user));

        $payload = [
            'endpoint' => 'https://updates.push.services.com/wpush/v2/abc',
            'p256dh' => 'BIPb7...',
            'auth' => 'X0rA...',
        ];

        $client->request('POST', '/api/push_subscriptions', [], [], ['CONTENT_TYPE' => 'application/ld+json', 'HTTP_ACCEPT' => 'application/ld+json'], json_encode($payload));
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $client->request('POST', '/api/push_subscriptions', [], [], ['CONTENT_TYPE' => 'application/ld+json', 'HTTP_ACCEPT' => 'application/ld+json'], json_encode($payload));
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $this->assertEquals(1, static::getContainer()->get('doctrine')->getRepository(PushSubscription::class)->count([]));
    }
}
