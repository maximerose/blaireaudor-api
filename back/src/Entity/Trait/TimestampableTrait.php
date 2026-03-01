<?php

declare(strict_types=1);

namespace App\Entity\Trait;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Trait pour la gestion automatique des dates de création et de mise à jour.
 * * Nécessite l'extension StofDoctrineExtensions (Gedmo Timestampable) pour
 * alimenter automatiquement ces champs lors de la persistance en base de données.
 */
trait TimestampableTrait
{
    /**
     * @var \DateTimeImmutable|null Date de création (fixée automatiquement à l'insertion).
     */
    #[Gedmo\Timestampable(on: 'create')]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * @var \DateTimeImmutable|null Date de dernière modification (mise à jour automatiquement).
     */
    #[Gedmo\Timestampable(on: 'update')]
    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;
    
    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}