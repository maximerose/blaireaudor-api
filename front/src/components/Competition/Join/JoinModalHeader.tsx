import { SECTION_HEADER_VARIANT, SectionHeader, FORM, ICONS } from '@/shared';

export const JoinModalHeader = () => {
  return (
    <SectionHeader
      variant={SECTION_HEADER_VARIANT.BLOCK}
      as="h1"
      title={FORM.MODALS.JOIN.INPUT_LABEL}
      subtitle={FORM.MODALS.JOIN.PLACEHOLDER}
      centered
      icon={ICONS.SECRET}
    />
  );
};
