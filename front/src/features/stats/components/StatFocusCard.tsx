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
  formatShortDate,
} from '@/shared';
import {
  PLAYER_STATS_GENERAL,
  FOCUS_THEME_CONFIG,
} from '@/features/stats/constants';
import type { StatFocusCardProps } from '@/features/stats/types';

export const StatFocusCard = ({
  title,
  data,
  icon,
  variant,
}: StatFocusCardProps) => {
  const config = FOCUS_THEME_CONFIG[variant];
  const finalPrefix = data?.prefixOverride || config.prefix;

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
                    className="text-[8px] tracking-normal truncate mt-0.5 flex flex-wrap items-center gap-1"
                  >
                    {data.involvedName && (
                      <span className="flex items-center normal-case">
                        {finalPrefix}
                        <span
                          className={cn(
                            'font-bold ml-1',
                            data.isMe ? 'text-player-me' : config.defaultColor,
                          )}
                        >
                          {data.isMe ? UI.ME : data.involvedName}
                        </span>
                      </span>
                    )}

                    {(data.date || data.competitionName) &&
                      data.involvedName && (
                        <span className="opacity-40 mx-0.5">•</span>
                      )}

                    {data.date ? (
                      <span className="text-silver italic font-mono text-[9px]">
                        {formatShortDate(data.date)}
                      </span>
                    ) : data.competitionName ? (
                      <span className="text-gold truncate">
                        {data.competitionName}
                      </span>
                    ) : null}
                  </Text>
                </Stack>
              ) : (
                <Text
                  variant={TEXT_VARIANT.MICRO}
                  colorTheme={TEXT_THEME.DIMMED}
                  className="italic text-[10px] tracking-normal mt-0.5 normal-case"
                >
                  {PLAYER_STATS_GENERAL.FOCUS.RECORD_EMPTY}
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
