<?php

declare(strict_types=1);

namespace App\State\Processor\Competition;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Symfony\Security\Exception\AccessDeniedException;
use ApiPlatform\Validator\Exception\ValidationException;
use App\DTO\Competition\CompetitionCreateInput;
use App\Entity\Competition;
use App\Service\Manager\CompetitionManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;

final readonly class CompetitionCreateProcessor implements ProcessorInterface
{
    public function __construct(
        private CompetitionManager $competitionManager,
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    /**
     * @param CompetitionCreateInput $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Competition
    {
        $user = $this->security->getUser();

        if (!$user) {
            throw new AccessDeniedException('Vous devez être connecté.');
        }

        $payload = [
            'name' => $data->name,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
            'join_code' => $data->joinCode,
            'fog_of_war' => $data->fogOfWar,
            'participate' => $data->participate,
            'is_creator_referee' => $data->isCreatorReferee,
        ];

        $result = $this->competitionManager->handleCreation($payload, $user);

        if (isset($result['violations'])) {
            $violationList = new ConstraintViolationList();
            foreach ($result['violations'] as $error) {
                $violationList->add(new ConstraintViolation(
                    $error['message'], null, [], null, $error['propertyPath'], null
                ));
            }
            throw new ValidationException($violationList);
        }

        $this->entityManager->flush();

        return $result['competition'];
    }
}
