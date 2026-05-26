<?php

declare(strict_types=1);

namespace App\Constants;

final class KpiConstants
{
    /**
     * 🗺️ CONFIGURATION VISUELLE ET SÉMANTIQUE DES METRIQUES (Data-Driven).
     */
    public const array KPIS = [
        'PENDING_ACTIONS' => [
            'title' => 'Arbitrages en attente (Global)',
            'icon' => 'fas fa-gavel',
            'color' => 'warning',
            'suffix' => null,
            'empty_value' => '-',
            'subtext' => null,
            'hint' => "Nombre total d'actions en attente de validation sur l'ensemble des arènes.",
        ],
        'ACTIVE_COMPETITIONS' => [
            'title' => 'Compétitions enregistrées',
            'icon' => 'fas fa-trophy',
            'color' => 'info',
            'suffix' => null,
            'empty_value' => '-',
            'subtext' => null,
            'hint' => 'Nombre total de tournois créés sur la plateforme.',
        ],
        'TOTAL_USERS' => [
            'title' => 'Comptes utilisateurs actifs',
            'icon' => 'fas fa-user-shield',
            'color' => 'success',
            'suffix' => null,
            'empty_value' => '-',
            'subtext' => null,
            'hint' => "Nombre d'utilisateurs possédant des identifiants de connexion actifs.",
        ],
        'TOTAL_PLAYERS' => [
            'title' => 'Profils joueurs enregistrés',
            'icon' => 'fas fa-users',
            'color' => 'secondary',
            'suffix' => null,
            'empty_value' => '-',
            'subtext' => null,
            'hint' => 'Cumul de tous les profils (comptes réels connectés et profils invités/fantômes).',
        ],
        'TOTAL_ACTIONS' => [
            'title' => "Total d'actions envoyées",
            'icon' => 'fas fa-paper-plane',
            'color' => 'light',
            'suffix' => null,
            'empty_value' => '-',
            'subtext' => null,
            'hint' => 'Volume brut de tous les signalements transmis, sans distinction de statut.',
        ],
        'VALIDATED_ACTIONS' => [
            'title' => "Total d'actions validées",
            'icon' => 'fas fa-check-circle',
            'color' => 'success',
            'suffix' => null,
            'empty_value' => '-',
            'subtext' => null,
            'hint' => 'Signalements officiellement approuvés par le corps arbitral.',
        ],
        'TOTAL_POINTS' => [
            'title' => 'Total de points distribués',
            'icon' => 'fas fa-bullseye',
            'color' => 'gold',
            'suffix' => 'pts',
            'empty_value' => '-',
            'subtext' => null,
            'hint' => 'Somme de tous les points de pénalité infligés à ce jour (multiplicateurs bonus inclus).',
        ],
        'BONUS_ACTIONS_RATIO' => [
            'title' => "Effet d'Aubaine (Opportunisme)",
            'icon' => 'fas fa-clock',
            'color' => 'warning',
            'suffix' => '%',
            'empty_value' => '-',
            'subtext' => null,
            'hint' => "Proportion d'actions réalisées spécifiquement durant les Jours Bonus programmés.",
        ],
        'MAX_ACTIONS_RECEIVED' => [
            'title' => 'Grand Récidiviste',
            'icon' => 'fas fa-bolt',
            'color' => 'danger',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '%d actions validées subies',
            'hint' => "Le joueur ayant subi le plus grand nombre total d'actions validées historiques.",
        ],
        'MAX_ACTIONS_REPORTED' => [
            'title' => "Balance d'Or",
            'icon' => 'fas fa-eye',
            'color' => 'warning',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '%d dénonciations envoyées',
            'hint' => 'Le joueur le plus loquace. A envoyé et fait valider le plus grand nombre de signalements.',
        ],
        'MIN_ACTIONS_RECEIVED' => [
            'title' => "Ange de l'Arène",
            'icon' => 'fas fa-cloud',
            'color' => 'success',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '%d méfait subi au total',
            'hint' => 'Le participant exemplaire (ou fantôme) ayant subi le moins de sanctions validées.',
        ],
        'MAX_APPROVAL_RATIO' => [
            'title' => 'Le Sniper',
            'icon' => 'fas fa-crosshairs',
            'color' => 'success',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '<strong>%s%%</strong> de réussite sur %d rapports',
            'empty_subtext' => 'Min. 3 jugés requis',
            'hint' => "Le dénonciateur le plus précis (min. 3 rapports jugés). Meilleur taux de validation par l'arbitrage.",
        ],
        'MAX_REJECTED_REPORTS' => [
            'title' => 'Le Calomniateur',
            'icon' => 'fas fa-comment-slash',
            'color' => 'danger',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '%d signalements rejetés par l\'arbitre',
            'hint' => 'Le joueur ayant essuyé le plus grand nombre de signalements refusés ou classés sans suite.',
        ],
        'MAX_DISTINCT_INFORMERS_RECEIVED' => [
            'title' => 'Le Paria',
            'icon' => 'fas fa-heart-broken',
            'color' => 'info',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => 'Ciblé par <strong>%d balances</strong> différentes',
            'hint' => "Le joueur pris en grippe par la meute. Ciblé par le plus grand nombre d'acteurs distincts.",
        ],
        'MAX_ACTIONS_VALIDATED_BY_REFEREE' => [
            'title' => 'Arbitre de Fer',
            'icon' => 'fas fa-balance-scale-right',
            'color' => 'danger',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '%d sentences validées de sa propre main',
            'hint' => "L'arbitre ayant validé et acté le plus grand nombre de sanctions en direct.",
        ],
        'MAX_ACTIONS_REJECTED_BY_REFEREE' => [
            'title' => 'Arbitre Ange Gardien',
            'icon' => 'fas fa-feather-alt',
            'color' => 'success',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '%d dossiers classés sans suite (rejetés)',
            'hint' => "L'arbitre protecteur ayant rejeté ou classé sans suite le plus de dossiers suspects.",
        ],
        'AVERAGE_SEVERITY' => [
            'title' => 'Sévérité moyenne',
            'icon' => 'fas fa-calculator',
            'color' => 'info',
            'suffix' => 'pts / action',
            'empty_value' => '-',
            'subtext' => null,
            'hint' => 'Nombre moyen de points attribués par dossier validé sur la plateforme.',
        ],
        'MAX_POINTS_COMPETITION' => [
            'title' => "Arène de l'Enfer",
            'icon' => 'fas fa-fire-alt',
            'color' => 'gold',
            'suffix' => null,
            'empty_value' => 'Aucune',
            'subtext' => '%s pts cumulés',
            'hint' => 'Le séjour/tournoi ayant accumulé le plus gros volume de points de pénalité.',
        ],
        'MOST_FREQUENT_TARGET_PAIR' => [
            'title' => 'Pire Rivalité (Vendetta)',
            'icon' => 'fas fa-handshake-slash',
            'color' => 'info',
            'suffix' => null,
            'empty_value' => 'Aucune',
            'subtext' => 'A harcelé sa cible avec <strong>%d signalements</strong>',
            'hint' => 'Le binôme infernal qui passe ses vacances à se renvoyer mutuellement les signalements.',
        ],
        'MAX_POINTS_SINGLE_ACTION' => [
            'title' => 'Le Casse du Siècle (Bonus)',
            'icon' => 'fas fa-gem',
            'color' => 'gold',
            'suffix' => null,
            'empty_value' => 'Aucun',
            'subtext' => '<strong class="text-danger border-0 pr-0 bg-transparent">+%d pts (Bonus Inclus)</strong> — %s <span class="text-warning">(%s)</span>',
            'hint' => "L'infraction d'anthologie ayant généré le plus de points en une seule fois.",
        ],
    ];

    /**
     * 🏗️ STRUCTURE DES BLOCS CATÉGORIES (Layout Architecture).
     */
    public const array CATEGORIES = [
        [
            'title' => '📊 Métriques de Volumes',
            'kpis' => ['PENDING_ACTIONS', 'ACTIVE_COMPETITIONS', 'TOTAL_USERS', 'TOTAL_PLAYERS'],
        ],
        [
            'title' => '📈 Activité Globale & Intensité',
            'kpis' => ['TOTAL_ACTIONS', 'VALIDATED_ACTIONS', 'TOTAL_POINTS', 'BONUS_ACTIONS_RATIO'],
        ],
        [
            'title' => '🏆 Le Livre des Records de Carrière',
            'kpis' => ['MAX_ACTIONS_RECEIVED', 'MAX_ACTIONS_REPORTED', 'MIN_ACTIONS_RECEIVED'],
        ],
        [
            'title' => '🕵️‍♂️ Profils Singuliers & Comportements',
            'kpis' => ['MAX_APPROVAL_RATIO', 'MAX_REJECTED_REPORTS', 'MAX_DISTINCT_INFORMERS_RECEIVED'],
        ],
        [
            'title' => '⚖️ Le Corps Magistral et Arbitral',
            'kpis' => ['MAX_ACTIONS_VALIDATED_BY_REFEREE', 'MAX_ACTIONS_REJECTED_BY_REFEREE', 'AVERAGE_SEVERITY'],
        ],
        [
            'title' => '🏟️ Contextes et Faits Historiques',
            'kpis' => ['MAX_POINTS_COMPETITION', 'MOST_FREQUENT_TARGET_PAIR', 'MAX_POINTS_SINGLE_ACTION'],
        ],
    ];
}
