import {
  ROUTES,
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  cn,
  BUTTONS,
  ICONS,
} from '@/shared';

export const CreateCompetitionStepper = ({ step }: { step: number }) => {
  const renderCircle = (num: number) => {
    const isPassed = step > num;
    const isActive = step === num;

    return (
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-default',
          isActive
            ? 'bg-gold text-dark'
            : isPassed
              ? 'bg-success text-white'
              : 'border border-white/10 text-white/20',
        )}
        aria-live="polite"
      >
        {isPassed ? '1' : ICONS.CHECK}
      </div>
    );
  };

  return (
    <div className="flex justify-between items-center px-1">
      <Button
        to={ROUTES.NAV.DASHBOARD}
        variant={BUTTON_VARIANT.GHOST}
        size={BUTTON_SIZE.SMALL}
        className="transition-default"
      >
        {BUTTONS.CANCEL}
      </Button>
      <div className="flex items-center gap-2">
        {renderCircle(1)}
        <div className="w-4 h-px bg-white/10" />
        {renderCircle(2)}
        <div className="w-4 h-px bg-white/10" />
        {renderCircle(3)}
      </div>
    </div>
  );
};
