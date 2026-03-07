<?php

declare(strict_types=1);

namespace App\Serializer;

use App\Entity\Participation;
use App\Repository\ParticipationRepository;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class ParticipationNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'PARTICIPATION_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        private readonly ParticipationRepository $repository
    ) {
    }

    public function normalize($object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        if ($object instanceof Participation) {
            // Calcul du rang : 1 + nombre de gens ayant un score > au mien dans cette compétition
            $rank = $this->repository->countHigherScores(
                $object->getCompetition(),
                $object->getScore()
            ) + 1;

            $object->setRank($rank);
        }

        $context[self::ALREADY_CALLED] = true;

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Participation;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [Participation::class => false];
    }
}
