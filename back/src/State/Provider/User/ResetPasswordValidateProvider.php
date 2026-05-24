<?php

declare(strict_types=1);

namespace App\State\Provider\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Constants\ErrorMessages;
use App\DTO\User\ResetPasswordResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

final readonly class ResetPasswordValidateProvider implements ProviderInterface
{
    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ResetPasswordResponse
    {
        $token = $uriVariables['token'] ?? '';

        try {
            $this->resetPasswordHelper->validateTokenAndFetchUser($token);

            return new ResetPasswordResponse('Token valide');
        } catch (ResetPasswordExceptionInterface) {
            throw new BadRequestHttpException(ErrorMessages::INVALID_RESET_PASSWORD_TOKEN);
        }
    }
}
