<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Entité gérant l'authentification et les accès utilisateur.
 * * Cette classe respecte les contrats Symfony UserInterface et PasswordAuthenticatedUserInterface.
 * Elle est liée de manière unique à un profil Player pour la partie jeu.
 */
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['username'], message: 'Ce nom d\'utiliateur est déjà utilisé.')]
#[UniqueEntity(fields: ['email'], message: 'Cette adresse email est déjà utilisée.')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    use UuidTrait;
    use TimestampableTrait;

    /**
     * @var string|null identifiant unique de connexion
     */
    #[ORM\Column(length: 180)]
    #[Groups(['user:read'])]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = [];

    /**
     * @var string|null mot de passe non haché, utilisé uniquement lors
     *                  de la soumission de formulaires ou de l'inscription
     */
    private ?string $plainPassword = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?string $email = null;

    #[ORM\OneToOne(mappedBy: 'associatedUser', cascade: ['persist', 'remove'])]
    #[Assert\Valid]
    #[Groups(['user:read'])]
    private ?Player $player = null;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: Competition::class)]
    #[Groups(['user:read'])]
    private Collection $createdCompetitions;

    public function __construct()
    {
        $this->createdCompetitions = new ArrayCollection();
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
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     * Retourne les rôles de l'utilisateur.
     * * Ajoute systématiquement ROLE_USER pour garantir un accès de base.
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): static
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0".self::class."\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    public function getPlayer(): ?Player
    {
        return $this->player;
    }

    /**
     * @param Player|null $player Le profil joueur à lier.
     *                            * Gère la synchronisation bidirectionnelle de la relation OneToOne.
     */
    public function setPlayer(?Player $player): static
    {
        if (null === $player && null !== $this->player) {
            $this->player->setAssociatedUser(null);
        }

        if (null !== $player && $player->getAssociatedUser() !== $this) {
            $player->setAssociatedUser($this);
        }

        $this->player = $player;

        return $this;
    }

    public function getCreatedCompetitions(): Collection
    {
        return $this->createdCompetitions;
    }
}
