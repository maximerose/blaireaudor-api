<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation as OpenApiOperation;
use App\Constants\ErrorMessages;
use App\DTO\Competition\CompetitionAddPlayersInput;
use App\DTO\Competition\CompetitionCreateInput;
use App\DTO\Competition\CompetitionRefereeInput;
use App\Entity\Trait\BlameableTrait;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\CompetitionRepository;
use App\Security\Voter\CompetitionVoter;
use App\State\Processor\Competition\CompetitionAddPlayersProcessor;
use App\State\Processor\Competition\CompetitionAddRefereeProcessor;
use App\State\Processor\Competition\CompetitionCreateProcessor;
use App\State\Processor\Competition\CompetitionRemoveRefereeProcessor;
use App\State\Processor\Competition\CompetitionUpdateProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Représente une compétition du Blaireau d'Or.
 * * Gère le cycle de vie de la compétition (dates, statut) et centralise
 * les participations des joueurs ainsi que les actions de jeu.
 */
#[ORM\Entity(repositoryClass: CompetitionRepository::class)]
#[UniqueEntity(fields: ['joinCode'], message: ErrorMessages::DUPLICATE_JOIN_CODE)]
#[Assert\Expression(
    'this.getEndDate() === null || this.getEndDate() >= this.getStartDate()',
    message: ErrorMessages::END_DATE_BEFORE_START_DATE
)]
#[ApiResource(
    operations: [
        new Post(
            security: "is_granted('ROLE_USER')",
            securityMessage: ErrorMessages::AUTH_REQUIRED,
            input: CompetitionCreateInput::class,
            processor: CompetitionCreateProcessor::class,
        ),
        new Post(
            name: 'add_players',
            uriTemplate: '/competitions/{id}/add-players',
            security: "is_granted('ROLE_USER')",
            securityMessage: ErrorMessages::AUTH_REQUIRED,
            input: CompetitionAddPlayersInput::class,
            processor: CompetitionAddPlayersProcessor::class,
            read: false,
            normalizationContext: ['groups' => ['competition:read']],
            openapi: new OpenApiOperation(
                summary: 'Ajoute des joueurs et des arbitres à la compétition'
            )
        ),
        new Post(
            name: 'add_referee',
            uriTemplate: '/competitions/{id}/referees/add',
            security: "is_granted('ROLE_USER')",
            securityMessage: ErrorMessages::AUTH_REQUIRED,
            input: CompetitionRefereeInput::class,
            processor: CompetitionAddRefereeProcessor::class,
            read: false,
            normalizationContext: ['groups' => ['competition:read']],
            openapi: new OpenApiOperation(
                summary: 'Ajoute un arbitre à la compétition'
            )
        ),
        new Post(
            name: 'remove_referee',
            uriTemplate: '/competitions/{id}/referees/remove',
            security: "is_granted('ROLE_USER', object)",
            securityMessage: ErrorMessages::AUTH_REQUIRED,
            input: CompetitionRefereeInput::class,
            processor: CompetitionRemoveRefereeProcessor::class,
            read: false,
            normalizationContext: ['groups' => ['competition:read']],
            openapi: new OpenApiOperation(
                summary: 'Retire un arbitre de la compétition'
            )
        ),
        new Get(normalizationContext: ['groups' => 'competition:read']),
        new Patch(
            security: "is_granted('".CompetitionVoter::MANAGE."', object)",
            securityMessage: ErrorMessages::COMP_DENIED_MANAGE,
            processor: CompetitionUpdateProcessor::class,
            denormalizationContext: ['groups' => ['competition:write']],
            normalizationContext: ['groups' => ['competition:read']]
        ),
        new GetCollection(normalizationContext: ['groups' => 'competition:read']),
        new Delete(
            security: "is_granted('".CompetitionVoter::CREATOR."', object)",
            securityMessage: ErrorMessages::COMP_DENIED_DELETE
        ),
    ]
)]
#[ORM\HasLifecycleCallbacks]
class Competition
{
    use UuidTrait;
    use TimestampableTrait;
    use BlameableTrait;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['competition:read', 'competition:write', 'user:read', 'action:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 25, unique: true)]
    #[Assert\Length(max: 25)]
    #[Groups(['competition:read', 'competition:write', 'user:read'])]
    private ?string $joinCode = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Groups(['competition:read', 'competition:write',  'user:read'])]
    private ?\DateTimeImmutable $startDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['competition:read', 'competition:write',  'user:read'])]
    private ?\DateTimeImmutable $endDate = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    #[Groups(['competition:read', 'competition:write', 'user:read'])]
    #[ApiProperty(
        securityPostDenormalize: "
        object.getId() === null or 
        is_granted('".CompetitionVoter::REFEREE."', object)
    "
    )]
    private ?bool $fogOfWar = true;

    /**
     * Liste des participations (joueurs inscrits et leurs scores).
     *
     * @var Collection<int, Participation>
     */
    #[ORM\OneToMany(targetEntity: Participation::class, mappedBy: 'competition', orphanRemoval: true, cascade: ['remove'])]
    #[Groups(['competition:read', 'competition:write'])]
    private Collection $participations;

    #[ORM\ManyToMany(targetEntity: Player::class, inversedBy: 'refereedCompetitions')]
    #[Groups(['competition:read', 'competition:admin'])]
    private Collection $referees;

    /**
     * Liste des jours bonus (multiplicateurs de points).
     *
     * @var Collection<int, BonusDay>
     */
    #[ORM\OneToMany(targetEntity: BonusDay::class, mappedBy: 'competition', orphanRemoval: true, cascade: ['persist', 'remove'])]
    #[Groups(['competition:read'])]
    private Collection $bonusDays;

    public function __construct()
    {
        $this->participations = new ArrayCollection();
        $this->referees = new ArrayCollection();
        $this->bonusDays = new ArrayCollection();
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

    public function setEndDate(?\DateTimeImmutable $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    #[Groups(['competition:read', 'user:read'])]
    public function getIsFinished(): ?bool
    {
        if (null === $this->endDate) {
            return false;
        }

        return $this->endDate < new \DateTimeImmutable();
    }

    #[Groups(['competition:read', 'user:read'])]
    public function getHasStarted(): ?bool
    {
        return $this->startDate <= new \DateTimeImmutable();
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
            if ($participation->getCompetition() === $this) {
                $participation->setCompetition(null);
            }
        }

        return $this;
    }

    public function hasFogOfWar(): ?bool
    {
        return $this->fogOfWar;
    }

    public function setFogOfWar(bool $fogOfWar): static
    {
        $this->fogOfWar = $fogOfWar;

        return $this;
    }

    #[Groups(['competition:read', 'user:read'])]
    public function getParticipantsCount(): int
    {
        return $this->participations->count();
    }

    public function getReferees(): Collection
    {
        return $this->referees;
    }

    public function addReferee(Player $referee): static
    {
        if (!$this->referees->contains($referee)) {
            $this->referees->add($referee);
            $referee->addRefereedCompetition($this);
        }

        return $this;
    }

    public function removeReferee(Player $referee): static
    {
        if ($this->referees->removeElement($referee)) {
            if ($referee->getRefereedCompetitions()->contains($this)) {
                $referee->removeRefereedCompetition($this);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BonusDay>
     */
    public function getBonusDays(): Collection
    {
        return $this->bonusDays;
    }

    public function addBonusDay(BonusDay $bonusDay): static
    {
        if (!$this->bonusDays->contains($bonusDay)) {
            $this->bonusDays->add($bonusDay);
            $bonusDay->setCompetition($this);
        }

        return $this;
    }

    public function removeBonusDay(BonusDay $bonusDay): static
    {
        if ($this->bonusDays->removeElement($bonusDay)) {
            if ($bonusDay->getCompetition() === $this) {
                $bonusDay->setCompetition(null);
            }
        }

        return $this;
    }
}
