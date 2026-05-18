<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\ValidationHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api.profile.')]
final class ProfileController extends AbstractController
{
    #[Route('/me', name: 'update', methods: ['PATCH'])]
    public function updateProfile(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        ValidationHelper $validationHelper,
    ): JsonResponse {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(['message' => 'Non autorisé'], Response::HTTP_UNAUTHORIZED);
        }

        $data = $request->toArray();
        $player = $user->getPlayer();

        if (isset($data['display_name']) && $player) {
            $player->setDisplayName(trim($data['display_name']));
        }

        if (isset($data['username'])) {
            $slugger = new AsciiSlugger();
            $newUsername = strtolower($slugger->slug(trim($data['username']))->toString());

            $user->setUsername($newUsername);
            if ($player) {
                $player->setUsername($newUsername);
            }
        }

        if (isset($data['email'])) {
            $user->setEmail(trim($data['email']));
        }

        if (!empty($data['new_password'])) {
            if (empty($data['current_password']) || !$passwordHasher->isPasswordValid($user, $data['current_password'])) {
                return $this->json([
                    'violations' => [['propertyPath' => 'current_password', 'message' => 'Le mot de passe actuel est invalide.']],
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            $user->setPlainPassword($data['new_password']);
        }

        $userErrors = $validator->validate($user);
        $playerErrors = $player ? $validator->validate($player) : [];

        if (\count($userErrors) > 0 || \count($playerErrors) > 0) {
            $violations = [];
            $allErrors = [
                ...$validationHelper->formatErrors($userErrors),
                ...$playerErrors ? $validationHelper->formatErrors($playerErrors) : [],
            ];
            foreach ($allErrors as $path => $message) {
                $violations[] = ['propertyPath' => $path, 'message' => $message];
            }

            return $this->json(['violations' => $violations], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $entityManager->flush();

        return $this->json($user, Response::HTTP_OK, [], ['groups' => ['user:read']]);
    }
}
