import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          position: "relative",
        }}
      >
        {/* Red glow background */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse, rgba(220,38,38,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

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
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#dc2626",
            }}
          />
          <span style={{ color: "#fca5a5", fontSize: "18px", fontWeight: 600 }}>
            5 Jurisdictions · 16 Risk Categories
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-1px",
          }}
        >
          Red Flag{" "}
          <span style={{ color: "#dc2626" }}>AI Pro</span>
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: "26px",
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "800px",
            marginBottom: "48px",
          }}
        >
          Scan your marketing copy for compliance violations in 60 seconds.
          FTC · GDPR · ASA · EU AI Act · ACCC · CASL
        </div>

        {/* Bottom tags */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["FTC", "GDPR", "EU AI Act", "ASA / UK", "ACCC", "CASL"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "#d1d5db",
                fontSize: "16px",
                fontWeight: 600,
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
          }}
        >
          redflagaipro.com
        </div>
      </div>
    ),
    { ...size }
  );
}
