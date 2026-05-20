<?php

declare(strict_types=1);

namespace App\State\Processor\Participation;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Participation;
use App\Service\Manager\ParticipationManager;
use Doctrine\ORM\EntityManagerInterface;

final readonly class ParticipationDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        private ParticipationManager $participationManager,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param Participation $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        $this->participationManager->removeParticipation($data);
        $this->entityManager->flush();
    }
}
