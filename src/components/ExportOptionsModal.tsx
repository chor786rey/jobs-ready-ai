import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  FileText,
  FileCode2,
  FileCheck2,
  Download,
  Copy,
  Check,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  ATSKeyword,
  RecruitersEyeAssessment,
  ResumeScore,
  RewrittenBullet,
} from '../types';
import {
  buildAtsTxtResume,
  buildResumeMarkdown,
  downloadTextFile,
  generateAndDownloadAtsPdf,
  mergeResumeWithSuggestedBullets,
  parseResumeSections,
} from '../utils/atsResumeGenerator';

export type ExportFormat = 'pdf' | 'txt' | 'markdown';

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  suggestedBullets: RewrittenBullet[];
  atsKeywords?: ATSKeyword[];
  score?: ResumeScore;
  assessment?: RecruitersEyeAssessment;
  onOpenFullPdfPreview?: () => void;
  onExportComplete?: (format: ExportFormat, filename: string) => void;
}

export const ExportOptionsModal: React.FC<ExportOptionsModalProps> = ({
  isOpen,
  onClose,
  rawText,
  suggestedBullets,
  score,
  assessment,
  onOpenFullPdfPreview,
  onExportComplete,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [includeScoreSummary, setIncludeScoreSummary] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [exportedFile, setExportedFile] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setExportedFile(null);
    setExportError(null);
    setCopied(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const { mergedText, replacedCount, parsed } = useMemo(() => {
    const merged = mergeResumeWithSuggestedBullets(rawText, suggestedBullets);
    return {
      mergedText: merged.text,
      replacedCount: merged.replacedCount,
      parsed: parseResumeSections(merged.text),
    };
  }, [rawText, suggestedBullets]);

  const txtOutput = useMemo(
    () =>
      buildAtsTxtResume({
        rawResumeText: rawText,
        suggestedBullets,
        score,
        assessment,
        includeScoreSummary,
      }),
    [rawText, suggestedBullets, score, assessment, includeScoreSummary]
  );

  const mdOutput = useMemo(
    () =>
      buildResumeMarkdown({
        rawResumeText: rawText,
        suggestedBullets,
        score,
        assessment,
        includeScoreSummary,
      }),
    [rawText, suggestedBullets, score, assessment, includeScoreSummary]
  );

  if (!isOpen) return null;

  const cleanCandidateName = (parsed.name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  const expectedPdfFilename =
    includeScoreSummary && score
      ? `${cleanCandidateName}_Resume_with_AI_Scorecard.pdf`
      : `${cleanCandidateName}_Resume_ATS_Optimized.pdf`;

  const activeContent =
    selectedFormat === 'txt'
      ? txtOutput.content
      : selectedFormat === 'markdown'
      ? mdOutput.content
      : mergedText;

  const activeFilename =
    selectedFormat === 'txt'
      ? txtOutput.filename
      : selectedFormat === 'markdown'
      ? mdOutput.filename
      : expectedPdfFilename;

  const wordCount = activeContent.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = activeContent.split('\n').length;

  const formatCards: Array<{
    id: ExportFormat;
    title: string;
    extension: string;
    tagline: string;
    detail: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      id: 'pdf',
      title: 'Standard PDF',
      extension: '.pdf',
      tagline: 'Print & Application Ready',
      detail: 'Single-column A4 vector document formatted for recruiters and enterprise portals.',
      icon: FileCheck2,
    },
    {
      id: 'txt',
      title: 'ATS-Friendly TXT',
      extension: '.txt',
      tagline: '100% Parser Safe',
      detail: 'Pure ASCII plain text with zero tables or glyphs for Taleo, Workday & Naukri.',
      icon: FileText,
    },
    {
      id: 'markdown',
      title: 'Markdown',
      extension: '.md',
      tagline: 'Developer & Portfolio Ready',
      detail: 'Semantic headings and clean bullet lists for GitHub READMEs, Notion, or web.',
      icon: FileCode2,
    },
  ];

  const handleDownload = () => {
    setExportError(null);
    try {
      if (selectedFormat === 'pdf') {
        const result = generateAndDownloadAtsPdf({
          rawResumeText: rawText,
          score,
          assessment,
          suggestedBullets,
          includeScoreReport: includeScoreSummary,
        });
        setExportedFile(result.filename);
        onExportComplete?.('pdf', result.filename);
      } else if (selectedFormat === 'txt') {
        downloadTextFile(txtOutput.content, txtOutput.filename, 'text/plain;charset=utf-8');
        setExportedFile(txtOutput.filename);
        onExportComplete?.('txt', txtOutput.filename);
      } else {
        downloadTextFile(mdOutput.content, mdOutput.filename, 'text/markdown;charset=utf-8');
        setExportedFile(mdOutput.filename);
        onExportComplete?.('markdown', mdOutput.filename);
      }
    } catch (err: any) {
      setExportError(err?.message || 'Unable to generate export file.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setExportError('Clipboard access is unavailable in this browser.');
    }
  };

  const detectedSections = [
    parsed.summary ? 'Summary' : null,
    parsed.skillsText ? 'Skills' : null,
    parsed.experienceText ? 'Experience' : null,
    parsed.educationText ? 'Education' : null,
    ...parsed.additionalSections.map((s) => s.title),
  ].filter(Boolean) as string[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1017]/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-options-title"
        className="relative w-full max-w-3xl rounded-3xl border border-[#2B3340] bg-[#0C1017] p-5 sm:p-7 shadow-2xl my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#2B3340]/80 pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F7D07A]">
              Multi-Format Resume Export
            </p>
            <h2
              id="export-options-title"
              className="mt-1 text-xl sm:text-2xl font-bold text-[#F4F1EA] tracking-tight"
            >
              Export Options
            </h2>
            <p className="mt-0.5 text-xs text-[#949EB0] tabular-nums">
              {parsed.name} · {replacedCount} AI XYZ upgrade{replacedCount === 1 ? '' : 's'} integrated
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Export Options"
            className="rounded-xl bg-[#131924] border border-[#2B3340] p-2 text-[#949EB0] hover:text-[#F4F1EA] hover:border-[#FFB319]/40 transition shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selection Grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {formatCards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedFormat === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setSelectedFormat(card.id);
                  setExportedFile(null);
                  setExportError(null);
                }}
                className={`text-left rounded-2xl p-4 transition-all ${
                  isSelected
                    ? 'luxury-surface-gold ring-1 ring-[#FFB319]/40'
                    : 'luxury-surface hover:border-[#FFB319]/35'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      isSelected
                        ? 'bg-[#FFB319]/15 border-[#FFB319]/40 text-[#FFB319]'
                        : 'bg-[#0C1017] border-[#2B3340] text-[#949EB0]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isSelected ? 'text-[#F7D07A]' : 'text-[#6B768A]'
                    }`}
                  >
                    {card.extension}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-[#F4F1EA]">{card.title}</h3>
                <p className="mt-0.5 text-[11px] font-medium text-[#F7D07A]">{card.tagline}</p>
                <p className="mt-1.5 text-[11px] text-[#949EB0] leading-relaxed">{card.detail}</p>
              </button>
            );
          })}
        </div>

        {/* Configuration Toggle & File Metadata */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#2B3340] bg-[#131924]/75 px-4 py-3 text-xs">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-[#E5E8EE]">
            <input
              type="checkbox"
              checked={includeScoreSummary}
              onChange={(e) => setIncludeScoreSummary(e.target.checked)}
              className="h-4 w-4 rounded border-[#2B3340] bg-[#0C1017] accent-[#FFB319] cursor-pointer"
            />
            <span className="font-medium">Include AI Readiness Score summary</span>
          </label>

          <div className="flex items-center gap-2 text-[11px] text-[#949EB0] font-mono tabular-nums">
            <span className="truncate max-w-[230px] text-[#C6CCD8]">{activeFilename}</span>
            <span className="text-[#465063]">·</span>
            <span>{wordCount} words</span>
            <span className="text-[#465063]">·</span>
            <span>{lineCount} lines</span>
          </div>
        </div>

        {/* Format-Specific Preview Area */}
        <div className="mt-4">
          {selectedFormat === 'pdf' ? (
            <div className="rounded-2xl border border-[#2B3340] bg-[#131924]/60 p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#F4F1EA]">
                    Standard A4 Vector PDF Layout
                  </h4>
                  <p className="text-xs text-[#949EB0] mt-0.5">
                    Single-column Helvetica typography with crisp section rules and machine-selectable text.
                  </p>
                </div>

                {onOpenFullPdfPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenFullPdfPreview();
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#0C1017] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-3.5 py-2 text-xs font-semibold text-[#F7D07A] transition whitespace-nowrap shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#FFB319]" />
                    <span>Visual A4 Preview</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#2B3340]/80 text-xs">
                <div>
                  <span className="text-[11px] text-[#949EB0] block">Parsed Sections</span>
                  <span className="font-semibold text-[#E5E8EE]">
                    {detectedSections.join(' · ') || 'Full Document'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#949EB0] block">Paper Specification</span>
                  <span className="font-semibold text-[#E5E8EE] tabular-nums">A4 Portrait (210 × 297 mm)</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#949EB0] block">AI Score Header</span>
                  <span className="font-semibold text-[#F7D07A] tabular-nums">
                    {includeScoreSummary && score ? `Included (${score.overall}/100)` : 'Clean Resume Only'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#2B3340] bg-[#090C12] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#2B3340] bg-[#131924]/80 px-4 py-2 text-[11px] text-[#949EB0]">
                <span className="font-semibold text-[#C6CCD8]">
                  {selectedFormat === 'txt' ? 'Plain Text (.txt) Preview' : 'Markdown (.md) Preview'}
                </span>
                <span className="font-mono text-[#F7D07A]">UTF-8</span>
              </div>
              <pre className="max-h-56 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-[#E5E8EE] whitespace-pre-wrap">
                {activeContent}
              </pre>
            </div>
          )}
        </div>

        {/* Status Feedback */}
        {exportedFile && (
          <div className="mt-4 rounded-xl border border-[#FFB319]/40 bg-[#17120A]/90 px-4 py-2.5 text-xs text-[#FCE6A6] flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#FFB319] shrink-0" />
            <span>
              Downloaded <strong className="font-mono">{exportedFile}</strong> cleanly.
            </span>
          </div>
        )}

        {exportError && (
          <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/50 px-4 py-2.5 text-xs text-rose-200">
            {exportError}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-[#2B3340]/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-4 py-2.5 text-xs font-semibold text-[#E5E8EE] transition whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  Copied {selectedFormat === 'pdf' ? 'ATS Text' : selectedFormat.toUpperCase()}
                </span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-[#FFB319]" />
                <span>
                  Copy {selectedFormat === 'pdf' ? 'ATS Text' : selectedFormat === 'txt' ? 'Plain Text' : 'Markdown'}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] px-4 py-2.5 text-xs font-semibold text-[#C6CCD8] transition whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="luxury-gold-btn flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition active:scale-95 whitespace-nowrap"
            >
              <Download className="h-4 w-4 text-[#0C1017]" />
              <span>
                {selectedFormat === 'pdf'
                  ? 'Download Standard PDF'
                  : selectedFormat === 'txt'
                  ? 'Download ATS TXT'
                  : 'Download Markdown'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
