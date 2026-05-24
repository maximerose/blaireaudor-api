<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use App\Constants\ErrorMessages;
use App\Entity\Trait\UuidTrait;
use App\Repository\NotificationRepository;
use App\State\Provider\Notification\NotificationProvider;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/notifications',
            provider: NotificationProvider::class,
            normalizationContext: ['groups' => ['notification:read']]
        ),
        new Get(
            uriTemplate: '/notifications/{id}',
            provider: NotificationProvider::class,
            security: "is_granted('ROLE_USER') and object.getRecipient() === user",
            securityMessage: ErrorMessages::AUTH_DENIED,
            normalizationContext: ['groups' => ['notification:read']]
        ),
        new Patch(
            uriTemplate: '/notifications/{id}',
            provider: NotificationProvider::class,
            security: "is_granted('ROLE_USER') and object.getRecipient() === user",
            securityMessage: ErrorMessages::AUTH_DENIED,
            denormalizationContext: ['groups' => ['notification:patch']],
            normalizationContext: ['groups' => ['notification:read']]
        ),
    ]
)]
class Notification
{
    use UuidTrait;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $recipient = null;

    #[ORM\Column(length: 255)]
    #[Groups(['notification:read'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['notification:read'])]
    private ?string $message = null;

    #[ORM\Column(length: 50)]
    #[Groups(['notification:read'])]
    private ?string $type = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    #[Groups(['notification:read', 'notification:patch'])]
    private bool $isRead = false;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['notification:read'])]
    private ?string $targetUrl = null;

    #[Gedmo\Timestampable(on: 'create')]
    #[ORM\Column]
    #[Groups(['notification:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function getRecipient(): ?User
    {
        return $this->recipient;
    }

    public function setRecipient(?User $recipient): static
    {
        $this->recipient = $recipient;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getIsRead(): bool
    {
        return $this->isRead;
    }

    public function setIsRead(bool $isRead): static
    {
        $this->isRead = $isRead;

        return $this;
    }

    public function getTargetUrl(): ?string
    {
        return $this->targetUrl;
    }

    public function setTargetUrl(?string $targetUrl): static
    {
        $this->targetUrl = $targetUrl;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
