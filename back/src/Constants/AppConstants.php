<?php

declare(strict_types=1);

namespace App\Constants;

final class AppConstants
{
    public const string TIMEZONE = 'Europe/Paris';

    // RÈGLES D'AUTHENTIFICATION & COMPTE
    public const int AUTH_MIN_DISPLAY_NAME = 2;
    public const int AUTH_MIN_USERNAME = 3;
    public const int AUTH_MIN_PASSWORD = 6;

    // RÈGLES DE JEU (MÉFAITS)
    public const int ACTION_MIN_DESCRIPTION = 3;

    // RÈGLES DES JOURS BONUS
    public const int BONUS_MIN_MULTIPLIER = 2;

    // RÈGLES DES COMPÉTITIONS
    public const int COMPETITION_MIN_NAME = 3;
    public const int COMPETITION_MIN_JOIN_CODE = 3;
}
