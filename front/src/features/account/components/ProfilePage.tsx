import { PROFILE_UI } from '@/features/account/constants';
import { useProfile } from '@/features/account/hooks';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  BUTTONS,
  Card,
  CARD_VARIANT,
  FORM,
  Grid,
  ICONS,
  MainLayout,
  PwaInstallCard,
  PwaInstallGuideCard,
  ROUTES,
  SECTION_HEADER_THEME,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Stack,
} from '@/shared';
import { ConfirmPasswordField } from './fields/ConfirmPasswordField';
import { DisplayNameField } from './fields/DisplayNameField';
import { EmailField } from './fields/EmailField';
import { PasswordField } from './fields/PasswordField';
import { UsernameField } from './fields/UsernameField';
import { NotificationSettingsForm } from './NotificationSettingsForm';

export const ProfilePage = () => {
  const {
    defaultUsername,
    defaultEmail,
    passwordValue,
    infoForm,
    passwordForm,
    onInfoSubmit,
    onPasswordSubmit,
    usernameRegistryOptions,
    prefsForm,
    onPrefsSubmit,
  } = useProfile();

  return (
    <MainLayout title={PROFILE_UI.TITLE} subtitle={PROFILE_UI.TITLE}>
      <Stack gap="lg" className="max-w-2xl mx-auto w-full">
        <SectionHeader
          variant={SECTION_HEADER_VARIANT.TITLE}
          colorTheme={SECTION_HEADER_THEME.GOLD}
          title={PROFILE_UI.TITLE}
          centered
        />
        <PwaInstallCard />
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
            >
              {FORM.AUTH.BUTTONS.CHANGE_PASSWORD}
            </Button>
          </Card.Body>
        </Card>

        {/* --- NOTIFICATIONS --- */}
        <NotificationSettingsForm form={prefsForm} onSubmit={onPrefsSubmit} />

        <PwaInstallGuideCard />

        {/* --- BLOC FIN DE SESSION DE CARRIÈRE --- */}
        <Card
          variant={CARD_VARIANT.DARK}
          className="border-danger-border/30 bg-danger-soft/5 w-full animate-slide-up"
        >
          <Card.Body p="md" gap="sm" align="center">
            <SectionHeader
              title={PROFILE_UI.LOGOUT_CARD.TITLE}
              subtitle={PROFILE_UI.LOGOUT_CARD.SUBTITLE}
              variant={SECTION_HEADER_VARIANT.BLOCK}
              colorTheme={SECTION_HEADER_THEME.DANGER}
              centered
            />

            <Button
              to={ROUTES.NAV.LOGOUT}
              variant={BUTTON_VARIANT.DANGER}
              size={BUTTON_SIZE.SMALL}
              className="mt-2 w-full sm:w-auto"
              icon={ICONS.LOGOUT}
            >
              {PROFILE_UI.LOGOUT_CARD.BUTTON}
            </Button>
          </Card.Body>
        </Card>
      </Stack>
    </MainLayout>
  );
};

export default ProfilePage;
