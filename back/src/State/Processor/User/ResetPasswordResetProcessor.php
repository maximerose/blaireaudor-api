<?php

declare(strict_types=1);

namespace App\State\Processor\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Constants\ErrorMessages;
use App\DTO\User\ResetPasswordResetInput;
use App\DTO\User\ResetPasswordResponse;
use App\Service\Manager\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

final readonly class ResetPasswordResetProcessor implements ProcessorInterface
{
    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private UserManager $userManager,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param ResetPasswordResetInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ResetPasswordResponse
    {
        $token = $uriVariables['token'] ?? '';

        try {
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface) {
            throw new BadRequestHttpException(ErrorMessages::INVALID_RESET_PASSWORD_TOKEN);
        }

        $this->resetPasswordHelper->removeResetRequest($token);

        $this->userManager->updatePassword($user, $data->plainPassword);
        $this->entityManager->flush();

        return new ResetPasswordResponse('Mot de passe mis à jour avec succès.');
    }
}
