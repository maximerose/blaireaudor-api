<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\PlayerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Représente le profil d'un participant au jeu.
 * * Un joueur peut être autonome (lié à un compte User) ou être un profil "invité"
 * créé par un administrateur. Il centralise ses participations aux compétitions
 * et l'historique de ses actions.
 */
#[ORM\Entity(repositoryClass: PlayerRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_PLAYER_USERNAME', fields: ['username'])]
#[UniqueEntity(fields: ['username'], message: 'Ce nom d\'utiliateur est déjà utilisé.')]
#[ApiResource]
class Player
{
    use UuidTrait;
    use TimestampableTrait;
    use BlameableTrait;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['competition:read', 'action:read'])]
    private ?string $displayName = null;

    /**
     * @var string|null Nom d'utilisateur unique utilisé pour le slug et l'identification.
     *                  * Est synchronisé avec le username de l'User associé s'il existe.
     */
    #[Gedmo\Slug(fields: ['displayName'], unique: true)]
    #[ORM\Column(length: 255)]
    #[Groups(['competition:read', 'action:read'])]
    private ?string $username = null;

    /**
     * @var Collection<int, Participation> Liste des compétitions auxquelles le joueur participe.
     */
    #[ORM\OneToMany(targetEntity: Participation::class, mappedBy: 'player', orphanRemoval: true)]
    private Collection $participations;

    /**
     * @var User|null Compte utilisateur lié à ce profil de jeu.
     */
    #[ORM\OneToOne(inversedBy: 'player', cascade: ['persist', 'remove'])]
    #[Groups(['competition:read'])]
    private ?User $associatedUser = null;

    /**
     * @var Collection<int, Action>
     */
    #[ORM\OneToMany(targetEntity: Action::class, mappedBy: 'player', orphanRemoval: true)]
    private Collection $actions;

    public function __construct()
    {
        $this->participations = new ArrayCollection();
        $this->actions = new ArrayCollection();
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

    public function setUsername(?string $username): static
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

        if ($associatedUser) {
            $this->username = $associatedUser->getUsername();
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
            $action->setPlayer($this);
        }

        return $this;
    }

    public function removeAction(Action $action): static
    {
        if ($this->actions->removeElement($action)) {
            // set the owning side to null (unless already changed)
            if ($action->getPlayer() === $this) {
                $action->setPlayer(null);
            }
        }

        return $this;
    }

    /**
     * Indique si le joueur possède un compte utilisateur actif pour se connecter.
     * * Utilisé par l'API pour différencier les profils invités des membres.
     */
    #[Groups(['competition:read'])]
    public function getHasAccount(): bool
    {
        return $this->associatedUser !== null;
    }
}
