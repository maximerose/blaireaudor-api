<?php

declare(strict_types=1);

namespace App\Constants;

final class ErrorMessages
{
    // AUTHENTIFICATION
    public const string AUTH_REQUIRED = 'Tu dois être connecté.';
    public const string AUTH_DENIED = 'Accès refusé.';
    public const string INVALID_REFRESH_TOKEN = 'Token de rafraichissement invalide ou manquant';

    // COMPETITION
    public const string COMP_NOT_FOUND = 'Compétition introuvable.';
    public const string COMP_DENIED_MANAGE = 'Seul un gestionnaire peut modifier la compétition.';
    public const string COMP_DENIED_DELETE = 'Seul le créateur peut supprimer cette compétition.';
    public const string COMP_DENIED_ADD_PLAYERS = "Tu n'as pas le droit d'ajouter des joueurs à cette compétition.";
    public const string COMP_DENIED_ADD_REFEREES = "Tu n'as pas le droit d'ajouter des arbitres à cette compétition.";
    public const string COMP_DENIED_EDIT_REFEREES = "Tu n'as pas le droit de modifier les arbitres de cette compétition.";
    public const string COMP_MUST_PARTICIPATE = 'Tu dois participer à cette compétition pour effectuer cette action.';
    public const string COMP_LAST_REFEREE = 'Impossible de se retirer : tu es le dernier arbitre de cette arène.';
    public const string COMP_ALREADY_IN = 'Tu participes déjà à cette compétition.';
    public const string COMP_FINISHED = 'La compétition est terminée.';

    // JOUEURS & PARTICIPATIONS
    public const string PLAYER_NOT_FOUND = 'Joueur introuvable.';
    public const string PLAYER_ALREADY_LINKED = 'Ce profil joueur est déjà associé à un autre compte.';
    public const string PART_HAS_ACTIONS = 'Impossible de retirer ce joueur : il a déjà des actions enregistrées.';
    public const string PART_DENIED_DELETE = "Tu n'as pas le droit de supprimer un joueur";

    // ACTIONS (MÉFAITS)
    public const string ACTION_DENIED_EDIT = "Tu n'as pas le droit de modifier cette action.";
    public const string ACTION_DENIED_DELETE = "Tu n'as pas le droit de supprimer cette action.";
    public const string ACTION_PLAYER_NOT_FOUND = 'Le joueur ne participe pas à cette compétition.';

    // BONUS
    public const string BONUS_DENIED_CREATE = 'Seul un arbitre peut programmer un jour bonus.';
    public const string BONUS_DENIED_MANAGE = 'Seul un arbitre peut modifier un jour bonus.';
    public const string BONUS_DENIED_DELETE = 'Seul un arbitre peut supprimer un jour bonus.';

    // RESET PASSWORD
    public const string INVALID_RESET_PASSWORD_TOKEN = 'Le lien de réinitialisation est invalide ou a expiré.';

    // ACCES DIRECT
    public const string GUEST_PART_NOT_FOUND = 'Participation invité introuvable dans cette compétition.';
    public const string REAL_PLAYER_NOT_FOUND = "L'utilisateur réel ne possède pas de profil joueur actif.";
    public const string REAL_USER_NOT_FOUND = 'Utilisateur cible introuvable.';

    // ASSERT
    public const string MISSING_DATA = 'Données incomplètes.';
    public const string MISSING_ACTION_POINTS = "Les points de l'action sont obligatoires.";
    public const string MISSING_ACTION_DESCRIPTION = "La description de l'action est obligatoire.";
    public const string MISSING_ACTION_DATE = "La date de l'action est obligatoire.";
    public const string MISSING_ACTION_PLAYER = "L'auteur de l'action est obligatoire.";
    public const string MISSING_COMP_NAME = 'Le nom de la compétition est obligatoire.';
    public const string MISSING_COMP_START_DATE = 'La date de début de la compétition est obligatoire.';
    public const string MISSING_COMP_REFEREE_ID = "L'arbitre est obligatoire.";
    public const string MISSING_DISPLAY_NAME = "Le nom d'affichage est obligatoire.";
    public const string MISSING_USERNAME = "Le nom d'utilisateur est obligatoire.";
    public const string MISSING_EMAIL = "L'email est obligatoire.";
    public const string MISSING_PASSWORD = 'Le mot de passe est obligatoire.';
    public const string INVALID_EMAIL = "Format d'email invalide.";
    public const string DUPLICATE_EMAIL = 'Cette adresse email est déjà utilisée.';
    public const string DUPLICATE_USERNAME = "Ce nom d'utilisateur est déjà utilisé.";
    public const string AUTH_MIN_USERNAME = 'Le pseudo doit contenir au moins {{ limit }} caractères.';
    public const string AUTH_MIN_DISPLAY_NAME = "Le nom d'affichage doit contenir au moins {{ limit }} caractères.";
    public const string AUTH_MIN_PASSWORD = 'Le mot de passe doit contenir au moins {{ limit }} caractères.';
    public const string INVALID_CURRENT_PASSWORD = 'Mot de passe actuel invalide.';
    public const string INVALID_DATE_FORMAT = 'Format de date invalide.';
    public const string END_DATE_BEFORE_START_DATE = 'La date de fin doit être postérieure à la date de début.';
    public const string DUPLICATE_JOIN_CODE = 'Ce code est déjà utilisé.';
    public const string COMP_MIN_JOIN_CODE = "Le code d'accès doit contenir au moins {{ value }} caractères.";
    public const string ACTION_DATE_OUT_OF_RANGE = "La date de l'action doit être comprise dans les dates de la compétition.";
    public const string ACTION_MIN_DESCRIPTION = 'La description du méfait doit faire au moins {{ limit }} caractères.';
    public const string BONUS_DATE_OUT_OF_RANGE = 'La date du jour bonus doit être comprise dans les dates de la compétition.';
    public const string DUPLICATE_BONUS = 'Un bonus est déjà programmé pour cette arène à cette date.';
    public const string BONUS_MIN_VALUE = "Le multiplicateur doit être d'au moins {{ value }}.";
    public const string DUPLICATE_PARTICIPATION = 'Le joueur participe déjà à cette compétition.';
}
