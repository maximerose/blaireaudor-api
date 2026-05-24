<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Entity\Trait\TimestampableTrait;
use App\Entity\Trait\UuidTrait;
use App\Repository\PushSubscriptionRepository;
use App\State\Processor\Notification\PushSubscriptionProcessor;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: PushSubscriptionRepository::class)]
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/push_subscriptions',
            processor: PushSubscriptionProcessor::class,
            denormalizationContext: ['groups' => ['push:write']],
            normalizationContext: ['groups' => ['push:read']]
        ),
    ]
)]
class PushSubscription
{
    use UuidTrait;
    use TimestampableTrait;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['push:write', 'push:read'])]
    private ?string $endpoint = null;

    #[ORM\Column(length: 255)]
    #[Groups(['push:write', 'push:read'])]
    private ?string $p256dh = null;

    #[ORM\Column(length: 255)]
    #[Groups(['push:write', 'push:read'])]
    private ?string $auth = null;

    #[Gedmo\Timestampable(on: 'create')]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getEndpoint(): ?string
    {
        return $this->endpoint;
    }

    public function setEndpoint(string $endpoint): static
    {
        $this->endpoint = $endpoint;

        return $this;
    }

    public function getP256dh(): ?string
    {
        return $this->p256dh;
    }

    public function setP256dh(string $p256dh): static
    {
        $this->p256dh = $p256dh;

        return $this;
    }

    public function getAuth(): ?string
    {
        return $this->auth;
    }

    public function setAuth(string $auth): static
    {
        $this->auth = $auth;

        return $this;
    }
}
