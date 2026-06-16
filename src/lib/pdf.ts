import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import type { Scan, ScanFlag } from "@/types";
import { FLAG_CATEGORY_LABELS } from "./constants";

// Brand colours
const C = {
  red:       rgb(0.80, 0.00, 0.00),
  redDark:   rgb(0.50, 0.00, 0.00),
  redDim:    rgb(0.35, 0.06, 0.06),
  bg:        rgb(0.04, 0.02, 0.02),
  bgCard:    rgb(0.10, 0.06, 0.06),
  bgCard2:   rgb(0.08, 0.05, 0.05),
  border:    rgb(0.18, 0.10, 0.10),
  white:     rgb(1.00, 1.00, 1.00),
  whiteHi:   rgb(0.93, 0.88, 0.88),
  whiteMid:  rgb(0.62, 0.55, 0.55),
  whiteLow:  rgb(0.36, 0.30, 0.30),
  sevHigh:   rgb(0.87, 0.18, 0.18),
  sevMed:    rgb(0.95, 0.60, 0.10),
  sevLow:    rgb(0.18, 0.72, 0.32),
  green:     rgb(0.18, 0.72, 0.32),
};

function scoreColor(score: number) {
  if (score >= 70) return C.sevLow;
  if (score >= 40) return C.sevMed;
  return C.sevHigh;
}

function riskLabel(score: number) {
  if (score >= 70) return "LOW RISK";
  if (score >= 40) return "MEDIUM RISK";
  return "HIGH RISK";
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

function sevColor(severity: string) {
  if (severity === "high")   return C.sevHigh;
  if (severity === "medium") return C.sevMed;
  return C.sevLow;
}

export async function generateScanPdf(
  scan: Scan,
  flags: ScanFlag[],
  agencyName?: string | null
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  const fontsDir   = path.join(process.cwd(), "src/lib/fonts");
  const boldBytes  = fs.readFileSync(path.join(fontsDir, "Syne-Bold.ttf"));
  const regBytes   = fs.readFileSync(path.join(fontsDir, "Syne-Regular.ttf"));
  const bold       = await doc.embedFont(boldBytes);
  const regular    = await doc.embedFont(regBytes);

  const W = 595;
  const H = 842;
  const M = 44;

  const brandName = agencyName ?? "Red Flag AI Pro";
  const dateStr   = new Date(scan.created_at).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric",
  });
  const highCount = flags.filter((f) => f.severity === "high").length;
  const medCount  = flags.filter((f) => f.severity === "medium").length;
  const lowCount  = flags.filter((f) => f.severity === "low").length;

  // ════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ════════════════════════════════════════════════════════════════
  const cover = doc.addPage([W, H]);
  cover.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });

  // Top stripe
  cover.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: C.red });

  // Masthead band
  const mastheadH = 88;
  cover.drawRectangle({ x: 0, y: H - 8 - mastheadH, width: W, height: mastheadH, color: C.bgCard });

  // Red flag icon (pole + pennant)
  const fx = M, fy = H - 8 - mastheadH + 20;
  cover.drawRectangle({ x: fx,     y: fy,      width: 3,  height: 48, color: C.red });
  cover.drawRectangle({ x: fx + 3, y: fy + 32, width: 24, height: 14, color: C.red });
  cover.drawRectangle({ x: fx + 3, y: fy + 26, width: 24, height: 6,  color: C.redDark });

  // Brand name
  cover.drawText(agencyName ? agencyName.toUpperCase() : "RED FLAG AI PRO", {
    x: M + 38, y: H - 8 - mastheadH + 56,
    size: agencyName ? 15 : 20,
    font: bold, color: C.red,
  });
  cover.drawText("Marketing Compliance Risk Report", {
    x: M + 38, y: H - 8 - mastheadH + 30,
    size: 10, font: regular, color: C.whiteMid,
  });
  cover.drawText("redflagaipro.com", {
    x: W - M - 90, y: H - 8 - mastheadH + 44,
    size: 9, font: regular, color: C.whiteLow,
  });

  // Scan title — below masthead with breathing room
  const titleY0   = H - 8 - mastheadH - 60;
  const titleLines = wrapText(scan.title, 62);
  let titleY = titleY0;
  for (const line of titleLines) {
    cover.drawText(line, {
      x: M, y: titleY,
      size: 20, font: bold, color: C.white,
    });
    titleY -= 28;
  }
  cover.drawText(`Scanned on ${dateStr}`, {
    x: M, y: titleY - 6,
    size: 10, font: regular, color: C.whiteMid,
  });

  // ── Score circle — large, centred, with tons of space
  const cx = W / 2;
  const cy = H / 2 + 10;
  const r  = 108;

  // Outer decorative ring
  cover.drawEllipse({ x: cx, y: cy, xScale: r + 20, yScale: r + 20, color: C.bgCard });
  // Circle fill
  cover.drawEllipse({ x: cx, y: cy, xScale: r, yScale: r, color: C.bgCard2 });
  // Coloured border
  cover.drawEllipse({
    x: cx, y: cy, xScale: r, yScale: r,
    borderColor: scoreColor(scan.score), borderWidth: 11,
  });

  // Score number
  const scoreStr  = String(scan.score);
  const scoreSize = 72;
  const scoreW    = scoreStr.length * scoreSize * 0.53;
  cover.drawText(scoreStr, {
    x: cx - scoreW / 2, y: cy - 24,
    size: scoreSize, font: bold, color: scoreColor(scan.score),
  });
  cover.drawText("/ 100", {
    x: cx - 24, y: cy - 50,
    size: 15, font: regular, color: C.whiteMid,
  });

  // Risk label pill — directly below circle with gap
  const rLabel = riskLabel(scan.score);
  const rLW    = rLabel.length * 8.8;
  const pillX  = cx - rLW / 2 - 16;
  const pillY  = cy - r - 50;
  cover.drawRectangle({
    x: pillX, y: pillY,
    width: rLW + 32, height: 30,
    color: scoreColor(scan.score),
  });
  cover.drawText(rLabel, {
    x: pillX + 16, y: pillY + 9,
    size: 12, font: bold, color: C.white,
  });

  // ── Verification block — bottom third of cover, well-separated from circle
  const vBlockH = 140;
  const vBlockY = 44;

  cover.drawRectangle({
    x: M, y: vBlockY,
    width: W - M * 2, height: vBlockH,
    color: C.bgCard,
  });
  // Left red bar
  cover.drawRectangle({ x: M, y: vBlockY, width: 6, height: vBlockH, color: C.red });
  // Top border line
  cover.drawRectangle({ x: M, y: vBlockY + vBlockH, width: W - M * 2, height: 1, color: C.border });

  // Verified label + brand — pushed to top of block with generous spacing
  cover.drawText("VERIFIED BY", {
    x: M + 22, y: vBlockY + vBlockH - 18,
    size: 8, font: regular, color: C.whiteMid,
  });
  cover.drawText("RED FLAG AI PRO", {
    x: M + 22, y: vBlockY + vBlockH - 36,
    size: 14, font: bold, color: C.red,
  });

  // Horizontal divider — wider gap below brand name
  cover.drawRectangle({
    x: M + 22, y: vBlockY + vBlockH - 62,
    width: W - M * 2 - 44, height: 1, color: C.border,
  });

  // Score summary line
  cover.drawText(
    `Score: ${scan.score}/100  ·  ${rLabel}  ·  ${flags.length} compliance issue${flags.length === 1 ? "" : "s"} found`,
    { x: M + 22, y: vBlockY + 88, size: 11, font: bold, color: C.white }
  );

  // Coloured flag count dots
  const countItems = [
    { label: "HIGH RISK",   value: highCount, color: C.sevHigh },
    { label: "MEDIUM RISK", value: medCount,  color: C.sevMed },
    { label: "LOW RISK",    value: lowCount,  color: C.sevLow },
  ];
  let dotX = M + 22;
  for (const item of countItems) {
    cover.drawEllipse({ x: dotX + 5, y: vBlockY + 70, xScale: 5, yScale: 5, color: item.color });
    cover.drawText(`${item.value} ${item.label}`, {
      x: dotX + 14, y: vBlockY + 65,
      size: 9, font: bold, color: item.color,
    });
    dotX += 120;
  }

  // Scan details
  cover.drawText(`Scanned: ${dateStr}  ·  redflagaipro.com`, {
    x: M + 22, y: vBlockY + 44,
    size: 8, font: regular, color: C.whiteMid,
  });

  // Shield badge — right side of verification block (mirrors audit page badge)
  // SVG viewBox "0 0 36 42", scale 2.2 → 79 × 92px
  const shieldScale = 2.2;
  const shieldW     = 36 * shieldScale; // ~79
  const shieldH     = 42 * shieldScale; // ~92
  const shieldX     = W - M - shieldW - 10;
  // pdf-lib drawSvgPath: x,y is where SVG origin (0,0) maps in PDF space.
  // PDF y goes up; SVG y goes down → paths are flipped automatically.
  // Bottom of shield sits at vBlockY + 16, so origin Y = vBlockY + 16 + shieldH
  const shieldOriginY = vBlockY + 16 + shieldH;

  // Shield fill
  cover.drawSvgPath(
    "M18 2L4 8v12c0 9 6.5 17 14 20C25.5 37 32 29 32 20V8L18 2Z",
    { x: shieldX, y: shieldOriginY, scale: shieldScale, color: rgb(0.04, 0.14, 0.06), borderColor: rgb(0.09, 0.64, 0.29), borderWidth: 1.5 }
  );
  // Outer glow ring
  cover.drawSvgPath(
    "M18 2L4 8v12c0 9 6.5 17 14 20C25.5 37 32 29 32 20V8L18 2Z",
    { x: shieldX, y: shieldOriginY, scale: shieldScale, borderColor: rgb(0.09, 0.64, 0.29), borderWidth: 3, opacity: 0.3 }
  );
  // Flag pole
  cover.drawSvgPath(
    "M15 13L15 29",
    { x: shieldX, y: shieldOriginY, scale: shieldScale, borderColor: C.red, borderWidth: 1.5 }
  );
  // Flag pennant
  cover.drawSvgPath(
    "M15 13h8l-2.5 4 2.5 4H15z",
    { x: shieldX, y: shieldOriginY, scale: shieldScale, color: C.red }
  );
  // Checkmark
  cover.drawSvgPath(
    "M11 22l4 4 8-8",
    { x: shieldX, y: shieldOriginY, scale: shieldScale, borderColor: rgb(0.09, 0.64, 0.29), borderWidth: 1.8 }
  );

  // Labels below shield
  const shieldBottomY = vBlockY + 16;
  cover.drawText("COMPLIANCE VERIFIED", {
    x: shieldX + shieldW / 2 - 48, y: shieldBottomY - 12,
    size: 7, font: bold, color: C.whiteMid,
  });
  cover.drawText("Red Flag AI Pro", {
    x: shieldX + shieldW / 2 - 34, y: shieldBottomY - 22,
    size: 7, font: regular, color: C.whiteLow,
  });

  if (agencyName) {
    cover.drawText(`Prepared by ${agencyName}`, {
      x: M + 22, y: vBlockY + 30,
      size: 8, font: regular, color: C.whiteLow,
    });
  }

  // Cover page page number
  cover.drawText("Page 1", {
    x: W - M - 28, y: 20,
    size: 7, font: regular, color: C.whiteLow,
  });

  // ════════════════════════════════════════════════════════════════
  // PAGE 2 — WHAT WE FOUND
  // ════════════════════════════════════════════════════════════════
  let pg      = doc.addPage([W, H]);
  let pageNum = 2;
  pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
  drawPageHeader(pg, bold, regular, W, H, M, brandName, scan.title, C);

  let y = H - 96;

  // Section heading
  pg.drawText("WHAT WE FOUND", {
    x: M, y,
    size: 18, font: bold, color: C.white,
  });
  y -= 6;
  pg.drawRectangle({ x: M, y, width: 200, height: 2, color: C.red });
  y -= 22;

  // Stats boxes
  const stats = [
    { label: "TOTAL FLAGS", value: String(flags.length), color: C.white },
    { label: "HIGH RISK",   value: String(highCount),    color: C.sevHigh },
    { label: "MEDIUM RISK", value: String(medCount),     color: C.sevMed },
    { label: "LOW RISK",    value: String(lowCount),     color: C.sevLow },
  ];
  const boxW = (W - M * 2) / 4;
  const boxH = 72;

  stats.forEach((stat, i) => {
    const bx = M + i * boxW;
    pg.drawRectangle({ x: bx + 3, y: y - boxH, width: boxW - 6, height: boxH, color: C.bgCard });
    pg.drawRectangle({ x: bx + 3, y: y - 3,    width: boxW - 6, height: 3,    color: stat.color });
    pg.drawText(stat.value, {
      x: bx + 14, y: y - boxH + 34,
      size: 28, font: bold, color: stat.color,
    });
    pg.drawText(stat.label, {
      x: bx + 14, y: y - boxH + 14,
      size: 8, font: regular, color: C.whiteMid,
    });
  });
  y -= boxH + 26;

  if (flags.length === 0) {
    pg.drawText("No compliance issues detected in this copy.", {
      x: M, y,
      size: 13, font: regular, color: C.sevLow,
    });
  } else {
    pg.drawText(`ISSUE DETAILS  —  ${flags.length} FLAG${flags.length === 1 ? "" : "S"} FOUND`, {
      x: M, y,
      size: 9, font: bold, color: C.red,
    });
    y -= 18;

    for (const flag of flags) {
      const catLabel     = FLAG_CATEGORY_LABELS[flag.category] ?? flag.category;
      const descLines    = flag.flag_description ? wrapText(flag.flag_description, 82) : [];
      const excerptLines = flag.text_excerpt ? wrapText(`"${flag.text_excerpt}"`, 82) : [];
      const suggLines    = flag.suggestion ? wrapText(flag.suggestion, 82) : [];

      const blockH =
        28 +
        descLines.length * 13 +
        (excerptLines.length > 0 ? excerptLines.length * 12 + 14 : 0) +
        (suggLines.length > 0 ? suggLines.length * 12 + 22 : 0) +
        14;

      if (y - blockH < 60) {
        drawPageFooter(pg, regular, pageNum, W, M, C);
        pg = doc.addPage([W, H]);
        pageNum++;
        pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
        drawPageHeader(pg, bold, regular, W, H, M, brandName, scan.title, C);
        y = H - 96;
        pg.drawText("ISSUE DETAILS — CONTINUED", {
          x: M, y, size: 9, font: bold, color: C.red,
        });
        y -= 18;
      }

      const cardY = y - blockH;
      const sc    = sevColor(flag.severity);

      pg.drawRectangle({ x: M, y: cardY, width: W - M * 2, height: blockH, color: C.bgCard });
      pg.drawRectangle({ x: M, y: cardY, width: 5, height: blockH, color: sc });

      pg.drawText(catLabel, {
        x: M + 16, y: y - 20,
        size: 11, font: bold, color: C.white,
      });

      const sevStr = flag.severity.toUpperCase();
      const sevW   = sevStr.length * 6.4;
      pg.drawRectangle({ x: W - M - sevW - 18, y: y - 28, width: sevW + 18, height: 18, color: sc });
      pg.drawText(sevStr, {
        x: W - M - sevW - 9, y: y - 23,
        size: 8, font: bold, color: C.white,
      });

      let lineY = y - 36;

      for (const line of descLines) {
        pg.drawText(line, { x: M + 16, y: lineY, size: 9, font: regular, color: C.whiteHi });
        lineY -= 13;
      }

      if (excerptLines.length > 0) {
        lineY -= 4;
        const exH = excerptLines.length * 12 + 10;
        pg.drawRectangle({ x: M + 16, y: lineY - exH + 6, width: W - M * 2 - 32, height: exH, color: C.redDim });
        for (const line of excerptLines) {
          pg.drawText(line, { x: M + 22, y: lineY, size: 8, font: regular, color: rgb(0.95, 0.80, 0.80) });
          lineY -= 12;
        }
        lineY -= 8;
      }

      if (suggLines.length > 0) {
        lineY -= 10;
        pg.drawText("SUGGESTED FIX:", { x: M + 16, y: lineY, size: 8, font: bold, color: C.green });
        lineY -= 14;
        for (const line of suggLines) {
          pg.drawText(line, { x: M + 16, y: lineY, size: 8, font: regular, color: rgb(0.70, 0.90, 0.75) });
          lineY -= 12;
        }
      }

      y -= blockH + 8;
    }
  }

  drawPageFooter(pg, regular, pageNum, W, M, C);

  return doc.save();
}

function drawPageHeader(
  page: ReturnType<PDFDocument["addPage"]>,
  bold: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  regular: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  W: number,
  H: number,
  M: number,
  brandName: string,
  scanTitle: string,
  C: Record<string, ReturnType<typeof rgb>>
) {
  page.drawRectangle({ x: 0, y: H - 5, width: W, height: 5, color: C.red });
  page.drawRectangle({ x: 0, y: H - 64, width: W, height: 59, color: C.bgCard });
  page.drawText(brandName.toUpperCase(), {
    x: M, y: H - 30, size: 11, font: bold, color: C.red,
  });
  const truncTitle = scanTitle.length > 60 ? scanTitle.slice(0, 57) + "..." : scanTitle;
  page.drawText(truncTitle, {
    x: M, y: H - 50, size: 8, font: regular, color: C.whiteMid,
  });
  page.drawText("redflagaipro.com", {
    x: W - M - 90, y: H - 38, size: 8, font: regular, color: C.whiteLow,
  });
}

function drawPageFooter(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  pageNum: number,
  W: number,
  M: number,
  C: Record<string, ReturnType<typeof rgb>>
) {
  page.drawRectangle({ x: 0, y: 0, width: W, height: 34, color: C.bgCard });
  page.drawRectangle({ x: 0, y: 34, width: W, height: 1, color: C.border });
  page.drawText("Generated by Red Flag AI Pro · redflagaipro.com · Confidential", {
    x: M, y: 12, size: 7, font, color: C.whiteLow,
  });
  page.drawText(`Page ${pageNum}`, {
    x: W - M - 30, y: 12, size: 7, font, color: C.whiteLow,
  });
}
