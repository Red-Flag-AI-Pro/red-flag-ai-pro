import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Red Flag AI Pro — Marketing Compliance Scanner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#030712",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(220,38,38,0.15)",
            border: "1px solid rgba(220,38,38,0.4)",
            borderRadius: "999px",
            padding: "8px 20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#dc2626",
            }}
          />
          <span style={{ color: "#fca5a5", fontSize: "18px", fontWeight: 600 }}>
            16 Risk Categories · 5 Jurisdictions
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          Red Flag&nbsp;<span style={{ color: "#dc2626" }}>AI Pro</span>
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: "24px",
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "800px",
            marginBottom: "48px",
            display: "flex",
          }}
        >
          Scan your marketing copy for compliance violations in 60 seconds.
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["FTC", "GDPR", "EU AI Act", "ASA / UK", "ACCC", "CASL"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "#d1d5db",
                fontSize: "15px",
                fontWeight: 600,
                display: "flex",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            color: "#4b5563",
            fontSize: "18px",
            display: "flex",
          }}
        >
          redflagaipro.com
        </div>
      </div>
    ),
    { ...size }
  );
}
