<?php

declare(strict_types=1);

namespace App\State\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\Exception\ValidationException;
use App\Dto\RegistrationInput;
use App\Entity\User;
use App\Repository\CompetitionRepository;
use App\Repository\UserRepository;
use App\Service\Manager\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;

final class UserRegistrationProcessor implements ProcessorInterface
{
    public function __construct(
        private UserManager $userManager,
        private UserRepository $userRepository,
        private CompetitionRepository $competitionRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param RegistrationInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): User
    {
        $payload = [
            'username' => $data->username,
            'email' => $data->email,
            'plain_password' => $data->plainPassword,
            'display_name' => $data->displayName,
            'join_code' => $data->joinCode,
            'player_id' => $data->playerId,
        ];

        $result = $this->userManager->handleRegistration($payload, $this->userRepository, $this->competitionRepository);

        if (isset($result['violations'])) {
            $violationList = new ConstraintViolationList();
            foreach ($result['violations'] as $error) {
                $violationList->add(new ConstraintViolation(
                    $error['message'], null, [], null, $error['propertyPath'], null
                ));
            }
            throw new ValidationException($violationList);
        }

        $this->entityManager->flush();

        return $result['user'];
    }
}
