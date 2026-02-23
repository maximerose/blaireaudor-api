<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Participation;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Entity\User;
use App\Repository\PlayerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PlayerRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_PLAYER_USERNAME', fields: ['username'])]
#[UniqueEntity(fields: ['username'], message: 'Ce nom d\'utiliateur est déjà utilisé.')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource]
class Player
{
    use UuidTrait, TimestampableTrait, BlameableTrait;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $displayName = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    /**
     * @var Collection<int, Participation>
     */
    #[ORM\OneToMany(targetEntity: Participation::class, mappedBy: 'player', orphanRemoval: true)]
    private Collection $participations;

    #[ORM\OneToOne(inversedBy: 'player', cascade: ['persist', 'remove'])]
    private ?User $associatedUser = null;

    public function __construct()
    {
        $this->participations = new ArrayCollection();
    }

    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    public function setDisplayName(string $displayName): static
    {
        $this->displayName = $displayName;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

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
            $participation->setPlayer($this);
        }

        return $this;
    }

    public function removeParticipation(Participation $participation): static
    {
        if ($this->participations->removeElement($participation)) {
            // set the owning side to null (unless already changed)
            if ($participation->getPlayer() === $this) {
                $participation->setPlayer(null);
            }
        }

        return $this;
    }

    public function getAssociatedUser(): ?User
    {
        return $this->associatedUser;
    }

    public function setAssociatedUser(?User $associatedUser): static
    {
        $this->associatedUser = $associatedUser;

        return $this;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function syncUsername(): void
    {
        // Si un User est lié, on prend son username
        if ($this->associatedUser !== null) {
            $this->username = $this->associatedUser->getUsername();
            return;
        }

        // Sinon, si le username est vide (création par l'arbitre), on génère le slug
        if ($this->username === null && $this->displayName !== null) {
            $slugger = new AsciiSlugger();
            $this->username = strtolower($slugger->slug($this->displayName)->toString());
        }
    }
}
