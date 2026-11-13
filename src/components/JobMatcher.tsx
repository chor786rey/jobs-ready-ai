import React, { useState } from 'react';
import { Briefcase, MapPin, IndianRupee, Search, CheckCircle2, ArrowRight, ExternalLink, ArrowLeft } from 'lucide-react';
import { SAMPLE_JOBS, DEFAULT_USER } from '../data/sampleData';
import { JobListing } from '../types';

interface JobMatcherProps {
  onBack: () => void;
  onSelectJobForCoverLetter?: (job: JobListing) => void;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({ onBack, onSelectJobForCoverLetter }) => {
  const [roleFilter, setRoleFilter] = useState(DEFAULT_USER.targetRole);
  const [locationFilter, setLocationFilter] = useState('Chandigarh');
  const [ctcFilter, setCtcFilter] = useState('₹6–8 LPA');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const handleApply = (id: string) => {
    setAppliedJobIds((prev) => [...prev, id]);
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
              AI Job Matcher
            </h2>
            <p className="text-xs text-slate-400">
              Matched based on your verified skills, experience, and location preferences
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 text-xs font-bold text-emerald-300 self-start sm:self-auto">
          {SAMPLE_JOBS.length} High-Match Openings
        </span>
      </div>

      {/* Candidate Preferences Filter (PDF page 7, 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Job Role
          </label>
          <div className="relative">
            <input
              type="text"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
              placeholder="e.g. HR Recruiter"
            />
            <Briefcase className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
              placeholder="e.g. Chandigarh, Remote"
            />
            <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Expected CTC
          </label>
          <div className="relative">
            <input
              type="text"
              value={ctcFilter}
              onChange={(e) => setCtcFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-8 pr-3 py-2 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none"
              placeholder="e.g. ₹6–8 LPA"
            />
            <IndianRupee className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-3.5">
        {SAMPLE_JOBS.map((job) => {
          const isApplied = appliedJobIds.includes(job.id);
          return (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-amber-500/50 p-4 sm:p-5 transition-all shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base text-white tracking-tight">
                    {job.title}
                  </h3>
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                    {job.matchScore}% CV Match
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {job.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{job.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <IndianRupee className="h-3 w-3" />
                    {job.salaryRange}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {job.skillsRequired.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded-md bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => handleApply(job.id)}
                  className={`w-full sm:w-36 flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition active:scale-95 shadow-md ${
                    isApplied
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 cursor-default'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black shadow-amber-500/20'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <span>1-Click Apply</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>

                {onSelectJobForCoverLetter && (
                  <button
                    type="button"
                    onClick={() => onSelectJobForCoverLetter(job)}
                    className="w-full sm:w-36 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-2 text-[11px] font-semibold text-slate-300 transition"
                  >
                    Generate Cover Letter
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
