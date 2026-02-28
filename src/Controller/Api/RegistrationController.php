<?php

namespace App\Controller\Api;

use App\Repository\CompetitionRepository;
use App\Service\UserManager;
use App\Service\ValidationHelper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api.')]
final class RegistrationController extends AbstractController 
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private CompetitionRepository $competitionRepository,
        private ValidatorInterface $validator,
        private ValidationHelper $validationHelper
    ) {
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, UserManager $userManager): JsonResponse
    {
        $data = $request->toArray();

        $joinCode = $data['join_code'] ?? null;
        $competition = null;

        if ($joinCode) {
            $competition = $this->competitionRepository->findOneBy(['joinCode' => $joinCode]);
            
            if (null === $competition) {
                return $this->json([
                    'message' => 'La compétition n\'existe pas.'
                ], Response::HTTP_NOT_FOUND);
            }
        }

        $user = $userManager->registerUser(
            $data['username'] ?? '',
            $data['plain_password'] ?? '',
            $data['display_name'] ?? '',
            $competition
        );

        $errors = $this->validator->validate($user);

        if (count($errors) > 0) {
            return $this->json([
                'errors' => $this->validationHelper->formatErrors($errors)
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        }

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Inscription réussie',
            'user' => $user->getUserIdentifier(),
        ], Response::HTTP_CREATED);
    }
}
