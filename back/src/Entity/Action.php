<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Enum\ActionStatus;
use App\Repository\ActionRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Représente une action de jeu effectuée par un joueur.
 * * Chaque action rapporte un nombre de points défini et est liée
 * à une compétition spécifique. Elle possède un cycle de vie via son statut.
 */
#[ORM\Entity(repositoryClass: ActionRepository::class)]
#[ApiResource]
class Action
{
    use UuidTrait;
    use BlameableTrait;
    use TimestampableTrait;

    public function __construct()
    {
        $this->dateAction = new DateTimeImmutable();
    }

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['action:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Type(type: 'integer')]
    #[Groups(['action:read'])]
    private ?int $points = null;

    /**
     * @var Player|null Le joueur ayant réalisé l'action.
     */
    #[ORM\ManyToOne(inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['action:read'])]
    private ?Player $player = null;

    /**
     * @var Competition|null La compétition dans laquelle l'action a eu lieu.
     */
    #[ORM\ManyToOne(inversedBy: 'actions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Competition $competition = null;

    /**
     * @var ActionStatus État actuel de l'action (par défaut : PENDING).
     */
    #[ORM\Column(type: 'string', enumType: ActionStatus::class)]
    private ActionStatus $status = ActionStatus::PENDING;

    #[ORM\Column(nullable: false)]
    private DateTimeImmutable $dateAction;

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

    public function getPlayer(): ?Player
    {
        return $this->player;
    }

    public function setPlayer(?Player $player): static
    {
        $this->player = $player;

        return $this;
    }

    public function getCompetition(): ?Competition
    {
        return $this->competition;
    }

    public function setCompetition(?Competition $competition): static
    {
        $this->competition = $competition;

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

    public function getDateAction(): DateTimeImmutable
    {
        return $this->dateAction;
    }

    public function setDateAction(DateTimeImmutable $dateAction): static
    {
        $this->dateAction = $dateAction;

        return $this;
    }
}
