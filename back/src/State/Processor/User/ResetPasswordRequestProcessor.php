<?php

declare(strict_types=1);

namespace App\State\Processor\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\DTO\User\ResetPasswordResponse;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

final readonly class ResetPasswordRequestProcessor implements ProcessorInterface
{
    private const string SUCCESS_MESSAGE = 'Si un compte correspond à cette adresse, un email a été envoyé.';

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager,
        private MailerInterface $mailer,
    ) {
    }

    /**
     * @param \App\DTO\User\ResetPasswordRequestInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ResetPasswordResponse
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data->email]);

        // SÉCURITÉ : On ne révèle jamais si l'email existe pour éviter le scraping.
        if (!$user) {
            return new ResetPasswordResponse(self::SUCCESS_MESSAGE);
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface) {
            return new ResetPasswordResponse(self::SUCCESS_MESSAGE);
        }

        $frontendUrl = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';

        $emailMessage = (new TemplatedEmail())
            ->from(new Address('no-reply@blaireaudor.com', 'Le Maître Blaireau'))
            ->to((string) $user->getEmail())
            ->subject('Réinitialisation de votre mot de passe')
            ->htmlTemplate('reset_password/email.html.twig')
            ->context([
                'resetToken' => $resetToken,
                'frontend_url' => $frontendUrl,
            ]);

        $this->mailer->send($emailMessage);

        return new ResetPasswordResponse(self::SUCCESS_MESSAGE);
    }
}
