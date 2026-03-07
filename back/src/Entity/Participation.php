<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\ParticipationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

/**
 * Table de liaison entre un Joueur et une Compétition.
 * * Cette entité porte le score cumulé du joueur pour une compétition donnée.
 * Une contrainte d'unicité garantit qu'un joueur n'a qu'une seule participation
 * par compétition.
 */
#[ORM\Entity(repositoryClass: ParticipationRepository::class)]
#[ORM\UniqueConstraint(name: 'unique_participation', columns: ['player_id', 'competition_id'])]
#[ORM\HasLifecycleCallbacks]
#[ApiResource]
class Participation
{
    use UuidTrait;
    use TimestampableTrait;

    /**
     * @var Competition|null La compétition concernée.
     */
    #[ORM\ManyToOne(targetEntity: Competition::class, inversedBy: 'participations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['user:read'])]
    private ?Competition $competition = null;

    /**
     * Score cumulé du joueur pour cette compétition.
     * * Note : Cette valeur est une dénormalisation (somme des points des actions)
     * utilisée pour optimiser les performances de l'affichage du classement.
     * Elle doit être mise à jour à chaque fois qu'une Action est validée ou modifiée.
     * @var int Le score total du joueur dans cette compétition (0 par défaut).
     */
    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['competition:read', 'user:read'])]
    private int $score = 0;

    /**
     * @var Player|null Le profil du joueur participant.
     */
    #[ORM\ManyToOne(targetEntity: Player::class, inversedBy: 'participations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['competition:read'])]
    private ?Player $player = null;

    /**
     * @var int|null Rang calculé dynamiquement
     */
    #[Groups(['user:read', 'competition:read'])]
    private ?int $rank = null;

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

    public function getRank(): ?int
    {
        return $this->rank;
    }

    public function setRank(?int $rank): static
    {
        $this->rank = $rank;
        return $this;
    }
}
