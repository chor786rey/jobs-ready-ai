import React, { useState } from 'react';
import { ShieldCheck, Users, Search, Plus, Filter, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, FileText } from 'lucide-react';

interface RecruiterModeProps {
  onBack: () => void;
}

export const RecruiterMode: React.FC<RecruiterModeProps> = ({ onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'screening' | 'ranking' | 'jd-creator'>('screening');
  const [targetRole, setTargetRole] = useState('Senior Technical Recruiter');
  const [generatedJD, setGeneratedJD] = useState('');
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);

  const candidatePipeline = [
    {
      id: 'c1',
      name: 'Abhinandan Sharma',
      role: 'Talent Acquisition Specialist',
      experience: '4 Years',
      location: 'Chandigarh',
      score: 78,
      shortlistProbability: '82% (Strong Fit)',
      status: 'Shortlisted',
      topSkill: 'Tech Sourcing, Workday ATS, 92% Offer Closure',
    },
    {
      id: 'c2',
      name: 'Priya Malhotra',
      role: 'Technical Recruiter',
      experience: '3.5 Years',
      location: 'Mohali / Remote',
      score: 84,
      shortlistProbability: '88% (Top Candidate)',
      status: 'Interview Scheduled',
      topSkill: 'Boolean Search, Full-Stack Screening, SLA Reduction',
    },
    {
      id: 'c3',
      name: 'Vikas Mehra',
      role: 'HR Executive',
      experience: '2 Years',
      location: 'Delhi NCR',
      score: 62,
      shortlistProbability: '54% (Unquantified)',
      status: 'Under Review',
      topSkill: 'Generalist HR, Payroll, Basic Sourcing',
    }
  ];

  const handleGenerateJD = () => {
    setIsGeneratingJD(true);
    setTimeout(() => {
      setGeneratedJD(`JOB DESCRIPTION: ${targetRole}
Location: Chandigarh / Hybrid | Compensation: ₹8.0 – ₹12.0 LPA

ABOUT THE ROLE:
We are seeking an ambitious ${targetRole} to drive end-to-end recruitment for our engineering and product teams. You will partner directly with Engineering Directors to source, evaluate, and close top-tier technical talent.

KEY RESPONSIBILITIES:
• Lead full-cycle recruitment for engineering pods, achieving <30 day time-to-hire SLAs.
• Build active talent pipelines via LinkedIn Recruiter, GitHub, and niche developer communities.
• Implement structured scorecard evaluations to maintain an offer acceptance rate >90%.
• Provide compensation benchmarking and counter-offer mitigation strategies.

REQUIREMENTS:
• 3–6 years of demonstrated technical recruiting experience.
• Hands-on expertise with ATS platforms (Workday, Greenhouse, or Lever).
• Exceptional candidate counseling, communication, and offer negotiation abilities.`);
      setIsGeneratingJD(false);
    }, 700);
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
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F1EA] tracking-tight flex items-center gap-2 flex-wrap">
              <span>JobReady AI for Recruiters</span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FFB319]">
                · Enterprise Suite
              </span>
            </h2>
            <p className="text-xs text-[#949EB0]">
              Screen CVs in bulk, rank applicant match probabilities, and generate role descriptions in seconds
            </p>
          </div>
        </div>

        {/* B2B Pricing Callout */}
        <span className="text-xs text-[#F7D07A] bg-[#131924] border border-[#FFB319]/30 px-3 py-1.5 rounded-xl font-semibold tabular-nums whitespace-nowrap">
          Recruiter Tier: ₹2,999 – ₹9,999/mo
        </span>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2B3340] pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('screening')}
          className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap ${
            activeSubTab === 'screening'
              ? 'luxury-gold-btn font-bold'
              : 'text-[#949EB0] hover:text-[#F4F1EA]'
          }`}
        >
          Candidate Screening &amp; Ranking ({candidatePipeline.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('jd-creator')}
          className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap ${
            activeSubTab === 'jd-creator'
              ? 'luxury-gold-btn font-bold'
              : 'text-[#949EB0] hover:text-[#F4F1EA]'
          }`}
        >
          AI Job Description Creator
        </button>
      </div>

      {activeSubTab === 'screening' ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-[#2B3340] bg-[#131924]/80 p-3 flex items-center justify-between text-xs text-[#C6CCD8]">
            <span>Automated batch screening active: 3 CVs analyzed using Recruiter&rsquo;s Eye™</span>
            <span className="font-semibold text-[#F7D07A]">Sort: Highest Match Score</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {candidatePipeline.map((c) => (
              <div
                key={c.id}
                className="luxury-surface rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#FFB319]/50 transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-base text-[#F4F1EA]">{c.name}</h3>
                    <span className="text-xs text-[#949EB0] font-medium">
                      · {c.experience}
                    </span>
                    <span className="rounded-md bg-[#FFB319]/12 border border-[#FFB319]/30 text-[#F7D07A] px-2 py-0.5 text-[11px] font-semibold">
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#949EB0]">
                    {c.role} · {c.location}
                  </p>

                  <p className="text-xs text-[#C6CCD8]">
                    <strong className="text-[#949EB0]">Identified Strengths:</strong> {c.topSkill}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#F7D07A] block">
                      {c.shortlistProbability}
                    </span>
                    <span className="text-xl font-extrabold text-[#F4F1EA] tabular-nums">{c.score}/100</span>
                  </div>

                  <button
                    type="button"
                    className="luxury-gold-btn rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap"
                  >
                    View Recruiter Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="luxury-surface rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#F4F1EA]">Generate High-Converting Job Postings</h3>
              <p className="text-xs text-[#949EB0]">Auto-injects ATS search keywords and realistic market compensation</p>
            </div>

            <button
              type="button"
              disabled={isGeneratingJD}
              onClick={handleGenerateJD}
              className="luxury-gold-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#0C1017]" />
              <span>{isGeneratingJD ? 'Drafting JD...' : 'Generate Job Description'}</span>
            </button>
          </div>

          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full rounded-xl border border-[#2B3340] bg-[#0C1017] px-3.5 py-2 text-xs font-semibold text-[#F4F1EA] focus:outline-none focus:border-[#FFB319]"
            placeholder="Target role name..."
          />

          {generatedJD && (
            <textarea
              value={generatedJD}
              onChange={(e) => setGeneratedJD(e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-[#2B3340] bg-[#0C1017] p-4 font-mono text-xs text-[#E5E8EE] leading-relaxed focus:outline-none focus:border-[#FFB319]"
            />
          )}
        </div>
      )}
    </div>
  );
};
