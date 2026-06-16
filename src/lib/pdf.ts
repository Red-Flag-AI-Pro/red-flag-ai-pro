import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { Scan, ScanFlag } from "@/types";
import { FLAG_CATEGORY_LABELS } from "./constants";

// Brand colours
const C = {
  red:        rgb(0.80, 0.00, 0.00),
  redLight:   rgb(0.94, 0.27, 0.27),
  redDim:     rgb(0.40, 0.05, 0.05),
  bg:         rgb(0.05, 0.03, 0.03),
  bgCard:     rgb(0.10, 0.06, 0.06),
  bgCardAlt:  rgb(0.08, 0.08, 0.08),
  border:     rgb(0.20, 0.12, 0.12),
  white:      rgb(1.00, 1.00, 1.00),
  whiteHi:    rgb(0.95, 0.90, 0.90),
  whiteMid:   rgb(0.65, 0.60, 0.60),
  whiteLow:   rgb(0.38, 0.34, 0.34),
  sevHigh:    rgb(0.87, 0.20, 0.20),
  sevMed:     rgb(0.95, 0.60, 0.10),
  sevLow:     rgb(0.20, 0.70, 0.30),
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
  const bold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const W = 595;
  const H = 842;
  const M = 44; // margin

  const brandName = agencyName ?? "Red Flag AI Pro";

  // ─── Page 1: Cover / Summary ────────────────────────────────────────────────
  const p1 = doc.addPage([W, H]);

  // Full dark background
  p1.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });

  // Top accent bar
  p1.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: C.red });

  // Header area
  p1.drawRectangle({ x: 0, y: H - 80, width: W, height: 74, color: C.bgCard });

  // Brand name
  p1.drawText(agencyName ? agencyName.toUpperCase() : "RED FLAG AI PRO", {
    x: M, y: H - 40,
    size: agencyName ? 14 : 16,
    font: bold,
    color: C.red,
  });

  // Sub-label
  const subLabel = agencyName
    ? "Compliance Risk Report — Powered by Red Flag AI Pro"
    : "Marketing Compliance Risk Report";
  p1.drawText(subLabel, {
    x: M, y: H - 60,
    size: 9,
    font: regular,
    color: C.whiteMid,
  });

  // redflagaipro.com top-right
  p1.drawText("redflagaipro.com", {
    x: W - M - 90, y: H - 48,
    size: 9,
    font: regular,
    color: C.whiteLow,
  });

  // Scan title
  const titleLines = wrapText(scan.title, 70);
  let titleY = H - 116;
  for (const line of titleLines) {
    p1.drawText(line, {
      x: M, y: titleY,
      size: 18,
      font: bold,
      color: C.white,
    });
    titleY -= 24;
  }

  const dateStr = new Date(scan.created_at).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric",
  });
  p1.drawText(`Scanned on ${dateStr}`, {
    x: M, y: titleY - 4,
    size: 10,
    font: regular,
    color: C.whiteMid,
  });

  // ── Score circle ──
  const cx = W / 2;
  const cy = H - 310;
  const r  = 72;

  // Outer ring fill
  p1.drawEllipse({ x: cx, y: cy, xScale: r, yScale: r, color: C.bgCard });
  // Coloured border
  p1.drawEllipse({
    x: cx, y: cy, xScale: r, yScale: r,
    borderColor: scoreColor(scan.score), borderWidth: 7,
  });

  // Score number
  const scoreStr  = String(scan.score);
  const scoreSize = 44;
  const scoreW    = scoreStr.length * scoreSize * 0.53;
  p1.drawText(scoreStr, {
    x: cx - scoreW / 2, y: cy - 16,
    size: scoreSize,
    font: bold,
    color: scoreColor(scan.score),
  });
  p1.drawText("/ 100", {
    x: cx - 18, y: cy - 36,
    size: 11, font: regular, color: C.whiteMid,
  });

  // Risk label below circle
  const rLabel = riskLabel(scan.score);
  const rLabelW = rLabel.length * 7.8;
  p1.drawRectangle({
    x: cx - rLabelW / 2 - 10, y: cy - 112,
    width: rLabelW + 20, height: 22,
    color: scoreColor(scan.score),
  });
  p1.drawText(rLabel, {
    x: cx - rLabelW / 2, y: cy - 106,
    size: 11, font: bold, color: C.white,
  });

  // ── Stats row ──
  const highCount = flags.filter((f) => f.severity === "high").length;
  const medCount  = flags.filter((f) => f.severity === "medium").length;
  const lowCount  = flags.filter((f) => f.severity === "low").length;

  const stats = [
    { label: "TOTAL FLAGS",    value: String(flags.length),  color: C.white },
    { label: "HIGH",           value: String(highCount),     color: C.sevHigh },
    { label: "MEDIUM",         value: String(medCount),      color: C.sevMed },
    { label: "LOW",            value: String(lowCount),      color: C.sevLow },
  ];

  const boxW  = (W - M * 2) / 4;
  const boxY  = H - 480;
  const boxH2 = 68;

  stats.forEach((stat, i) => {
    const bx = M + i * boxW;
    p1.drawRectangle({
      x: bx + 3, y: boxY,
      width: boxW - 6, height: boxH2,
      color: C.bgCard,
    });
    // Top accent line
    p1.drawRectangle({
      x: bx + 3, y: boxY + boxH2 - 3,
      width: boxW - 6, height: 3,
      color: stat.color,
    });
    p1.drawText(stat.value, {
      x: bx + 14, y: boxY + 34,
      size: 24, font: bold, color: stat.color,
    });
    p1.drawText(stat.label, {
      x: bx + 14, y: boxY + 14,
      size: 8, font: regular, color: C.whiteMid,
    });
  });

  // ── Verified stamp ──
  const stampY = H - 580;
  const stampH = 80;

  p1.drawRectangle({
    x: M, y: stampY,
    width: W - M * 2, height: stampH,
    color: C.bgCard,
  });
  // Left red bar
  p1.drawRectangle({ x: M, y: stampY, width: 5, height: stampH, color: C.red });

  // Red flag SVG approximation — just a small rectangle flag icon
  p1.drawRectangle({ x: M + 18, y: stampY + 55, width: 2, height: 20, color: C.red });
  p1.drawRectangle({ x: M + 20, y: stampY + 62, width: 12, height: 9, color: C.red });

  p1.drawText("VERIFIED BY RED FLAG AI PRO", {
    x: M + 40, y: stampY + 56,
    size: 9, font: bold, color: C.red,
  });
  p1.drawText(`Score: ${scan.score}/100  ·  ${rLabel}  ·  ${flags.length} flag${flags.length === 1 ? "" : "s"} detected`, {
    x: M + 40, y: stampY + 40,
    size: 11, font: bold, color: C.white,
  });
  p1.drawText(`Scanned ${dateStr}  ·  redflagaipro.com`, {
    x: M + 40, y: stampY + 22,
    size: 8, font: regular, color: C.whiteMid,
  });

  if (agencyName) {
    p1.drawText(`Report prepared by ${agencyName}`, {
      x: M + 40, y: stampY + 10,
      size: 8, font: regular, color: C.whiteLow,
    });
  }

  // ── What this means ──
  const meaningY = stampY - 30;
  p1.drawText("WHAT THIS MEANS", {
    x: M, y: meaningY,
    size: 8, font: bold, color: C.red,
  });

  const meaning =
    scan.score >= 70
      ? "This copy passed with a low-risk score. Minor issues were identified. Review and address each flag before publishing to maintain compliance."
      : scan.score >= 40
      ? "Medium risk detected. Several compliance issues need addressing before this copy can be safely published or used in paid advertising."
      : "High risk — significant compliance violations found. Do not publish until all high-severity flags have been resolved to avoid regulatory action.";

  const meaningLines = wrapText(meaning, 90);
  let mY = meaningY - 16;
  for (const line of meaningLines) {
    p1.drawText(line, {
      x: M, y: mY,
      size: 9, font: regular, color: C.whiteHi,
    });
    mY -= 14;
  }

  drawFooter(p1, regular, 1, W, M, C);

  // ── Page 2+: Flag Details ───────────────────────────────────────────────────
  if (flags.length === 0) {
    const pg = doc.addPage([W, H]);
    pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
    drawPageHeader(pg, bold, W, H, M, brandName, C);
    pg.drawText("No compliance flags detected.", {
      x: M, y: H - 130,
      size: 13, font: regular, color: C.sevLow,
    });
    drawFooter(pg, regular, 2, W, M, C);
  } else {
    let pg = doc.addPage([W, H]);
    let pageNum = 2;
    pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
    drawPageHeader(pg, bold, W, H, M, brandName, C);
    let y = H - 120;

    // Section heading
    pg.drawText(`FLAG DETAILS — ${flags.length} ISSUE${flags.length === 1 ? "" : "S"} FOUND`, {
      x: M, y,
      size: 8, font: bold, color: C.red,
    });
    y -= 20;

    for (const flag of flags) {
      const catLabel       = FLAG_CATEGORY_LABELS[flag.category] ?? flag.category;
      const descLines      = flag.flag_description ? wrapText(flag.flag_description, 82) : [];
      const excerptLines   = flag.text_excerpt ? wrapText(`"${flag.text_excerpt}"`, 82) : [];
      const suggLines      = flag.suggestion ? wrapText(flag.suggestion, 82) : [];

      // Block height: title row + desc + excerpt + suggestion label + suggestion + padding
      const blockH =
        26 +
        descLines.length * 13 +
        (excerptLines.length > 0 ? excerptLines.length * 12 + 10 : 0) +
        (suggLines.length > 0 ? suggLines.length * 12 + 18 : 0) +
        16;

      if (y - blockH < M + 40) {
        drawFooter(pg, regular, pageNum, W, M, C);
        pg = doc.addPage([W, H]);
        pageNum++;
        pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
        drawPageHeader(pg, bold, W, H, M, brandName, C);
        y = H - 120;
        pg.drawText(`FLAG DETAILS — CONTINUED`, {
          x: M, y,
          size: 8, font: bold, color: C.red,
        });
        y -= 20;
      }

      const cardY = y - blockH;
      const sc    = sevColor(flag.severity);

      // Card background
      pg.drawRectangle({
        x: M, y: cardY,
        width: W - M * 2, height: blockH,
        color: C.bgCard,
      });

      // Left severity bar
      pg.drawRectangle({
        x: M, y: cardY,
        width: 4, height: blockH,
        color: sc,
      });

      // Category title
      pg.drawText(catLabel, {
        x: M + 14, y: y - 18,
        size: 11, font: bold, color: C.white,
      });

      // Severity badge (right-aligned)
      const sevStr = flag.severity.toUpperCase();
      const sevW   = sevStr.length * 6.2;
      pg.drawRectangle({
        x: W - M - sevW - 16, y: y - 26,
        width: sevW + 16, height: 16,
        color: sc,
      });
      pg.drawText(sevStr, {
        x: W - M - sevW - 8, y: y - 21,
        size: 8, font: bold, color: C.white,
      });

      let lineY = y - 34;

      // Description
      for (const line of descLines) {
        pg.drawText(line, {
          x: M + 14, y: lineY,
          size: 9, font: regular, color: C.whiteHi,
        });
        lineY -= 13;
      }

      // Excerpt
      if (excerptLines.length > 0) {
        lineY -= 6;
        pg.drawRectangle({
          x: M + 14, y: lineY - excerptLines.length * 12 + 2,
          width: W - M * 2 - 28, height: excerptLines.length * 12 + 6,
          color: C.redDim,
        });
        for (const line of excerptLines) {
          pg.drawText(line, {
            x: M + 20, y: lineY,
            size: 8, font: regular, color: rgb(0.95, 0.80, 0.80),
          });
          lineY -= 12;
        }
        lineY -= 4;
      }

      // Suggestion
      if (suggLines.length > 0) {
        lineY -= 4;
        pg.drawText("SUGGESTED FIX:", {
          x: M + 14, y: lineY,
          size: 8, font: bold, color: C.sevLow,
        });
        lineY -= 14;
        for (const line of suggLines) {
          pg.drawText(line, {
            x: M + 14, y: lineY,
            size: 8, font: regular, color: rgb(0.70, 0.90, 0.75),
          });
          lineY -= 12;
        }
      }

      y -= blockH + 8;
    }

    drawFooter(pg, regular, pageNum, W, M, C);
  }

  return doc.save();
}

function drawPageHeader(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  W: number,
  H: number,
  M: number,
  brandName: string,
  C: Record<string, ReturnType<typeof rgb>>
) {
  // Top accent bar
  page.drawRectangle({ x: 0, y: H - 4, width: W, height: 4, color: C.red });
  // Header band
  page.drawRectangle({ x: 0, y: H - 60, width: W, height: 56, color: C.bgCard });
  page.drawText(brandName.toUpperCase(), {
    x: M, y: H - 32,
    size: 12, font, color: C.red,
  });
  page.drawText("Compliance Risk Report", {
    x: M, y: H - 50,
    size: 9, font,
    color: C.whiteMid,
  });
  page.drawText("redflagaipro.com", {
    x: W - M - 90, y: H - 40,
    size: 9, font, color: C.whiteLow,
  });
}

function drawFooter(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  pageNum: number,
  W: number,
  M: number,
  C: Record<string, ReturnType<typeof rgb>>
) {
  page.drawRectangle({ x: 0, y: 0, width: W, height: 30, color: C.bgCard });
  page.drawRectangle({ x: 0, y: 30, width: W, height: 1, color: C.border });
  page.drawText("Generated by Red Flag AI Pro · redflagaipro.com · Confidential", {
    x: M, y: 10,
    size: 7, font, color: C.whiteLow,
  });
  page.drawText(`Page ${pageNum}`, {
    x: W - M - 28, y: 10,
    size: 7, font, color: C.whiteLow,
  });
}
