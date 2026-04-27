import { Button, Text, Badge } from '@/components/UI';
import { cn } from '@/utils';

export const FogOfWarToggle = ({ isActive, onToggle, isLoading }: any) => (
  <div className="flex flex-col items-center lg:items-start gap-3">
    <Button
      variant={isActive ? 'primary' : 'ghost'}
      onClick={onToggle}
      isLoading={isLoading}
      className={cn(
        'w-full sm:w-auto min-w-70 h-20 transition-all duration-500',
        isActive ? 'border-gold/50 bg-gold/10' : 'border-white/10',
      )}
    >
      <div className="flex items-center gap-4 text-left w-full">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner',
            isActive ? 'bg-gold text-black' : 'bg-white/5 text-white/20',
          )}
        >
          {isActive ? '🌫️' : '👁️'}
        </div>
        <div className="flex flex-col flex-1">
          <Text
            variant="h3"
            className="font-black uppercase text-[11px] leading-none tracking-tight"
          >
            {isActive ? 'Lever le brouillard' : 'Activer le brouillard'}
          </Text>
          <Text
            variant="body"
            className="text-[10px] opacity-60 font-normal italic mt-1 leading-tight"
          >
            {isActive
              ? 'Rendre les scores visibles par tous'
              : 'Cacher les scores pour le suspense'}
          </Text>
        </div>
        <Badge variant={isActive ? 'success' : 'warning'}>
          {isActive ? 'ACTIF' : 'OFF'}
        </Badge>
      </div>
    </Button>
  </div>
);
