<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\BonusDayRepository;
use App\State\BonusDay\BonusDayPersistProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Représente une journée où les points des actions sont multipliés.
 */
#[ORM\Entity(repositoryClass: BonusDayRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_COMPETITION_DATE', fields: ['competition', 'date'])]
#[UniqueEntity(
    fields: ['competition', 'date'],
    message: self::ERROR_DUPLICATE_BONUS
)]
#[Assert\Expression(
    expression: 'this.getCompetition() == null or (this.getDate() >= this.getCompetition().getStartDate() and (this.getCompetition().getEndDate() == null or this.getDate() <= this.getCompetition().getEndDate()))',
    message: self::ERROR_DATE_OUT_OF_RANGE
)]
#[ApiFilter(SearchFilter::class, properties: ['competition' => 'exact'])]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['bonus:read']]),
        new GetCollection(normalizationContext: ['groups' => ['bonus:read']]),
        new Post(
            securityPostDenormalize: "is_granted('MANAGE', object.getCompetition())",
            securityPostDenormalizeMessage: 'Seul un arbitre peut programmer un jour bonus.',
            denormalizationContext: ['groups' => ['bonus:write']],
            normalizationContext: ['groups' => ['bonus:read']]
        ),
        new Patch(
            security: "is_granted('MANAGE', object.getCompetition())",
            securityMessage: 'Seul un arbitre peut modifier ce jour bonus.',
            denormalizationContext: ['groups' => ['bonus:write']],
            normalizationContext: ['groups' => ['bonus:read']]
        ),
        new Delete(
            security: "is_granted('MANAGE', object.getCompetition())",
            securityMessage: 'Seul un arbitre peut supprimer ce jour bonus.'
        ),
    ],
    processor: BonusDayPersistProcessor::class,
)]
#[ORM\HasLifecycleCallbacks]
class BonusDay
{
    use UuidTrait;
    use TimestampableTrait;
    use BlameableTrait;

    public const DEFAULT_MULTIPLIER = 2;
    public const ERROR_DATE_OUT_OF_RANGE = 'La date du jour bonus doit être comprise dans les dates de la compétition.';
    public const ERROR_DUPLICATE_BONUS = 'Un bonus est déjà programmé pour cette arène à cette date.';

    #[ORM\ManyToOne(targetEntity: Competition::class, inversedBy: 'bonusDays')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['bonus:read', 'bonus:write'])]
    private ?Competition $competition = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Assert\NotBlank]
    #[Groups(['bonus:read', 'bonus:write', 'competition:read'])]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(type: Types::INTEGER)]
    #[Assert\NotBlank]
    #[Assert\GreaterThanOrEqual(
        value: self::DEFAULT_MULTIPLIER,
        message: "Le multiplicateur doit être d'au moins {{ value }}."
    )]
    #[Groups(['bonus:read', 'bonus:write', 'competition:read'])]
    private ?int $multiplier = self::DEFAULT_MULTIPLIER;

    public function getCompetition(): ?Competition
    {
        return $this->competition;
    }

    public function setCompetition(?Competition $competition): static
    {
        $this->competition = $competition;

        if ($competition && !$competition->getBonusDays()->contains($this)) {
            $competition->getBonusDays()->add($this);
        }

        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getMultiplier(): ?int
    {
        return $this->multiplier;
    }

    public function setMultiplier(int $multiplier): static
    {
        $this->multiplier = $multiplier;

        return $this;
    }
}
