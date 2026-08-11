<?php

declare(strict_types=1);

namespace App\Constants;

final class NotificationConstants
{
    public const string TOPIC_USER_NOTIFICATIONS = 'urn:blaireau:user:%s:notifications';

    // 1. LES CLÉS UNIQUES (TYPES)
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
    public const string TYPE_REFEREE_PROMOTED = 'REFEREE_PROMOTED';
    public const string TYPE_REFEREE_REVOKED = 'REFEREE_REVOKED';
    public const string TYPE_GUEST_CLAIMED = 'GUEST_CLAIMED';

    // 2. LE DICTIONNAIRE DE CONTENUS (Idéal pour la future page Paramètres)
    public const array CONTENT = [
        self::TYPE_NEW_SUBMISSION => [
            'label' => 'Nouvelles demandes d\'arbitrage',
            'title' => 'Arbitrage requis',
            'msg' => 'Une action sur %s attend ton verdict.',
        ],
        self::TYPE_ACTION_VALIDATED => [
            'label' => 'Validation des méfaits',
            'title' => 'Sentence confirmée !',
            'msg_target' => 'Tu as pris %d points ! (%s)',
            'msg_others' => '%s a pris %d points ! (%s)',
            'msg_fog_target' => 'Tu as pris des points ! (%s)',
            'msg_fog_others' => '%s a pris des points !',
        ],
        self::TYPE_ACTION_REJECTED => [
            'label' => 'Rejet de mes signalements',
            'title' => 'Signalement refusé',
            'msg' => 'Ton signalement sur %s a été classé sans suite.',
        ],
        self::TYPE_BONUS_TRIGGERED => [
            'label' => 'Jours Bonus activés',
            'title' => 'Multiplicateur activé !',
            'msg_past' => 'Les points étaient multipliés par %d le %s !',
            'msg_today' => 'Les points sont multipliés par %d aujourd\'hui !',
            'msg_tomorrow' => 'Les points seront multipliés par %d demain !',
            'msg_future' => 'Les points seront multipliés par %d dans %d jours (%s) !',
        ],
        self::TYPE_PLAYER_JOINED => [
            'label' => 'Nouveaux concurrents dans l\'arène',
            'title' => 'Nouveau concurrent',
            'msg' => '%s est entré dans l\'arène !',
        ],
        self::TYPE_COMPETITION_STARTED => [
            'label' => 'Ouverture officielle des arènes',
            'title' => 'Lancement de la saison',
            'msg' => 'L\'arène %s est ouverte, que la chasse commence !',
        ],
        self::TYPE_COMPETITION_FINISHED => [
            'label' => 'Clôture des arènes',
            'title' => 'Fin de la compétition',
            'msg' => 'L\'arène %s est close. Consultez le classement final !',
        ],
        self::TYPE_FOG_DISABLED => [
            'label' => 'Levée du brouillard de guerre',
            'title' => 'Brouillard dissipé',
            'msg' => 'Le secret est levé, les scores de l\'arène sont visibles !',
        ],
        self::TYPE_FOG_ENABLED => [
            'label' => 'Activation du brouillard de guerre',
            'title' => 'Brouillard activé',
            'msg' => 'L\'arène est plongée dans l\'ombre, les scores sont masqués !',
        ],
        self::TYPE_ADDED_BY_REFEREE => [
            'label' => 'Ajout forcé par un arbitre',
            'title' => 'Ajout à une compétition',
            'msg' => '%s vous a ajouté à l\'arène %s.',
        ],
        self::TYPE_REFEREE_PROMOTED => [
            'label' => 'Nominations d\'arbitres',
            'title' => 'Équipe d\'arbitrage',
            'msg_target' => '%s vous a désigné arbitre pour l\'arène %s.',
            'msg_others' => '%s a été désigné arbitre pour l\'arène %s.',
        ],
        self::TYPE_REFEREE_REVOKED => [
            'label' => 'Révocations d\'arbitres',
            'title' => 'Équipe d\'arbitrage',
            'msg_target' => '%s a révoqué vos droits d\'arbitrage pour l\'arène %s.',
            'msg_others' => '%s a été libéré de ses fonctions d\'arbitre pour l\'arène %s.',
        ],
        self::TYPE_GUEST_CLAIMED => [
            'label' => 'Prise de contrôle d\'un profil invité',
            'title' => 'Un joueur se réveille',
            'msg' => '%s a créé son compte réel et gère désormais son propre profil !',
        ],
    ];
}
