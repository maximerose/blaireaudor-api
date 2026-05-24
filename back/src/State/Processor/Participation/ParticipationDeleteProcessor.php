<?php

declare(strict_types=1);

namespace App\State\Processor\Participation;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Constants\ErrorMessages;
use App\Entity\Participation;
use App\Entity\User;
use App\Security\Voter\CompetitionVoter;
use App\Service\Manager\ParticipationManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final readonly class ParticipationDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        private ParticipationManager $participationManager,
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    /**
     * @param Participation $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        $competition = $data->getCompetition();
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException(ErrorMessages::AUTH_DENIED);
        }

        $isManager = $this->security->isGranted(CompetitionVoter::MANAGE, $competition);
        $isSelf = $user && $user->getPlayer() === $data->getPlayer();

        if (!$isManager && !$isSelf) {
            throw new AccessDeniedHttpException(ErrorMessages::PART_DENIED_DELETE);
        }

        $this->participationManager->removeParticipation($data);
        $this->entityManager->flush();
    }
}
