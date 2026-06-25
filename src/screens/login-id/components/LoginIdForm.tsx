import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useErrors,
  useLoginIdentifiers,
  usePasskeyAutofill,
} from "@auth0/auth0-acul-react/login-id";
import type {
  ErrorItem,
  IdentifierType,
  LoginOptions,
} from "@auth0/auth0-acul-react/types";

import Captcha from "@/components/Captcha/index";
import { ULThemeFloatingLabelField } from "@/components/form/ULThemeFloatingLabelField";
import { ULThemeFormMessage } from "@/components/form/ULThemeFormMessage";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ULThemeButton } from "@/components/ULThemeButton";
import ULThemeCountryCodePicker from "@/components/ULThemeCountryCodePicker";
import { ULThemeAlert, ULThemeAlertTitle } from "@/components/ULThemeError";
import ULThemeLink from "@/components/ULThemeLink";
import { useCaptcha } from "@/hooks/useCaptcha";
import {
  isPhoneNumberSupported,
  transformAuth0CountryCode,
} from "@/utils/helpers/countryUtils";
import { getIdentifierDetails } from "@/utils/helpers/identifierUtils";

import { useLoginIdManager } from "../hooks/useLoginIdManager";

const STORAGE_KEY = "login_id_form_data";

function LoginIdForm() {
  const {
    texts,
    locales,
    captcha,
    countryCode,
    countryPrefix,
    resetPasswordLink,
    isCaptchaAvailable,
    isPasskeyEnabled,
    showPasskeyAutofill,
    handleLoginId,
    handlePickCountryCode,
  } = useLoginIdManager();

  const activeIdentifiers = useLoginIdentifiers();

  // Use helper to determine placeholder based on active identifiers
  const identifierDetails = getIdentifierDetails(
    (activeIdentifiers || undefined) as IdentifierType[] | undefined,
    texts
  );

  type LoginIdFormValues = LoginOptions & {
    firstName: string;
    lastName: string;
    birthday: string;
    newsletterOptIn: boolean | null;
  };

  const form = useForm<LoginIdFormValues>({
    defaultValues: (() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return { captcha: "", ...JSON.parse(saved) };
      } catch {}
      return { firstName: "", lastName: "", username: "", birthday: "", captcha: "", newsletterOptIn: null };
    })(),
    reValidateMode: "onBlur",
  });

  const watchedValues = form.watch(["firstName", "lastName", "username", "birthday", "newsletterOptIn"]);

  useEffect(() => {
    const [firstName, lastName, username, birthday, newsletterOptIn] = watchedValues;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ firstName, lastName, username, birthday, newsletterOptIn }));
    } catch {}
  }, [watchedValues]);

  const {
    formState: { isSubmitting },
  } = form;

  // Use locales as fallback to SDK texts
  const captchaLabel = texts?.captchaCodePlaceholder
    ? `${texts.captchaCodePlaceholder}*`
    : locales?.loginIdForm?.captchaLabel;
  const forgotPasswordLinkText =
    texts?.forgotPasswordText || locales?.loginIdForm?.forgotPasswordLinkText;
  const continueButtonText =
    texts?.buttonText || locales?.loginIdForm?.continueButtonText;

  const { captchaConfig, captchaProps, captchaValue } = useCaptcha(
    captcha || undefined,
    captchaLabel
  );

  // Enable passkey autofill for identifier field if supported
  // Only register autofill when showPasskeyAutofill is true
  if (isPasskeyEnabled && showPasskeyAutofill) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePasskeyAutofill();
  }

  const { errors, hasError, dismiss } = useErrors();

  // Get field-specific SDK errors
  const usernameSDKError = errors.byField("username")[0]?.message;
  const captchaSDKError = errors.byField("captcha")[0]?.message;

  // Get general errors (not field-specific)
  const generalErrors: ErrorItem[] = errors
    .byType("auth0")
    .filter((err) => !err.field);

  const shouldShowCountryPicker = isPhoneNumberSupported(
    activeIdentifiers || []
  );

  // Proper submit handler with form data
  const onSubmit = async (data: LoginOptions) => {
    await handleLoginId({
      username: data.username,
      captcha: isCaptchaAvailable && captchaValue ? captchaValue : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Display general errors */}
        {hasError && generalErrors.length > 0 && (
          <div className="space-y-3 mb-4">
            {generalErrors.map((error) => (
              <ULThemeAlert
                key={error.id}
                variant="destructive"
                onDismiss={() => dismiss(error.id)}
              >
                <ULThemeAlertTitle>
                  {error.message || locales?.errors?.errorOccurred}
                </ULThemeAlertTitle>
              </ULThemeAlert>
            ))}
          </div>
        )}

        {/* Country Code Picker - only show if phone numbers are supported */}
        {shouldShowCountryPicker && (
          <div className="mb-4">
            <ULThemeCountryCodePicker
              selectedCountry={transformAuth0CountryCode(
                countryCode,
                countryPrefix
              )}
              onClick={handlePickCountryCode}
              fullWidth
              placeholder={locales?.loginIdForm?.selectCountryPlaceholder}
            />
          </div>
        )}

        {/* First Name field */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <ULThemeFloatingLabelField
                {...field}
                label="First Name*"
                type="text"
                autoComplete="given-name"
              />
            </FormItem>
          )}
        />

        {/* Last Name field */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <ULThemeFloatingLabelField
                {...field}
                label="Last Name*"
                type="text"
                autoComplete="family-name"
              />
            </FormItem>
          )}
        />

        {/* Username Identifier input field */}
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: locales?.errors?.identifierRequired,
          }}
          render={({ field, fieldState }) => (
            <FormItem>
              <ULThemeFloatingLabelField
                {...field}
                label={identifierDetails.label}
                type={identifierDetails.type}
                autoComplete={identifierDetails.autoComplete}
                autoFocus
                error={!!fieldState.error || !!usernameSDKError}
              />
              <ULThemeFormMessage
                sdkError={usernameSDKError}
                hasFormError={!!fieldState.error}
              />
            </FormItem>
          )}
        />

        {/* Birthday Gift */}
        <div style={{ margin: "1.25rem 0 0" }}>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "0.25rem" }}>
            Birthday Gift (Optional)
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: "1.5", marginBottom: "0.75rem" }}>
            We'll email you 1000 points for your birthday every year.
          </p>
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <ULThemeFloatingLabelField
                  {...field}
                  label="Birthday (dd/mm/yyyy)"
                  type="text"
                  autoComplete="bday"
                />
              </FormItem>
            )}
          />
        </div>

        {/* Newsletter promo */}
        <div style={{ margin: "1.25rem 0" }}>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "0.375rem" }}>
            How does 10% off sound?
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: "1.5", marginBottom: "1rem" }}>
            Get 10% off your next order when you sign up to get our email newsletter. New subscribers only. Unsubscribe at any time.
          </p>
          <FormField
            control={form.control}
            name="newsletterOptIn"
            render={({ field }) => (
              <FormItem>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => field.onChange(true)}
                    style={{
                      flex: 1,
                      padding: "0.625rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      borderRadius: "0.375rem",
                      border: `2px solid ${field.value === true ? "#111827" : "#d1d5db"}`,
                      backgroundColor: field.value === true ? "#111827" : "#ffffff",
                      color: field.value === true ? "#ffffff" : "#374151",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Sign me Up!
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange(false)}
                    style={{
                      flex: 1,
                      padding: "0.625rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      borderRadius: "0.375rem",
                      border: `2px solid ${field.value === false ? "#111827" : "#d1d5db"}`,
                      backgroundColor: field.value === false ? "#111827" : "#ffffff",
                      color: field.value === false ? "#ffffff" : "#374151",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    No Thanks
                  </button>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Captcha Field */}
        {isCaptchaAvailable && captchaConfig && (
          <Captcha
            control={form.control}
            name="captcha"
            captcha={captchaConfig}
            {...captchaProps}
            sdkError={captchaSDKError}
            rules={{
              required: locales?.errors?.captchaCompletionRequired,
            }}
          />
        )}


        <ULThemeButton type="submit" className="w-full" disabled={isSubmitting}>
          {continueButtonText}
        </ULThemeButton>
      </form>
    </Form>
  );
}

export default LoginIdForm;
