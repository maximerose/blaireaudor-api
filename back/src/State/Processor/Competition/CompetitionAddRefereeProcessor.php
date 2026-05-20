<?php

declare(strict_types=1);

namespace App\State\Processor\Competition;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\DTO\Competition\CompetitionRefereeInput;
use App\Entity\Competition;
use App\Repository\PlayerRepository;
use App\Security\Voter\CompetitionVoter;
use App\Service\Manager\CompetitionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class CompetitionAddRefereeProcessor implements ProcessorInterface
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
            throw new AccessDeniedHttpException('Vous devez être connecté.');
        }

        $competitionId = $uriVariables['id'] ?? null;
        $competition = $this->entityManager->getRepository(Competition::class)->find($competitionId);

        if (!$competition) {
            throw new NotFoundHttpException('Compétition introuvable.');
        }

        if (!$this->security->isGranted(CompetitionVoter::MANAGE, $competition)) {
            throw new AccessDeniedHttpException('Seul un gestionnaire peut modifier les arbitres.');
        }

        $player = $this->playerRepository->find($data->playerId);

        if (!$player) {
            throw new NotFoundHttpException('Joueur introuvable');
        }

        $this->competitionManager->addReferee($competition, $player);
        $this->entityManager->flush();

        return $competition;
    }
}
