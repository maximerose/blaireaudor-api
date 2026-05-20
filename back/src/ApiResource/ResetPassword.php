<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation as OpenApiOperation;
use App\DTO\User\ResetPasswordRequestInput;
use App\DTO\User\ResetPasswordResetInput;
use App\DTO\User\ResetPasswordResponse;
use App\State\Processor\User\ResetPasswordRequestProcessor;
use App\State\Processor\User\ResetPasswordResetProcessor;
use App\State\Provider\User\ResetPasswordValidateProvider;

#[ApiResource(
    shortName: 'ResetPassword',
    operations: [
        // Étape 1 : Demande de lien (POST)
        new Post(
            uriTemplate: '/reset-password',
            input: ResetPasswordRequestInput::class,
            output: ResetPasswordResponse::class,
            processor: ResetPasswordRequestProcessor::class,
            openapi: new OpenApiOperation(summary: 'Étape 1 : Demande de réinitialisation (Envoi email)')
        ),
        // Étape 2 : Validation du token (GET)
        new Get(
            uriTemplate: '/reset-password/{token}',
            output: ResetPasswordResponse::class,
            provider: ResetPasswordValidateProvider::class,
            openapi: new OpenApiOperation(summary: 'Étape 2 : Vérification de la validité du token')
        ),
        // Étape 3 : Changement effectif (POST)
        new Post(
            name: 'reset_password_confirm',
            uriTemplate: '/reset-password/{token}',
            input: ResetPasswordResetInput::class,
            output: ResetPasswordResponse::class,
            processor: ResetPasswordResetProcessor::class,
            openapi: new OpenApiOperation(summary: 'Étape 3 : Remplacement du mot de passe')
        ),
    ]
)]
final class ResetPassword
{
}
