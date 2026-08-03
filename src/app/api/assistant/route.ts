import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  ASSISTANT_SYSTEM_PROMPT,
  buildKnowledgeBase,
} from "@/lib/assistant-knowledge";

export const runtime = "nodejs";

const MAX_MESSAGES = 20; // conversation turns kept from the client
const MAX_CHARS = 1500; // per user message

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Very small in-memory throttle. It does not survive a serverless cold start,
// so it is a courtesy speed bump, not the real defence (durable rate limiting
// via Vercel WAF is tracked separately). Still stops a single warm instance
// being hammered in a tight loop.
const HITS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now > rec.resetAt) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a moment." },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: "The assistant is offline right now. Email support@redflagaipro.com and James will help you directly." },
      { status: 200 }
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await request.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch (err) {
    console.error("[assistant] failed to parse request body", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Sanitise: keep only well formed turns, cap length and count, and never
  // trust a client supplied system role.
  const clean = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
    return NextResponse.json({ error: "No message to answer." }, { status: 400 });
  }

  try {
    const knowledge = buildKnowledgeBase();
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 350,
      messages: [
        { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
        { role: "system", content: knowledge },
        ...clean,
      ],
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "Sorry, I did not catch that. Could you say it another way, or email support@redflagaipro.com?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[assistant] chat completion failed", err);
    return NextResponse.json(
      {
        reply:
          "Something went wrong on my end. Email support@redflagaipro.com and James will pick it up.",
      },
      { status: 200 }
    );
  }
}
