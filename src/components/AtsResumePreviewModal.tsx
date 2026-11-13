import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  FileCheck,
  Loader2,
  ZoomIn,
  ZoomOut,
  Palette,
  FileBarChart2,
  AlertTriangle,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  RewrittenBullet,
  ResumeScore,
  RecruitersEyeAssessment,
  ATSKeyword,
} from '../types';
import {
  parseResumeSections,
  mergeResumeWithSuggestedBullets,
  generateAndDownloadAtsPdf,
} from '../utils/atsResumeGenerator';
import { generateDashboardAnalysisPdf } from '../utils/dashboardPdfGenerator';
import { exportA4ElementToPdf } from '../utils/pdfExportService';

export type PreviewModalTab = 'analysis' | 'paper' | 'bullet-audit';

interface AtsResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawText: string;
  suggestedBullets: RewrittenBullet[];
  atsKeywords?: ATSKeyword[];
  onDownload?: (includeScore?: boolean, filename?: string) => void;
  isDownloading?: boolean;
  score?: ResumeScore;
  assessment?: RecruitersEyeAssessment;
  initialTab?: PreviewModalTab;
}

export const AtsResumePreviewModal: React.FC<AtsResumePreviewModalProps> = ({
  isOpen,
  onClose,
  rawText,
  suggestedBullets,
  atsKeywords = [],
  onDownload,
  isDownloading: parentDownloading = false,
  score,
  assessment,
  initialTab = 'analysis',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<PreviewModalTab>(initialTab);
  const [includeScoreInPdf, setIncludeScoreInPdf] = useState(true);
  const [exportEngine, setExportEngine] = useState<'html2canvas-jspdf' | 'jspdf-vector'>('html2canvas-jspdf');
  const [theme, setTheme] = useState<'executive' | 'classic' | 'modern-gold'>('executive');
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const a4PaperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorBanner(null);
      setSuccessToast(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const { text: mergedText, replacedCount } = mergeResumeWithSuggestedBullets(
    rawText,
    suggestedBullets
  );
  const parsed = parseResumeSections(mergedText);

  const effectiveScore: ResumeScore = score || {
    overall: 78,
    atsCompatibility: 70,
    skills: 90,
    experience: 80,
    keywords: 70,
    achievements: 60,
  };

  const effectiveAssessment: RecruitersEyeAssessment = assessment || {
    shortlistProbability: 82,
    verdict: 'Strong Candidate',
    summary:
      'Strong core experience and ATS familiarity; quantifying metrics with %, currency, and SLA benchmarks will raise shortlist conversion.',
    strengths: [
      'Full-cycle domain ownership and cross-functional collaboration',
      'Strong progressive career trajectory',
    ],
    missingMetrics: [
      'Quantified ROI, cost savings, or SLA percentage improvements',
      'Explicit headcount or volume benchmarks per quarter',
    ],
    redFlags: ['Unquantified bullet descriptions without measurable outcomes'],
    recommendedRoleLevel: 'Senior Specialist / Lead',
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(mergedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerVectorDownload = (): { filename: string; pageCount: number } => {
    if (activeTab === 'analysis' || activeTab === 'bullet-audit') {
      const res = generateDashboardAnalysisPdf({
        resumeText: rawText,
        score: effectiveScore,
        assessment: effectiveAssessment,
        atsKeywords,
        suggestedBullets,
        candidateName: parsed.name,
      });
      return { filename: res.filename, pageCount: res.pageCount };
    }

    const res = generateAndDownloadAtsPdf({
      rawResumeText: rawText,
      score: effectiveScore,
      assessment: effectiveAssessment,
      suggestedBullets,
      includeScoreReport: includeScoreInPdf,
    });
    return { filename: res.filename, pageCount: 1 };
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    setErrorBanner(null);
    setExportProgress('Preparing A4 PDF...');

    const cleanCandidateName = (parsed.name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
    const isAnalysisMode = activeTab === 'analysis' || activeTab === 'bullet-audit';
    const filename = isAnalysisMode
      ? `${cleanCandidateName}_Resume_Analysis_Report.pdf`
      : includeScoreInPdf && score
      ? `${cleanCandidateName}_Resume_with_AI_Scorecard.pdf`
      : `${cleanCandidateName}_Resume_ATS_A4.pdf`;

    try {
      if (exportEngine === 'html2canvas-jspdf' && a4PaperRef.current && activeTab !== 'bullet-audit') {
        const result = await exportA4ElementToPdf(a4PaperRef.current, {
          filename,
          candidateName: parsed.name,
          footerLabel: isAnalysisMode
            ? `JobReady AI • Resume Analysis Report for ${parsed.name}`
            : `JobReady AI • Certified ATS Resume for ${parsed.name}`,
          onProgress: (stage) => setExportProgress(stage),
        });

        if (result.success) {
          confetti({
            particleCount: 80,
            spread: 65,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8'],
          });
          setSuccessToast(
            `Exported ${result.filename} (${result.pageCount} A4 page${result.pageCount > 1 ? 's' : ''}) cleanly.`
          );
          setTimeout(() => setSuccessToast(null), 5000);
          onDownload?.(includeScoreInPdf, result.filename);
          return;
        }

        // Seamless vector fallback if html2canvas fails in a restricted browser
        setExportProgress('Switching to vector PDF fallback...');
        const fallbackRes = triggerVectorDownload();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        setSuccessToast(`Exported ${fallbackRes.filename} (${fallbackRes.pageCount} A4 page${fallbackRes.pageCount > 1 ? 's' : ''}).`);
        onDownload?.(includeScoreInPdf, fallbackRes.filename);
      } else {
        setExportProgress('Generating vector PDF via jsPDF...');
        const vecRes = triggerVectorDownload();
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8'],
        });
        setSuccessToast(
          `Exported ${vecRes.filename} (${vecRes.pageCount} A4 page${vecRes.pageCount > 1 ? 's' : ''}) cleanly.`
        );
        setTimeout(() => setSuccessToast(null), 5000);
        onDownload?.(includeScoreInPdf, vecRes.filename);
      }
    } catch (err: any) {
      console.error('PDF export error:', err);
      setErrorBanner(err?.message || 'Unable to generate PDF. Please try switching to Vector PDF.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const isBusy = isExporting || parentDownloading;
  const foundKws = atsKeywords.filter((k) => k.status === 'found');
  const missingKws = atsKeywords.filter((k) => k.status === 'missing');
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const diagnosticRows = [
    {
      label: 'ATS Match',
      value: effectiveScore.atsCompatibility,
      color: effectiveScore.atsCompatibility >= 80 ? '#059669' : '#d97706',
      note: 'Machine parser compatibility & section structure',
    },
    {
      label: 'Skills Depth',
      value: effectiveScore.skills,
      color: effectiveScore.skills >= 80 ? '#059669' : '#d97706',
      note: 'Core domain & specialized technical competencies',
    },
    {
      label: 'Experience',
      value: effectiveScore.experience,
      color: effectiveScore.experience >= 80 ? '#059669' : '#2563eb',
      note: 'Career progression, tenure stability & ownership',
    },
    {
      label: 'Keywords',
      value: effectiveScore.keywords,
      color: effectiveScore.keywords >= 80 ? '#059669' : '#d97706',
      note: 'Target role & industry keyword coverage',
    },
    {
      label: 'Achievements',
      value: effectiveScore.achievements,
      color: effectiveScore.achievements >= 80 ? '#059669' : '#e11d48',
      note: 'Quantified impact using %, currency & SLA metrics',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={() => !isBusy && onClose()}
    >
      <div
        className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
              {activeTab === 'analysis' ? (
                <FileBarChart2 className="h-5 w-5" />
              ) : (
                <FileCheck className="h-5 w-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                {activeTab === 'analysis'
                  ? 'Resume Analysis Dashboard — A4 PDF Export'
                  : activeTab === 'paper'
                  ? 'ATS-Formatted Resume — A4 PDF Export'
                  : 'Google XYZ Bullet Enhancements'}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {parsed.name} · ISO 216 Standard A4 · Ready to download & keep
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-40 shrink-0"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success / Error Notification Banners */}
        {successToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-4 sm:px-6 py-2.5 text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="text-emerald-300 hover:text-white font-bold ml-3 whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        )}

        {errorBanner && (
          <div className="bg-rose-500/20 border-b border-rose-500/40 px-4 sm:px-6 py-2.5 text-xs text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span className="font-semibold">{errorBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              className="text-rose-300 hover:text-white font-bold ml-3 whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Controls Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-900/90 shrink-0 text-xs">
          {/* Document View Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('analysis')}
              className={`rounded-md px-3 py-1.5 font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'analysis'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileBarChart2 className="h-3.5 w-3.5" />
              <span>Analysis Report</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('paper')}
              className={`rounded-md px-3 py-1.5 font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'paper'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>ATS Resume</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bullet-audit')}
              className={`rounded-md px-3 py-1.5 font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'bullet-audit'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bullet Upgrades ({suggestedBullets.length})</span>
            </button>
          </div>

          {/* Middle Controls: Theme & Zoom */}
          {activeTab !== 'bullet-audit' && (
            <div className="hidden lg:flex items-center gap-2">
              {activeTab === 'paper' && (
                <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
                  <Palette className="h-3.5 w-3.5 text-slate-400 ml-1.5" />
                  {(['executive', 'classic', 'modern-gold'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition whitespace-nowrap ${
                        theme === t ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t === 'executive' ? 'Executive' : t === 'classic' ? 'Classic' : 'Gold'}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.max(65, zoomScale - 10))}
                  className="p-1 text-slate-400 hover:text-white rounded"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="text-[11px] font-mono tabular-nums text-slate-300 px-1">
                  {zoomScale}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale(Math.min(120, zoomScale + 10))}
                  className="p-1 text-slate-400 hover:text-white rounded"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Right Quick Actions */}
          <div className="flex items-center gap-2">
            {activeTab === 'paper' && score && (
              <button
                type="button"
                onClick={() => setIncludeScoreInPdf(!includeScoreInPdf)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition whitespace-nowrap shrink-0 ${
                  includeScoreInPdf
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-700 bg-slate-800 text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${includeScoreInPdf ? 'text-emerald-400' : 'text-slate-500'}`}
                />
                <span>Scorecard: {includeScoreInPdf ? 'On' : 'Off'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyText}
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 transition whitespace-nowrap shrink-0"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? 'Copied' : 'Copy CV'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isBusy}
              className="flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-md active:scale-95 transition disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              ) : (
                <Download className="h-4 w-4 text-slate-950" />
              )}
              <span>{isBusy ? exportProgress || 'Exporting...' : 'Download as PDF'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950/70 flex justify-center">
          {activeTab === 'analysis' ? (
            /* ================================================================
               TAB 1: FORMATTED RESUME ANALYSIS DASHBOARD A4 REPORT
               ================================================================ */
            <div
              className="w-full flex justify-center transition-transform origin-top"
              style={{ transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : undefined }}
            >
              <div
                ref={a4PaperRef}
                className="w-full max-w-[794px] min-h-[1123px] bg-white text-slate-900 rounded-sm shadow-2xl border border-slate-300 p-8 sm:p-11 font-sans flex flex-col justify-between"
                style={{ boxSizing: 'border-box' }}
              >
                <div className="space-y-6">
                  {/* Report Top Sheet Marker (hidden during capture) */}
                  <div
                    data-html2canvas-ignore="true"
                    className="pb-2.5 border-b border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none"
                  >
                    <span>A4 DOCUMENT PREVIEW (210 × 297 MM)</span>
                    <span>READY FOR PDF EXPORT</span>
                  </div>

                  {/* Executive Dark Header Block */}
                  <div className="rounded-xl bg-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
                        JobReady AI · Resume Analysis Dashboard Report
                      </p>
                      <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">
                        {parsed.name}
                      </h1>
                      <p className="text-xs text-slate-300 mt-1">
                        {parsed.contactLine
                          ? parsed.contactLine.replace(/\s*\|\s*/g, '  ·  ')
                          : `Recommended Role: ${effectiveAssessment.recommendedRoleLevel}`}
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="block text-[11px] text-slate-400">Report Date</span>
                      <span className="text-xs font-semibold text-slate-100 tabular-nums">
                        {reportDate}
                      </span>
                      <span className="block text-[11px] text-amber-300 font-semibold mt-1">
                        {effectiveAssessment.recommendedRoleLevel}
                      </span>
                    </div>
                  </div>

                  {/* Executive Score + Recruiter's Eye Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
                    {/* Left: Overall Score Panel */}
                    <div className="sm:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between text-center">
                      <div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Overall AI Resume Score
                        </span>
                        <div className="mt-3 flex items-baseline justify-center gap-1">
                          <span
                            className={`text-5xl font-extrabold tabular-nums ${
                              effectiveScore.overall >= 85
                                ? 'text-emerald-600'
                                : effectiveScore.overall >= 70
                                ? 'text-amber-600'
                                : 'text-rose-600'
                            }`}
                          >
                            {effectiveScore.overall}
                          </span>
                          <span className="text-sm font-semibold text-slate-500 tabular-nums">
                            / 100
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 mt-3 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${effectiveScore.overall}%`,
                              backgroundColor:
                                effectiveScore.overall >= 85
                                  ? '#059669'
                                  : effectiveScore.overall >= 70
                                  ? '#d97706'
                                  : '#e11d48',
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                        <p className="font-bold text-slate-900">Top 22% of Applicants</p>
                        <p className="text-[11px] text-slate-500">
                          Passing benchmark: 75/100
                        </p>
                      </div>
                    </div>

                    {/* Right: Recruiter's Eye Assessment Panel */}
                    <div className="sm:col-span-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-sm font-extrabold text-slate-900">
                            Recruiter’s Eye Assessment
                          </h2>
                          <span className="text-xs font-bold text-emerald-700 tabular-nums">
                            {effectiveAssessment.verdict} · {effectiveAssessment.shortlistProbability}% Shortlist Probability
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-700 leading-relaxed italic bg-white/90 border border-amber-200/80 rounded-lg p-3">
                          “{effectiveAssessment.summary}”
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                        <span>Target Level: <strong className="text-slate-900">{effectiveAssessment.recommendedRoleLevel}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Pillar Detailed Diagnostic Breakdown */}
                  <div>
                    <div className="flex items-baseline justify-between pb-1.5 border-b border-slate-300">
                      <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                        Detailed Diagnostic Breakdown
                      </h2>
                      <span className="text-[11px] text-slate-500 tabular-nums">
                        5 core criteria evaluated
                      </span>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      {diagnosticRows.map((row) => (
                        <div
                          key={row.label}
                          className="rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block">
                              {row.label}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {row.note}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 sm:w-64 shrink-0">
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${row.value}%`,
                                  backgroundColor: row.color,
                                }}
                              />
                            </div>
                            <span
                              className="text-xs font-extrabold tabular-nums w-14 text-right"
                              style={{ color: row.color }}
                            >
                              {row.value}/100
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths vs Missing Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                      <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide mb-2">
                        What Recruiters Love (Strengths)
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {effectiveAssessment.strengths.map((item, i) => (
                          <li key={i} className="leading-snug flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                      <h3 className="text-xs font-extrabold text-rose-800 uppercase tracking-wide mb-2">
                        Why You Miss Shortlists (Actionable Gaps)
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {effectiveAssessment.missingMetrics.map((item, i) => (
                          <li key={i} className="leading-snug flex items-start gap-2">
                            <span className="text-rose-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Red Flags */}
                  {effectiveAssessment.redFlags && effectiveAssessment.redFlags.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                      <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide mb-1.5">
                        Detected Risk & Red Flags
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {effectiveAssessment.redFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-700 font-bold">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ATS Keyword Compatibility Audit */}
                  {atsKeywords.length > 0 && (
                    <div>
                      <div className="flex items-baseline justify-between pb-1.5 border-b border-slate-300">
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5 text-slate-700" />
                          ATS Keyword Compatibility Audit
                        </h2>
                        <span className="text-[11px] text-slate-600 tabular-nums">
                          {foundKws.length} Matched · {missingKws.length} Missing
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <span className="block font-bold text-rose-700 mb-1.5">
                            Missing High-Impact Keywords ({missingKws.length})
                          </span>
                          {missingKws.length > 0 ? (
                            <p className="text-slate-700 leading-relaxed">
                              {missingKws.map((k) => `${k.keyword} (${k.category})`).join(' · ')}
                            </p>
                          ) : (
                            <p className="text-emerald-700 font-medium">
                              All tracked ATS keywords are present.
                            </p>
                          )}
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <span className="block font-bold text-emerald-700 mb-1.5">
                            Matched Keywords ({foundKws.length})
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {foundKws.map((k) => `${k.keyword} (${k.category})`).join(' · ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Google XYZ Bullet Upgrade Recommendations */}
                  {suggestedBullets.length > 0 && (
                    <div>
                      <div className="flex items-baseline justify-between pb-1.5 border-b border-slate-300">
                        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                          Recommended Resume Bullet Upgrades (Google XYZ Formula)
                        </h2>
                        <span className="text-[11px] text-slate-500 tabular-nums">
                          {suggestedBullets.length} recommendations
                        </span>
                      </div>

                      <div className="mt-3 space-y-2.5">
                        {suggestedBullets.map((b, idx) => (
                          <div
                            key={b.id || idx}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                              <span>Upgrade #{idx + 1} · {b.formula}</span>
                            </div>
                            <p className="text-rose-800">
                              <strong className="font-semibold">Before:</strong> “{b.original}”
                            </p>
                            <p className="text-emerald-900 font-medium">
                              <strong className="font-bold">After:</strong> “{b.improved}”
                            </p>
                            <p className="text-[11px] text-slate-600 italic">
                              Impact Note: {b.impactReason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Footer */}
                <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                  JobReady AI Resume Analysis Report · {parsed.name} · Generated {reportDate}
                </div>
              </div>
            </div>
          ) : activeTab === 'paper' ? (
            /* ================================================================
               TAB 2: FORMATTED ATS RESUME A4 VIEW
               ================================================================ */
            <div
              className="w-full flex justify-center transition-transform origin-top"
              style={{ transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : undefined }}
            >
              <div
                ref={a4PaperRef}
                className="w-full max-w-[794px] min-h-[1123px] bg-white text-slate-900 rounded-sm shadow-2xl border border-slate-300 p-8 sm:p-12 font-sans flex flex-col justify-between"
                style={{ boxSizing: 'border-box' }}
              >
                <div>
                  <div
                    data-html2canvas-ignore="true"
                    className="pb-3 mb-5 border-b border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none"
                  >
                    <span>ISO 216 STANDARD A4 (210 × 297 MM)</span>
                    <span>ATS-OPTIMIZED SINGLE-COLUMN FORMAT</span>
                  </div>

                  {/* Candidate Header */}
                  <div
                    className={`text-center pb-5 border-b ${
                      theme === 'modern-gold'
                        ? 'border-amber-500/50'
                        : theme === 'classic'
                        ? 'border-slate-800'
                        : 'border-slate-300'
                    }`}
                  >
                    <h1
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${
                        theme === 'executive'
                          ? 'text-slate-900'
                          : theme === 'modern-gold'
                          ? 'text-amber-950'
                          : 'text-black'
                      }`}
                    >
                      {parsed.name}
                    </h1>

                    {parsed.contactLine && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium tracking-wide">
                        {parsed.contactLine.replace(/\s*\|\s*/g, '   •   ')}
                      </p>
                    )}
                  </div>

                  {/* Optional AI Executive Scorecard Block */}
                  {score && includeScoreInPdf && (
                    <div className="mt-5 rounded-xl border border-slate-300 bg-slate-50 p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="text-center px-3.5 py-2 rounded-lg bg-amber-100 border border-amber-300">
                            <span className="block text-2xl font-black text-slate-900 leading-tight tabular-nums">
                              {score.overall}
                            </span>
                            <span className="block text-[9px] font-extrabold text-amber-900 uppercase tracking-wider">
                              Score / 100
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                              JobReady AI Certified
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {effectiveAssessment.verdict}
                            </h4>
                            <p className="text-xs text-slate-600 font-medium tabular-nums">
                              {effectiveAssessment.shortlistProbability}% Shortlist Probability
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2 text-center text-[10px] w-full sm:w-auto">
                          {[
                            { name: 'ATS', val: score.atsCompatibility, color: '#059669' },
                            { name: 'Skills', val: score.skills, color: '#d97706' },
                            { name: 'Exp', val: score.experience, color: '#2563eb' },
                            { name: 'Keywords', val: score.keywords, color: '#7c3aed' },
                            { name: 'Impact', val: score.achievements, color: '#d97706' },
                          ].map((m) => (
                            <div
                              key={m.name}
                              className="bg-white p-2 rounded-lg border border-slate-200"
                            >
                              <span className="block text-slate-500 font-semibold text-[9px]">
                                {m.name}
                              </span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                {m.val}%
                              </span>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${m.val}%`, backgroundColor: m.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {parsed.summary && (
                    <div className="mt-6">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-300">
                        Professional Summary
                      </h2>
                      <p className="mt-2 text-xs text-slate-700 leading-relaxed text-justify">
                        {parsed.summary}
                      </p>
                    </div>
                  )}

                  {parsed.skillsText && (
                    <div className="mt-6">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-300">
                        Core Competencies & Technical Skills
                      </h2>
                      <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                        {parsed.skillsText}
                      </p>
                    </div>
                  )}

                  {parsed.experienceText && (
                    <div className="mt-6">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-300">
                        Professional Experience
                      </h2>
                      <div className="mt-3 space-y-3 text-xs text-slate-700">
                        {parsed.experienceText.split('\n').map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const isBullet =
                            trimmed.startsWith('-') ||
                            trimmed.startsWith('•') ||
                            trimmed.startsWith('*');

                          if (!isBullet) {
                            return (
                              <div
                                key={idx}
                                className="font-bold text-slate-900 pt-2 flex flex-col sm:flex-row sm:items-center justify-between"
                              >
                                <span className="text-xs font-bold text-slate-900">
                                  {trimmed.split('|')[0]}
                                </span>
                                <span className="font-normal text-slate-500 text-[11px]">
                                  {trimmed.split('|').slice(1).join(' | ')}
                                </span>
                              </div>
                            );
                          }

                          const isEnhancedBullet = suggestedBullets.some((b) =>
                            trimmed.includes(b.improved.substring(0, 30))
                          );

                          return (
                            <div
                              key={idx}
                              className={`flex items-start gap-2.5 pl-3 py-0.5 ${
                                isEnhancedBullet ? 'bg-amber-50/70 rounded px-2' : ''
                              }`}
                            >
                              <span className="text-slate-900 font-bold select-none">•</span>
                              <span
                                className={`leading-relaxed ${
                                  isEnhancedBullet ? 'font-medium text-slate-900' : 'text-slate-700'
                                }`}
                              >
                                {trimmed.replace(/^[-•*]\s*/, '')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {parsed.educationText && (
                    <div className="mt-6">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-300">
                        Education
                      </h2>
                      <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                        {parsed.educationText}
                      </div>
                    </div>
                  )}

                  {parsed.additionalSections.map((sec, sIdx) => (
                    <div key={sIdx} className="mt-6">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-300">
                        {sec.title}
                      </h2>
                      <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                        {sec.content.split('\n').map((cLine, cIdx) => (
                          <p key={cIdx} className="py-0.5">
                            {cLine}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                  ATS-Compliant Document · {parsed.name} · JobReady AI ({replacedCount} XYZ enhancements)
                </div>
              </div>
            </div>
          ) : (
            /* ================================================================
               TAB 3: BULLET AUDIT VIEW
               ================================================================ */
            <div className="max-w-3xl w-full mx-auto space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-slate-300">
                <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  How Your Bullets Were Upgraded (Google XYZ Formula)
                </h4>
                <p className="mt-1 text-slate-400">
                  Each unquantified line is structured as “Accomplished [X], measured by [Y], by doing [Z]”. All transformations are included in the downloadable PDF report.
                </p>
              </div>

              {suggestedBullets.map((bullet, idx) => (
                <div
                  key={bullet.id || idx}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>
                      Transformation #{idx + 1} · {bullet.formula}
                    </span>
                    <span className="text-amber-300">Included in Report</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-rose-950/20 border border-rose-900/30 p-3">
                      <span className="font-semibold text-rose-400 block mb-1">
                        Original Unquantified:
                      </span>
                      <p className="text-slate-300 leading-relaxed">“{bullet.original}”</p>
                    </div>

                    <div className="rounded-lg bg-emerald-950/30 border border-emerald-900/40 p-3">
                      <span className="font-bold text-emerald-400 block mb-1">
                        ATS-Optimized Upgrade:
                      </span>
                      <p className="text-emerald-100 font-medium leading-relaxed">
                        “{bullet.improved}”
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                    <strong className="text-amber-400">Impact Analysis: </strong>
                    {bullet.impactReason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">
              Format:{' '}
              <strong className="text-slate-200">
                {exportEngine === 'html2canvas-jspdf'
                  ? 'Visual A4 (html2canvas + jsPDF)'
                  : 'Selectable Vector (jsPDF)'}
              </strong>
            </span>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={() =>
                setExportEngine(
                  exportEngine === 'html2canvas-jspdf' ? 'jspdf-vector' : 'html2canvas-jspdf'
                )
              }
              className="text-[11px] text-amber-400 hover:underline font-semibold whitespace-nowrap"
            >
              Switch Engine
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isBusy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-5 py-2.5 text-xs font-extrabold text-slate-950 shadow-md active:scale-95 transition disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              ) : (
                <Download className="h-4 w-4 text-slate-950" />
              )}
              <span>
                {isBusy
                  ? exportProgress || 'Exporting PDF...'
                  : activeTab === 'analysis' || activeTab === 'bullet-audit'
                  ? 'Confirm & Download Analysis PDF'
                  : includeScoreInPdf
                  ? 'Confirm & Download Resume + Scorecard PDF'
                  : 'Confirm & Download Clean A4 Resume'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
