"use client";

const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as const;
const mono = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

export function PromoBox({ platform, label, post }: { platform: string; label: string; post: string }) {
  return (
    <div style={{ marginBottom: "2px", background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.06)", padding: "2rem" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" as const }}>
        <p style={{ ...syne, fontSize: "0.9rem", fontWeight: 700, color: "white", margin: 0 }}>{platform}</p>
        <p style={{ ...syne, fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>{label}</p>
      </div>
      <textarea
        readOnly
        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        defaultValue={post}
        rows={post.split("\n").length + 1}
        style={{
          width: "100%",
          background: "#0A1628",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "6px",
          padding: "1rem",
          color: "rgba(255,255,255,0.6)",
          ...mono,
          fontSize: "12px",
          lineHeight: 1.7,
          resize: "none",
          cursor: "text",
          boxSizing: "border-box" as const,
        }}
      />
      <p style={{ ...syne, fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "0.5rem" }}>
        Click to select all · swap [YOUR AFFILIATE LINK] with your Tolt link
      </p>
    </div>
  );
}
