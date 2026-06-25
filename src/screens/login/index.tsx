import ULThemeCard from "@/components/ULThemeCard";
import ULThemePageLayout from "@/components/ULThemePageLayout";
import ULThemeSeparator from "@/components/ULThemeSeparator";
import { extractTokenValue } from "@/utils/helpers/tokenUtils";
import { applyAuth0Theme } from "@/utils/theme/themeEngine";

import AlternativeLogins from "./components/AlternativeLogins";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import LoginForm from "./components/LoginForm";
import { useLoginManager } from "./hooks/useLoginManager";

function LoginScreen() {
  // Extracting attributes from hook made out of LoginInstance class of Auth0 React ACUL SDK
  const { login, texts, locales, alternateConnections } = useLoginManager();

  const showSeparator = alternateConnections && alternateConnections.length > 0;

  const separatorText = texts?.separatorText || locales?.page?.orText;
  document.title = texts?.pageTitle || locales?.page?.title;

  applyAuth0Theme(login);

  const socialLoginAlignment = extractTokenValue(
    "--ul-theme-widget-social-buttons-layout"
  );

  const renderSocialLogins = (alignment: "top" | "bottom") => (
    <>
      {alignment === "bottom" && showSeparator && (
        <ULThemeSeparator text={separatorText} />
      )}
      <AlternativeLogins />
      {alignment === "top" && showSeparator && (
        <ULThemeSeparator text={separatorText} />
      )}
    </>
  );

  return (
    // Applying UDS theme overrides using the "theme-universal" class
    <ULThemePageLayout className="theme-universal p-0 items-stretch">
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#ffffff" }}>
        <div style={{ flexShrink: 0, padding: "1.25rem 2rem", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f3f4f6", textAlign: "center" }}>
          <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#111827" }}>Join Now</span>
        </div>
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <LeftPanel />
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 4rem 2.5rem 1.5rem", backgroundColor: "#ffffff" }}>
            <ULThemeCard className="w-full max-w-[400px] gap-0 px-6" style={{ border: "none", boxShadow: "none", borderRadius: 0, backgroundColor: "transparent" }}>
              <Header />
              {socialLoginAlignment === "top" && renderSocialLogins("top")}
              <LoginForm />
              <Footer />
              {socialLoginAlignment !== "top" && renderSocialLogins("bottom")}
            </ULThemeCard>
          </div>
        </div>
      </div>
    </ULThemePageLayout>
  );
}

export default LoginScreen;
