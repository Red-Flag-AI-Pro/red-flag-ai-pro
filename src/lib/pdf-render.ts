import chromium from "@sparticuz/chromium-min";
import puppeteer, { type Browser } from "puppeteer-core";

const CHROMIUM_PACK_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.tar";

async function launchBrowser(): Promise<Browser> {
  // Local dev: point CHROME_EXECUTABLE_PATH at a real Chrome/Chromium install.
  // Production (Vercel): chromium-min downloads the brotli pack at cold start.
  const executablePath =
    process.env.CHROME_EXECUTABLE_PATH ??
    (await chromium.executablePath(CHROMIUM_PACK_URL));

  return puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });
}

interface RenderPdfOptions {
  /** Full URL of the page to render, e.g. https://app.com/print/scans/123 */
  url: string;
  /** Raw "cookie" header value from the original authenticated request. */
  cookieHeader: string | null;
}

export async function renderPagePdf({ url, cookieHeader }: RenderPdfOptions): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 2 });

    // Forward the authenticated session so the print route renders as this user.
    if (cookieHeader) {
      const { hostname } = new URL(url);
      const cookies = cookieHeader.split(";").map((pair) => {
        const idx = pair.indexOf("=");
        const name = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();
        return { name, value, domain: hostname };
      });
      await page.setCookie(...cookies);
    }

    // Suppress the cookie consent banner so it never appears in the render.
    await page.evaluateOnNewDocument(() => {
      window.localStorage.setItem("cookie-consent", "accepted");
    });

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
