import { NextResponse } from "next/server";
import { parse } from "node-html-parser";

interface A11yFlag {
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  count: number;
}

const SEVERITY_DEDUCTIONS = { high: 15, medium: 8, low: 3 };

export async function POST(request: Request) {
  const body = await request.json();
  let url: string = (body.url ?? "").trim();

  if (!url) {
    return NextResponse.json({ error: "A URL is required." }, { status: 400 });
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Please enter a valid URL." }, { status: 400 });
  }

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      const message = res.status === 403
        ? "This site's bot protection is blocking the scan (403 Forbidden)."
        : `Could not fetch that URL. The page returned status ${res.status}.`;
      return NextResponse.json({ error: message }, { status: 400 });
    }
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Could not reach that URL. Please check it is publicly accessible." }, { status: 400 });
  }

  const root = parse(html);
  const flags: A11yFlag[] = [];

  // 1. <html lang> attribute
  const htmlEl = root.querySelector("html");
  if (!htmlEl?.getAttribute("lang")) {
    flags.push({
      severity: "medium",
      title: "Missing language attribute",
      description: "The <html> tag has no lang attribute, so screen readers can't determine the page's language and may mispronounce content.",
      count: 1,
    });
  }

  // 2. Images missing alt text
  const images = root.querySelectorAll("img");
  const missingAlt = images.filter((img) => {
    const alt = img.getAttribute("alt");
    const role = img.getAttribute("role");
    return alt === undefined && role !== "presentation";
  });
  if (missingAlt.length > 0) {
    flags.push({
      severity: "high",
      title: "Images missing alt text",
      description: "Screen reader users can't tell what these images show. Every meaningful image needs descriptive alt text; purely decorative images should use alt=\"\".",
      count: missingAlt.length,
    });
  }

  // 3. Form inputs without labels
  const inputs = root.querySelectorAll("input").filter((el) => {
    const type = (el.getAttribute("type") || "text").toLowerCase();
    return !["hidden", "submit", "button", "checkbox", "radio"].includes(type);
  });
  const unlabeled = inputs.filter((input) => {
    const id = input.getAttribute("id");
    const ariaLabel = input.getAttribute("aria-label");
    const ariaLabelledby = input.getAttribute("aria-labelledby");
    if (ariaLabel || ariaLabelledby) return false;
    if (id && root.querySelector(`label[for="${id}"]`)) return false;
    return true;
  });
  if (unlabeled.length > 0) {
    flags.push({
      severity: "high",
      title: "Form fields without labels",
      description: "These input fields have no associated label, aria-label, or aria-labelledby — screen reader users won't know what to enter.",
      count: unlabeled.length,
    });
  }

  // 4. Buttons/links with no accessible text
  const interactive = [...root.querySelectorAll("button"), ...root.querySelectorAll("a")];
  const emptyInteractive = interactive.filter((el) => {
    const text = el.text.trim();
    const ariaLabel = el.getAttribute("aria-label");
    const title = el.getAttribute("title");
    return !text && !ariaLabel && !title;
  });
  if (emptyInteractive.length > 0) {
    flags.push({
      severity: "high",
      title: "Buttons or links with no accessible text",
      description: "These interactive elements have no visible text, aria-label, or title — screen reader users will hear nothing meaningful when they reach them.",
      count: emptyInteractive.length,
    });
  }

  // 5. Heading structure — no H1, or multiple H1s
  const h1s = root.querySelectorAll("h1");
  if (h1s.length === 0) {
    flags.push({
      severity: "medium",
      title: "No H1 heading found",
      description: "Every page should have exactly one H1 that describes its main content — it's the primary landmark screen reader users rely on.",
      count: 1,
    });
  } else if (h1s.length > 1) {
    flags.push({
      severity: "low",
      title: "Multiple H1 headings",
      description: "Having more than one H1 can confuse the page's outline for screen reader and SEO purposes.",
      count: h1s.length,
    });
  }

  // 6. Viewport meta (mobile zoom/accessibility)
  const viewport = root.querySelector('meta[name="viewport"]');
  if (!viewport) {
    flags.push({
      severity: "low",
      title: "Missing viewport meta tag",
      description: "Without this, mobile users (including those who rely on zoom for low vision) may not be able to scale the page properly.",
      count: 1,
    });
  } else if (/user-scalable=no|maximum-scale=1(\.0)?(?!\d)/i.test(viewport.getAttribute("content") || "")) {
    flags.push({
      severity: "medium",
      title: "Zoom disabled on mobile",
      description: "The viewport tag blocks pinch-to-zoom — a real barrier for low-vision users who need to enlarge text.",
      count: 1,
    });
  }

  const score = Math.max(0, 100 - flags.reduce((acc, f) => acc + SEVERITY_DEDUCTIONS[f.severity] * Math.min(f.count, 3), 0));

  return NextResponse.json({ score, flags, url });
}
