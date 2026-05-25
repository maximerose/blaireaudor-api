<?php

declare(strict_types=1);

namespace App\Constants;

final class AdminConstants
{
    public const string DASHBOARD_TITLE = 'Console Super-Admin';
    public const string DASHBOARD_WELCOME = 'Bienvenue dans la salle des machines du Blaireau d\'Or.';

    public const string MENU_DASHBOARD = 'Tableau de bord';
    public const string MENU_SECTION_GAME = 'Le Jeu';
    public const string MENU_COMPETITIONS = 'Compétitions';
    public const string MENU_PLAYERS = 'Profils Joueurs';
    public const string MENU_ACTIONS = 'Actions (Méfaits)';
    public const string MENU_SECTION_PLATFORM = 'Plateforme';
    public const string MENU_USERS = 'Comptes Utilisateurs';
    public const string MENU_SECTION_BACK = 'Retour';
    public const string MENU_BACK_TO_SITE = 'Retour au site';

    // ACCENTS & TEXTES DU JOURNAL IMBRIQUÉ
    public const string FIELD_COLLECTION_TITLE = 'Journal de l\'arène (Scores & Actions)';
    public const string NO_PARTICIPANT = 'Aucun participant inscrit';
    public const string NO_ACTION = 'Aucun méfait enregistré pour le moment.';

    // TABLEAU
    public const string TH_DATE = 'Date';
    public const string TH_DESCRIPTION = 'Méfait / Description';
    public const string TH_POINTS = 'Points';
    public const string TH_STATUS = 'Statut';

    // BADGES STATUTS
    public const string STATUS_VALIDATED = 'Validée';
    public const string STATUS_PENDING = 'En attente';
    public const string STATUS_REJECTED = 'Refusée';
    public const string ACTION_EDIT_LINK = 'Modifier';
    public const string SUFFIX_ACTIONS_COUNT = 'action(s)';

    public const string FIELD_PLAYER_HELP_USER = 'Modifier le compte utilisateur lié (%s)';
    public const string ACTION_EDIT_USER = 'Modifier l\'User';
}
