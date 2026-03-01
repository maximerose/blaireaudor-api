<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * Repository gérant l'accès aux données des Utilisateurs (comptes de sécurité).
 * * Responsable de la récupération des identifiants et de la mise à jour 
 * automatique des hashs de mots de passe pour maintenir un haut niveau de sécurité.
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Met à jour le mot de passe haché de l'utilisateur.
     * * Cette méthode est utilisée par Symfony pour "re-hasher" les mots de passe
     * de manière transparente si les paramètres de l'algorithme (coût, mémoire) 
     * sont modifiés dans la configuration.
     * @throws UnsupportedUserException Si l'objet utilisateur n'est pas une instance de App\Entity\User.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }
}
