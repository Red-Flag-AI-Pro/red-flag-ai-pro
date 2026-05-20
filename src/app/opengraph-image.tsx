import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Red Flag AI Pro — Marketing Compliance Scanner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/redflag-logo.png"));
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#030712",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          gap: "60px",
        }}
      >
        {/* Logo */}
        <img
          src={logoBase64}
          width={220}
          height={220}
          style={{ flexShrink: 0 }}
        />

        {/* Right side text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
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
              padding: "6px 16px",
              marginBottom: "20px",
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
            <span style={{ color: "#fca5a5", fontSize: "16px", fontWeight: 600 }}>
              16 Risk Categories · 5 Jurisdictions
            </span>
          </div>

          {/* Main heading */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              marginBottom: "16px",
              letterSpacing: "-1px",
            }}
          >
            Red Flag <span style={{ color: "#dc2626" }}>AI Pro</span>
          </div>

          {/* Subheading */}
          <div
            style={{
              fontSize: "22px",
              color: "#9ca3af",
              lineHeight: 1.4,
              marginBottom: "32px",
            }}
          >
            Scan your marketing copy for compliance violations in 60 seconds.
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["FTC", "GDPR", "EU AI Act", "ASA", "ACCC", "CASL"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  color: "#d1d5db",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
