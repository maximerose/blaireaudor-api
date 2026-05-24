<?php

declare(strict_types=1);

namespace App\State\Processor\User;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\Exception\ValidationException;
use App\Constants\ErrorMessages;
use App\DTO\User\ProfileUpdateInput;
use App\Entity\User;
use App\Service\Manager\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;

final readonly class ProfileUpdateProcessor implements ProcessorInterface
{
    public function __construct(
        private UserManager $userManager,
        private EntityManagerInterface $entityManager,
        private Security $security,
        private JWTTokenManagerInterface $jwtManager,
        private SerializerInterface $serializer,
    ) {
    }

    /**
     * @param ProfileUpdateInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Response
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_DENIED);
        }

        $payload = [
            'display_name' => $data->displayName,
            'username' => $data->username,
            'email' => $data->email,
            'current_password' => $data->currentPassword,
            'new_password' => $data->newPassword,
        ];

        $violations = $this->userManager->updateProfile($user, $payload);

        if (!empty($violations)) {
            $violationList = new ConstraintViolationList();
            foreach ($violations as $error) {
                $violationList->add(new ConstraintViolation(
                    $error['message'], null, [], null, $error['propertyPath'], null
                ));
            }
            throw new ValidationException($violationList);
        }

        $this->entityManager->flush();

        $newToken = $this->jwtManager->create($user);

        $json = $this->serializer->serialize([
            'user' => $user,
            'token' => $newToken,
        ],
            'json',
            ['groups' => ['user:read']]
        );

        return new Response($json, Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }
}
