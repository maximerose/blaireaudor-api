import {
  MainLayout,
  Button,
  Card,
  CARD_VARIANT,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  AVAILABILITY,
  BUTTONS,
  FORM,
  ICONS,
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
    handleUsernameBlur,
    handleUsernameChange,
    handleEmailBlur,
    onInfoSubmit,
    onPasswordSubmit,
    usernameStatus,
    usernameLoading,
    isUsernameUnchanged,
    emailStatus,
    emailLoading,
    isEmailUnchanged,
  } = useProfile();

  const passwordValue = passwordForm.watch('new_password') || '';

  return (
    <MainLayout title={PROFILE_UI.TITLE} subtitle={PROFILE_UI.TITLE}>
      <div className="max-w-2xl mx-auto space-y-8 pb-10">
        <SectionHeader
          variant={SECTION_HEADER_VARIANT.TITLE}
          title={PROFILE_UI.TITLE}
          centered
        />

        <Card
          variant={CARD_VARIANT.GLASS}
          className="p-6 sm:p-8 animate-slide-up"
        >
          <SectionHeader
            variant={SECTION_HEADER_VARIANT.BLOCK}
            title={PROFILE_UI.INFO_TITLE}
            subtitle={PROFILE_UI.INFO_SUBTITLE}
            as="h2"
          />

          <form onSubmit={onInfoSubmit} className="space-y-6 mt-6" noValidate>
            <DisplayNameField
              error={infoForm.formState.errors?.display_name?.message}
              {...infoForm.register('display_name')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <UsernameField
                usernameStatus={usernameStatus}
                usernameLoading={usernameLoading}
                isUsernameUnchanged={isUsernameUnchanged}
                error={infoForm.formState.errors.username?.message}
                {...infoForm.register('username', {
                  onChange: handleUsernameChange,
                  onBlur: handleUsernameBlur,
                })}
              />

              <EmailField
                emailStatus={emailStatus}
                emailLoading={emailLoading}
                isEmailUnchanged={isEmailUnchanged}
                error={infoForm.formState.errors.email?.message}
                {...infoForm.register('email', { onBlur: handleEmailBlur })}
              />
            </div>

            <Button
              type="submit"
              isLoading={infoForm.formState.isSubmitting}
              disabled={
                !infoForm.formState.isDirty ||
                !infoForm.formState.isValid ||
                usernameStatus === AVAILABILITY.TAKEN ||
                emailStatus === AVAILABILITY.TAKEN
              }
              fullWidth
            >
              {BUTTONS.SAVE}
            </Button>
          </form>
        </Card>

        <Card
          variant={CARD_VARIANT.DARK}
          className="p-6 sm:p-8 animate-slide-up"
        >
          <SectionHeader
            variant={SECTION_HEADER_VARIANT.BLOCK}
            title={PROFILE_UI.PASSWORD_TITLE}
            subtitle={PROFILE_UI.PASSWORD_SUBTITLE}
            as="h2"
            centered
            colorTheme="danger"
          />

          <form
            onSubmit={onPasswordSubmit}
            className="space-y-6 mt-6"
            noValidate
          >
            <PasswordField
              label={FORM.AUTH.LABELS.CURRENT_PASSWORD}
              error={passwordForm.formState.errors.current_password?.message}
              {...passwordForm.register('current_password')}
            />

            <div className="space-y-4 pt-4 border-t border-white/5">
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
            </div>

            <Button
              type="submit"
              variant="danger"
              isLoading={passwordForm.formState.isSubmitting}
              disabled={
                !passwordForm.formState.isDirty ||
                !passwordForm.formState.isValid
              }
              fullWidth
            >
              {FORM.AUTH.BUTTONS.CHANGE_PASSWORD}
            </Button>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};
