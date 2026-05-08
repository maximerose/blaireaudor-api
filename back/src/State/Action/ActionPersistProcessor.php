<?php

declare(strict_types=1);

namespace App\State\Action;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Action;
use App\Service\ActionManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class ActionPersistProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
        private ActionManager $actionManager,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        if ($result instanceof Action) {
            $this->actionManager->updateScore($result->getParticipation());
        }

        return $result;
    }
}
