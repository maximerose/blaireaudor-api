<?php

declare(strict_types=1);

namespace App\State\Provider\Notification;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Constants\ErrorMessages;
use App\Repository\NotificationRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final readonly class NotificationProvider implements ProviderInterface
{
    public function __construct(
        private NotificationRepository $notificationRepository,
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();
        if (!$user) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_REQUIRED);
        }

        if ($operation instanceof CollectionOperationInterface) {
            return $this->notificationRepository->findBy(
                ['recipient' => $user],
                ['createdAt' => 'DESC']
            );
        }

        $id = $uriVariables['id'] ?? null;
        $notification = $this->notificationRepository->find($id);

        if ($notification && $notification->getRecipient() !== $user) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_DENIED);
        }

        return $notification;
    }
}
