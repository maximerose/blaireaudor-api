<?php

declare(strict_types=1);

namespace App\Constants;

final class KpiConstants
{
    // Compteurs et structures globales
    public const string PENDING_ACTIONS = 'Arbitrages en attente (Global)';
    public const string ACTIVE_COMPETITIONS = 'Compétitions enregistrées';
    public const string TOTAL_USERS = 'Comptes utilisateurs actifs';
    public const string TOTAL_PLAYERS = 'Profils joueurs enregistrés';
    public const string TOTAL_ACTIONS = 'Total d\'actions envoyées';
    public const string VALIDATED_ACTIONS = 'Total d\'actions validées';
    public const string TOTAL_POINTS = 'Total de points distribués';
    public const string FALSE_REPORTS_RATE = 'Taux de faux rapports';
    public const string AVERAGE_SEVERITY = 'Sévérité moyenne';
    public const string MAX_POINTS_COMPETITION = 'Arène de l\'Enfer 🏟️';
    public const string BONUS_ACTIONS_RATIO = 'Effet d\'Aubaine (Opportunisme) 📈';

    // Le Panthéon des Dossiers et Comportements
    public const string MAX_ACTIONS_RECEIVED = 'Grand Récidiviste 🦡';
    public const string MAX_ACTIONS_REPORTED = 'Balance d\'Or 🤫';
    public const string MIN_ACTIONS_RECEIVED = 'Ange de l\'Arène 😇';
    public const string MAX_APPROVAL_RATIO = 'Le Sniper 🎯';
    public const string MAX_REJECTED_REPORTS = 'Le Calomniateur 🤥';
    public const string MAX_DISTINCT_INFORMERS_RECEIVED = 'Le Paria 😩';
    public const string MOST_FREQUENT_TARGET_PAIR = 'Pire Rivalité (Vendetta) ⚔️';
    public const string MAX_POINTS_SINGLE_ACTION = 'Le Casse du Siècle (Avec Bonus) 💰';
    public const string MAX_ACTIONS_VALIDATED_BY_REFEREE = 'Arbitre de Fer ⚖️';
    public const string MAX_ACTIONS_REJECTED_BY_REFEREE = 'Arbitre Ange Gardien 👼';
}
