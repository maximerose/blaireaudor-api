<?php

declare(strict_types=1);

namespace App\State\Processor\Competition;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Competition;
use App\Service\Manager\CompetitionManager;
use Doctrine\ORM\EntityManagerInterface;

final readonly class CompetitionUpdateProcessor implements ProcessorInterface
{
    public function __construct(
        private CompetitionManager $competitionManager,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param Competition $data L'entité déjà hydratée avec les nouvelles valeurs du PATCH
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Competition
    {
        // On applique nos règles métier de cohérence des dates
        $this->competitionManager->enforceDateRules($data);

        // On sauvegarde explicitement les changements (ainsi que les suppressions de bonus)
        $this->entityManager->flush();

        return $data;
    }
}
