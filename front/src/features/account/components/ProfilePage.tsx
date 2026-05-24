import {
  MainLayout,
  Button,
  Card,
  CARD_VARIANT,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  BUTTONS,
  FORM,
  ICONS,
  BUTTON_VARIANT,
  SECTION_HEADER_THEME,
  Stack,
  Grid,
} from '@/shared';
import { useProfile } from '@/features/account/hooks';
import { PROFILE_UI } from '@/features/account/constants';
import { DisplayNameField } from './fields/DisplayNameField';
import { UsernameField } from './fields/UsernameField';
import { EmailField } from './fields/EmailField';
import { PasswordField } from './fields/PasswordField';
import { ConfirmPasswordField } from './fields/ConfirmPasswordField';

export const ProfilePage = () => {
  const {
    infoForm,
    passwordForm,
    onInfoSubmit,
    onPasswordSubmit,
    usernameRegistryOptions,
  } = useProfile();

  const passwordValue = passwordForm.watch('new_password') || '';

  const defaultUsername = infoForm.formState.defaultValues?.username || '';
  const defaultEmail = infoForm.formState.defaultValues?.email || '';

  return (
    <MainLayout title={PROFILE_UI.TITLE} subtitle={PROFILE_UI.TITLE}>
      <Stack gap="xl" className="max-w-2xl mx-auto w-full">
        <SectionHeader
          variant={SECTION_HEADER_VARIANT.TITLE}
          colorTheme={SECTION_HEADER_THEME.GOLD}
          title={PROFILE_UI.TITLE}
          centered
        />

        {/* --- FORMULAIRE DES INFORMATIONS GÉNÉRALES --- */}
        <Card
          as="form"
          variant={CARD_VARIANT.GLASS}
          onSubmit={onInfoSubmit}
          noValidate
          className="animate-slide-up w-full"
        >
          <Card.Body p="lg" gap="lg">
            <SectionHeader
              variant={SECTION_HEADER_VARIANT.BLOCK}
              title={PROFILE_UI.INFO_TITLE}
              subtitle={PROFILE_UI.INFO_SUBTITLE}
              as="h2"
              centered
            />

            <DisplayNameField
              error={infoForm.formState.errors?.display_name?.message}
              {...infoForm.register('display_name')}
            />

            <Grid cols={1} sm={2} gap="lg" className="w-full">
              <UsernameField
                register={infoForm.register}
                watch={infoForm.watch}
                errors={infoForm.formState.errors}
                initialUsername={defaultUsername}
                registerOptions={usernameRegistryOptions}
              />

              <EmailField
                register={infoForm.register}
                watch={infoForm.watch}
                errors={infoForm.formState.errors}
                initialEmail={defaultEmail}
              />
            </Grid>

            <Button
              type="submit"
              isLoading={infoForm.formState.isSubmitting}
              disabled={
                !infoForm.formState.isDirty || !infoForm.formState.isValid
              }
              fullWidth
              className="cursor-pointer"
            >
              {BUTTONS.SAVE}
            </Button>
          </Card.Body>
        </Card>

        {/* --- FORMULAIRE DE MODIFICATION DU MOT DE PASSE --- */}
        <Card
          as="form"
          variant={CARD_VARIANT.GLASS}
          onSubmit={onPasswordSubmit}
          noValidate
          className="animate-slide-up w-full"
        >
          <Card.Body p="lg" gap="lg">
            <SectionHeader
              variant={SECTION_HEADER_VARIANT.BLOCK}
              title={PROFILE_UI.PASSWORD_TITLE}
              subtitle={PROFILE_UI.PASSWORD_SUBTITLE}
              as="h2"
              centered
              colorTheme={SECTION_HEADER_THEME.DANGER}
            />

            <PasswordField
              label={FORM.AUTH.LABELS.CURRENT_PASSWORD}
              error={passwordForm.formState.errors.current_password?.message}
              {...passwordForm.register('current_password')}
            />

            <Stack
              gap="md"
              className="pt-4 border-t border-border-subtle w-full"
            >
              <PasswordField
                label={FORM.AUTH.LABELS.NEW_PASSWORD}
                icon={ICONS.STARS}
                watchValue={passwordValue}
                error={passwordForm.formState.errors.new_password?.message}
                {...passwordForm.register('new_password')}
              />

              <ConfirmPasswordField
                error={passwordForm.formState.errors.confirm_password?.message}
                {...passwordForm.register('confirm_password')}
              />
            </Stack>

            <Button
              type="submit"
              variant={BUTTON_VARIANT.DANGER}
              isLoading={passwordForm.formState.isSubmitting}
              disabled={
                !passwordForm.formState.isDirty ||
                !passwordForm.formState.isValid
              }
              fullWidth
              className="cursor-pointer"
            >
              {FORM.AUTH.BUTTONS.CHANGE_PASSWORD}
            </Button>
          </Card.Body>
        </Card>
      </Stack>
    </MainLayout>
  );
};
