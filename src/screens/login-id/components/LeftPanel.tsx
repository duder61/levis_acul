import { useLoginIdManager } from "../hooks/useLoginIdManager";

const defaultTagline =
  "Join now and unlock immediate access to free shipping on every order, birthday surprises, exclusive product drops and more. And like your jeans, the benefits just keep getting better with time.";

const defaultFeatures = [
  "Exclusive member-only pricing and offers",
  "Free shipping on every order",
  "Early access to new drops and sales",
  "Personalized birthday rewards each year",
];

const featureIcons = [
  <svg key="discount" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>,
  <svg key="truck" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 4v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>,
  <svg key="star" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>,
  <svg key="gift" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" rx="1" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>,
];

function LeftPanel() {
  const { texts, locales } = useLoginIdManager();
  const logoAltText = texts?.logoAltText || locales?.heading?.logoAltText || "Logo";
  const tagline = locales?.leftPanel?.tagline ?? defaultTagline;
  const features = locales?.leftPanel?.features ?? defaultFeatures;

  return (
    // hidden by default; lg:flex makes it visible on large screens
    <div className="hidden lg:flex" style={{ flexDirection: "column", justifyContent: "center", width: "50%", height: "100%",
      overflowY: "hidden", backgroundColor: "#ffffff", padding: "1rem 1.5rem 5rem 4rem", borderRight: "1px solid #f3f4f6", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "1rem" }}>
        <img src="/redtag_logo.png" alt={logoAltText} style={{ height: "2.5rem", width: "auto" }} />
      </div>

      <p style={{ color: "#111827", fontSize: "1rem", lineHeight: "1.75", marginBottom: "2.5rem", maxWidth: "none" }}>
        {tagline}
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {features.map((label, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ flexShrink: 0, width: "2.25rem", height: "2.25rem", borderRadius: "50%", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}>
              {featureIcons[i]}
            </span>
            <span style={{ fontWeight: 600, color: "#111827", fontSize: "0.875rem", lineHeight: "1.375" }}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeftPanel;
