import { Text, TEXT_VARIANT } from '@/components/UI';
import { FORM, ICONS } from '@/constants';

const ICON_WRAPPER =
  'w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]';

export const JoinModalHeader = () => (
  <header className="text-center space-y-2">
    <div className={ICON_WRAPPER} aria-hidden="true">
      <span className="text-xl">{ICONS.SECRET}</span>
    </div>
    <Text id="modal-title" variant={TEXT_VARIANT.H2} className="italic">
      {FORM.MODALS.JOIN.INPUT_LABEL}
    </Text>
    <Text variant={TEXT_VARIANT.CAPTION}>{FORM.MODALS.JOIN.PLACEHOLDER}</Text>
  </header>
);
