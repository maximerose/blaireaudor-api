import {
  Card,
  Text,
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  TEXT_VARIANT,
  TEXT_THEME,
  CARD_VARIANT,
  FORM,
  Row,
  Stack,
} from '@/shared';
import { AUTH_UI } from '@/features/account/constants';

interface LinkedProfileCardProps {
  name?: string;
  onClear: () => void;
}

export const LinkedProfileCard = ({
  name,
  onClear,
}: LinkedProfileCardProps) => (
  <Card
    variant={CARD_VARIANT.GLASS}
    role="region"
    aria-label={AUTH_UI.LINKED_CARD.STATUS}
    className="border-success-border bg-success-soft animate-fade-in"
  >
    <Card.Body>
      <Row justify="between" align="center">
        <Stack gap="xs" className="text-left">
          <Row gap="xs">
            <div
              className="w-1.5 h-1.5 rounded-full bg-success-bright animate-pulse"
              aria-hidden="true"
            />
            <Text
              variant={TEXT_VARIANT.CAPTION}
              colorTheme={TEXT_THEME.SUCCESS}
            >
              {AUTH_UI.LINKED_CARD.STATUS}
            </Text>
          </Row>

          <Text variant={TEXT_VARIANT.H2} className="normal-case">
            {name}
          </Text>
        </Stack>

        <Button
          variant={BUTTON_VARIANT.GHOST_NEUTRAL}
          size={BUTTON_SIZE.SMALL}
          onClick={onClear}
          aria-label={FORM.AUTH.ARIA.CHANGE_LINKED_PLAYER(name)}
        >
          {AUTH_UI.LINKED_CARD.CHANGE_BUTTON}
        </Button>
      </Row>
    </Card.Body>
  </Card>
);
