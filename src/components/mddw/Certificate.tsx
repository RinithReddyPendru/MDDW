import React from "react";

interface CertificateProps {
  userName: string;
  phcName?: string;
  date?: string;
  lang?: string;
  isPreview?: boolean;
  score?: number;
  pct?: number;
  t?: (key: string) => string;
}

/**
 * Pure HTML/CSS certificate — no background image overlay.
 * Every element is a real DOM node, so name/date positioning is always perfect.
 */
export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(
  ({ userName, phcName, date, lang = "en", isPreview = false }, ref) => {

    const formattedDate = date || new Date().toLocaleDateString(
      lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "te-IN",
      { year: "numeric", month: "long", day: "numeric" }
    );

    const certId = `JM-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const content = (
      <div
        style={{
          width: "1024px",
          height: "682px",
          position: "relative",
          background: "linear-gradient(135deg, #fff9f0 0%, #fff 40%, #fff9f0 100%)",
          fontFamily: "'Segoe UI', 'Noto Sans Telugu', 'Noto Sans Devanagari', sans-serif",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            inset: "8px",
            border: "3px solid #d4577a",
            borderRadius: "8px",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "14px",
            border: "1px solid #e8a0b4",
            borderRadius: "6px",
            pointerEvents: "none",
          }}
        />

        {/* Corner decorations */}
        {[
          { top: "4px", left: "4px", transform: "rotate(0deg)" },
          { top: "4px", right: "4px", transform: "rotate(90deg)" },
          { bottom: "4px", right: "4px", transform: "rotate(180deg)" },
          { bottom: "4px", left: "4px", transform: "rotate(270deg)" },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "60px",
              height: "60px",
              ...pos,
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 60 60" width="60" height="60">
              <path d="M5,5 Q5,30 30,30 Q5,30 5,55" stroke="#d4577a" fill="none" strokeWidth="2" opacity="0.6" />
              <path d="M8,2 Q8,28 28,28" stroke="#e8a0b4" fill="none" strokeWidth="1.5" opacity="0.4" />
              <circle cx="15" cy="15" r="3" fill="#d4577a" opacity="0.3" />
            </svg>
          </div>
        ))}

        {/* Side floral decorations */}
        <div style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", opacity: 0.15, fontSize: "80px", lineHeight: 1 }}>
          🌿
        </div>
        <div style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%) scaleX(-1)", opacity: 0.15, fontSize: "80px", lineHeight: 1 }}>
          🌿
        </div>

        {/* Main content area */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Logos row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "10px", marginBottom: "4px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#1a365d", letterSpacing: "0.02em", lineHeight: 1 }}>
                AI <span style={{ fontSize: "28px", color: "#2563eb" }}>Med</span>
              </div>
              <div style={{ fontSize: "9px", color: "#64748b", fontWeight: 600, letterSpacing: "0.1em" }}>Tech Alliance</div>
            </div>
            <div style={{ width: "2px", height: "40px", background: "#cbd5e1" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "28px", lineHeight: 1 }}>🤰</div>
              <div style={{ fontSize: "8px", color: "#d4577a", fontWeight: 700 }}>జననీ మిత్ర</div>
            </div>
          </div>

          {/* CERTIFICATE text */}
          <div
            style={{
              fontSize: "46px",
              fontWeight: 700,
              color: "#b8860b",
              letterSpacing: "0.25em",
              fontFamily: "'Times New Roman', 'Georgia', serif",
              lineHeight: 1.1,
              marginTop: "2px",
              textTransform: "uppercase",
            }}
          >
            Certificate
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#b8860b",
              letterSpacing: "0.35em",
              fontFamily: "'Times New Roman', 'Georgia', serif",
              textTransform: "uppercase",
              marginTop: "0px",
            }}
          >
            of Completion
          </div>

          {/* PROUDLY PRESENTED TO banner */}
          <div
            style={{
              margin: "8px 0 6px 0",
              padding: "4px 28px",
              background: "linear-gradient(90deg, #d4577a, #c0435e)",
              borderRadius: "20px",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Proudly Presented To
          </div>

          {/* ===== NAME ===== */}
          <div
            style={{
              fontSize: "38px",
              fontWeight: 700,
              color: "#c0435e",
              fontFamily: "'Times New Roman', 'Georgia', 'Noto Sans Telugu', serif",
              letterSpacing: "0.04em",
              textTransform: "capitalize",
              lineHeight: 1.2,
              minHeight: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 40px",
            }}
          >
            {userName || "ASHA"}
          </div>

          {/* for successfully completing */}
          <div style={{ fontSize: "11px", color: "#555", marginTop: "2px", fontStyle: "italic" }}>
            for successfully completing the training on
          </div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a2e", marginTop: "2px" }}>
            Janani Mithra Training Program
          </div>

          {/* Description */}
          <div style={{ fontSize: "9px", color: "#666", maxWidth: "620px", lineHeight: 1.5, marginTop: "4px" }}>
            This training has equipped you with essential knowledge and skills on maternal and child health,
            nutrition, growth monitoring, diet diversity, and the effective use of the Janani Mithra app
            to support healthy mothers, happy babies, and a stronger community.
          </div>

          {/* TRAINING COVERED */}
          <div
            style={{
              margin: "8px 0 4px 0",
              padding: "3px 18px",
              background: "linear-gradient(90deg, #d4577a, #c0435e)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Training Covered
          </div>

          {/* Training topics row */}
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "flex-start", margin: "4px 0", flexWrap: "nowrap" }}>
            {/* Empowered ASHA */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100px" }}>
              <div style={{ fontSize: "22px", marginBottom: "2px" }}>🤰</div>
              <div style={{ fontSize: "7px", color: "#d4577a", fontWeight: 700, lineHeight: 1.2, textAlign: "center" }}>
                Empowered ASHA,<br />Healthy Mother,<br />Happy Baby,<br />Stronger Community.
              </div>
            </div>
            {[
              { icon: "📱", title: "Janani Mithra\n(JM) App", desc: "Features, navigation,\ndata entry & reporting" },
              { icon: "🍽️", title: "MDDW Model", desc: "10 Food Groups,\nBalanced Diet &\nDiet Diversity" },
              { icon: "📊", title: "Growth Monitoring\n& Tracking", desc: "Weight, IFA, and\nMilestone Tracking" },
              { icon: "👶", title: "Maternal & Child\nHealth", desc: "Nutrition, Immunization,\nIFA, ANC & PNC" },
              { icon: "🚨", title: "One-Tap\nEmergency", desc: "Instant SOS &\nReferral Support" },
              { icon: "📋", title: "Reports & Follow-up", desc: "Daily Tracking,\nReports & Home\nVisit Follow-up" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "105px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#fce4ec",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    marginBottom: "2px",
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontSize: "7px", fontWeight: 700, color: "#333", lineHeight: 1.2, textAlign: "center", whiteSpace: "pre-line" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "6px", color: "#888", lineHeight: 1.3, textAlign: "center", whiteSpace: "pre-line" }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom section */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: "100%", padding: "0 40px", marginTop: "auto", marginBottom: "8px" }}>
            {/* Date */}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#c0435e", marginBottom: "2px" }}>
                {formattedDate}
              </div>
              <div style={{ fontSize: "8px", color: "#999", borderTop: "1px solid #ccc", paddingTop: "2px", width: "160px" }}>
                Date
              </div>
            </div>

            {/* Seal */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "-4px" }}>
              <div style={{ fontSize: "44px", lineHeight: 1 }}>🏅</div>
            </div>

            {/* Program Coordinator */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#333" }}>Program Coordinator</div>
              <div style={{ fontSize: "9px", fontWeight: 600, color: "#666" }}>Janani Mithra Program</div>
              <div style={{ fontSize: "8px", color: "#999", borderTop: "1px solid #ccc", paddingTop: "2px", width: "180px", marginTop: "4px" }}>
                Certificate ID: {certId}
              </div>
            </div>
          </div>

          {/* Footer tagline */}
          <div style={{ fontSize: "10px", color: "#c0435e", fontWeight: 600, fontStyle: "italic", marginBottom: "6px" }}>
            ❤️ Healthy Mother, Happy Baby, Stronger Community. ❤️
          </div>
        </div>
      </div>
    );

    if (isPreview) {
      return (
        <div
          ref={ref}
          style={{
            width: "100%",
            maxWidth: "512px",
            margin: "0 auto",
            aspectRatio: "1024/682",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "1024px", height: "682px" }}>
            {content}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} style={{ width: "1024px", height: "682px" }}>
        {content}
      </div>
    );
  }
);

Certificate.displayName = "Certificate";
