import React, { useState } from 'react';
import { Send, Copy, Check, Sparkles, ArrowLeft, RefreshCw, FileCheck } from 'lucide-react';
import { DEFAULT_USER } from '../data/sampleData';

interface CoverLetterGeneratorProps {
  onBack: () => void;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ onBack }) => {
  const [companyName, setCompanyName] = useState('Innovacx Cloud Systems');
  const [jobTitle, setJobTitle] = useState('Lead Talent Acquisition Partner');
  const [tone, setTone] = useState<'confident' | 'executive' | 'enthusiastic'>('confident');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const getCoverLetter = () => {
    if (tone === 'executive') {
      return `Dear Hiring Committee at ${companyName},

I am writing to express my strong interest in the ${jobTitle} position. With over four years of progressive talent acquisition leadership in high-tempo technical ecosystems, I specialize in reducing hiring cycle times while safeguarding cultural and engineering standards.

At Apex Tech Solutions, I partnered with senior engineering leadership to close 70+ critical technical roles across North India, successfully lowering our average time-to-hire by 28% and achieving an offer acceptance rate of 92%. My strategic recruitment methodology blends data-driven pipeline analytics, structured scorecard evaluations, and executive candidate engagement.

I admire ${companyName}'s rapid growth trajectory and would welcome the opportunity to discuss how my full-cycle talent acquisition capabilities can accelerate your team's headcount milestones.

Sincerely,
${DEFAULT_USER.name}
+91 98765 43210 | abhinandan.hr@example.com`;
    }

    if (tone === 'enthusiastic') {
      return `Dear ${companyName} Team,

I am thrilled to submit my application for the ${jobTitle} role! As an experienced talent acquisition specialist passionate about matching exceptional engineering talent with mission-driven tech products, ${companyName}'s innovation has consistently stood out to me.

Over the past four years, I have spearheaded full-cycle hiring across North India, scaling technical teams by 70+ members and orchestrating campus drives across major regional universities. I thrive in collaborative environments where candidate experience and hiring speed are celebrated together.

I would love the opportunity to bring my energy, boolean sourcing expertise, and candidate counseling skills to ${companyName}!

Warm regards,
${DEFAULT_USER.name}`;
    }

    // Confident default
    return `Dear Hiring Manager,

I am writing to formally apply for the ${jobTitle} role at ${companyName}. As a dedicated Talent Acquisition Specialist with four years of hands-on experience closing technical and leadership requisitions in Chandigarh and Pan-India, I bring a proven record of measurable recruitment impact.

Throughout my tenure at Apex Tech Solutions and Global Talent Bridge, I transformed talent pipelines by instituting 48-hour SLA interview loops, shortening time-to-hire from 42 to 30 days while maintaining a 96% 90-day retention rate. Furthermore, my targeted candidate nurturing enabled a 92% offer acceptance rate, reducing recruiter spend and mitigating counter-offer risks.

${companyName}'s dedication to product excellence aligns with my professional values. I look forward to the prospect of discussing how my talent acquisition capabilities will support your strategic hiring objectives.

Respectfully,
${DEFAULT_USER.name}
Chandigarh, India`;
  };

  const [letterContent, setLetterContent] = useState(getCoverLetter());

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLetterContent(getCoverLetter());
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              Cover Letter Generator
            </h2>
            <p className="text-xs text-slate-400">
              Generate a tailored, high-converting cover letter for any job in 10 seconds
            </p>
          </div>
        </div>
      </div>

      {/* Target Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Target Company
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
            placeholder="e.g. Innovacx Cloud"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Target Job Title
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
            placeholder="e.g. Lead Talent Acquisition"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Tone of Voice
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="confident">Confident & Metric-Focused</option>
            <option value="executive">Executive & Strategic</option>
            <option value="enthusiastic">Enthusiastic & Modern</option>
          </select>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={isGenerating}
          onClick={handleRegenerate}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-bold text-amber-300 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate Letter</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-2 text-xs font-black text-slate-950 transition active:scale-95 shadow-md shadow-amber-500/20"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Cover Letter</span>
            </>
          )}
        </button>
      </div>

      {/* Letter Display */}
      <div className="relative rounded-2xl border border-slate-700 bg-slate-950 p-5 sm:p-7 shadow-inner font-sans">
        <textarea
          value={letterContent}
          onChange={(e) => setLetterContent(e.target.value)}
          rows={14}
          className="w-full bg-transparent text-xs sm:text-sm text-slate-200 leading-relaxed font-sans focus:outline-none resize-y"
        />
      </div>
    </div>
  );
};
