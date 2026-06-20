import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { GovernanceQuizResponse, Dimension, RedFlag, RoadmapAction } from "@/lib/governance-audit";
import { GOVERNANCE_DIMENSIONS } from "@/lib/governance-audit";
import logoPngB64 from "./fonts/logo-png";

// Brand colours (consistent with scan PDF)
const C = {
  red: rgb(0.80, 0.00, 0.00),
  redDark: rgb(0.50, 0.00, 0.00),
  redDim: rgb(0.35, 0.06, 0.06),
  bg: rgb(0.04, 0.02, 0.02),
  bgCard: rgb(0.10, 0.06, 0.06),
  bgCard2: rgb(0.08, 0.05, 0.05),
  border: rgb(0.18, 0.10, 0.10),
  white: rgb(1.00, 1.00, 1.00),
  whiteHi: rgb(0.93, 0.88, 0.88),
  whiteMid: rgb(0.62, 0.55, 0.55),
  whiteLow: rgb(0.36, 0.30, 0.30),
  sevHigh: rgb(0.87, 0.18, 0.18),
  sevMed: rgb(0.95, 0.60, 0.10),
  sevLow: rgb(0.18, 0.72, 0.32),
  green: rgb(0.18, 0.72, 0.32),
};

function scoreColor(score: number) {
  if (score >= 70) return C.sevLow;
  if (score >= 40) return C.sevMed;
  return C.sevHigh;
}

function riskLabel(score: number) {
  if (score >= 70) return "MATURE";
  if (score >= 40) return "MANAGED";
  return "CRITICAL";
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
  if (severity === "high") return C.sevHigh;
  if (severity === "medium") return C.sevMed;
  return C.sevLow;
}

export async function generateGovernanceAuditPDF(
  response: GovernanceQuizResponse
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const logoImg = await doc.embedPng(Buffer.from(logoPngB64, "base64"));

  const W = 595;
  const H = 842;
  const M = 44;

  const dateStr = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ════════════════════════════════════════════════════════════════
  const cover = doc.addPage([W, H]);
  cover.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });

  // Top stripe
  cover.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: C.red });

  // Masthead band
  const mastheadH = 100;
  cover.drawRectangle({
    x: 0,
    y: H - 8 - mastheadH,
    width: W,
    height: mastheadH,
    color: C.bgCard,
  });

  // Logo
  const logoSize = 72;
  const logoX = M;
  const logoY = H - 8 - mastheadH + (mastheadH - logoSize) / 2;
  cover.drawImage(logoImg, {
    x: logoX,
    y: logoY,
    width: logoSize,
    height: logoSize,
  });

  // Brand name
  const brandX = M + logoSize + 16;
  cover.drawText("RED FLAG AI PRO", {
    x: brandX,
    y: H - 8 - mastheadH + 64,
    size: 22,
    font: bold,
    color: C.red,
  });
  cover.drawText("AI Governance Assessment Report", {
    x: brandX,
    y: H - 8 - mastheadH + 38,
    size: 9,
    font: regular,
    color: C.whiteMid,
  });
  cover.drawText("redflagaipro.com", {
    x: W - M - 90,
    y: H - 8 - mastheadH + 52,
    size: 9,
    font: regular,
    color: C.whiteLow,
  });

  // Title
  const titleY0 = H - 8 - mastheadH - 60;
  cover.drawText("Governance Maturity", {
    x: M,
    y: titleY0,
    size: 20,
    font: bold,
    color: C.white,
  });
  cover.drawText("Index — Report", {
    x: M,
    y: titleY0 - 28,
    size: 20,
    font: bold,
    color: C.white,
  });
  cover.drawText(`Generated on ${dateStr}`, {
    x: M,
    y: titleY0 - 56,
    size: 10,
    font: regular,
    color: C.whiteMid,
  });

  // Score circle
  const cx = W / 2;
  const cy = H / 2 + 10;
  const r = 108;

  cover.drawEllipse({
    x: cx,
    y: cy,
    xScale: r + 20,
    yScale: r + 20,
    color: C.bgCard,
  });
  cover.drawEllipse({
    x: cx,
    y: cy,
    xScale: r,
    yScale: r,
    color: C.bgCard2,
  });
  cover.drawEllipse({
    x: cx,
    y: cy,
    xScale: r,
    yScale: r,
    borderColor: scoreColor(response.overallScore),
    borderWidth: 11,
  });

  const scoreStr = String(response.overallScore);
  const scoreSize = 72;
  const scoreW = scoreStr.length * scoreSize * 0.53;
  cover.drawText(scoreStr, {
    x: cx - scoreW / 2,
    y: cy - 24,
    size: scoreSize,
    font: bold,
    color: scoreColor(response.overallScore),
  });
  cover.drawText("/ 100", {
    x: cx - 24,
    y: cy - 50,
    size: 15,
    font: regular,
    color: C.whiteMid,
  });

  // Risk label
  const rLabel = riskLabel(response.overallScore);
  const rLW = rLabel.length * 8.8;
  const pillX = cx - rLW / 2 - 16;
  const pillY = cy - r - 50;
  cover.drawRectangle({
    x: pillX,
    y: pillY,
    width: rLW + 32,
    height: 30,
    color: scoreColor(response.overallScore),
  });
  cover.drawText(rLabel, {
    x: pillX + 16,
    y: pillY + 9,
    size: 12,
    font: bold,
    color: C.white,
  });

  // Verification block
  const vBlockH = 140;
  const vBlockY = 44;

  cover.drawRectangle({
    x: M,
    y: vBlockY,
    width: W - M * 2,
    height: vBlockH,
    color: C.bgCard,
  });
  cover.drawRectangle({
    x: M,
    y: vBlockY,
    width: 6,
    height: vBlockH,
    color: C.red,
  });
  cover.drawRectangle({
    x: M,
    y: vBlockY + vBlockH,
    width: W - M * 2,
    height: 1,
    color: C.border,
  });

  cover.drawText("GOVERNANCE ASSESSMENT BY", {
    x: M + 22,
    y: vBlockY + vBlockH - 18,
    size: 8,
    font: regular,
    color: C.whiteMid,
  });
  cover.drawText("RED FLAG AI PRO", {
    x: M + 22,
    y: vBlockY + vBlockH - 36,
    size: 14,
    font: bold,
    color: C.red,
  });

  cover.drawRectangle({
    x: M + 22,
    y: vBlockY + vBlockH - 62,
    width: W - M * 2 - 44,
    height: 1,
    color: C.border,
  });

  cover.drawText(
    `Maturity Index: ${response.overallScore}/100  •  ${response.riskLevel.toUpperCase()}  •  ${response.redFlags.length} governance gap${response.redFlags.length === 1 ? "" : "s"}`,
    {
      x: M + 22,
      y: vBlockY + 88,
      size: 11,
      font: bold,
      color: C.white,
    }
  );

  const criticalCount = response.redFlags.filter(
    (f) => f.severity === "high"
  ).length;
  const mediumCount = response.redFlags.filter(
    (f) => f.severity === "medium"
  ).length;
  const lowCount = response.redFlags.filter(
    (f) => f.severity === "low"
  ).length;

  const countItems = [
    { label: "HIGH", value: criticalCount, color: C.sevHigh },
    { label: "MEDIUM", value: mediumCount, color: C.sevMed },
    { label: "LOW", value: lowCount, color: C.sevLow },
  ];
  let dotX = M + 22;
  for (const item of countItems) {
    cover.drawEllipse({
      x: dotX + 5,
      y: vBlockY + 70,
      xScale: 5,
      yScale: 5,
      color: item.color,
    });
    cover.drawText(`${item.value} ${item.label}`, {
      x: dotX + 14,
      y: vBlockY + 65,
      size: 9,
      font: bold,
      color: item.color,
    });
    dotX += 120;
  }

  cover.drawText(
    `Assessment: ${dateStr}  •  redflagaipro.com`,
    {
      x: M + 22,
      y: vBlockY + 44,
      size: 8,
      font: regular,
      color: C.whiteMid,
    }
  );

  cover.drawText("Page 1", {
    x: W - M - 28,
    y: 20,
    size: 7,
    font: regular,
    color: C.whiteLow,
  });

  // ════════════════════════════════════════════════════════════════
  // PAGE 2 — DIMENSION BREAKDOWN
  // ════════════════════════════════════════════════════════════════
  let pg = doc.addPage([W, H]);
  let pageNum = 2;
  pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
  drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);

  let y = H - 96;

  pg.drawText("DIMENSION BREAKDOWN", {
    x: M,
    y,
    size: 18,
    font: bold,
    color: C.white,
  });
  y -= 6;
  pg.drawRectangle({ x: M, y, width: 200, height: 2, color: C.red });
  y -= 22;

  const dimensions = Object.entries(response.dimensionScores) as [Dimension, number][];
  for (const [dim, score] of dimensions) {
    const dimInfo = GOVERNANCE_DIMENSIONS[dim];
    const boxH = 80;

    if (y - boxH < 60) {
      drawPageFooter(pg, regular, pageNum, W, M, C);
      pg = doc.addPage([W, H]);
      pageNum++;
      pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
      drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);
      y = H - 96;
    }

    const sc = scoreColor(score);

    pg.drawRectangle({
      x: M,
      y: y - boxH,
      width: W - M * 2,
      height: boxH,
      color: C.bgCard,
    });
    pg.drawRectangle({
      x: M,
      y: y - boxH,
      width: 5,
      height: boxH,
      color: sc,
    });

    pg.drawText(dimInfo.title, {
      x: M + 16,
      y: y - 20,
      size: 12,
      font: bold,
      color: C.white,
    });
    pg.drawText(dimInfo.subtitle, {
      x: M + 16,
      y: y - 36,
      size: 9,
      font: regular,
      color: C.whiteHi,
    });

    const scoreStr = String(score);
    const scoreW = scoreStr.length * 12;
    pg.drawRectangle({
      x: W - M - scoreW - 28,
      y: y - boxH + 16,
      width: scoreW + 28,
      height: 40,
      color: sc,
    });
    pg.drawText(scoreStr, {
      x: W - M - scoreW - 14,
      y: y - boxH + 28,
      size: 28,
      font: bold,
      color: C.white,
    });
    pg.drawText("/30", {
      x: W - M - 16,
      y: y - boxH + 18,
      size: 9,
      font: regular,
      color: C.white,
    });

    y -= boxH + 10;
  }

  drawPageFooter(pg, regular, pageNum, W, M, C);

  // ════════════════════════════════════════════════════════════════
  // PAGE 3+ — RED FLAGS & RECOMMENDATIONS
  // ════════════════════════════════════════════════════════════════
  pg = doc.addPage([W, H]);
  pageNum++;
  pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
  drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);

  y = H - 96;

  pg.drawText("RED FLAGS & RECOMMENDATIONS", {
    x: M,
    y,
    size: 18,
    font: bold,
    color: C.white,
  });
  y -= 6;
  pg.drawRectangle({ x: M, y, width: 250, height: 2, color: C.red });
  y -= 22;

  if (response.redFlags.length === 0) {
    pg.drawText("No governance gaps identified.", {
      x: M,
      y,
      size: 13,
      font: regular,
      color: C.sevLow,
    });
  } else {
    for (const flag of response.redFlags) {
      const descLines = wrapText(flag.description, 85);
      const recLines = wrapText(flag.recommendation, 85);
      const regLines = flag.regulatoryContext
        .map((r) => wrapText(r, 85))
        .flat();

      const blockH =
        28 +
        descLines.length * 13 +
        8 +
        12 +
        8 +
        recLines.length * 12 +
        8 +
        12 +
        regLines.length * 11 +
        16;

      if (y - blockH < 60) {
        drawPageFooter(pg, regular, pageNum, W, M, C);
        pg = doc.addPage([W, H]);
        pageNum++;
        pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
        drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);
        y = H - 96;
      }

      const cardY = y - blockH;
      const sc = sevColor(flag.severity);

      pg.drawRectangle({
        x: M,
        y: cardY,
        width: W - M * 2,
        height: blockH,
        color: C.bgCard,
      });
      pg.drawRectangle({
        x: M,
        y: cardY,
        width: 5,
        height: blockH,
        color: sc,
      });

      pg.drawText(flag.title, {
        x: M + 16,
        y: y - 20,
        size: 12,
        font: bold,
        color: C.white,
      });

      const sevStr = flag.severity.toUpperCase();
      const sevW = sevStr.length * 6.4;
      pg.drawRectangle({
        x: W - M - sevW - 18,
        y: y - 28,
        width: sevW + 18,
        height: 18,
        color: sc,
      });
      pg.drawText(sevStr, {
        x: W - M - sevW - 9,
        y: y - 23,
        size: 8,
        font: bold,
        color: C.white,
      });

      let lineY = y - 36;

      for (const line of descLines) {
        pg.drawText(line, {
          x: M + 16,
          y: lineY,
          size: 9,
          font: regular,
          color: C.whiteHi,
        });
        lineY -= 13;
      }

      lineY -= 8;
      pg.drawText("RECOMMENDATION:", {
        x: M + 16,
        y: lineY,
        size: 8,
        font: bold,
        color: C.green,
      });
      lineY -= 12;
      for (const line of recLines) {
        pg.drawText(line, {
          x: M + 16,
          y: lineY,
          size: 8,
          font: regular,
          color: rgb(0.7, 0.9, 0.75),
        });
        lineY -= 12;
      }

      lineY -= 8;
      pg.drawText("REGULATORY CONTEXT:", {
        x: M + 16,
        y: lineY,
        size: 8,
        font: bold,
        color: C.red,
      });
      lineY -= 11;
      for (const line of regLines) {
        pg.drawText(line, {
          x: M + 16,
          y: lineY,
          size: 7,
          font: regular,
          color: rgb(0.9, 0.7, 0.7),
        });
        lineY -= 11;
      }

      y -= blockH + 8;
    }
  }

  drawPageFooter(pg, regular, pageNum, W, M, C);

  // ════════════════════════════════════════════════════════════════
  // ROADMAP PAGE (STRATEGIC ACTIONS)
  // ════════════════════════════════════════════════════════════════

  if (response.roadmap && response.roadmap.length > 0) {
    pageNum++;
    pg = doc.addPage([W, H]);
    pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
    drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);
    let ry = H - 96;

    pg.drawText('Governance Roadmap', {
      x: M,
      y: ry,
      size: 16,
      font: bold,
      color: C.red,
    });
    ry -= 24;

    // Quick wins (90-day)
    const quickWins = response.roadmap.filter((a) => a.phase === 'quick_wins');
    if (quickWins.length > 0) {
      pg.drawText('90-Day Quick Wins', {
        x: M,
        y: ry,
        size: 11,
        font: bold,
        color: C.white,
      });
      ry -= 16;

      for (const action of quickWins) {
        pg.drawText(`• ${action.title}`, {
          x: M + 12,
          y: ry,
          size: 9,
          font: bold,
          color: C.sevMed,
        });
        ry -= 11;
        pg.drawText(`${action.description}`, {
          x: M + 24,
          y: ry,
          size: 8,
          font: regular,
          color: C.whiteMid,
        });
        ry -= 10;
        pg.drawText(`Owner: ${action.owner} | Timeline: ${action.timeline}`, {
          x: M + 24,
          y: ry,
          size: 7,
          font: regular,
          color: C.whiteLow,
        });
        ry -= 14;

        if (ry < 80) {
          drawPageFooter(pg, regular, pageNum, W, M, C);
          pageNum++;
          pg = doc.addPage([W, H]);
          pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
          drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);
          ry = H - 96;
        }
      }

      ry -= 12;
    }

    // Medium-term (6-month)
    const mediumTerm = response.roadmap.filter((a) => a.phase === 'medium_term');
    if (mediumTerm.length > 0) {
      pg.drawText('6-Month Medium-Term', {
        x: M,
        y: ry,
        size: 11,
        font: bold,
        color: C.white,
      });
      ry -= 16;

      for (const action of mediumTerm) {
        pg.drawText(`• ${action.title}`, {
          x: M + 12,
          y: ry,
          size: 9,
          font: bold,
          color: C.sevMed,
        });
        ry -= 11;
        pg.drawText(`${action.description}`, {
          x: M + 24,
          y: ry,
          size: 8,
          font: regular,
          color: C.whiteMid,
        });
        ry -= 10;
        pg.drawText(`Owner: ${action.owner} | Timeline: ${action.timeline}`, {
          x: M + 24,
          y: ry,
          size: 7,
          font: regular,
          color: C.whiteLow,
        });
        ry -= 14;

        if (ry < 80) {
          drawPageFooter(pg, regular, pageNum, W, M, C);
          pageNum++;
          pg = doc.addPage([W, H]);
          pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
          drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);
          ry = H - 96;
        }
      }

      ry -= 12;
    }

    // Strategic (12-month)
    const strategic = response.roadmap.filter((a) => a.phase === 'strategic');
    if (strategic.length > 0) {
      pg.drawText('12-Month Strategic', {
        x: M,
        y: ry,
        size: 11,
        font: bold,
        color: C.white,
      });
      ry -= 16;

      for (const action of strategic) {
        pg.drawText(`• ${action.title}`, {
          x: M + 12,
          y: ry,
          size: 9,
          font: bold,
          color: C.red,
        });
        ry -= 11;
        pg.drawText(`${action.description}`, {
          x: M + 24,
          y: ry,
          size: 8,
          font: regular,
          color: C.whiteMid,
        });
        ry -= 10;
        pg.drawText(`Owner: ${action.owner} | Timeline: ${action.timeline}`, {
          x: M + 24,
          y: ry,
          size: 7,
          font: regular,
          color: C.whiteLow,
        });
        ry -= 14;

        if (ry < 80) {
          drawPageFooter(pg, regular, pageNum, W, M, C);
          pageNum++;
          pg = doc.addPage([W, H]);
          pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
          drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);
          ry = H - 96;
        }
      }
    }

    drawPageFooter(pg, regular, pageNum, W, M, C);
  }

  // ════════════════════════════════════════════════════════════════
  // BOARD SUMMARY PAGE
  // ════════════════════════════════════════════════════════════════

  pageNum++;
  pg = doc.addPage([W, H]);
  pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.bg });
  drawPageHeader(pg, bold, regular, W, H, M, C, logoImg);
  let by = H - 96;

  pg.drawText('Executive Summary — For Board/Leadership', {
    x: M,
    y: by,
    size: 14,
    font: bold,
    color: C.red,
  });
  by -= 28;

  // Big score
  const scoreCol1 = M;
  const scoreCol2 = M + 150;
  const scoreCol3 = M + 300;

  pg.drawRectangle({
    x: scoreCol1,
    y: by - 60,
    width: 120,
    height: 60,
    color: C.bgCard,
  });
  pg.drawText('Maturity Index', {
    x: scoreCol1 + 12,
    y: by - 15,
    size: 9,
    font: bold,
    color: C.whiteLow,
  });
  pg.drawText(`${response.overallScore}/100`, {
    x: scoreCol1 + 12,
    y: by - 40,
    size: 28,
    font: bold,
    color: scoreColor(response.overallScore),
  });

  pg.drawRectangle({
    x: scoreCol2,
    y: by - 60,
    width: 120,
    height: 60,
    color: C.bgCard,
  });
  pg.drawText('Risk Level', {
    x: scoreCol2 + 12,
    y: by - 15,
    size: 9,
    font: bold,
    color: C.whiteLow,
  });
  pg.drawText(riskLabel(response.overallScore), {
    x: scoreCol2 + 12,
    y: by - 40,
    size: 18,
    font: bold,
    color: scoreColor(response.overallScore),
  });

  pg.drawRectangle({
    x: scoreCol3,
    y: by - 60,
    width: 120,
    height: 60,
    color: C.bgCard,
  });
  pg.drawText('Top Gaps Found', {
    x: scoreCol3 + 12,
    y: by - 15,
    size: 9,
    font: bold,
    color: C.whiteLow,
  });
  pg.drawText(`${response.redFlags.length}`, {
    x: scoreCol3 + 12,
    y: by - 40,
    size: 28,
    font: bold,
    color: C.red,
  });

  by -= 88;

  // Key findings
  pg.drawText('Key Findings', {
    x: M,
    y: by,
    size: 11,
    font: bold,
    color: C.white,
  });
  by -= 16;

  const topGaps = response.redFlags.slice(0, 3);
  for (const flag of topGaps) {
    pg.drawText(`• ${flag.title}`, {
      x: M + 12,
      y: by,
      size: 9,
      font: bold,
      color: sevColor(flag.severity),
    });
    by -= 13;
  }

  by -= 12;

  // Recommendation
  pg.drawRectangle({
    x: M,
    y: by - 50,
    width: W - M * 2,
    height: 50,
    color: C.bgCard,
  });
  pg.drawText('Next Step', {
    x: M + 12,
    y: by - 15,
    size: 10,
    font: bold,
    color: C.red,
  });
  pg.drawText(
    'Schedule a governance assessment to prioritize fixes and build a 90-day quick-wins plan.',
    {
      x: M + 12,
      y: by - 35,
      size: 9,
      font: regular,
      color: C.white,
    }
  );

  drawPageFooter(pg, regular, pageNum, W, M, C);

  return doc.save();
}

function drawPageHeader(
  page: ReturnType<typeof PDFDocument.prototype.addPage>,
  bold: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>,
  regular: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>,
  W: number,
  H: number,
  M: number,
  C: Record<string, ReturnType<typeof rgb>>,
  logoImg: Awaited<ReturnType<typeof PDFDocument.prototype.embedPng>>
) {
  page.drawRectangle({ x: 0, y: H - 5, width: W, height: 5, color: C.red });
  page.drawRectangle({
    x: 0,
    y: H - 68,
    width: W,
    height: 63,
    color: C.bgCard,
  });
  page.drawImage(logoImg, { x: M, y: H - 60, width: 38, height: 38 });
  page.drawText("RED FLAG AI PRO", {
    x: M + 46,
    y: H - 28,
    size: 11,
    font: bold,
    color: C.red,
  });
  page.drawText("AI Governance Assessment Report", {
    x: M + 46,
    y: H - 46,
    size: 8,
    font: regular,
    color: C.whiteMid,
  });
  page.drawText("redflagaipro.com", {
    x: W - M - 90,
    y: H - 38,
    size: 8,
    font: regular,
    color: C.whiteLow,
  });
}

function drawPageFooter(
  page: ReturnType<typeof PDFDocument.prototype.addPage>,
  font: Awaited<ReturnType<typeof PDFDocument.prototype.embedFont>>,
  pageNum: number,
  W: number,
  M: number,
  C: Record<string, ReturnType<typeof rgb>>
) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: W,
    height: 34,
    color: C.bgCard,
  });
  page.drawRectangle({
    x: 0,
    y: 34,
    width: W,
    height: 1,
    color: C.border,
  });
  page.drawText(
    "This assessment blueprint is complimentary. Implementation support, automated monitoring & governance proof available through Red Flag Sentinel.",
    {
      x: M,
      y: 18,
      size: 6,
      font,
      color: C.whiteMid,
    }
  );
  page.drawText(
    "Generated by Red Flag AI Pro • redflagaipro.com • Confidential",
    {
      x: M,
      y: 8,
      size: 6,
      font,
      color: C.whiteLow,
    }
  );
  page.drawText(`Page ${pageNum}`, {
    x: W - M - 30,
    y: 12,
    size: 7,
    font,
    color: C.whiteLow,
  });
}
