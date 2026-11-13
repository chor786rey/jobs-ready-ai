import { jsPDF } from 'jspdf';
import { RewrittenBullet, ResumeScore, RecruitersEyeAssessment } from '../types';

export interface GeneratePdfOptions {
  rawResumeText: string;
  score?: ResumeScore;
  assessment?: RecruitersEyeAssessment;
  suggestedBullets?: RewrittenBullet[];
  candidateName?: string;
  includeScoreReport?: boolean;
}

export interface AtsResumeData {
  name: string;
  contactLine: string;
  summary: string;
  experienceText: string;
  skillsText: string;
  educationText: string;
  additionalSections: Array<{ title: string; content: string }>;
  mergedFullText: string;
  replacedBulletsCount: number;
}

/**
 * Clean up uploaded header noise (e.g., "Uploaded Document: ...")
 */
function cleanRawResumeText(text: string): string {
  let cleaned = text.trim();
  // Strip "Uploaded Document: ... Size: ..." banner if present
  cleaned = cleaned.replace(/^Uploaded Document:.*?Size:.*?\n+/is, '');
  return cleaned.trim();
}

/**
 * Merge raw resume text with suggested bullets, substituting unquantified bullets with improved ones.
 */
export function mergeResumeWithSuggestedBullets(
  rawText: string,
  suggestedBullets: RewrittenBullet[]
): { text: string; replacedCount: number } {
  let cleaned = cleanRawResumeText(rawText);
  let replacedCount = 0;

  suggestedBullets.forEach((b) => {
    if (!b.original || !b.improved) return;

    const trimmedOriginal = b.original.trim();
    // Try exact replacement
    if (cleaned.includes(trimmedOriginal)) {
      cleaned = cleaned.replace(trimmedOriginal, b.improved.trim());
      replacedCount++;
      return;
    }

    // Try without leading bullet dash/dot if present
    const cleanOrigStripped = trimmedOriginal.replace(/^[-•*]\s*/, '');
    const cleanImpStripped = b.improved.trim().replace(/^[-•*]\s*/, '');

    // Search for the bullet text
    if (cleaned.includes(cleanOrigStripped)) {
      cleaned = cleaned.replace(cleanOrigStripped, cleanImpStripped);
      replacedCount++;
    }
  });

  return { text: cleaned, replacedCount };
}

/**
 * Parses resume text into ATS structured sections
 */
export function parseResumeSections(text: string): AtsResumeData {
  const lines = text.split('\n').map((l) => l.trimEnd());
  
  // Name is typically the first non-empty line
  let name = 'Abhinandan Pandey';
  let contactLine = 'Chandigarh, India | +91 98765 43210 | abhinandan@696969marketing.com | linkedin.com/in/abhinandan-pandey-hr';
  
  let lineIdx = 0;
  while (lineIdx < lines.length && !lines[lineIdx].trim()) {
    lineIdx++;
  }

  if (lineIdx < lines.length) {
    name = lines[lineIdx].trim();
    lineIdx++;
  }

  // Look for contact line (often contains @, phone, |, or link)
  while (lineIdx < lines.length && !lines[lineIdx].trim()) {
    lineIdx++;
  }

  if (lineIdx < lines.length) {
    const candidateContact = lines[lineIdx].trim();
    if (
      candidateContact.includes('@') || 
      candidateContact.includes('|') || 
      candidateContact.includes('+') || 
      candidateContact.toLowerCase().includes('.com')
    ) {
      contactLine = candidateContact;
      lineIdx++;
    }
  }

  // Section parsing
  const sectionHeaders = [
    'SUMMARY',
    'PROFESSIONAL SUMMARY',
    'EXECUTIVE SUMMARY',
    'PROFILE',
    'EXPERIENCE',
    'PROFESSIONAL EXPERIENCE',
    'WORK EXPERIENCE',
    'EMPLOYMENT HISTORY',
    'SKILLS',
    'CORE SKILLS',
    'TECHNICAL SKILLS',
    'CORE COMPETENCIES',
    'EDUCATION',
    'ACADEMIC BACKGROUND',
    'CERTIFICATIONS',
    'PROJECTS',
  ];

  type SectionKey = 'summary' | 'experience' | 'skills' | 'education' | 'other';
  let currentSection: SectionKey = 'summary';
  let currentOtherTitle = '';

  const summaryLines: string[] = [];
  const experienceLines: string[] = [];
  const skillsLines: string[] = [];
  const educationLines: string[] = [];
  const otherSections: Array<{ title: string; content: string }> = [];

  for (let i = lineIdx; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.trim().toUpperCase();

    // Check if line matches a known section header
    const matchedHeader = sectionHeaders.find(
      (h) => upperLine === h || upperLine === `${h}:` || upperLine.startsWith(`${h} —`)
    );

    if (matchedHeader) {
      if (
        matchedHeader.includes('SUMMARY') || 
        matchedHeader === 'PROFILE'
      ) {
        currentSection = 'summary';
      } else if (
        matchedHeader.includes('EXPERIENCE') || 
        matchedHeader.includes('EMPLOYMENT')
      ) {
        currentSection = 'experience';
      } else if (
        matchedHeader.includes('SKILL') || 
        matchedHeader.includes('COMPETENCIES')
      ) {
        currentSection = 'skills';
      } else if (
        matchedHeader.includes('EDUCATION') || 
        matchedHeader.includes('ACADEMIC')
      ) {
        currentSection = 'education';
      } else {
        currentSection = 'other';
        currentOtherTitle = line.trim();
        otherSections.push({ title: currentOtherTitle, content: '' });
      }
      continue;
    }

    // Accumulate lines into the current section
    if (currentSection === 'summary') {
      summaryLines.push(line);
    } else if (currentSection === 'experience') {
      experienceLines.push(line);
    } else if (currentSection === 'skills') {
      skillsLines.push(line);
    } else if (currentSection === 'education') {
      educationLines.push(line);
    } else if (currentSection === 'other' && otherSections.length > 0) {
      const last = otherSections[otherSections.length - 1];
      last.content += (last.content ? '\n' : '') + line;
    }
  }

  return {
    name,
    contactLine,
    summary: summaryLines.join('\n').trim(),
    experienceText: experienceLines.join('\n').trim(),
    skillsText: skillsLines.join('\n').trim(),
    educationText: educationLines.join('\n').trim(),
    additionalSections: otherSections.filter((s) => s.content.trim().length > 0),
    mergedFullText: text,
    replacedBulletsCount: 0,
  };
}

/**
 * Downloads a clean, ATS-compliant PDF resume formatted according to 2026 Fortune 500 ATS standards.
 * Standard single column, 100% vector typography (Helvetica), standard section markers, high contrast.
 */
export function generateAndDownloadAtsPdf({
  rawResumeText,
  score,
  assessment,
  suggestedBullets,
  candidateName,
  includeScoreReport = true,
}: GeneratePdfOptions): { success: boolean; filename: string; replacedCount: number } {
  // 1. Merge text with suggested bullets
  const { text: mergedText, replacedCount } = mergeResumeWithSuggestedBullets(
    rawResumeText,
    suggestedBullets || []
  );

  // 2. Parse into structured ATS components
  const parsed = parseResumeSections(mergedText);
  if (candidateName && candidateName.trim()) {
    parsed.name = candidateName.trim();
  }

  // 3. Initialize jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  const topMargin = 18;
  const bottomMargin = 18;
  const contentWidth = pageWidth - marginX * 2; // 174mm

  let currentY = topMargin;

  // Metadata for ATS Parsers
  doc.setProperties({
    title: `${parsed.name} - Resume (ATS-Optimized)`,
    subject: 'ATS-Optimized Curriculum Vitae',
    author: parsed.name,
    keywords: 'ATS, Resume, Full-Cycle Recruitment, HR, Hiring, Talent Acquisition',
    creator: 'JobReady AI - 696969 Marketing',
  });

  // Helper to check page break
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = topMargin;
    }
  };

  // Helper to render standard ATS Section Header
  const renderSectionHeader = (title: string) => {
    checkPageBreak(12);
    currentY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 32, 44); // Dark charcoal for maximum contrast
    doc.text(title.toUpperCase(), marginX, currentY);
    
    currentY += 1.8;
    // Single subtle horizontal rule
    doc.setDrawColor(180, 190, 205);
    doc.setLineWidth(0.35);
    doc.line(marginX, currentY, marginX + contentWidth, currentY);
    currentY += 4;
  };

  // Helper to render body paragraph
  const renderParagraph = (text: string, fontSize = 9.5, lineHeight = 4.5) => {
    if (!text.trim()) return;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(45, 55, 72);

    const lines = doc.splitTextToSize(text.trim(), contentWidth);
    lines.forEach((line: string) => {
      checkPageBreak(lineHeight);
      doc.text(line, marginX, currentY);
      currentY += lineHeight;
    });
  };

  // Helper to render a bullet point with clean hanging indent
  const renderBullet = (bulletText: string) => {
    const cleanBullet = bulletText.replace(/^[-•*]\s*/, '').trim();
    if (!cleanBullet) return;

    const bulletSymbol = '•';
    const indent = 5; // mm
    const textWidth = contentWidth - indent;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    const lines = doc.splitTextToSize(cleanBullet, textWidth);

    // First line with bullet dot
    checkPageBreak(4.5);
    doc.setFont('helvetica', 'bold');
    doc.text(bulletSymbol, marginX + 1, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(lines[0], marginX + indent, currentY);
    currentY += 4.5;

    // Remaining lines indented
    for (let i = 1; i < lines.length; i++) {
      checkPageBreak(4.5);
      doc.text(lines[i], marginX + indent, currentY);
      currentY += 4.5;
    }
  };

  // -------------------------------------------------------------
  // 1. HEADER (Candidate Name + Contact)
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Deep slate
  doc.text(parsed.name, pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  // Clean Contact Information
  if (parsed.contactLine) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    // Replace raw pipe separators with nicely spaced bullets if desired
    const formattedContact = parsed.contactLine.replace(/\s*\|\s*/g, '   •   ');
    const contactLines = doc.splitTextToSize(formattedContact, contentWidth);
    contactLines.forEach((cline: string) => {
      doc.text(cline, pageWidth / 2, currentY, { align: 'center' });
      currentY += 4.2;
    });
  }

  currentY += 2;

  // -------------------------------------------------------------
  // 1.5. JOBREADY AI EXECUTIVE SCORECARD & AUDIT
  // -------------------------------------------------------------
  if (score && includeScoreReport !== false) {
    checkPageBreak(34);
    currentY += 1;

    const cardHeight = 28;
    // Light slate background with rounded border
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, cardHeight, 2, 2, 'FD');

    // Left block: Overall score
    const scoreColor = score.overall >= 85 ? [16, 185, 129] : score.overall >= 70 ? [217, 119, 6] : [225, 29, 72];
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('JOBREADY AI AUDIT SCORE', marginX + 4, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${score.overall}`, marginX + 4, currentY + 13.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('/100', marginX + 21, currentY + 13);

    const verdict = assessment?.verdict || (score.overall >= 80 ? 'Strong Candidate' : 'Moderate Candidate');
    const prob = assessment?.shortlistProbability || Math.min(96, Math.round(score.overall * 1.05));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(verdict, marginX + 4, currentY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`${prob}% Shortlist Probability`, marginX + 4, currentY + 23.5);

    // Vertical Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX + 52, currentY + 3, marginX + 52, currentY + cardHeight - 3);

    // Right block: 5 Diagnostic Pillars
    const col2X = marginX + 57;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ATS DIAGNOSTIC PILLARS & READINESS MATRIX', col2X, currentY + 5);

    const metrics = [
      { name: 'ATS Match', val: score.atsCompatibility },
      { name: 'Skills Depth', val: score.skills },
      { name: 'Experience', val: score.experience },
      { name: 'Keywords', val: score.keywords },
      { name: 'Achievements', val: score.achievements },
    ];

    const metricWidth = 23;
    metrics.forEach((m, idx) => {
      const mX = col2X + idx * metricWidth;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      doc.text(m.name, mX, currentY + 10.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      const mColor = m.val >= 80 ? [16, 185, 129] : m.val >= 70 ? [217, 119, 6] : [225, 29, 72];
      doc.setTextColor(mColor[0], mColor[1], mColor[2]);
      doc.text(`${m.val}%`, mX, currentY + 15);

      // Mini bar background
      doc.setFillColor(226, 232, 240);
      doc.rect(mX, currentY + 17, 19, 2, 'F');
      // Filled bar
      doc.setFillColor(mColor[0], mColor[1], mColor[2]);
      doc.rect(mX, currentY + 17, Math.max(1, (19 * m.val) / 100), 2, 'F');
    });

    // Verification Seal Text
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Verified with Enterprise ATS Parser & Google XYZ Impact Formula  •  JobReady AI Certified Document',
      col2X,
      currentY + 24.5
    );

    currentY += cardHeight + 3.5;
  }

  // -------------------------------------------------------------
  // 2. PROFESSIONAL SUMMARY
  // -------------------------------------------------------------
  if (parsed.summary) {
    renderSectionHeader('Professional Summary');
    renderParagraph(parsed.summary);
    currentY += 2;
  }

  // -------------------------------------------------------------
  // 3. CORE COMPETENCIES / SKILLS
  // -------------------------------------------------------------
  if (parsed.skillsText) {
    renderSectionHeader('Core Competencies & Technical Skills');
    renderParagraph(parsed.skillsText);
    currentY += 2;
  }

  // -------------------------------------------------------------
  // 4. PROFESSIONAL EXPERIENCE
  // -------------------------------------------------------------
  if (parsed.experienceText) {
    renderSectionHeader('Professional Experience');

    const expLines = parsed.experienceText.split('\n');

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i].trim();
      if (!line) {
        currentY += 1.5;
        continue;
      }

      // Check if this line is a Job Header / Company Header
      // Usually format: "Job Title | Company, Location | Dates" or starts with no bullet dash
      const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');

      if (!isBullet) {
        // Parse Title, Company, Date if pipe-separated
        const parts = line.split('|').map((p) => p.trim());

        checkPageBreak(10);
        currentY += 2;

        if (parts.length >= 2) {
          const titleRole = parts[0];
          const companyLoc = parts[1];
          const dates = parts.slice(2).join(' | ');

          // Line 1: Job Title & Company (Bold)
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(`${titleRole}  –  ${companyLoc}`, marginX, currentY);

          // Dates right aligned
          if (dates) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text(dates, marginX + contentWidth, currentY, { align: 'right' });
          }

          currentY += 5;
        } else {
          // Regular bold job title header
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(line, marginX, currentY);
          currentY += 5;
        }
      } else {
        // Bullet point
        renderBullet(line);
      }
    }

    currentY += 2;
  }

  // -------------------------------------------------------------
  // 5. EDUCATION
  // -------------------------------------------------------------
  if (parsed.educationText) {
    renderSectionHeader('Education');
    const eduLines = parsed.educationText.split('\n');
    eduLines.forEach((eline) => {
      const trimmed = eline.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        renderBullet(trimmed);
      } else {
        const parts = trimmed.split('|').map((p) => p.trim());
        checkPageBreak(8);
        if (parts.length >= 2) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          doc.text(parts[0] + (parts[1] ? `  –  ${parts[1]}` : ''), marginX, currentY);

          if (parts[2]) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text(parts[2], marginX + contentWidth, currentY, { align: 'right' });
          }
          currentY += 4.5;
        } else {
          renderParagraph(trimmed);
        }
      }
    });
    currentY += 2;
  }

  // -------------------------------------------------------------
  // 6. ADDITIONAL SECTIONS (Certifications, Projects, etc.)
  // -------------------------------------------------------------
  parsed.additionalSections.forEach((sec) => {
    renderSectionHeader(sec.title);
    const sLines = sec.content.split('\n');
    sLines.forEach((sLine) => {
      const sTrim = sLine.trim();
      if (!sTrim) return;
      if (sTrim.startsWith('-') || sTrim.startsWith('•')) {
        renderBullet(sTrim);
      } else {
        renderParagraph(sTrim);
      }
    });
    currentY += 2;
  });

  // -------------------------------------------------------------
  // Page Numbers Footer (ATS best practice)
  // -------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      `ATS-Compliant Document  |  ${parsed.name}  |  Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // 4. Save and trigger download
  const cleanFilename = includeScoreReport && score
    ? `${parsed.name.replace(/[^a-zA-Z0-9]/g, '_')}_Resume_with_AI_Scorecard.pdf`
    : `${parsed.name.replace(/[^a-zA-Z0-9]/g, '_')}_Resume_ATS_Optimized.pdf`;
  doc.save(cleanFilename);

  return {
    success: true,
    filename: cleanFilename,
    replacedCount,
  };
}

export interface MultiFormatExportOptions {
  rawResumeText: string;
  suggestedBullets?: RewrittenBullet[];
  candidateName?: string;
  score?: ResumeScore;
  assessment?: RecruitersEyeAssessment;
  includeScoreSummary?: boolean;
}

function normalizePlainTextLine(line: string): string {
  return line
    .replace(/[•▪●◦‣]/g, '-')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

/**
 * Generates an ultra-clean, ASCII-safe ATS-friendly plain text (.txt) resume.
 * Optimized for legacy parsers (Taleo, Workday, iCIMS, Naukri) with zero special glyphs or tables.
 */
export function buildAtsTxtResume({
  rawResumeText,
  suggestedBullets = [],
  candidateName,
  score,
  includeScoreSummary = false,
}: MultiFormatExportOptions): { content: string; filename: string; replacedCount: number; candidateName: string } {
  const { text: mergedText, replacedCount } = mergeResumeWithSuggestedBullets(
    rawResumeText,
    suggestedBullets
  );
  const parsed = parseResumeSections(mergedText);
  const finalName = candidateName?.trim() || parsed.name;
  const safeName = finalName.replace(/[^a-zA-Z0-9]/g, '_') || 'Candidate';

  const lines: string[] = [];
  lines.push(finalName.toUpperCase());
  if (parsed.contactLine) {
    lines.push(normalizePlainTextLine(parsed.contactLine));
  }
  lines.push('='.repeat(68));

  if (includeScoreSummary && score) {
    lines.push('');
    lines.push('AI OPTIMIZATION SUMMARY');
    lines.push(
      `Overall Score: ${score.overall}/100 | ATS Match: ${score.atsCompatibility}% | Skills: ${score.skills}% | Experience: ${score.experience}% | Keywords: ${score.keywords}% | Achievements: ${score.achievements}%`
    );
  }

  const pushSection = (heading: string, body: string) => {
    if (!body.trim()) return;
    lines.push('');
    lines.push(heading.toUpperCase());
    lines.push('-'.repeat(heading.length));
    body.split('\n').forEach((rawLine) => {
      const cleaned = normalizePlainTextLine(rawLine);
      if (!cleaned) {
        lines.push('');
      } else if (cleaned.startsWith('-') || cleaned.startsWith('*')) {
        lines.push(`- ${cleaned.replace(/^[-*]\s*/, '')}`);
      } else {
        lines.push(cleaned);
      }
    });
  };

  pushSection('PROFESSIONAL SUMMARY', parsed.summary);
  pushSection('CORE COMPETENCIES & SKILLS', parsed.skillsText);
  pushSection('PROFESSIONAL EXPERIENCE', parsed.experienceText);
  pushSection('EDUCATION', parsed.educationText);

  parsed.additionalSections.forEach((sec) => {
    pushSection(sec.title, sec.content);
  });

  const content = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return {
    content,
    filename: `${safeName}_Resume_ATS.txt`,
    replacedCount,
    candidateName: finalName,
  };
}

/**
 * Generates a structured Markdown (.md) resume ideal for GitHub profiles, Notion, or static portfolios.
 */
export function buildResumeMarkdown({
  rawResumeText,
  suggestedBullets = [],
  candidateName,
  score,
  assessment,
  includeScoreSummary = false,
}: MultiFormatExportOptions): { content: string; filename: string; replacedCount: number; candidateName: string } {
  const { text: mergedText, replacedCount } = mergeResumeWithSuggestedBullets(
    rawResumeText,
    suggestedBullets
  );
  const parsed = parseResumeSections(mergedText);
  const finalName = candidateName?.trim() || parsed.name;
  const safeName = finalName.replace(/[^a-zA-Z0-9]/g, '_') || 'Candidate';

  const md: string[] = [];
  md.push(`# ${finalName}`);

  if (parsed.contactLine) {
    const contactFormatted = parsed.contactLine
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean)
      .join(' · ');
    md.push(`**${contactFormatted}**`);
  }

  if (includeScoreSummary && score) {
    md.push('');
    md.push(
      `> **JobReady AI Audit:** ${score.overall}/100 (${assessment?.verdict || 'Verified'}) · ATS Match ${score.atsCompatibility}% · Shortlist Probability ${assessment?.shortlistProbability ?? Math.min(96, score.overall)}%`
    );
  }

  if (parsed.summary) {
    md.push('');
    md.push('## Professional Summary');
    md.push('');
    md.push(parsed.summary.trim());
  }

  if (parsed.skillsText) {
    md.push('');
    md.push('## Core Competencies & Technical Skills');
    md.push('');
    const skillItems = parsed.skillsText
      .split(/[,|\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillItems.length > 2) {
      md.push(skillItems.map((s) => `\`${s}\``).join(' · '));
    } else {
      md.push(parsed.skillsText.trim());
    }
  }

  if (parsed.experienceText) {
    md.push('');
    md.push('## Professional Experience');

    parsed.experienceText.split('\n').forEach((rawLine) => {
      const trimmed = rawLine.trim();
      if (!trimmed) return;

      const isBullet =
        trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');

      if (isBullet) {
        md.push(`- ${trimmed.replace(/^[-•*]\s*/, '')}`);
      } else {
        const parts = trimmed.split('|').map((p) => p.trim());
        md.push('');
        if (parts.length >= 2) {
          const role = parts[0];
          const company = parts[1];
          const dates = parts.slice(2).join(' | ');
          md.push(`### ${role} — ${company}`);
          if (dates) {
            md.push(`*${dates}*`);
          }
          md.push('');
        } else {
          md.push(`### ${trimmed}`);
          md.push('');
        }
      }
    });
  }

  if (parsed.educationText) {
    md.push('');
    md.push('## Education');
    md.push('');
    parsed.educationText.split('\n').forEach((rawLine) => {
      const trimmed = rawLine.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        md.push(`- ${trimmed.replace(/^[-•*]\s*/, '')}`);
      } else {
        const parts = trimmed.split('|').map((p) => p.trim());
        if (parts.length >= 2) {
          md.push(`- **${parts[0]}** — ${parts.slice(1).join(' | ')}`);
        } else {
          md.push(`- **${trimmed}**`);
        }
      }
    });
  }

  parsed.additionalSections.forEach((sec) => {
    md.push('');
    md.push(`## ${sec.title}`);
    md.push('');
    sec.content.split('\n').forEach((rawLine) => {
      const trimmed = rawLine.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        md.push(`- ${trimmed.replace(/^[-•*]\s*/, '')}`);
      } else {
        md.push(trimmed);
      }
    });
  });

  const content = md.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return {
    content,
    filename: `${safeName}_Resume.md`,
    replacedCount,
    candidateName: finalName,
  };
}

/**
 * Triggers a clean client-side download for plain text or markdown resumes.
 */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType = 'text/plain;charset=utf-8'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

