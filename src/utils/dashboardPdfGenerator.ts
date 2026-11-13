import { jsPDF } from 'jspdf';
import {
  ATSKeyword,
  RecruitersEyeAssessment,
  ResumeScore,
  RewrittenBullet,
} from '../types';
import { parseResumeSections } from './atsResumeGenerator';

export interface GenerateDashboardPdfOptions {
  resumeText: string;
  score: ResumeScore;
  assessment: RecruitersEyeAssessment;
  atsKeywords?: ATSKeyword[];
  suggestedBullets?: RewrittenBullet[];
  candidateName?: string;
}

export interface GenerateDashboardPdfResult {
  success: boolean;
  filename: string;
  pageCount: number;
}

/**
 * Generates a formatted, multi-page A4 vector PDF document containing the full
 * Resume Analysis Dashboard: overall score, Recruiter's Eye assessment,
 * 5-pillar diagnostic matrix, strengths & gaps, ATS keyword audit, and
 * Google XYZ bullet upgrades.
 */
export function generateDashboardAnalysisPdf({
  resumeText,
  score,
  assessment,
  atsKeywords = [],
  suggestedBullets = [],
  candidateName,
}: GenerateDashboardPdfOptions): GenerateDashboardPdfResult {
  const parsed = parseResumeSections(resumeText || '');
  const resolvedName = (candidateName || parsed.name || 'Candidate').trim();
  const cleanFileName = `${resolvedName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume_Analysis_Report.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2; // 178mm
  const bottomLimit = pageHeight - 16;

  doc.setProperties({
    title: `${resolvedName} - Resume Analysis Report`,
    subject: 'AI Resume Score, Recruiter Assessment & ATS Diagnostic Report',
    author: resolvedName,
    creator: 'JobReady AI',
  });

  let y = 16;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > bottomLimit) {
      doc.addPage();
      y = 18;
    }
  };

  const renderSectionTitle = (title: string, subtitle?: string) => {
    ensureSpace(14);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title, marginX, y);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, marginX + contentWidth, y, { align: 'right' });
    }

    y += 2;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.35);
    doc.line(marginX, y, marginX + contentWidth, y);
    y += 5;
  };

  const renderWrappedLines = (
    text: string,
    x: number,
    maxWidth: number,
    fontSize = 9,
    lineHeight = 4.3,
    color: [number, number, number] = [51, 65, 85],
    fontStyle: 'normal' | 'bold' | 'italic' = 'normal'
  ) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      ensureSpace(lineHeight + 1);
      doc.text(line, x, y);
      y += lineHeight;
    });
  };

  // ---------------------------------------------------------------------------
  // 1. EXECUTIVE REPORT BANNER
  // ---------------------------------------------------------------------------
  doc.setFillColor(15, 23, 42); // Slate-900 header banner
  doc.roundedRect(marginX, y, contentWidth, 26, 2.5, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(251, 191, 36); // Amber-400
  doc.text('JOBREADY AI  •  RESUME ANALYSIS DASHBOARD REPORT', marginX + 5, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(resolvedName, marginX + 5, y + 14.5);

  const dateLabel = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const contactSnippet = parsed.contactLine
    ? parsed.contactLine.replace(/\s*\|\s*/g, '  ·  ')
    : `Target Role: ${assessment.recommendedRoleLevel}`;
  const trimmedContact = doc.splitTextToSize(contactSnippet, contentWidth - 45)[0];
  doc.text(trimmedContact, marginX + 5, y + 21);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated ${dateLabel}`, marginX + contentWidth - 5, y + 7, { align: 'right' });

  y += 31;

  // ---------------------------------------------------------------------------
  // 2. OVERALL SCORE & RECRUITER'S EYE™ SUMMARY CARDS
  // ---------------------------------------------------------------------------
  ensureSpace(44);
  const leftW = 58;
  const gap = 4;
  const rightW = contentWidth - leftW - gap;
  const topBlockH = 40;

  // Left card: Overall AI Resume Score
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.35);
  doc.roundedRect(marginX, y, leftW, topBlockH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('OVERALL AI SCORE', marginX + leftW / 2, y + 6.5, { align: 'center' });

  const overallColor: [number, number, number] =
    score.overall >= 85 ? [5, 150, 105] : score.overall >= 70 ? [217, 119, 6] : [225, 29, 72];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(overallColor[0], overallColor[1], overallColor[2]);
  doc.text(`${score.overall}`, marginX + leftW / 2 - 4, y + 19, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('/100', marginX + leftW / 2 + 10, y + 19, { align: 'center' });

  // Horizontal score bar inside left card
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(marginX + 6, y + 23, leftW - 12, 2.5, 1, 1, 'F');
  doc.setFillColor(overallColor[0], overallColor[1], overallColor[2]);
  doc.roundedRect(
    marginX + 6,
    y + 23,
    Math.max(4, ((leftW - 12) * Math.min(100, score.overall)) / 100),
    2.5,
    1,
    1,
    'F'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Top 22% of Applicants', marginX + leftW / 2, y + 31, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text('Passing threshold: 75/100', marginX + leftW / 2, y + 35.5, { align: 'center' });

  // Right card: Recruiter's Eye™ Assessment
  const rightX = marginX + leftW + gap;
  doc.setFillColor(255, 251, 235); // Warm light amber surface
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(rightX, y, rightW, topBlockH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Recruiter's Eye Assessment", rightX + 5, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.text(`${assessment.shortlistProbability}% Shortlist Probability`, rightX + 5, y + 14.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(5, 150, 105);
  doc.text(
    `Verdict: ${assessment.verdict}  ·  Level: ${assessment.recommendedRoleLevel}`,
    rightX + 5,
    y + 20
  );

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(`"${assessment.summary}"`, rightW - 10);
  summaryLines.slice(0, 3).forEach((sLine: string, idx: number) => {
    doc.text(sLine, rightX + 5, y + 25.5 + idx * 4.2);
  });

  y += topBlockH + 4;

  // ---------------------------------------------------------------------------
  // 3. DETAILED DIAGNOSTIC BREAKDOWN (5 CRITERIA)
  // ---------------------------------------------------------------------------
  renderSectionTitle('Detailed Diagnostic Breakdown', '5 Criteria Evaluated');

  const criteria = [
    {
      label: 'ATS Match',
      val: score.atsCompatibility,
      note: 'Parser readability & structure alignment (target >= 80)',
    },
    {
      label: 'Skills Depth',
      val: score.skills,
      note: 'Core domain & technical tool coverage',
    },
    {
      label: 'Experience',
      val: score.experience,
      note: 'Relevant progression, tenure stability & ownership',
    },
    {
      label: 'Keywords',
      val: score.keywords,
      note: 'Required & recommended role keyword density',
    },
    {
      label: 'Achievements',
      val: score.achievements,
      note: 'Quantified outcomes with %, currency, & SLA metrics',
    },
  ];

  criteria.forEach((c) => {
    ensureSpace(12);
    const rowH = 10;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, y, contentWidth, rowH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(c.label, marginX + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.note, marginX + 4, y + 8.3);

    // Progress bar on right
    const barX = marginX + 96;
    const barW = 58;
    const barColor: [number, number, number] =
      c.val >= 80 ? [5, 150, 105] : c.val >= 70 ? [217, 119, 6] : [225, 29, 72];

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(barX, y + 3.8, barW, 2.6, 1, 1, 'F');
    doc.setFillColor(barColor[0], barColor[1], barColor[2]);
    doc.roundedRect(barX, y + 3.8, Math.max(2, (barW * Math.min(100, c.val)) / 100), 2.6, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(barColor[0], barColor[1], barColor[2]);
    doc.text(`${c.val}/100`, marginX + contentWidth - 4, y + 6.3, { align: 'right' });

    y += rowH + 2;
  });

  // ---------------------------------------------------------------------------
  // 4. STRENGTHS, MISSING METRICS & RED FLAGS
  // ---------------------------------------------------------------------------
  renderSectionTitle('Recruiter Findings & Actionable Gaps');

  const colW = (contentWidth - 4) / 2;
  const startBlockY = y;

  // Compute heights safely
  const calcListHeight = (items: string[]) =>
    items.reduce((acc, item) => acc + doc.splitTextToSize(`• ${item}`, colW - 8).length * 4 + 1.5, 10);

  const strengthsH = calcListHeight(assessment.strengths);
  const gapsH = calcListHeight(assessment.missingMetrics);
  const pairH = Math.max(strengthsH, gapsH, 22);

  ensureSpace(pairH + 4);

  // Strengths Box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(marginX, y, colW, pairH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87);
  doc.text('What Recruiters Love (Strengths)', marginX + 4, y + 5.5);

  let sY = y + 10.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  assessment.strengths.forEach((s) => {
    const lines = doc.splitTextToSize(`• ${s}`, colW - 8);
    lines.forEach((line: string) => {
      doc.text(line, marginX + 4, sY);
      sY += 4;
    });
    sY += 1.2;
  });

  // Missing Metrics Box
  const gapX = marginX + colW + 4;
  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(gapX, y, colW, pairH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 18, 60);
  doc.text('Why You Miss Shortlists (Missing Metrics)', gapX + 4, y + 5.5);

  let gY = y + 10.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  assessment.missingMetrics.forEach((m) => {
    const lines = doc.splitTextToSize(`• ${m}`, colW - 8);
    lines.forEach((line: string) => {
      doc.text(line, gapX + 4, gY);
      gY += 4;
    });
    gY += 1.2;
  });

  y = Math.max(y + pairH, startBlockY + pairH) + 4;

  // Red flags if present
  if (assessment.redFlags && assessment.redFlags.length > 0) {
    const rfLinesCount = assessment.redFlags.reduce(
      (acc, rf) => acc + doc.splitTextToSize(`• ${rf}`, contentWidth - 8).length,
      0
    );
    const rfHeight = 9 + rfLinesCount * 4.2;
    ensureSpace(rfHeight + 2);

    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(253, 224, 71);
    doc.roundedRect(marginX, y, contentWidth, rfHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14);
    doc.text('Detected Risk & Red Flags', marginX + 4, y + 5.5);

    let rfY = y + 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    assessment.redFlags.forEach((rf) => {
      const lines = doc.splitTextToSize(`• ${rf}`, contentWidth - 8);
      lines.forEach((line: string) => {
        doc.text(line, marginX + 4, rfY);
        rfY += 4.2;
      });
    });

    y += rfHeight + 4;
  }

  // ---------------------------------------------------------------------------
  // 5. ATS KEYWORD COMPATIBILITY AUDIT
  // ---------------------------------------------------------------------------
  if (atsKeywords.length > 0) {
    const foundKws = atsKeywords.filter((k) => k.status === 'found');
    const missingKws = atsKeywords.filter((k) => k.status === 'missing');
    renderSectionTitle(
      'ATS Keyword Compatibility Audit',
      `${foundKws.length} Matched  ·  ${missingKws.length} Missing`
    );

    if (missingKws.length > 0) {
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(190, 18, 60);
      doc.text('Missing High-Impact Keywords to Add:', marginX, y);
      y += 4.5;

      const missingStr = missingKws.map((k) => `${k.keyword} (${k.category})`).join('   •   ');
      renderWrappedLines(missingStr, marginX + 2, contentWidth - 4, 8.2, 4.2, [51, 65, 85]);
      y += 2;
    }

    if (foundKws.length > 0) {
      ensureSpace(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(4, 120, 87);
      doc.text('Matched ATS Keywords Found in Resume:', marginX, y);
      y += 4.5;

      const foundStr = foundKws.map((k) => `${k.keyword} (${k.category})`).join('   •   ');
      renderWrappedLines(foundStr, marginX + 2, contentWidth - 4, 8.2, 4.2, [51, 65, 85]);
      y += 2;
    }
  }

  // ---------------------------------------------------------------------------
  // 6. GOOGLE XYZ BULLET UPGRADE RECOMMENDATIONS
  // ---------------------------------------------------------------------------
  if (suggestedBullets.length > 0) {
    renderSectionTitle(
      'Recommended Resume Bullet Upgrades (Google XYZ Formula)',
      `${suggestedBullets.length} Transformations`
    );

    suggestedBullets.forEach((b, idx) => {
      const origLines = doc.splitTextToSize(`Original: "${b.original}"`, contentWidth - 8);
      const impLines = doc.splitTextToSize(`Upgraded: "${b.improved}"`, contentWidth - 8);
      const reasonLines = doc.splitTextToSize(`Why it works: ${b.impactReason}`, contentWidth - 8);
      const boxH = 8 + (origLines.length + impLines.length + reasonLines.length) * 4 + 4;

      ensureSpace(boxH + 3);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(marginX, y, contentWidth, boxH, 2, 2, 'FD');

      let bY = y + 5.5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9);
      doc.text(`Upgrade #${idx + 1} (${b.formula})`, marginX + 4, bY);
      bY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      origLines.forEach((line: string) => {
        doc.text(line, marginX + 4, bY);
        bY += 4;
      });
      bY += 1;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(6, 95, 70);
      impLines.forEach((line: string) => {
        doc.text(line, marginX + 4, bY);
        bY += 4;
      });
      bY += 1;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      reasonLines.forEach((line: string) => {
        doc.text(line, marginX + 4, bY);
        bY += 3.8;
      });

      y += boxH + 3;
    });
  }

  // ---------------------------------------------------------------------------
  // PAGE NUMBERS & FOOTER ON ALL PAGES
  // ---------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `JobReady AI  •  Resume Analysis Report for ${resolvedName}  •  Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );
  }

  doc.save(cleanFileName);

  return {
    success: true,
    filename: cleanFileName,
    pageCount: totalPages,
  };
}
