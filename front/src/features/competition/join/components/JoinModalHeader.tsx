import {
  FORM,
  ICONS,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
} from '@/shared';

export const JoinModalHeader = () => {
  return (
    <SectionHeader
      variant={SECTION_HEADER_VARIANT.BLOCK}
      as="h1"
      title={FORM.MODALS.JOIN.INPUT_LABEL}
      subtitle={FORM.MODALS.JOIN.PLACEHOLDER}
      colorTheme={SECTION_HEADER_THEME.GOLD}
      centered
      icon={ICONS.SECRET}
    />
  );
};
