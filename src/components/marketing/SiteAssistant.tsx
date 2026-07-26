"use client";

import { useState, useRef, useEffect } from "react";
import { track } from "@vercel/analytics";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm the Red Flag assistant. Tell me what you're worried about, your ads, your AI use, a board asking for proof, and I'll point you to the free check that shows where you actually stand.",
};

// Turns bare paths and support email in the assistant's replies into real
// links, so a routed suggestion is one click, not a copy paste.
function renderContent(text: string) {
  const parts = text.split(/(\/[a-z0-9/-]+|support@redflagaipro\.com)/gi);
  return parts.map((part, i) => {
    if (/^\/[a-z0-9/-]+$/i.test(part)) {
      return (
        <a key={i} href={part} style={{ color: "#E5484D", fontWeight: 600, textDecoration: "underline" }}>
          {part}
        </a>
      );
    }
    if (/^support@redflagaipro\.com$/i.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} style={{ color: "#E5484D", fontWeight: 600 }}>
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    if (!startedRef.current) {
      startedRef.current = true;
      track("assistant_conversation_started");
    }
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Drop the static greeting before sending; the server adds its own context.
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? data.error ?? "Sorry, please try again." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't reach the server. Email support@redflagaipro.com and James will help." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const syne = { fontFamily: "'Syne', system-ui, sans-serif" } as React.CSSProperties;

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => { setOpen(true); track("assistant_opened"); }}
          aria-label="Open the Red Flag assistant"
          style={{
            position: "fixed", bottom: "20px", right: "20px", zIndex: 60,
            display: "flex", alignItems: "center", gap: "8px",
            background: "#E5484D", color: "white", border: "none",
            borderRadius: "9999px", padding: "12px 18px", cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.28)", ...syne, fontSize: "14px", fontWeight: 700,
          }}
        >
          <span aria-hidden style={{ fontSize: "16px" }}>💬</span>
          Ask a question
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Red Flag assistant"
          style={{
            position: "fixed", bottom: "20px", right: "20px", zIndex: 60,
            width: "min(380px, calc(100vw - 32px))", height: "min(560px, calc(100vh - 40px))",
            display: "flex", flexDirection: "column",
            background: "#0D1B2E", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", overflow: "hidden",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0A1628",
          }}>
            <div>
              <p style={{ ...syne, color: "white", fontSize: "14px", fontWeight: 700, margin: 0 }}>Red Flag assistant</p>
              <p style={{ color: "rgba(244,241,234,0.45)", fontSize: "11px", margin: "2px 0 0" }}>Answers about the product. Not legal advice.</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close the assistant"
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div style={{
                  background: m.role === "user" ? "#E5484D" : "rgba(255,255,255,0.06)",
                  color: m.role === "user" ? "white" : "rgba(244,241,234,0.92)",
                  padding: "10px 13px", borderRadius: "12px", fontSize: "13.5px", lineHeight: 1.55,
                }}>
                  {m.role === "assistant" ? renderContent(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", color: "rgba(244,241,234,0.5)", fontSize: "13px", padding: "4px 2px" }}>
                thinking…
              </div>
            )}
          </div>

          <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "8px" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Type your question…"
              aria-label="Type your question"
              style={{
                flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px", padding: "10px 12px", color: "white", fontSize: "13.5px", outline: "none",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send"
              style={{
                background: input.trim() ? "#E5484D" : "rgba(255,255,255,0.1)",
                color: "white", border: "none", borderRadius: "10px", padding: "0 16px",
                cursor: input.trim() ? "pointer" : "default", ...syne, fontSize: "14px", fontWeight: 700,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
