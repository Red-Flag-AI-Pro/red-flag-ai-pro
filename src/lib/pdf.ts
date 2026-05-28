import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { Scan, ScanFlag } from "@/types";
import { FLAG_CATEGORY_LABELS } from "./constants";

const SEVERITY_COLORS = {
  high: rgb(0.87, 0.2, 0.2),
  medium: rgb(0.95, 0.6, 0.1),
  low: rgb(0.2, 0.7, 0.3),
};

function scoreColor(score: number) {
  if (score >= 70) return rgb(0.2, 0.7, 0.3);
  if (score >= 40) return rgb(0.95, 0.6, 0.1);
  return rgb(0.87, 0.2, 0.2);
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

export async function generateScanPdf(
  scan: Scan,
  flags: ScanFlag[],
  agencyName?: string | null
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);

  const W = 595;
  const H = 842;
  const margin = 50;

  // ── Page 1: Summary ──────────────────────────────────────────────────────────
  const page1 = doc.addPage([W, H]);

  // Header bar
  page1.drawRectangle({
    x: 0,
    y: H - 70,
    width: W,
    height: 70,
    color: rgb(0.1, 0.1, 0.15),
  });

  const headerTitle = agencyName || "Red Flag AI Pro";
  const headerSub = agencyName ? "Compliance Risk Report — Powered by Red Flag AI Pro" : "Compliance Risk Report";

  page1.drawText(headerTitle, {
    x: margin,
    y: H - 44,
    size: 22,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page1.drawText(headerSub, {
    x: margin,
    y: H - 62,
    size: 11,
    font: regularFont,
    color: rgb(0.7, 0.7, 0.75),
  });

  // Scan title
  page1.drawText(scan.title, {
    x: margin,
    y: H - 110,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.15),
  });

  const dateStr = new Date(scan.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  page1.drawText(`Scanned on ${dateStr}`, {
    x: margin,
    y: H - 132,
    size: 11,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.55),
  });

  // Score circle
  const cx = W / 2;
  const cy = H - 270;
  const r = 70;

  page1.drawEllipse({
    x: cx,
    y: cy,
    xScale: r,
    yScale: r,
    borderColor: scoreColor(scan.score),
    borderWidth: 8,
    color: rgb(0.97, 0.97, 0.99),
  });

  const scoreStr = String(scan.score);
  const scoreSize = 42;
  const scoreWidth = scoreStr.length * scoreSize * 0.52;
  page1.drawText(scoreStr, {
    x: cx - scoreWidth / 2,
    y: cy - 16,
    size: scoreSize,
    font: boldFont,
    color: scoreColor(scan.score),
  });

  page1.drawText("/ 100", {
    x: cx - 18,
    y: cy - 34,
    size: 12,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.55),
  });

  const label = riskLabel(scan.score);
  const labelWidth = label.length * 7.5;
  page1.drawText(label, {
    x: cx - labelWidth / 2,
    y: cy - 100,
    size: 13,
    font: boldFont,
    color: scoreColor(scan.score),
  });

  // Stats row
  const highCount = flags.filter((f) => f.severity === "high").length;
  const medCount = flags.filter((f) => f.severity === "medium").length;
  const lowCount = flags.filter((f) => f.severity === "low").length;

  const stats = [
    { label: "Total Flags", value: String(flags.length) },
    { label: "High Severity", value: String(highCount) },
    { label: "Medium Severity", value: String(medCount) },
    { label: "Low Severity", value: String(lowCount) },
  ];

  const boxW = (W - margin * 2) / 4;
  stats.forEach((stat, i) => {
    const bx = margin + i * boxW;
    const by = H - 440;
    page1.drawRectangle({
      x: bx + 4,
      y: by,
      width: boxW - 8,
      height: 60,
      color: rgb(0.95, 0.95, 0.97),
      borderColor: rgb(0.88, 0.88, 0.9),
      borderWidth: 1,
    });
    page1.drawText(stat.value, {
      x: bx + 14,
      y: by + 34,
      size: 22,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.15),
    });
    page1.drawText(stat.label, {
      x: bx + 14,
      y: by + 12,
      size: 9,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.55),
    });
  });

  drawFooter(page1, regularFont, 1, W, margin);

  // ── Page 2+: Flags ────────────────────────────────────────────────────────────
  if (flags.length === 0) {
    const pg = doc.addPage([W, H]);
    drawPageHeader(pg, boldFont, W, H, margin, agencyName);
    pg.drawText("No compliance flags detected.", {
      x: margin,
      y: H - 120,
      size: 13,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.35),
    });
    drawFooter(pg, regularFont, 2, W, margin);
  } else {
    let pg = doc.addPage([W, H]);
    let pageNum = 2;
    drawPageHeader(pg, boldFont, W, H, margin, agencyName);
    let y = H - 110;

    for (const flag of flags) {
      const excerptLines = flag.text_excerpt
        ? wrapText(`"${flag.text_excerpt}"`, 85)
        : [];
      const suggestionLines = flag.suggestion
        ? wrapText(flag.suggestion, 85)
        : [];
      const blockH = 30 + excerptLines.length * 13 + suggestionLines.length * 13 + 40;

      if (y - blockH < margin + 30) {
        drawFooter(pg, regularFont, pageNum, W, margin);
        pg = doc.addPage([W, H]);
        pageNum++;
        drawPageHeader(pg, boldFont, W, H, margin, agencyName);
        y = H - 110;
      }

      // Flag card background
      pg.drawRectangle({
        x: margin,
        y: y - blockH + 10,
        width: W - margin * 2,
        height: blockH,
        color: rgb(0.97, 0.97, 0.99),
        borderColor: rgb(0.88, 0.88, 0.9),
        borderWidth: 1,
      });

      // Severity badge
      pg.drawRectangle({
        x: margin,
        y: y - blockH + 10,
        width: 4,
        height: blockH,
        color: SEVERITY_COLORS[flag.severity] ?? rgb(0.5, 0.5, 0.5),
      });

      pg.drawText(
        FLAG_CATEGORY_LABELS[flag.category] ?? flag.category,
        {
          x: margin + 14,
          y: y - 4,
          size: 11,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.15),
        }
      );

      const sevLabel = flag.severity.toUpperCase();
      pg.drawText(sevLabel, {
        x: W - margin - sevLabel.length * 6.5,
        y: y - 4,
        size: 9,
        font: boldFont,
        color: SEVERITY_COLORS[flag.severity] ?? rgb(0.5, 0.5, 0.5),
      });

      let lineY = y - 20;
      pg.drawText(flag.flag_description, {
        x: margin + 14,
        y: lineY,
        size: 9,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.35),
      });
      lineY -= 16;

      for (const line of excerptLines) {
        pg.drawText(line, {
          x: margin + 14,
          y: lineY,
          size: 8,
          font: regularFont,
          color: rgb(0.45, 0.35, 0.1),
        });
        lineY -= 13;
      }

      if (suggestionLines.length > 0) {
        lineY -= 4;
        pg.drawText("Suggestion:", {
          x: margin + 14,
          y: lineY,
          size: 9,
          font: boldFont,
          color: rgb(0.15, 0.45, 0.25),
        });
        lineY -= 13;
        for (const line of suggestionLines) {
          pg.drawText(line, {
            x: margin + 14,
            y: lineY,
            size: 8,
            font: regularFont,
            color: rgb(0.2, 0.35, 0.25),
          });
          lineY -= 13;
        }
      }

      y -= blockH + 10;
    }

    drawFooter(pg, regularFont, pageNum, W, margin);
  }

  return doc.save();
}

function drawPageHeader(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  W: number,
  H: number,
  margin: number,
  agencyName?: string | null
) {
  page.drawRectangle({
    x: 0,
    y: H - 50,
    width: W,
    height: 50,
    color: rgb(0.1, 0.1, 0.15),
  });
  page.drawText(`${agencyName || "Red Flag AI Pro"} — Flag Details`, {
    x: margin,
    y: H - 32,
    size: 14,
    font,
    color: rgb(1, 1, 1),
  });
}

function drawFooter(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  pageNum: number,
  W: number,
  margin: number
) {
  page.drawLine({
    start: { x: margin, y: 35 },
    end: { x: W - margin, y: 35 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.82),
  });
  page.drawText("Generated by Red Flag AI Pro · Confidential", {
    x: margin,
    y: 20,
    size: 8,
    font,
    color: rgb(0.6, 0.6, 0.65),
  });
  page.drawText(`Page ${pageNum}`, {
    x: W - margin - 30,
    y: 20,
    size: 8,
    font,
    color: rgb(0.6, 0.6, 0.65),
  });
}
