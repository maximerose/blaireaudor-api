<?php

namespace App\Entity\Trait;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;

/**
 * Trait fournissant un identifiant unique (UUID) à l'entité.
 * * Utilise le générateur de Symfony/Uid pour garantir l'unicité
 * sans dépendre de l'auto-incrément de la base de données.
 */
trait UuidTrait
{
    /**
     * @var Uuid|null L'identifiant unique de l'enregistrement.
     * * Expose l'ID dans les contextes de lecture des compétitions, 
     * des actions et des profils joueurs.
     */
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    #[Groups(['competition:read', 'action:read', 'player:read'])]
    private ?Uuid $id = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }
}