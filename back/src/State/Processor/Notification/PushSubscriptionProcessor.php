<?php

declare(strict_types=1);

namespace App\State\Processor\Notification;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Constants\ErrorMessages;
use App\Entity\PushSubscription;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final readonly class PushSubscriptionProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): PushSubscription
    {
        $user = $this->security->getUser();
        if (!$user) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_REQUIRED);
        }

        /** @var PushSubscription $data */
        $repo = $this->entityManager->getRepository(PushSubscription::class);
        $existing = $repo->findOneBy(['endpoint' => $data->getEndpoint()]);

        if ($existing) {
            $existing->setUser($user);
            $existing->setP256dh($data->getP256dh());
            $existing->setAuth($data->getAuth());

            return $existing;
        }

        $data->setUser($user);
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}
