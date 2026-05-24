<?php

declare(strict_types=1);

namespace App\Constants;

final class NotificationConstants
{
    // Types de Notifications
    public const string TYPE_NEW_SUBMISSION = 'NEW_SUBMISSION';
    public const string TYPE_ACTION_VALIDATED = 'ACTION_VALIDATED';
    public const string TYPE_ACTION_REJECTED = 'ACTION_REJECTED';

    // ⚖️ NEW_SUBMISSION (Arbitres)
    public const string TITLE_NEW_SUBMISSION = '⚖️ Arbitrage requis';
    public const string MSG_NEW_SUBMISSION = 'Une action sur %s attend ton verdict.';

    // 🚨 ACTION_VALIDATED
    public const string TITLE_ACTION_VALIDATED = '🚨 Sentence confirmée !';
    public const string MSG_ACTION_VALIDATED_FOG = 'L\'arbitre a validé : %s.';
    public const string MSG_ACTION_VALIDATED_TARGET = 'Tu as pris %d points ! (%s)';
    public const string MSG_ACTION_VALIDATED_OTHERS = '%s a pris %d points ! (%s)';

    // ✕ ACTION_REJECTED (Dénonciateur)
    public const string TITLE_ACTION_REJECTED = '✕ Signalement refusé';
    public const string MSG_ACTION_REJECTED = 'Ton signalement sur %s a été classé sans suite.';
}
