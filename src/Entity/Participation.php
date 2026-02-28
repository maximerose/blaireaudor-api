<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Competition;
use App\Entity\Player;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\ParticipationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ParticipationRepository::class)]
#[ORM\UniqueConstraint(name: 'unique_participation', columns: ['player_id', 'competition_id'])]
#[ORM\HasLifecycleCallbacks]
#[ApiResource]
class Participation
{
    use UuidTrait, TimestampableTrait;

    #[ORM\ManyToOne(targetEntity: Competition::class, inversedBy: 'participations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Competition $competition = null;

    #[ORM\Column(options: ['default' => 0])]
    private int $score = 0;

    #[ORM\ManyToOne(targetEntity: Player::class, inversedBy: 'participations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Player $player = null;

    public function getCompetition(): ?Competition
    {
        return $this->competition;
    }

    public function setCompetition(?Competition $competition): static
    {
        $this->competition = $competition;

        return $this;
    }

    public function getScore(): int
    {
        return $this->score;
    }

    public function setScore(int $score): static
    {
        $this->score = $score;

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
}
