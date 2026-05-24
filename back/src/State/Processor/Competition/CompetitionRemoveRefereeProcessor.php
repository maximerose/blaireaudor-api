<?php

declare(strict_types=1);

namespace App\State\Processor\Competition;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Constants\ErrorMessages;
use App\DTO\Competition\CompetitionRefereeInput;
use App\Entity\Competition;
use App\Repository\PlayerRepository;
use App\Security\Voter\CompetitionVoter;
use App\Service\Manager\CompetitionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class CompetitionRemoveRefereeProcessor implements ProcessorInterface
{
    public function __construct(
        private CompetitionManager $competitionManager,
        private PlayerRepository $playerRepository,
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    /**
     * @param CompetitionRefereeInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Competition
    {
        if (!$this->security->getUser()) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_REQUIRED);
        }

        $competitionId = $uriVariables['id'] ?? null;
        $competition = $this->entityManager->getRepository(Competition::class)->find($competitionId);

        if (!$competition) {
            throw new NotFoundHttpException(ErrorMessages::COMP_NOT_FOUND);
        }

        if (!$this->security->isGranted(CompetitionVoter::MANAGE, $competition)) {
            throw new AccessDeniedHttpException(ErrorMessages::COMP_DENIED_EDIT_REFEREES);
        }

        $player = $this->playerRepository->find($data->playerId);

        if (!$player) {
            throw new NotFoundHttpException(ErrorMessages::PLAYER_NOT_FOUND);
        }

        try {
            $this->competitionManager->removeReferee($competition, $player);
            $this->entityManager->flush();
        } catch (\LogicException $e) {
            throw new BadRequestHttpException($e->getMessage());
        }

        return $competition;
    }
}
