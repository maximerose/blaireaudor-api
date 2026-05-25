<?php

declare(strict_types=1);

namespace App\Service\Manager;

use App\Constants\ErrorMessages;
use App\Entity\Competition;
use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\PlayerRepository;
use App\Repository\UserRepository;
use App\Service\Helper\ValidationHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserManager
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private PlayerManager $playerManager,
        private PlayerRepository $playerRepository,
        private ParticipationManager $participationManager,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private ValidationHelper $validationHelper,
    ) {
    }

    /**
     * Gère le processus complet de validation et de création d'un utilisateur.
     * Retourne un tableau de violations (vide si succès).
     */
    public function handleRegistration(array $data, UserRepository $userRepository, CompetitionRepository $competitionRepository): array
    {
        $username = trim($data['username'] ?? '');
        $email = trim($data['email'] ?? '');
        $joinCode = $data['join_code'] ?? null;
        $playerId = $data['player_id'] ?? null;
        $competition = null;

        if ($userRepository->count(['username' => $username]) > 0) {
            return ['violations' => [['propertyPath' => 'username', 'message' => ErrorMessages::DUPLICATE_USERNAME]]];
        }

        if ($userRepository->count(['email' => $email]) > 0) {
            return ['violations' => [['propertyPath' => 'email', 'message' => ErrorMessages::DUPLICATE_EMAIL]]];
        }

        if ($joinCode) {
            $cleanJoinCode = strtoupper(trim($joinCode));
            $competition = $competitionRepository->findOneBy(['joinCode' => $cleanJoinCode]);
            if (null === $competition) {
                return ['violations' => [['propertyPath' => 'join_code', 'message' => ErrorMessages::COMP_NOT_FOUND]]];
            }

            if ($competition->getIsFinished()) {
                return ['violations' => [['propertyPath' => 'join_code', 'message' => ErrorMessages::COMP_FINISHED]]];
            }
        }

        if ($playerId) {
            $playerToClaim = $this->playerRepository->find($playerId);
            if (!$playerToClaim) {
                return ['violations' => [['propertyPath' => 'player_id', 'message' => ErrorMessages::PLAYER_NOT_FOUND]]];
            }
            if (null !== $playerToClaim->getAssociatedUser()) {
                return ['violations' => [['propertyPath' => 'player_id', 'message' => ErrorMessages::PLAYER_ALREADY_LINKED]]];
            }
        }

        $user = $this->registerUser($username, $data['plain_password'] ?? '', $data['display_name'] ?? '', $competition, $playerId, $email);

        $errors = $this->validator->validate($user);
        if (\count($errors) > 0) {
            return ['violations' => $this->validationHelper->formatErrors($errors)];
        }

        return ['user' => $user];
    }

    /**
     * Devient PRIVATE car encapsulée par handleRegistration.
     */
    private function registerUser(string $username, string $plainPassword, string $displayName, ?Competition $competition, ?string $playerId, string $email): User
    {
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($this->passwordHasher->hashPassword($user, $plainPassword));

        $player = null;

        if ($playerId) {
            $player = $this->playerRepository->find($playerId);
            $player->setDisplayName($displayName);
        } else {
            $player = $this->playerManager->createPlayer($displayName);
        }

        $player->setUsername($username);
        $player->setAssociatedUser($user);
        $user->setPlayer($player);

        if ($competition) {
            $this->participationManager->joinCompetition($player, $competition);
        }

        $this->entityManager->persist($user);
        $this->entityManager->persist($player);

        return $user;
    }

    public function updatePassword(User $user, string $newPlainPassword): void
    {
        $user->setPassword($this->passwordHasher->hashPassword($user, $newPlainPassword));
    }

    public function updateProfile(User $user, array $data): array
    {
        $player = $user->getPlayer();

        if (!empty($data['new_password'])) {
            if (empty($data['current_password']) || !$this->passwordHasher->isPasswordValid($user, $data['current_password'])) {
                return [['propertyPath' => 'current_password', 'message' => ErrorMessages::INVALID_CURRENT_PASSWORD]];
            }
            $this->updatePassword($user, $data['new_password']);
        }

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

        $userErrors = $this->validator->validate($user);
        $playerErrors = $player ? $this->validator->validate($player) : [];

        if (\count($userErrors) > 0 || \count($playerErrors) > 0) {
            return [
                ...$this->validationHelper->formatErrors($userErrors),
                ...$playerErrors ? $this->validationHelper->formatErrors($playerErrors) : [],
            ];
        }

        return [];
    }
}
