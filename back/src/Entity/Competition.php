<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\CompetitionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Représente une compétition du Blaireau d'Or.
 * * Gère le cycle de vie de la compétition (dates, statut) et centralise
 * les participations des joueurs ainsi que les actions de jeu.
 */
#[ORM\Entity(repositoryClass: CompetitionRepository::class)]
#[UniqueEntity(fields: ['slug'])]
#[Assert\Expression(
    "this.getEndDate() == null || this.getEndDate() >= this.getStartDate()",
    message: "La date de fin doit être postérieure à la date de début"
)]
#[ApiResource(
    normalizationContext: ['groups' => ['competition:read']],
    denormalizationContext: ['groups' => ['competition:write']]
)]
class Competition
{
    use UuidTrait;
    use TimestampableTrait;
    use BlameableTrait;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['competition:read', 'competition:write', 'user:read', 'action:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Gedmo\Slug(fields: ['name'], unique: true)]
    #[Groups(['competition:read'])]
    private ?string $slug = null;

    #[ORM\Column(length: 10, unique: true)]
    #[Assert\Length(max: 10)]
    #[Groups(['competition:read', 'competition:write', 'user:read'])]
    private ?string $joinCode = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Groups(['competition:read', 'competition:write', 'user:read'])]
    private ?\DateTimeImmutable $startDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['competition:read', 'competition:write', 'user:read'])]
    private ?\DateTimeImmutable $endDate = null;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['competition:read', 'user:read'])]
    private ?bool $isFinished = false;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    #[Groups(['competition:read', 'competition:write', 'user:read'])]
    private ?bool $fogOfWar = true;

    /**
     * Liste des participations (joueurs inscrits et leurs scores).
     * @var Collection<int, Participation>
     */
    #[ORM\OneToMany(targetEntity: Participation::class, mappedBy: 'competition', orphanRemoval: true)]
    #[Groups(['competition:read', 'action:read'])]
    private Collection $participations;

    /**
     * Liste des actions enregistrées durant cette compétition.
     * @var Collection<int, Action>
     */
    #[ORM\OneToMany(targetEntity: Action::class, mappedBy: 'competition', orphanRemoval: true)]
    private Collection $actions;

    public function __construct()
    {
        $this->participations = new ArrayCollection();
        $this->actions = new ArrayCollection();
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getJoinCode(): ?string
    {
        return $this->joinCode;
    }

    public function setJoinCode(?string $joinCode): static
    {
        $this->joinCode = $joinCode;

        return $this;
    }

    public function getStartDate(): ?\DateTimeImmutable
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeImmutable $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeImmutable
    {
        return $this->endDate;
    }

    public function setEndDate(?\DateTimeImmutable $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function isFinished(): ?bool
    {
        return $this->isFinished;
    }

    public function setIsFinished(bool $isFinished): static
    {
        $this->isFinished = $isFinished;

        return $this;
    }

    /**
     * @return Collection<int, Participation>
     */
    public function getParticipations(): Collection
    {
        return $this->participations;
    }

    public function addParticipation(Participation $participation): static
    {
        if (!$this->participations->contains($participation)) {
            $this->participations->add($participation);
            $participation->setCompetition($this);
        }

        return $this;
    }

    public function removeParticipation(Participation $participation): static
    {
        if ($this->participations->removeElement($participation)) {
            // set the owning side to null (unless already changed)
            if ($participation->getCompetition() === $this) {
                $participation->setCompetition(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Action>
     */
    public function getActions(): Collection
    {
        return $this->actions;
    }

    public function addAction(Action $action): static
    {
        if (!$this->actions->contains($action)) {
            $this->actions->add($action);
            $action->setCompetition($this);
        }

        return $this;
    }

    public function removeAction(Action $action): static
    {
        if ($this->actions->removeElement($action)) {
            // set the owning side to null (unless already changed)
            if ($action->getCompetition() === $this) {
                $action->setCompetition(null);
            }
        }

        return $this;
    }

    /**
     * Extrait la liste des profils joueurs à partir des participations.
     * @return Collection<int, Player>
     */
    #[Groups(['competition:read'])]
    public function getPlayers(): Collection
    {
        return $this->participations->map(fn (Participation $p) => $p->getPlayer());
    }

    public function hasFogOfWar(): ?bool
    {
        return $this->fogOfWar;
    }

    public function setFogOfWar(bool $fogOfWar): static
    {
        $this->fogOfWar = $fogOfWar;

        return $this;
    }
}
