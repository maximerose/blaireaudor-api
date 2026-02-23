<?php

namespace App\Controller\Api;

use App\Entity\Participation;
use App\Entity\Player;
use App\Entity\User;
use App\Repository\CompetitionRepository;
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
    ) {
    }

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = $request->toArray();

        $username = $data['username'] ?? null;
        $plainPassword = $data['plain_password'] ?? null;
        $displayName = $data['display_name'] ?? null;

        $user = new User();
        $user->setUsername($username);
        $user->setPlainPassword($plainPassword);

        $player = new Player();
        $player->setDisplayName($displayName);
        $player->setUsername($username);

        $player->setAssociatedUser($user);
        $user->setPlayer($player);
        
        $joinCode = $data['join_code'] ?? null;

        if (null !== $joinCode) {
            $competition = $this->competitionRepository->findOneby(['joinCode' => $joinCode]);

            if (null === $competition) {
                return $this->json([
                    'message' => 'La compétition n\'existe pas.'
                ], Response::HTTP_NOT_FOUND);
            } else {
                $participation = new Participation();
                $participation->setCompetition($competition);
                $participation->setPlayer($player);

                $this->entityManager->persist($participation);
            }
        }

        $errors = $this->validator->validate($user);

        if (count($errors) > 0) {
            $messages = [];

            foreach ($errors as $violation) {
                $messages[$violation->getPropertyPath()] = $violation->getMessage();
            }

            return $this->json(['errors' => $messages], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $this->entityManager->persist($user);
        $this->entityManager->persist($player);

        $this->entityManager->flush();

        return $this->json([
            'message' => 'Inscription réussie',
            'user' => $user->getUserIdentifier(),
        ], Response::HTTP_CREATED);
    }
}
