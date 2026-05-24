<?php

declare(strict_types=1);

namespace App\Constants;

final class NotificationConstants
{
    // Types de Notifications
    public const string TYPE_NEW_SUBMISSION = 'NEW_SUBMISSION';
    public const string TYPE_ACTION_VALIDATED = 'ACTION_VALIDATED';
    public const string TYPE_ACTION_REJECTED = 'ACTION_REJECTED';
    public const string TYPE_BONUS_TRIGGERED = 'BONUS_TRIGGERED';
    public const string TYPE_PLAYER_JOINED = 'PLAYER_JOINED';
    public const string TYPE_COMPETITION_STARTED = 'COMPETITION_STARTED';
    public const string TYPE_COMPETITION_FINISHED = 'COMPETITION_FINISHED';
    public const string TYPE_FOG_DISABLED = 'FOG_DISABLED';
    public const string TYPE_FOG_ENABLED = 'FOG_ENABLED';
    public const string TYPE_ADDED_BY_REFEREE = 'ADDED_BY_REFEREE';

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

    // 🔥 BONUS_TRIGGERED
    public const string TITLE_BONUS_TRIGGERED = '🔥 Multiplicateur activé !';
    public const string MSG_BONUS_TRIGGERED = 'Les points sont multipliés par %d aujourd\'hui !';

    // 🐣 PLAYER_JOINED
    public const string TITLE_PLAYER_JOINED = '🐣 Nouveau concurrent';
    public const string MSG_PLAYER_JOINED = '%s est entré dans l\'arène !';

    // 🏁 COMPETITION_STARTED
    public const string TITLE_COMPETITION_STARTED = '🏁 Lancement de la saison';
    public const string MSG_COMPETITION_STARTED = 'L\'arène %s est ouverte, que la chasse commence !';

    // 🏆 COMPETITION_FINISHED
    public const string TITLE_COMPETITION_FINISHED = '🏆 Fin de la compétition';
    public const string MSG_COMPETITION_FINISHED = 'L\'arène %s est close. Consultez le classement final !';

    // 👁️ FOG_DISABLED
    public const string TITLE_FOG_DISABLED = '👁️ Brouillard dissipé';
    public const string MSG_FOG_DISABLED = 'Le secret est levé, les scores de l\'arène sont visibles !';

    // 👻 FOG_ENABLED
    public const string TITLE_FOG_ENABLED = '👻 Brouillard activé';
    public const string MSG_FOG_ENABLED = 'L\'arène est plongée dans l\'ombre, les scores sont masqués !';

    // 📋 ADDED_BY_REFEREE
    public const string TITLE_ADDED_BY_REFEREE = '📋 Ajout à une compétition';
    public const string MSG_ADDED_BY_REFEREE = '%s vous a ajouté à l\'arène %s.';
}
