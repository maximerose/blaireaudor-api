<?php

declare(strict_types=1);

namespace App\State\Processor\Action;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Constants\ErrorMessages;
use App\DTO\Action\ActionCreateInput;
use App\Entity\Action;
use App\Entity\Competition;
use App\Security\Voter\CompetitionVoter;
use App\Service\Manager\ActionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class ActionCreateProcessor implements ProcessorInterface
{
    public function __construct(
        private ActionManager $actionManager,
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    /**
     * @param ActionCreateInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Action
    {
        $user = $this->security->getUser();
        if (!$user) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_REQUIRED);
        }

        $competitionId = $uriVariables['competitionId'] ?? null;
        $competition = $this->entityManager->getRepository(Competition::class)->find($competitionId);

        if (!$competition) {
            throw new NotFoundHttpException(ErrorMessages::COMP_NOT_FOUND);
        }

        if (!$this->security->isGranted(CompetitionVoter::PLAYER, $competition)) {
            throw new AccessDeniedHttpException(ErrorMessages::COMP_MUST_PARTICIPATE);
        }

        $payload = [
            'description' => $data->description,
            'points' => $data->points,
            'date_action' => $data->dateAction,
            'player' => $data->player,
        ];

        $action = $this->actionManager->createActionFromPayload($competition, $user, $payload);
        $this->entityManager->flush();

        return $action;
    }
}
