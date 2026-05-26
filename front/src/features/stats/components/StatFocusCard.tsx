import {
  Card,
  CARD_VARIANT,
  Text,
  TEXT_VARIANT,
  TEXT_THEME,
  Row,
  Stack,
  cn,
  UI,
} from '@/shared';
import type { PlayerRecord } from '@/features/account/types';
import { useAuthContext } from '@/features/account';
import { PLAYER_STATS_UI } from '@/features/stats/constants';

interface StatFocusCardProps {
  title: string;
  data: PlayerRecord | null;
  icon: string | React.ReactNode;
  variant: 'danger' | 'info';
}

const THEME_CONFIG = {
  danger: {
    cardClass: 'border-danger-border/40 bg-danger-soft/5',
    iconClass: 'bg-danger/20 text-danger-bright',
    textTheme: TEXT_THEME.DANGER,
    glowClass: 'drop-shadow-[0_0_6px_rgba(248,113,113,0.4)]',
    defaultColor: 'text-danger-bright',
    prefix: PLAYER_STATS_UI.FOCUS.STAB_DENOUNCER,
  },
  info: {
    cardClass: 'border-info-border/30 bg-info-soft/5',
    iconClass: 'bg-info/20 text-info-bright',
    textTheme: TEXT_THEME.INFO,
    glowClass: 'drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]',
    defaultColor: 'text-info-bright',
    prefix: PLAYER_STATS_UI.FOCUS.STAB_VICTIM,
  },
};

export const StatFocusCard = ({
  title,
  data,
  icon,
  variant,
}: StatFocusCardProps) => {
  const config = THEME_CONFIG[variant];
  const { user } = useAuthContext();
  const isMe = data?.involved_player_name === user?.player?.display_name;

  return (
    <Card variant={CARD_VARIANT.DARK} className={config.cardClass}>
      <Card.Body p="sm" justify="center" className="h-full">
        <Row
          justify="between"
          align="center"
          gap="md"
          px="xs"
          className="min-w-0"
        >
          <Row
            fullWidth={false}
            gap="sm"
            align="center"
            className="min-w-0 flex-1"
          >
            <div
              className={cn(
                'p-2 rounded-xl text-base shrink-0 flex items-center justify-center',
                config.iconClass,
              )}
            >
              {icon}
            </div>

            <Stack gap="none" className="min-w-0 flex-1 text-left">
              <Text
                variant={TEXT_VARIANT.CAPTION}
                colorTheme={config.textTheme}
                className="font-black text-[10px] tracking-normal whitespace-nowrap"
              >
                {title}
              </Text>

              {data ? (
                <Stack gap="none" className="min-w-0">
                  <Text
                    variant={TEXT_VARIANT.CAPTION}
                    className="truncate text-white font-bold tracking-wider italic normal-case block mt-0.5"
                  >
                    {data.description}
                  </Text>
                  <Text
                    variant={TEXT_VARIANT.MICRO}
                    colorTheme={TEXT_THEME.DIMMED}
                    className="text-[8px] tracking-normal truncate block mt-0.5"
                  >
                    {data.involved_player_name ? (
                      <>
                        {config.prefix}
                        <span
                          className={cn(
                            'font-bold mr-1',
                            isMe ? 'text-player-me' : config.defaultColor,
                          )}
                        >
                          {isMe ? UI.ME : data.involved_player_name}
                        </span>
                        <span className="opacity-40">• </span>
                      </>
                    ) : null}
                    <span className="text-gold">{data.competition_name}</span>
                  </Text>
                </Stack>
              ) : (
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.DIMMED}
                  className="italic text-[10px] tracking-normal mt-0.5"
                >
                  {PLAYER_STATS_UI.FOCUS.RECORD_EMPTY}
                </Text>
              )}
            </Stack>
          </Row>

          {data && (
            <Text
              variant={TEXT_VARIANT.H2}
              colorTheme={config.textTheme}
              className={cn('shrink-0 font-black text-lg', config.glowClass)}
            >
              +{data.points}
              <span className="text-[7px] font-normal lowercase opacity-40 ml-0.5">
                pts
              </span>
            </Text>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};
