<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\ParticipationRepository;
use App\State\Participation\ParticipationDeleteProcessor;
use App\Validator\IsNotFinished;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
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
#[UniqueEntity(
    fields: ['player', 'competition'],
    message: 'ALREADY_JOINED',
    errorPath: 'competition'
)]
#[ApiFilter(SearchFilter::class, properties: ['competition' => 'exact'])]
#[ApiResource(
    operations: [
        new \ApiPlatform\Metadata\Get(),
        new \ApiPlatform\Metadata\Post(),
        new \ApiPlatform\Metadata\Delete(
            processor: ParticipationDeleteProcessor::class
        ),
    ]
)]
class Participation
{
    use UuidTrait;
    use TimestampableTrait;

    /**
     * @var Competition|null la compétition concernée
     */
    #[ORM\ManyToOne(targetEntity: Competition::class, inversedBy: 'participations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['user:read'])]
    #[IsNotFinished]
    private ?Competition $competition = null;

    /**
     * Score cumulé du joueur pour cette compétition.
     * * Note : Cette valeur est une dénormalisation (somme des points des actions)
     * utilisée pour optimiser les performances de l'affichage du classement.
     * Elle doit être mise à jour à chaque fois qu'une Action est validée ou modifiée.
     *
     * @var int le score total du joueur dans cette compétition (0 par défaut)
     */
    #[ORM\Column(options: ['default' => 0])]
    #[Groups(['competition:read', 'user:read'])]
    private int $score = 0;

    /**
     * @var Player|null le profil du joueur participant
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

    #[ORM\OneToMany(mappedBy: 'participation', targetEntity: Action::class)]
    #[Groups(['participation:actions'])]
    private Collection $actions;

    public function __construct()
    {
        $this->actions = new ArrayCollection();
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

    public function getActions(): Collection
    {
        return $this->actions;
    }
}
