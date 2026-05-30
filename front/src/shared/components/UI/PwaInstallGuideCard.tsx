import {
  Card,
  CARD_VARIANT,
  Grid,
  ICONS,
  Row,
  Stack,
  Text,
  TEXT_THEME,
  TEXT_VARIANT,
  usePwaInstall,
} from '@/shared';

export const PwaInstallGuideCard = () => {
  const { isInstalled } = usePwaInstall();

  // Si le joueur utilise déjà l'application depuis son écran d'accueil, le guide se masque.
  if (isInstalled) return null;

  return (
    <Card
      variant={CARD_VARIANT.GLASS}
      className="w-full shadow-modal-info border-info/50 animate-slide-up"
    >
      <Card.Body p="lg" gap="md">
        <Stack gap="xs" align="center" className="text-center mb-2">
          <Text
            variant={TEXT_VARIANT.H2}
            colorTheme={TEXT_THEME.INFO}
            className="italic flex items-center gap-2"
          >
            <span aria-hidden="true">{ICONS.INSTALL}</span> Guide d'installation
          </Text>
          <Text
            variant={TEXT_VARIANT.BODY}
            colorTheme={TEXT_THEME.MUTED}
            className="text-xs leading-relaxed"
          >
            Si le bouton d'installation n'apparaît pas, suis ce tutoriel rapide
            pour forcer l'ajout de l'arène sur ton téléphone.
          </Text>
        </Stack>

        <Grid cols={1} sm={2} gap="md" className="w-full pt-2">
          {/* Bloc iPhone / Safari */}
          <Stack
            gap="sm"
            className="bg-black/40 p-4 rounded-xl border border-info/20 text-left"
          >
            <Row gap="sm" align="center">
              <span className="text-xl text-info-bright" aria-hidden="true">
                {ICONS.PLAYER}
              </span>
              <Text
                variant={TEXT_VARIANT.H3}
                colorTheme={TEXT_THEME.INFO}
                className="font-bold"
              >
                Sur iPhone / iPad
              </Text>
            </Row>

            <Stack gap="xs" className="pl-1">
              <Text
                variant={TEXT_VARIANT.BODY}
                className="text-xs leading-snug text-silver"
              >
                1. Ouvre impérativement le site dans le navigateur{' '}
                <strong>Safari</strong>.
              </Text>
              <Text
                variant={TEXT_VARIANT.BODY}
                className="text-xs leading-snug text-silver"
              >
                2. Appuie sur le bouton <strong>Partager</strong>{' '}
                <span className="text-info-bright font-black">⎋</span> (l'icône
                de carré avec une flèche vers le haut).
              </Text>
              <Text
                variant={TEXT_VARIANT.BODY}
                className="text-xs leading-snug text-silver"
              >
                3. Descends dans la liste d'options et sélectionne{' '}
                <strong>Sur l'écran d'accueil</strong> ➕.
              </Text>
            </Stack>
          </Stack>

          {/* Bloc Android / Chrome */}
          <Stack
            gap="sm"
            className="bg-black/40 p-4 rounded-xl border border-info/50 text-left"
          >
            <Row gap="sm" align="center">
              <span className="text-xl text-info-bright" aria-hidden="true">
                {ICONS.SETTINGS}
              </span>
              <Text
                variant={TEXT_VARIANT.H3}
                colorTheme={TEXT_THEME.INFO}
                className="font-bold"
              >
                Sur Android / PC
              </Text>
            </Row>

            <Stack gap="xs" className="pl-1">
              <Text
                variant={TEXT_VARIANT.BODY}
                className="text-xs leading-snug text-silver"
              >
                1. Si disponible, utilise{' '}
                <strong>l'encart doré automatique</strong> tout en haut de
                l'écran.
              </Text>
              <Text
                variant={TEXT_VARIANT.BODY}
                className="text-xs leading-snug text-silver"
              >
                2. Sinon, appuie sur les <strong>3 petits points</strong> ⁝
                situés en haut à droite de ton navigateur Chrome.
              </Text>
              <Text
                variant={TEXT_VARIANT.BODY}
                className="text-xs leading-snug text-silver"
              >
                3. Sélectionne l'option <strong>Installer l'application</strong>
                .
              </Text>
            </Stack>
          </Stack>
        </Grid>
      </Card.Body>
    </Card>
  );
};
