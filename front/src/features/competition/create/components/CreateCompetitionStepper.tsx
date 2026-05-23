// front/src/features/competition/create/components/CreateCompetitionStepper.tsx

import {
  ROUTES,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  cn,
  BUTTONS,
  ICONS,
  Row,
} from '@/shared';

export const CreateCompetitionStepper = ({ step }: { step: number }) => {
  const renderCircle = (num: number) => {
    const isPassed = step > num;
    const isActive = step === num;

    return (
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-default shrink-0',
          isActive
            ? 'bg-gold text-dark'
            : isPassed
              ? 'bg-success-bright text-success'
              : 'border border-white/10 text-white/20',
        )}
        aria-live="polite"
      >
        {isPassed ? <span className="text-xs">{ICONS.CHECK}</span> : num}
      </div>
    );
  };

  return (
    <Row justify="between" align="center" className="px-1">
      <Button
        to={ROUTES.NAV.DASHBOARD}
        variant={BUTTON_VARIANT.GHOST}
        size={BUTTON_SIZE.SMALL}
      >
        {BUTTONS.CANCEL}
      </Button>

      <Row align="center" gap="sm" fullWidth={false}>
        {renderCircle(1)}
        <div className="w-4 h-px bg-border-base shrink-0" />
        {renderCircle(2)}
        <div className="w-4 h-px bg-border-base shrink-0" />
        {renderCircle(3)}
      </Row>
    </Row>
  );
};
