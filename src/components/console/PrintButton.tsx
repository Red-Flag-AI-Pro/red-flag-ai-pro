"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{ fontFamily: "system-ui, sans-serif", fontSize: "13px", fontWeight: 700, color: "#fff", background: "#C0363B", border: 0, borderRadius: "8px", padding: "9px 18px", cursor: "pointer" }}
    >
      Print
    </button>
  );
}
