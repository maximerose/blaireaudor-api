<?php

namespace App\EventListener;

use App\Entity\Player;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Symfony\Bundle\SecurityBundle\Security;

#[AsEntityListener(event: Events::prePersist, method: 'prePersist')]
#[AsEntityListener(event: Events::preUpdate, method: 'preUpdate')]
class BlameableListener
{
    public function __construct(
        private Security $security
    ) {}

    public function prePersist(object $entity, PrePersistEventArgs $event): void
    {
        if (!method_exists($entity, 'setCreatedBy')) {
            return;
        }

        if (!method_exists($entity, 'setUpdatedBy')) {
            return;
        }

        if ($entity->getCreatedBy() !== null) {
            return;
        }

        if ($entity instanceof Player) {
            $associatedUser = $entity->getAssociatedUser();
            if ($associatedUser instanceof User) {
                $entity->setCreatedBy($associatedUser);
                return;
            }
        }

        $user = $this->security->getUser();

        if ($user instanceof User) {
            $entity->setCreatedBy($user);
            $entity->setUpdatedBy($user);
        }
    }

    public function preUpdate(object $entity, PreUpdateEventArgs $event): void
    {
        if (!method_exists($entity, 'setUpdatedBy')) {
            return;
        }

        if ($entity->getUpdatedBy() !== null) {
            return;
        }

        $user = $this->security->getUser();
        if ($user instanceof User) {
            $entity->setUpdatedBy($user);
        }
    }
}