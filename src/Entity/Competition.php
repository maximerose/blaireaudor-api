<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Participation;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\CompetitionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CompetitionRepository::class)]
#[UniqueEntity(fields: ['slug'])]
#[ORM\HasLifecycleCallbacks]
#[Assert\Expression(
    "this.getEndDate() >= this.getStartDate()",
    message: "La date de fin doit être postérieure à la date de début"
)]
#[ApiResource]
class Competition
{
    use UuidTrait, TimestampableTrait, BlameableTrait;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $slug = null;

    #[ORM\Column(length: 10, unique: true)]
    #[Assert\Length(max: 10)]
    private ?string $joinCode = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    private ?\DateTimeImmutable $startDate = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    private ?\DateTimeImmutable $endDate = null;

    #[ORM\Column(options:['default' => false])]
    private ?bool $isFinished = false;

    /**
     * @var Collection<int, Participation>
     */
    #[ORM\OneToMany(targetEntity: Participation::class, mappedBy: 'competition', orphanRemoval: true)]
    private Collection $participations;

    public function __construct()
    {
        $this->participations = new ArrayCollection();
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

    public function setEndDate(\DateTimeImmutable $endDate): static
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
}
