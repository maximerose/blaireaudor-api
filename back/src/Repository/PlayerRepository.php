<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Player;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\String\Slugger\AsciiSlugger;

/**
 * Repository gérant l'accès aux données des profils Joueurs.
 * * Fournit les méthodes pour rechercher des participants par leur nom d'affichage
 * ou pour gérer les liaisons avec les comptes utilisateurs.
 *
 * @extends ServiceEntityRepository<Player>
 */
class PlayerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Player::class);
    }

    public function searchByName(string $query, bool $unlinkedOnly = false): array
    {
        $slugger = new AsciiSlugger();
        $canonicalQuery = strtolower($slugger->slug($query)->toString());

        $qb = $this->createQueryBuilder('p')
        ->where('p.slug LIKE :query')
        ->setParameter('query', (string) '%'.$canonicalQuery.'%')
        ->orderBy('p.slug', 'ASC');

        if ($unlinkedOnly) {
            $qb->andWhere('p.associatedUser IS NULL');
        }

        return $qb->getQuery()->getResult();
    }
}
