import { MainLayout } from '@/components/Layout';
import {
  Button,
  Card,
  CARD_VARIANT,
  Input,
  PasswordStrength,
  SECTION_HEADER_VARIANT,
  SectionHeader,
  Text,
  TEXT_VARIANT,
} from '@/components/UI';
import { AVAILABILITY, BUTTONS, FORM, ICONS, PROFILE_UI } from '@/constants';
import { useProfile } from '@/hooks';

export const ProfilePage = () => {
  const {
    infoForm,
    passwordForm,
    handleUsernameBlur,
    handleUsernameChange,
    onInfoSubmit,
    onPasswordSubmit,
    status,
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
            <Input
              label={FORM.AUTH.LABELS.DISPLAY_NAME}
              placeholder={FORM.AUTH.PLACEHOLDERS.DISPLAY_NAME}
              error={infoForm.formState.errors.display_name?.message}
              required
              {...infoForm.register('display_name')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Input
                  label={FORM.AUTH.LABELS.USERNAME}
                  icon="@"
                  error={infoForm.formState.errors.username?.message}
                  required
                  {...infoForm.register('username', {
                    onChange: handleUsernameChange,
                    onBlur: handleUsernameBlur,
                  })}
                />

                <div className="h-4 flex justify-center" aria-live="polite">
                  {!status.isUsernameUnchanged && (
                    <>
                      {status.isUsernameLoading ? (
                        <Text
                          variant={TEXT_VARIANT.MICRO}
                          className="text-gold animate-pulse text-center"
                        >
                          {FORM.AUTH.HINTS.USERNAME_CHECK}
                        </Text>
                      ) : status.username === AVAILABILITY.AVAILABLE ? (
                        <Text
                          variant={TEXT_VARIANT.MICRO}
                          className="text-success-bright text-center"
                        >
                          <span className="mr-1">{ICONS.SUCCESS}</span>{' '}
                          {FORM.AUTH.HINTS.USERNAME_AVAILABLE}
                        </Text>
                      ) : status.username === AVAILABILITY.TAKEN ? (
                        <Text
                          variant={TEXT_VARIANT.MICRO}
                          className="text-danger-bright text-center"
                        >
                          <span className="mr-1">{ICONS.FAILURE}</span>{' '}
                          {FORM.AUTH.HINTS.USERNAME_TAKEN}
                        </Text>
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Input
                  label={FORM.AUTH.LABELS.EMAIL}
                  type="email"
                  icon={ICONS.SEARCH}
                  error={infoForm.formState.errors.email?.message}
                  required
                  {...infoForm.register('email')}
                />
                <div className="h-4 flex justify-center" aria-live="polite">
                  {!status.isEmailUnchanged && (
                    <>
                      {status.isEmailLoading ? (
                        <Text
                          variant={TEXT_VARIANT.MICRO}
                          className="text-gold animate-pulse text-center"
                        >
                          {FORM.AUTH.HINTS.EMAIL_CHECK}
                        </Text>
                      ) : status.email === AVAILABILITY.AVAILABLE ? (
                        <Text
                          variant={TEXT_VARIANT.MICRO}
                          className="text-success-bright text-center"
                        >
                          <span className="mr-1">{ICONS.SUCCESS}</span>{' '}
                          {FORM.AUTH.HINTS.EMAIL_AVAILABLE}
                        </Text>
                      ) : status.email === AVAILABILITY.TAKEN ? (
                        <Text
                          variant={TEXT_VARIANT.MICRO}
                          className="text-danger-bright text-center"
                        >
                          <span className="mr-1">{ICONS.FAILURE}</span>{' '}
                          {FORM.AUTH.HINTS.EMAIL_TAKEN}
                        </Text>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={infoForm.formState.isSubmitting}
              disabled={
                !infoForm.formState.isDirty ||
                !infoForm.formState.isValid ||
                status.username === AVAILABILITY.TAKEN ||
                status.email === AVAILABILITY.TAKEN
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
          style={{ animationDelay: '100ms' }}
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
            <Input
              label={FORM.AUTH.LABELS.CURRENT_PASSWORD}
              type="password"
              icon={ICONS.SECRET}
              error={passwordForm.formState.errors.current_password?.message}
              required
              {...passwordForm.register('current_password')}
            />

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1">
                <Input
                  label={FORM.AUTH.LABELS.NEW_PASSWORD}
                  type="password"
                  icon={ICONS.STARS}
                  error={passwordForm.formState.errors.new_password?.message}
                  required
                  {...passwordForm.register('new_password')}
                />
                {passwordValue.length > 0 &&
                  !passwordForm.formState.errors.new_password && (
                    <PasswordStrength password={passwordValue} />
                  )}
              </div>

              <Input
                label={FORM.AUTH.LABELS.CONFIRM_PASSWORD}
                type="password"
                icon={ICONS.CHECK}
                error={passwordForm.formState.errors.confirm_password?.message}
                required
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
