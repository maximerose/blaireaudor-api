<?php

namespace App\EventListener;

use App\Entity\Player;
use App\Repository\PlayerRepository;
use App\Service\UniqueValueGenerator;
use App\Trait\SluggerTrait;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsEntityListener(event: Events::prePersist, entity: Player::class)]
class PlayerListener
{
    use SluggerTrait;

    public function __construct(
        private SluggerInterface $slugger,
        private PlayerRepository $playerRepository,
        private Security $security,
        private UniqueValueGenerator $uniqueValueGenerator
    ) {}
    
    public function prePersist(Player $player, PrePersistEventArgs $event): void
    {
        $this->setCreator($player);

        if ($player->getAssociatedUser() !== null) {
            $player->setUsername($player->getAssociatedUser()->getUsername());
        } elseif (empty($player->getUsername()) && !empty($player->getDisplayName())) {
            $baseSlugs = $this->uniqueValueGenerator->prepareBaseSlugs([$player->getDisplayName()]);
            $existing = $this->playerRepository->findPotentialCollisions($baseSlugs, 'username');

            $player->setUsername($this->uniqueValueGenerator->generateUniqueValue($player->getDisplayName(), $existing));
        }
    }

    private function setCreator(Player $player): void
    {
        $userConnected = $this->security->getUser();

        if (null !== $userConnected) {
            // Cas 1 : Un admin est connecté et crée le joueur
            $player->setCreatedBy($userConnected);
            $player->setUpdatedBy($userConnected);
            
            return;
        }

        $associatedUser = $player->getAssociatedUser();

        if (null !== $associatedUser) {
            $player->setCreatedBy($associatedUser);
            $player->setUpdatedBy($associatedUser);

            return;
        }
    }
}
