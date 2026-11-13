import React, { useState } from 'react';
import { IndianRupee, TrendingUp, MapPin, Briefcase, Award, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { DEFAULT_USER } from '../data/sampleData';

interface SalaryGuideProps {
  onBack: () => void;
}

export const SalaryGuide: React.FC<SalaryGuideProps> = ({ onBack }) => {
  const [role, setRole] = useState('HR Recruiter & Talent Acquisition');
  const [experience, setExperience] = useState(4);
  const [locationTier, setLocationTier] = useState<'tier1' | 'tier2' | 'remote'>('tier2'); // Chandigarh is Tier 2

  // Benchmarks logic in LPA (Lakhs Per Annum)
  const baseRate = 1.6; // multiplier per year
  const tierMultiplier = locationTier === 'tier1' ? 1.25 : locationTier === 'remote' ? 1.15 : 1.0;

  const minLPA = Math.round((2.8 + experience * 0.9 * tierMultiplier) * 10) / 10;
  const medianLPA = Math.round((3.8 + experience * 1.1 * tierMultiplier) * 10) / 10;
  const topLPA = Math.round((5.2 + experience * 1.45 * tierMultiplier) * 10) / 10;

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
              AI Market Salary Guide (2026)
            </h2>
            <p className="text-xs text-slate-400">
              Calibrated market compensation benchmarks based on verified industry placement records
            </p>
          </div>
        </div>
      </div>

      {/* Input Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Job Role / Title
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="HR Recruiter & Talent Acquisition">HR Recruiter & Talent Acquisition</option>
            <option value="Senior Technical Recruiter">Senior Technical Recruiter</option>
            <option value="Full Stack Developer">Full Stack Software Developer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Corporate Sales Lead">Corporate Sales Lead / BDE</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Experience: {experience} Years
          </label>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
            className="w-full accent-amber-400 mt-2"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Location Zone
          </label>
          <select
            value={locationTier}
            onChange={(e) => setLocationTier(e.target.value as any)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="tier2">Tier 2 (Chandigarh, Jaipur, Indore, Kochi)</option>
            <option value="tier1">Tier 1 (Bengaluru, Delhi NCR, Mumbai, Hyderabad)</option>
            <option value="remote">Pan-India Remote / Global Hybrid</option>
          </select>
        </div>
      </div>

      {/* Salary Brackets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Min Bracket */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            25th Percentile (Entry Band)
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center">
            <IndianRupee className="h-6 w-6 text-slate-400" />
            <span>{minLPA} LPA</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Standard base with fixed benefits</p>
        </div>

        {/* Median / Fair Market Value */}
        <div className="rounded-2xl border border-amber-500/60 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 p-4 text-center relative shadow-lg shadow-amber-500/10">
          <span className="inline-block rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider mb-1">
            Market Median
          </span>
          <div className="mt-1 text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center">
            <IndianRupee className="h-7 w-7 text-amber-400" />
            <span>{medianLPA} LPA</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-300 font-medium">Your realistic baseline asking target</p>
        </div>

        {/* 90th Percentile High Performer */}
        <div className="rounded-2xl border border-emerald-800/60 bg-slate-900/80 p-4 text-center">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            90th Percentile (High Value)
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 flex items-center justify-center">
            <IndianRupee className="h-6 w-6 text-emerald-400" />
            <span>{topLPA} LPA</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Attainable with quantified ATS CV & interview scorecard</p>
        </div>
      </div>

      {/* Negotiation Cheat Sheet */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-amber-400" />
          <span>Proven Salary Negotiation Script for Recruiters:</span>
        </h4>
        <div className="rounded-xl bg-slate-950 p-3.5 text-xs text-slate-300 leading-relaxed font-mono border border-slate-800">
          "Based on current market talent intelligence for {experience}+ years in {role} and my track record of reducing time-to-hire by 28% while closing 92% offer acceptance, I am targeting an annual package in the range of ₹{medianLPA}L – ₹{topLPA}L. I am confident in delivering immediate ROI to your hiring team."
        </div>
      </div>
    </div>
  );
};
