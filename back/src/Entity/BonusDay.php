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
use App\Constants\AppConstants;
use App\Constants\ErrorMessages;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\BonusDayRepository;
use App\Security\Voter\CompetitionVoter;
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
    message: ErrorMessages::DUPLICATE_BONUS
)]
#[Assert\Expression(
    expression: 'this.getCompetition() == null or (this.getDate() >= this.getCompetition().getStartDate() and (this.getCompetition().getEndDate() == null or this.getDate() <= this.getCompetition().getEndDate()))',
    message: ErrorMessages::BONUS_DATE_OUT_OF_RANGE
)]
#[ApiFilter(SearchFilter::class, properties: ['competition' => 'exact'])]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('".CompetitionVoter::VIEW."', object.getCompetition())",
            normalizationContext: ['groups' => ['bonus:read']]
        ),
        new GetCollection(normalizationContext: ['groups' => ['bonus:read']]),
        new Post(
            securityPostDenormalize: "is_granted('".CompetitionVoter::REFEREE."', object.getCompetition())",
            securityPostDenormalizeMessage: ErrorMessages::BONUS_DENIED_CREATE,
            denormalizationContext: ['groups' => ['bonus:write']],
            normalizationContext: ['groups' => ['bonus:read']]
        ),
        new Patch(
            security: "is_granted('".CompetitionVoter::REFEREE."', object.getCompetition())",
            securityPostDenormalize: "is_granted('".CompetitionVoter::REFEREE."', object.getCompetition())",
            securityMessage: ErrorMessages::BONUS_DENIED_MANAGE,
            denormalizationContext: ['groups' => ['bonus:write']],
            normalizationContext: ['groups' => ['bonus:read']]
        ),
        new Delete(
            security: "is_granted('".CompetitionVoter::REFEREE."', object.getCompetition())",
            securityMessage: ErrorMessages::BONUS_DENIED_DELETE
        ),
    ],
)]
#[ORM\HasLifecycleCallbacks]
class BonusDay
{
    use UuidTrait;
    use TimestampableTrait;
    use BlameableTrait;

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
        value: AppConstants::BONUS_DEFAULT_MULTIPLIER,
        message: ErrorMessages::BONUS_MIN_VALUE
    )]
    #[Groups(['bonus:read', 'bonus:write', 'competition:read'])]
    private ?int $multiplier = AppConstants::BONUS_DEFAULT_MULTIPLIER;

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

    public function __toString(): string
    {
        return \sprintf(
            'Bonus du %s (x%s)',
            $this->date ? $this->date->format('d/m/Y') : 'Date inconnue',
            $this->multiplier ?? '?'
        );
    }
}
