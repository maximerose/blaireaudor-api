<?php

declare(strict_types=1);

namespace App\State\Processor\Competition;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Constants\ErrorMessages;
use App\DTO\Competition\CompetitionAddPlayersInput;
use App\Entity\Competition;
use App\Security\Voter\CompetitionVoter;
use App\Service\Manager\CompetitionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class CompetitionAddPlayersProcessor implements ProcessorInterface
{
    public function __construct(
        private CompetitionManager $competitionManager,
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    /**
     * @param CompetitionAddPlayersInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Competition
    {
        $user = $this->security->getUser();
        if (!$user) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_REQUIRED);
        }

        $competitionId = $uriVariables['id'] ?? null;
        $competition = $this->entityManager->getRepository(Competition::class)->find($competitionId);

        if (!$competition) {
            throw new NotFoundHttpException(ErrorMessages::COMP_NOT_FOUND);
        }

        if (!$this->security->isGranted(CompetitionVoter::MANAGE, $competition)) {
            throw new AccessDeniedHttpException(ErrorMessages::COMP_DENIED_ADD_PLAYERS);
        }

        $payload = [
            'existing_players_ids' => $data->existingPlayersIds,
            'new_players' => $data->newPlayers,
            'existing_referees_ids' => $data->existingRefereesIds,
            'new_referees' => $data->newReferees,
        ];

        $this->competitionManager->handlePlayersAndRefereesBatch($competition, $payload, $user);
        $this->entityManager->flush();

        return $competition;
    }
}
