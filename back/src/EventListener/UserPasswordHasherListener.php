<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Listener Doctrine pour le hachage automatique du mot de passe.
 * * Surveille les entités User avant l'insertion (persist) et la mise à jour (update).
 * Si un mot de passe en clair (plainPassword) est présent, il est haché
 * puis effacé de la mémoire pour la sécurité.
 */
#[AsEntityListener(event: Events::prePersist, method: 'prePersist', entity: User::class)]
#[AsEntityListener(event: Events::preUpdate, method: 'preUpdate', entity: User::class)]
class UserPasswordHasherListener
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function prePersist(User $user, PrePersistEventArgs $event): void
    {
        $this->hashPassword($user);
    }

    public function preUpdate(User $user, PreUpdateEventArgs $event): void
    {
        $this->hashPassword($user);
    }

    /**
     * Hache le mot de passe s'il a été modifié.
     * * Récupère le texte brut, génère un hash sécurisé via l'algorithme configuré 
     * (généralement Argon2id ou Bcrypt), puis vide le champ brut par sécurité.
     */
    private function hashPassword(User $user): void
    {
        $plainPassword = $user->getPlainPassword();

        if ($plainPassword === null) {
            return;
        }

        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);
        $user->setPlainPassword(null);
    }
}