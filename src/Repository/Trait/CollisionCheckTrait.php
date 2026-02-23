<?php

namespace App\Repository\Trait;

use Doctrine\ORM\QueryBuilder;

trait CollisionCheckTrait
{
    abstract public function createQueryBuilder(string $alias, ?string $indexBy = null): QueryBuilder;

    public function findPotentialCollisions(array $baseSlugs, string $field): array
    {
        if (empty($baseSlugs)) {
            return [];
        }
        
        $qb = $this->createQueryBuilder('e')->select("e.$field");
        $orStatements = $qb->expr()->orX();

        foreach ($baseSlugs as $i => $slug) {
            $orStatements->add("e.$field = :exact_$i");
            $orStatements->add("e.$field LIKE :dash_$i");

            $qb->setParameter("exact_$i", $slug);
            $qb->setParameter("dash_$i", $slug . '-%');
        }

        $results = $qb->where($orStatements)->getQuery()->getScalarResult();

        return array_column($results, $field);
    }
}