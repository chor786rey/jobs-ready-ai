import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { RewrittenBullet } from '../types';
import { DEFAULT_USER, INITIAL_RESUME_TEXT } from '../data/sampleData';
import { AtsResumePreviewModal } from './AtsResumePreviewModal';
import { ExportOptionsModal } from './ExportOptionsModal';

interface ResumeRewriterProps {
  bullets: RewrittenBullet[];
  onBack: () => void;
  onOpenPricing: () => void;
  resumeText?: string;
}

export const ResumeRewriter: React.FC<ResumeRewriterProps> = ({
  bullets,
  onBack,
  onOpenPricing,
  resumeText = INITIAL_RESUME_TEXT,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'side-by-side' | 'full-document'>('side-by-side');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportOptionsOpen, setIsExportOptionsOpen] = useState(false);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI Resume Rewriter
            </h2>
            <p className="text-xs text-slate-400">
              Applying Google's XYZ Formula ("Accomplished [X], measured by [Y], by doing [Z]")
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(previewMode === 'side-by-side' ? 'full-document' : 'side-by-side')}
            className="rounded-xl bg-[#131924] border border-[#2B3340] px-3 py-2 text-xs font-semibold text-[#E5E8EE] hover:bg-[#1D2533] hover:border-[#FFB319]/40 transition whitespace-nowrap shrink-0"
          >
            {previewMode === 'side-by-side' ? 'View Apply-Ready CV' : 'View Bullet Comparisons'}
          </button>

          <button
            type="button"
            onClick={() => setIsExportOptionsOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#131924] border border-[#2B3340] px-3.5 py-2 text-xs font-semibold text-[#F7D07A] hover:bg-[#1D2533] hover:border-[#FFB319]/40 transition whitespace-nowrap shrink-0"
          >
            <FileText className="h-3.5 w-3.5 text-[#FFB319]" />
            <span>Export Options</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="luxury-gold-btn flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition active:scale-95 whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-[#0C1017]" />
            <span>Download as PDF</span>
          </button>
        </div>
      </div>

      {previewMode === 'side-by-side' ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>
                <strong>3 bullets upgraded</strong> to high-converting executive standards.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenPricing}
              className="text-amber-400 hover:underline font-bold text-xs"
            >
              Rewrite entire CV (₹99) →
            </button>
          </div>

          {bullets.map((b, idx) => (
            <div
              key={b.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Bullet Enhancement #{idx + 1} ({b.formula})
                </span>
                <button
                  type="button"
                  onClick={() => copyText(b.improved, b.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                >
                  {copiedId === b.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Improved</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Original */}
                <div className="rounded-xl bg-slate-950/70 border border-rose-900/30 p-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    Before (Weak / Passive)
                  </span>
                  <p className="text-xs text-slate-300 line-through decoration-rose-500/50 leading-relaxed">
                    {b.original}
                  </p>
                </div>

                {/* Improved */}
                <div className="rounded-xl bg-emerald-950/30 border border-emerald-800/50 p-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    After (Quantified Recruiter Standard)
                  </span>
                  <p className="text-xs font-medium text-emerald-200 leading-relaxed">
                    {b.improved}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-amber-950/20 border border-amber-500/30 px-3 py-2 text-[11px] text-amber-200 flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Recruiter Impact:</strong> {b.impactReason}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Full Apply-Ready Printable Document (PDF page 1, 26) */
        <div className="rounded-2xl border border-slate-700 bg-white text-slate-900 p-6 sm:p-10 shadow-2xl font-sans max-w-3xl mx-auto print:shadow-none print:p-0">
          <div className="border-b-2 border-slate-900 pb-4 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-slate-900">
              {DEFAULT_USER.name}
            </h1>
            <p className="text-sm font-semibold text-blue-900 mt-0.5">
              Senior Talent Acquisition Specialist & Technical Recruiter
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Chandigarh, India | +91 98765 43210 | abhinandan.hr@example.com | linkedin.com/in/abhinandan-hr
            </p>
          </div>

          {/* Executive Summary */}
          <div className="mt-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Executive Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Results-driven Senior Talent Acquisition Specialist with 4+ years of full-cycle hiring expertise across high-growth technology and product organizations in North India. Proven record of accelerating time-to-hire by 28% and driving a 92% offer acceptance rate across 70+ technical headcounts through structured stakeholder engagement, boolean sourcing, and competitive compensation negotiation.
            </p>
          </div>

          {/* Experience */}
          <div className="mt-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Professional Experience
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>Senior Talent Acquisition Specialist — Apex Tech Solutions</span>
                  <span className="text-slate-500 font-normal">Chandigarh | 2022 - Present</span>
                </div>
                <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs text-slate-700 leading-relaxed">
                  <li>Accelerated time-to-hire by 28% (42 to 30 days) across 45+ technical openings by instituting structured scorecard evaluation and 48-hour SLA feedback loops.</li>
                  <li>Partnered with VP of Engineering and Product Directors to fulfill 70+ headcount requirements across Chandigarh and Bengaluru, achieving 96% 90-day retention rate.</li>
                  <li>Closed 92% offer acceptance rate across 60+ offers by conducting proactive market benchmarking, competitive counter-offer mitigation, and transparent benefits counseling.</li>
                  <li>Managed recruitment operations using Workday and Greenhouse ATS, reducing cost-per-hire by 22% via employee referral campaigns.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>HR Recruiter — Global Talent Bridge</span>
                  <span className="text-slate-500 font-normal">Mohali | 2020 - 2022</span>
                </div>
                <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs text-slate-700 leading-relaxed">
                  <li>Screened 150+ candidates weekly across high-volume staffing mandates with an 88% first-round qualification rate.</li>
                  <li>Coordinated campus recruitment drives across 4 regional universities, hiring 40+ associate engineers in a single quarter.</li>
                  <li>Automated onboarding paperwork loops for 80+ hires, reducing candidate drop-off by 15%.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Core Competencies */}
          <div className="mt-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Core Competencies & Tools
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Full-Cycle Recruitment, Technical Sourcing, Time-to-Hire Optimization, Offer Acceptance Mitigation, Boolean Search, Campus Hiring Drives, Workday, Greenhouse, Zoho Recruit, Naukri Recruiter, LinkedIn Recruiter.
            </p>
          </div>
        </div>
      )}

      {/* A4 Resume Preview Modal with html2canvas & jsPDF Export */}
      <AtsResumePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        rawText={resumeText}
        suggestedBullets={bullets}
        initialTab="paper"
      />

      {/* Multi-Format Export Options Modal (PDF, TXT, Markdown) */}
      <ExportOptionsModal
        isOpen={isExportOptionsOpen}
        onClose={() => setIsExportOptionsOpen(false)}
        rawText={resumeText}
        suggestedBullets={bullets}
        onOpenFullPdfPreview={() => setIsPreviewOpen(true)}
      />
    </div>
  );
};
