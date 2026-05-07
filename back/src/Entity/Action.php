<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Enum\ActionStatus;
use App\Repository\ActionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Représente une action de jeu effectuée par un joueur.
 * * Chaque action rapporte un nombre de points défini et est liée
 * à une compétition spécifique. Elle possède un cycle de vie via son statut.
 */
#[ORM\Entity(repositoryClass: ActionRepository::class)]
#[ApiFilter(SearchFilter::class, properties: ['participation.competition' => 'exact'])]
#[ApiResource(
    normalizationContext: ['groups' => ['action:read']],
    denormalizationContext: ['groups' => ['action:write']],
    forceEager: true,
)]
class Action
{
    use UuidTrait;
    use BlameableTrait;
    use TimestampableTrait;

    public function __construct()
    {
        $this->dateAction = new \DateTimeImmutable();
    }

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['action:read', 'competition:read', 'action:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Type(type: 'integer')]
    #[Groups(['action:read', 'competition:read', 'action:write'])]
    private ?int $points = null;

    /**
     * @var ActionStatus état actuel de l'action (par défaut : PENDING)
     */
    #[ORM\Column(type: 'string', enumType: ActionStatus::class)]
    #[Groups(['action:read', 'competition:read', 'action:write'])]
    private ActionStatus $status = ActionStatus::PENDING;

    #[ORM\Column(nullable: false)]
    #[Groups(['action:read', 'competition:read', 'action:write'])]
    private \DateTimeImmutable $dateAction;

    #[ORM\ManyToOne(targetEntity: Participation::class, inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['action:write'])]
    private ?Participation $participation = null;

    #[Groups(['action:read', 'competition:read'])]
    public function getPlayer(): array
    {
        $player = $this->participation?->getPlayer();

        return [
            'id' => $player?->getId(),
            'display_name' => $player?->getDisplayName(),
        ];
    }

    public function getCompetition(): ?Competition
    {
        return $this->participation?->getCompetition();
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPoints(): ?int
    {
        return $this->points;
    }

    public function setPoints(int $points): static
    {
        $this->points = $points;

        return $this;
    }

    public function getStatus(): ActionStatus
    {
        return $this->status;
    }

    public function setStatus(ActionStatus $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDateAction(): \DateTimeImmutable
    {
        return $this->dateAction;
    }

    public function setDateAction(\DateTimeImmutable $dateAction): static
    {
        $this->dateAction = $dateAction;

        return $this;
    }

    public function getParticipation(): ?Participation
    {
        return $this->participation;
    }

    public function setParticipation(?Participation $participation): static
    {
        $this->participation = $participation;

        if ($participation && !$participation->getActions()->contains($this)) {
            $participation->getActions()->add($this);
        }

        return $this;
    }
}
