<?php

declare(strict_types=1);

namespace App\Entity\Trait;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Attribute\Groups;

/**
 * Trait permettant le traçage automatique de l'auteur des modifications.
 * * Nécessite l'activation du BlameableListener de Gedmo pour remplir
 * automatiquement 'createdBy' et 'updatedBy' avec l'utilisateur connecté.
 */
trait BlameableTrait
{
    /**
     * @var User|null L'utilisateur ayant créé l'enregistrement
     */
    #[Gedmo\Blameable(on: 'create')]
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['action:read', 'competition:read'])]
    private ?User $createdBy = null;

    /**
     * @var User|null le dernier utilisateur ayant modifié l'enregistrement
     */
    #[Gedmo\Blameable(on: 'update')]
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $updatedBy = null;

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $user): static
    {
        $this->createdBy = $user;

        return $this;
    }

    public function getUpdatedBy(): ?User
    {
        return $this->updatedBy;
    }

    public function setUpdatedBy(?User $user): static
    {
        $this->updatedBy = $user;

        return $this;
    }

    #[Groups(['action:read', 'competition:read'])]
    public function getCreatorName(): ?string
    {
        if ($this->createdBy && $this->createdBy->getPlayer()) {
            return $this->createdBy->getPlayer()->getDisplayName();
        }

        return null;
    }
}
