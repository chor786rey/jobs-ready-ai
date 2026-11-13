import React, { useState } from 'react';
import { Share2, Copy, Check, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';
import { DEFAULT_USER } from '../data/sampleData';

interface LinkedInBoosterProps {
  onBack: () => void;
}

export const LinkedInBooster: React.FC<LinkedInBoosterProps> = ({ onBack }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyItem = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const headlines = [
    {
      title: 'Variant A: High-Impact Recruiter Formula',
      text: 'Senior Talent Acquisition Partner | Scaled Tech & Product Teams 0→70+ | Ex-Apex Tech | Reducing Time-to-Hire via Data & Scorecards',
      impact: 'Maximizes recruiter search algorithm matches by front-loading keywords and scale numbers.'
    },
    {
      title: 'Variant B: Executive Stakeholder Focus',
      text: 'Talent Acquisition Specialist | Partnering with VPs & Founders to Build High-Performance Engineering Teams | 92% Offer Closure',
      impact: 'Positions candidate as a strategic business partner rather than transactional screener.'
    },
    {
      title: 'Variant C: Growth & Tech Hiring Lead',
      text: 'Technical Recruiter & Headhunter | Full-Cycle IT Sourcing, Boolean Search & Campus Drives | Chandigarh & Pan-India Tech Hiring',
      impact: 'Optimized for local and regional hiring managers filtering by geographic availability.'
    }
  ];

  const aboutSection = `I don't just fill open requisitions—I partner with executive engineering leaders to build high-retaining tech teams.

Over 4+ years of full-cycle talent acquisition in North India, I have closed 70+ engineering and product roles while accelerating average time-to-hire by 28% and achieving a 92% offer acceptance rate.

Core Expertise:
• Full-Cycle Technical & Executive Recruiting
• Sourcing Architecture & Advanced Boolean Search (GitHub, LinkedIn, Naukri)
• Structured Scorecard Design & Interview Loop SLA Optimization
• Competitive Compensation Benchmarking & Counter-Offer Mitigation
• Campus Recruitment Drives & University Relations

Let's connect: abhinandan.hr@example.com`;

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              LinkedIn Profile Booster
            </h2>
            <p className="text-xs text-slate-400">
              Algorithm-optimized headlines and About section to attract 4x more inbound recruiter messages
            </p>
          </div>
        </div>
      </div>

      {/* Headlines Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Recommended Headline Variations (Copy into your LinkedIn Profile)
        </h3>

        {headlines.map((hl, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 hover:border-amber-500/40 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">{hl.title}</span>
              <button
                type="button"
                onClick={() => copyItem(hl.text, `hl-${idx}`)}
                className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
              >
                {copiedKey === `hl-${idx}` ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs font-medium text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 font-sans">
              {hl.text}
            </p>
            <p className="text-[11px] text-slate-400 italic">
              Why it works: {hl.impact}
            </p>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Optimized "About / Summary" Section
            </h3>
            <p className="text-xs text-slate-400">
              Formatted with high-density recruiter keywords and clear paragraph breaks
            </p>
          </div>

          <button
            type="button"
            onClick={() => copyItem(aboutSection, 'about')}
            className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 text-xs font-black text-slate-950 transition active:scale-95 shadow-md shadow-amber-500/20"
          >
            {copiedKey === 'about' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-sans text-xs text-slate-200 whitespace-pre-line leading-relaxed">
          {aboutSection}
        </div>
      </div>
    </div>
  );
};
