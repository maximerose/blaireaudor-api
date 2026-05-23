import QRCode from 'react-qr-code';
import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Button,
  BUTTON_VARIANT,
  SectionHeader,
  ROUTES,
  Stack,
  BUTTONS,
} from '@/shared';
import { COMPETITION_UI } from '@/features/competition/constants';

interface Props {
  joinCode: string;
  onClose: () => void;
}

export const CompetitionQRCodeModal = ({ joinCode, onClose }: Props) => {
  const joinUrl = `${window.location.origin}${ROUTES.NAV.QR_JOIN(joinCode)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md animate-fade-in cursor-pointer"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-slide-up cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <Card
          variant={CARD_VARIANT.DARK}
          className="shadow-modal-gold border-gold/30"
        >
          <Card.Body p="xl" gap="lg" align="center">
            <SectionHeader
              title={COMPETITION_UI.DETAIL.SECTIONS.HEADER.QR_MODAL_TITLE}
              subtitle={COMPETITION_UI.DETAIL.SECTIONS.HEADER.QR_MODAL_SUBTITLE}
              centered
            />

            <div className="p-4 bg-white rounded-2xl shadow-inner mx-auto w-full aspect-square flex items-center justify-center">
              <QRCode value={joinUrl} size={256} className="w-full h-auto" />
            </div>

            <Stack gap="none" align="center" className="text-center">
              <Text
                variant={TEXT_VARIANT.MICRO}
                colorTheme={TEXT_THEME.DIMMED}
                className="uppercase"
              >
                {COMPETITION_UI.DETAIL.SECTIONS.HEADER.QR_DIRECT_LINK}
              </Text>
              <Text
                variant={TEXT_VARIANT.MONO}
                colorTheme={TEXT_THEME.GOLD}
                className="text-xl font-black mt-1 tracking-widest"
              >
                {joinCode}
              </Text>
            </Stack>

            <Button
              fullWidth
              variant={BUTTON_VARIANT.GHOST_NEUTRAL}
              onClick={onClose}
            >
              {BUTTONS.CLOSE}
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
