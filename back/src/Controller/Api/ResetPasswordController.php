<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\Manager\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

#[Route('/api/reset-password', name: 'api.reset_password.')]
final class ResetPasswordController extends AbstractController
{
    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * Étape 1 : Demande de réinitialisation (envoi de l'email).
     */
    #[Route('', name: 'request', methods: ['POST'])]
    public function request(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = $request->toArray();
        $email = $data['email'] ?? null;

        if (!$email) {
            return $this->json(['message' => 'Email manquant'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        // SÉCURITÉ : On ne révèle jamais si l'email existe en base pour éviter le "scraping" d'emails.
        // On renvoie toujours un succès générique.
        if (!$user) {
            return $this->json(['message' => 'Si un compte correspond à cette adresse, un email a été envoyé.']);
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json(['message' => 'Si un compte correspond à cette adresse, un email a été envoyé.']);
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

        $mailer->send($emailMessage);

        return $this->json(['message' => 'Si un compte correspond à cette adresse, un email a été envoyé.']);
    }

    /**
     * Étape 2 : Vérification de la validité du token (Optionnel mais super pour l'UX Front).
     */
    #[Route('/{token}', name: 'validate', methods: ['GET'])]
    public function validateToken(string $token): JsonResponse
    {
        try {
            $this->resetPasswordHelper->validateTokenAndFetchUser($token);

            return $this->json(['message' => 'Token valide']);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json(['message' => 'Le lien de réinitialisation est invalide ou a expiré.'], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Étape 3 : Changement effectif du mot de passe.
     */
    #[Route('/{token}', name: 'reset', methods: ['POST'])]
    public function reset(string $token, Request $request, UserManager $userManager): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json(['message' => 'Le lien de réinitialisation est invalide ou a expiré.'], Response::HTTP_BAD_REQUEST);
        }

        $data = $request->toArray();
        $newPassword = $data['plain_password'] ?? null;

        if (empty($newPassword) || \strlen($newPassword) < 6) {
            return $this->json([
                'violations' => [['propertyPath' => 'plain_password', 'message' => 'Le mot de passe doit contenir au moins 6 caractères.']],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->resetPasswordHelper->removeResetRequest($token);

        $userManager->updatePassword($user, $newPassword);
        $this->entityManager->flush();

        return $this->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }
}
