import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Card,
  CARD_VARIANT,
  ICONS,
  PWA,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  usePwaInstall,
} from '@/shared';

export const PwaInstallCard = () => {
  const { isInstallable, promptInstall, dismissPrompt } = usePwaInstall();

  // Si l'application est déjà installée ou que le navigateur ne le permet pas, le composant s'autodétruit silencieusement.
  if (!isInstallable) return null;

  return (
    <Card
      variant={CARD_VARIANT.DARK}
      className="border-gold/50 bg-gold/10 w-full animate-slide-up shadow-glow-gold relative"
    >
      <button
        type="button"
        onClick={dismissPrompt}
        className="absolute top-2 right-2 z-10 text-gold/50 hover:text-gold transition-default cursor-pointer p-2"
        aria-label={PWA.ARIA_HIDE}
        title={PWA.HIDE}
      >
        <span aria-hidden="true">{ICONS.CANCEL}</span>
      </button>
      <Card.Body p="md" gap="sm" align="center">
        <SectionHeader
          title={PWA.TITLE}
          subtitle={PWA.SUBTITLE}
          variant={SECTION_HEADER_VARIANT.BLOCK}
          colorTheme={SECTION_HEADER_THEME.GOLD}
          icon={ICONS.INSTALL}
          centered
        />
        <Button
          onClick={promptInstall}
          variant={BUTTON_VARIANT.PRIMARY}
          size={BUTTON_SIZE.MEDIUM}
          icon={ICONS.INSTALL}
          className="mt-2 w-full sm:w-auto"
        >
          {PWA.INSTALL_BTN}
        </Button>
      </Card.Body>
    </Card>
  );
};
