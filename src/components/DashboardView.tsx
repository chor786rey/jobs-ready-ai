import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  animate,
} from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Eye,
  TrendingUp,
  Target,
  Briefcase,
  FileText,
  MessageSquare,
  Download,
  Check,
  ShieldCheck,
  FileBarChart2,
} from 'lucide-react';
import {
  ResumeScore,
  RecruitersEyeAssessment,
  ActiveTab,
  RewrittenBullet,
  ATSKeyword,
} from '../types';
import {
  INITIAL_RESUME_TEXT,
  SAMPLE_REWRITTEN_BULLETS,
  SAMPLE_ATS_KEYWORDS,
} from '../data/sampleData';
import { AtsResumePreviewModal, PreviewModalTab } from './AtsResumePreviewModal';
import { ExportOptionsModal, ExportFormat } from './ExportOptionsModal';

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const AnimatedScoreValue: React.FC<{ value: number; suffix?: string; className?: string }> = ({
  value,
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const currentValRef = useRef(0);

  useEffect(() => {
    const controls = animate(currentValRef.current, value, {
      duration: 0.9,
      ease: LUXURY_EASE,
      onUpdate: (latest) => {
        currentValRef.current = latest;
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        currentValRef.current = value;
        setDisplayValue(value);
      },
    });
    return () => {
      controls.stop();
    };
  }, [value]);

  return (
    <span className={`tabular-nums ${className}`}>
      {displayValue}
      {suffix}
    </span>
  );
};

interface DashboardViewProps {
  score: ResumeScore;
  assessment: RecruitersEyeAssessment;
  onNavigate: (tab: ActiveTab) => void;
  onOpenPricing: () => void;
  resumeText?: string;
  suggestedBullets?: RewrittenBullet[];
  atsKeywords?: ATSKeyword[];
  currentUser?: any;
  onSaveToCloud?: () => void;
  isCloudSaving?: boolean;
  cloudSaveMessage?: string | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  score,
  assessment,
  onNavigate,
  onOpenPricing,
  resumeText = INITIAL_RESUME_TEXT,
  suggestedBullets = SAMPLE_REWRITTEN_BULLETS,
  atsKeywords = SAMPLE_ATS_KEYWORDS,
  currentUser,
  onSaveToCloud,
  isCloudSaving = false,
  cloudSaveMessage = null,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportOptionsOpen, setIsExportOptionsOpen] = useState(false);
  const [previewInitialTab, setPreviewInitialTab] = useState<PreviewModalTab>('analysis');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400 stroke-emerald-400';
    if (val >= 70) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (score.overall / 100) * circumference;

  const diagnosticMetrics = [
    {
      key: 'ats',
      label: 'ATS Match',
      value: score.atsCompatibility,
      valueClass: 'text-[#FFB319]',
      barClass: 'bg-gradient-to-r from-[#FFB319] to-[#F59E0B]',
      note: 'Missing 4 critical role keywords',
    },
    {
      key: 'skills',
      label: 'Skills Depth',
      value: score.skills,
      valueClass: 'text-emerald-400',
      barClass: 'bg-emerald-400',
      note: 'Strong core competencies',
    },
    {
      key: 'experience',
      label: 'Experience',
      value: score.experience,
      valueClass: 'text-[#F7D07A]',
      barClass: 'bg-gradient-to-r from-[#FCE6A6] to-[#FFB319]',
      note: 'Relevant progression & stability',
    },
    {
      key: 'keywords',
      label: 'Keywords',
      value: score.keywords,
      valueClass: 'text-[#FFB319]',
      barClass: 'bg-gradient-to-r from-[#FFB319] to-[#F59E0B]',
      note: 'Needs ATS keyword enrichment',
    },
    {
      key: 'achievements',
      label: 'Achievements',
      value: score.achievements,
      valueClass: 'text-rose-400',
      barClass: 'bg-rose-400',
      note: 'Needs %, ₹, & SLA metrics',
    },
  ];

  const openPdfPreview = (tab: PreviewModalTab) => {
    setPreviewInitialTab(tab);
    setIsPreviewOpen(true);
  };

  const handleDownloadSuccess = (includeScore = true, filename?: string) => {
    const docLabel = filename ? `(${filename})` : includeScore ? 'with AI Scorecard' : 'Clean A4 Document';
    setDownloadSuccessToast(
      `Saved formatted PDF ${docLabel} with your ${score.overall}/100 Resume Analysis & upgrades.`
    );

    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 5500);
  };

  const handleMultiFormatExportComplete = (format: ExportFormat, filename: string) => {
    const label = format === 'pdf' ? 'PDF' : format === 'txt' ? 'ATS Plain Text' : 'Markdown';
    setDownloadSuccessToast(`Exported ${label} resume (${filename}) with AI upgrades.`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 5500);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full space-y-6">
        {/* Toast Notification for Download Success */}
        <AnimatePresence>
          {downloadSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: LUXURY_EASE }}
              className="rounded-xl border border-[#FFB319]/40 bg-[#17120A]/90 p-3.5 text-xs text-[#FCE6A6] flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#FFB319] shrink-0" />
                <span className="font-semibold">{downloadSuccessToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setDownloadSuccessToast(null)}
                className="text-[#F7D07A] hover:text-white font-bold ml-3 text-xs whitespace-nowrap"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Cloud Firestore Sync Status Bar */}
      <div className="rounded-xl border border-[#2B3340] bg-[#131924]/90 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full shrink-0 ${currentUser ? 'bg-emerald-400' : 'bg-[#FFB319]'}`} />
          <span className="font-medium text-[#C6CCD8]">
            {currentUser ? (
              <>
                Cloud Database Connected: <span className="text-[#F7D07A] font-semibold">{currentUser.displayName || currentUser.email}</span>
              </>
            ) : (
              'Cloud Database Ready · Sign in with Google to sync your resume scores across devices'
            )}
          </span>
          {cloudSaveMessage && (
            <span className="ml-2 text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> {cloudSaveMessage}
            </span>
          )}
        </div>
        {currentUser && onSaveToCloud && (
          <button
            type="button"
            onClick={onSaveToCloud}
            disabled={isCloudSaving}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1D2533] hover:bg-[#2B3340] border border-[#2B3340] text-[#E5E8EE] font-semibold transition active:scale-95 disabled:opacity-50 text-[11px] whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#FFB319]" />
            <span>{isCloudSaving ? 'Saving to Cloud...' : 'Sync Resume to Cloud'}</span>
          </button>
        )}
      </div>

      {/* Dashboard Header Action Strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: LUXURY_EASE }}
        className="luxury-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl px-5 py-4"
      >
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#F4F1EA] tracking-tight">
            Resume Analysis Dashboard
          </h2>
          <p className="text-xs text-[#949EB0] mt-0.5 tabular-nums">
            Score{' '}
            <span className="text-[#F7D07A] font-semibold">
              <AnimatedScoreValue value={score.overall} suffix="/100" />
            </span>{' '}
            · <AnimatedScoreValue value={assessment.shortlistProbability} suffix="%" /> Shortlist Probability · {assessment.verdict}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => openPdfPreview('paper')}
            className="flex items-center gap-1.5 rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-3.5 py-2 text-xs font-semibold text-[#E5E8EE] transition whitespace-nowrap shrink-0"
          >
            <Eye className="h-3.5 w-3.5 text-[#FFB319]" />
            <span>ATS Resume</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportOptionsOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-3.5 py-2 text-xs font-semibold text-[#F7D07A] transition whitespace-nowrap shrink-0"
          >
            <FileText className="h-3.5 w-3.5 text-[#FFB319]" />
            <span>Export Options</span>
          </button>

          <button
            type="button"
            onClick={() => openPdfPreview('analysis')}
            className="luxury-gold-btn flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4 text-[#0C1017]" />
            <span>Download as PDF</span>
          </button>
        </div>
      </motion.div>

      {/* Top Banner: Overall Score & Recruiter's Eye probability */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.05, ease: LUXURY_EASE }}
          whileHover={{ y: -2, transition: { duration: 0.18, ease: LUXURY_EASE } }}
          className="md:col-span-5 luxury-surface-gold rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-10 right-0 w-36 h-36 bg-[#FFB319]/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F7D07A]">
            Overall AI Resume Score
          </span>

          {/* Animated Circular Gauge matched to Logo.tsx (#2B3340 track + #FFB319 -> #F59E0B gold) */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="scoreGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FCE6A6" />
                  <stop offset="50%" stopColor="#FFB319" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#2B3340"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                stroke={score.overall >= 70 ? 'url(#scoreGoldGrad)' : undefined}
                className={score.overall >= 70 ? '' : getScoreColor(score.overall)}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.05, delay: 0.12, ease: LUXURY_EASE }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <AnimatedScoreValue
                value={score.overall}
                className="text-4xl font-extrabold text-[#F4F1EA] tracking-tight"
              />
              <span className="text-[11px] font-medium text-[#949EB0] tabular-nums">/100</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F7D07A]">
            <TrendingUp className="h-3.5 w-3.5 text-[#FFB319]" />
            <span>Top 22% of Applicants</span>
          </div>

          <p className="mt-2.5 text-xs text-[#C6CCD8] max-w-xs leading-relaxed">
            Passing threshold is 75/100. Optimizing your unquantified achievements will boost your score past 88.
          </p>

          {/* Dual Action Buttons: Download Analysis as PDF & Improve CV */}
          <div className="mt-5 w-full flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => openPdfPreview('analysis')}
              className="luxury-gold-btn flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition active:scale-95 whitespace-nowrap"
              title="Preview resume analysis report and download as PDF"
            >
              <FileBarChart2 className="h-4 w-4 text-[#0C1017]" />
              <span>Download as PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('rewriter')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-3.5 py-2.5 text-xs font-semibold text-[#E5E8EE] transition active:scale-95 whitespace-nowrap"
            >
              <span>Improve CV</span>
              <ArrowRight className="h-4 w-4 text-[#FFB319]" />
            </button>
          </div>
        </motion.div>

        {/* Recruiter's Eye™ Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, delay: 0.11, ease: LUXURY_EASE }}
          whileHover={{ y: -2, transition: { duration: 0.18, ease: LUXURY_EASE } }}
          className="md:col-span-7 luxury-surface rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
        >
          <div className="absolute -bottom-16 -right-12 w-48 h-48 bg-[#FFB319]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB319]/12 border border-[#FFB319]/30 text-[#FFB319]">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F4F1EA] tracking-tight">
                    Recruiter&rsquo;s Eye™
                  </h3>
                  <p className="text-xs text-[#949EB0]">Proprietary Assessment · Shortlist Simulation</p>
                </div>
              </div>
            </div>

            {/* Shortlist Probability */}
            <div className="mt-4 flex items-baseline gap-3">
              <AnimatedScoreValue
                value={assessment.shortlistProbability}
                suffix="%"
                className="text-3xl sm:text-4xl font-extrabold luxury-gold-text"
              />
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-[#F7D07A]">{assessment.verdict}</span>
                  <span className="text-[#465063]">·</span>
                  <span className="text-[#949EB0]">Shortlist Probability</span>
                </div>
                <p className="text-[11px] text-[#949EB0] mt-0.5">
                  Recommended Level: <strong className="text-[#E5E8EE]">{assessment.recommendedRoleLevel}</strong>
                </p>
              </div>
            </div>

            {/* Human Recruiter Verdict */}
            <div className="mt-3.5 rounded-xl bg-[#0C1017]/80 border border-[#2B3340] p-3.5">
              <p className="text-xs italic text-[#C6CCD8] leading-relaxed">
                &ldquo;{assessment.summary}&rdquo;
              </p>
            </div>

            {/* Quick Strengths & Deficits */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#0C1017]/60 border border-emerald-500/20 p-3">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> What Recruiters Love
                </span>
                <ul className="space-y-1 text-[#C6CCD8] text-[11px]">
                  {assessment.strengths.slice(0, 2).map((s, i) => (
                    <li key={i} className="leading-snug">• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-[#0C1017]/60 border border-[#FFB319]/25 p-3">
                <span className="font-semibold text-[#F7D07A] flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#FFB319]" /> Why You Miss Shortlists
                </span>
                <ul className="space-y-1 text-[#C6CCD8] text-[11px]">
                  {assessment.missingMetrics.slice(0, 2).map((m, i) => (
                    <li key={i} className="leading-snug">• {m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2B3340]/80 flex items-center justify-between relative">
            <span className="text-xs text-[#949EB0]">Unlock full recruiter review</span>
            <button
              type="button"
              onClick={onOpenPricing}
              className="text-xs font-semibold text-[#F7D07A] hover:text-[#FCE6A6] underline decoration-[#FFB319]/40 underline-offset-4 transition whitespace-nowrap"
            >
              View Pro Tier (₹199) →
            </button>
          </div>
        </motion.div>
      </div>

      {/* 5 Core Metric Progress Bars */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, delay: 0.16, ease: LUXURY_EASE }}
        className="luxury-surface rounded-2xl p-5 sm:p-6 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-xs font-semibold text-[#F4F1EA] uppercase tracking-[0.14em]">
            Detailed Diagnostic Breakdown
          </h4>
          <span className="text-xs font-medium text-[#949EB0] tabular-nums">5 criteria checked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {diagnosticMetrics.map((metric, idx) => (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.18 + idx * 0.055,
                ease: LUXURY_EASE,
              }}
              whileHover={{
                y: -2,
                borderColor: 'rgba(255, 179, 25, 0.42)',
                transition: { duration: 0.18, ease: LUXURY_EASE },
              }}
              className="rounded-xl bg-[#0C1017]/80 border border-[#2B3340] p-3.5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#C6CCD8]">{metric.label}</span>
                <AnimatedScoreValue
                  value={metric.value}
                  suffix="/100"
                  className={`text-xs font-bold ${metric.valueClass}`}
                />
              </div>
              <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#2B3340] overflow-hidden">
                <motion.div
                  className={`h-full ${metric.barClass} rounded-full origin-left`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: Math.max(0, Math.min(1, metric.value / 100)) }}
                  transition={{
                    duration: 0.85,
                    delay: 0.25 + idx * 0.06,
                    ease: LUXURY_EASE,
                  }}
                />
              </div>
              <p className="mt-2 text-[11px] text-[#949EB0]">{metric.note}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ATS-Optimized Resume Ready for Download Banner */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, delay: 0.28, ease: LUXURY_EASE }}
        className="luxury-surface-gold rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFB319]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1 text-[#F7D07A]">
                <Check className="h-3.5 w-3.5 text-[#FFB319]" /> ATS-Optimized Version Ready
              </span>
              <span className="text-[#465063]">·</span>
              <span className="inline-flex items-center gap-1 text-[#C6CCD8]">
                <Sparkles className="h-3 w-3 text-[#FFB319]" />
                {suggestedBullets.length} Suggested Bullets Integrated
              </span>
              <span className="text-[#465063]">·</span>
              <span className="text-[#949EB0]">Single-Column Standard Layout</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#F4F1EA] tracking-tight">
              Export Clean, ATS-Compliant PDF Resume
            </h3>
            <p className="text-xs sm:text-sm text-[#C6CCD8] leading-relaxed">
              Your resume text has been structured and enhanced with the Google XYZ formula (&ldquo;Accomplished [X] measured by [Y] by doing [Z]&rdquo;).
              Download a clean, high-contrast, machine-readable PDF engineered specifically for Workday, Greenhouse, Taleo, and Naukri ATS parsers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => openPdfPreview('paper')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-4 py-2.5 text-xs font-semibold text-[#E5E8EE] transition active:scale-95 whitespace-nowrap"
            >
              <Eye className="h-4 w-4 text-[#FFB319]" />
              <span>Preview ATS CV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportOptionsOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-4 py-2.5 text-xs font-semibold text-[#F7D07A] transition active:scale-95 whitespace-nowrap"
            >
              <FileText className="h-4 w-4 text-[#FFB319]" />
              <span>Export Options (PDF / TXT / MD)</span>
            </button>

            <button
              type="button"
              onClick={() => openPdfPreview('analysis')}
              className="luxury-gold-btn flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition active:scale-95 whitespace-nowrap"
            >
              <Download className="h-4 w-4 text-[#0C1017]" />
              <span>Download as PDF</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Launch Cards */}
      <div>
        <h4 className="text-xs font-semibold text-[#F7D07A] uppercase tracking-[0.14em] mb-3">
          Recommended Next Steps
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: ATS Keywords */}
          <div
            onClick={() => onNavigate('ats')}
            className="luxury-surface group cursor-pointer rounded-2xl hover:border-[#FFB319]/50 p-4 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB319]/12 border border-[#FFB319]/25 text-[#FFB319] mb-3 group-hover:scale-105 transition">
              <Target className="h-4 w-4" />
            </div>
            <h5 className="font-bold text-sm text-[#F4F1EA] group-hover:text-[#F7D07A] transition">
              ATS Keyword Checker
            </h5>
            <p className="mt-1 text-xs text-[#949EB0]">
              Detect missing terms &amp; inject them automatically.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#F7D07A]">
              <span>View 10 Keywords</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2: AI Rewriter */}
          <div
            onClick={() => onNavigate('rewriter')}
            className="luxury-surface group cursor-pointer rounded-2xl hover:border-[#FFB319]/50 p-4 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB319]/12 border border-[#FFB319]/25 text-[#FFB319] mb-3 group-hover:scale-105 transition">
              <FileText className="h-4 w-4" />
            </div>
            <h5 className="font-bold text-sm text-[#F4F1EA] group-hover:text-[#F7D07A] transition">
              AI Resume Rewriter
            </h5>
            <p className="mt-1 text-xs text-[#949EB0]">
              Google XYZ formula bullets with download.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#F7D07A]">
              <span>Rewrite Bullets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3: Mock Interview */}
          <div
            onClick={() => onNavigate('interview')}
            className="luxury-surface group cursor-pointer rounded-2xl hover:border-[#FFB319]/50 p-4 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB319]/12 border border-[#FFB319]/25 text-[#FFB319] mb-3 group-hover:scale-105 transition">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h5 className="font-bold text-sm text-[#F4F1EA] group-hover:text-[#F7D07A] transition">
              AI Interview Coach
            </h5>
            <p className="mt-1 text-xs text-[#949EB0]">
              Practice HR &amp; technical questions with voice/text.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#F7D07A]">
              <span>Start Practice</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4: Job Matcher */}
          <div
            onClick={() => onNavigate('jobs')}
            className="luxury-surface group cursor-pointer rounded-2xl hover:border-[#FFB319]/50 p-4 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFB319]/12 border border-[#FFB319]/25 text-[#FFB319] mb-3 group-hover:scale-105 transition">
              <Briefcase className="h-4 w-4" />
            </div>
            <h5 className="font-bold text-sm text-[#F4F1EA] group-hover:text-[#F7D07A] transition">
              Matched Positions
            </h5>
            <p className="mt-1 text-xs text-[#949EB0]">
              Curated roles in Chandigarh &amp; Pan-India.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#F7D07A]">
              <span>View 4 Matches</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* ATS Resume & Dashboard Analysis Preview Modal */}
      <AtsResumePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        rawText={resumeText}
        suggestedBullets={suggestedBullets}
        atsKeywords={atsKeywords}
        onDownload={handleDownloadSuccess}
        score={score}
        assessment={assessment}
        initialTab={previewInitialTab}
      />

      {/* Multi-Format Export Options Modal (PDF, TXT, Markdown) */}
      <ExportOptionsModal
        isOpen={isExportOptionsOpen}
        onClose={() => setIsExportOptionsOpen(false)}
        rawText={resumeText}
        suggestedBullets={suggestedBullets}
        atsKeywords={atsKeywords}
        score={score}
        assessment={assessment}
        onOpenFullPdfPreview={() => openPdfPreview('paper')}
        onExportComplete={handleMultiFormatExportComplete}
      />
      </div>
    </MotionConfig>
  );
};
