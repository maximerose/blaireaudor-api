<?php

namespace App\EventListener;

use App\Entity\Player;
use App\Repository\PlayerRepository;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Events;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsEntityListener(event: Events::prePersist, entity: Player::class)]
class PlayerListener
{
    public function __construct(
        private SluggerInterface $slugger,
        private PlayerRepository $playerRepository,
        private Security $security
    ) {}
    
    public function prePersist(Player $player, PrePersistEventArgs $event): void
    {
        $this->setCreator($player);

        if ($player->getAssociatedUser() !== null) {
            $this->copyUserUsername($player);
        } else {
            $this->generateUniqueUsername($player);
        }
    }

    private function generateUniqueUsername(Player $player): void 
    {
        $name = $player->getDisplayName();
    
        // Sécurité : si pas de nom, on ne peut pas générer de username
        if (empty($name)) {
            return;
        }

        $baseSlug = strtolower($this->slugger->slug($name)->toString());
        $username = $baseSlug;
        $i = 1;

        // Tant qu'un Player possède déjà ce username, on cherche le suivant
        while ($this->playerRepository->findOneBy(['username' => $username])) {
            $username = $baseSlug . '-' . $i;
            $i++;
        }

        $player->setUsername($username);
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

    private function copyUserUsername(Player $player): void
    {
        $user = $player->getAssociatedUser();

        if (null === $user) {
            return;
        }

        $player->setUsername($user->getUsername());
    }
}