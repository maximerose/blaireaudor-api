import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/UI';
import { cn } from '@/utils';

export const CreateCompetitionStepper = ({ step }: { step: number }) => (
  <div className="flex justify-between items-center px-1">
    <Button
      to={ROUTES.NAV_DASHBOARD}
      variant="ghost"
      size="sm"
      className="transition-default"
    >
      ← Annuler
    </Button>
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-default',
          step === 1 ? 'bg-gold text-dark' : 'bg-success text-white',
        )}
      >
        {step === 1 ? '1' : '✓'}
      </div>
      <div className="w-4 h-px bg-white/10" />
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-default',
          step === 2
            ? 'bg-gold text-dark border-gold'
            : 'border-white/10 text-white/20',
        )}
        aria-live="polite"
      >
        2
      </div>
    </div>
  </div>
);
