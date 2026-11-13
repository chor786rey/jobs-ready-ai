import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, Plus, Check, ArrowLeft, ShieldAlert } from 'lucide-react';
import { ATSKeyword } from '../types';

interface ATSCheckerProps {
  keywords: ATSKeyword[];
  onInjectKeyword: (keyword: string) => void;
  onBackToDashboard: () => void;
}

export const ATSChecker: React.FC<ATSCheckerProps> = ({
  keywords,
  onInjectKeyword,
  onBackToDashboard,
}) => {
  const [filter, setFilter] = useState<'all' | 'missing' | 'found'>('all');
  const [injectedList, setInjectedList] = useState<string[]>([]);

  const filtered = keywords.filter((k) => {
    if (filter === 'missing') return k.status === 'missing' && !injectedList.includes(k.keyword);
    if (filter === 'found') return k.status === 'found' || injectedList.includes(k.keyword);
    return true;
  });

  const handleInject = (kw: string) => {
    onInjectKeyword(kw);
    setInjectedList((prev) => [...prev, kw]);
  };

  const foundCount = keywords.filter(k => k.status === 'found' || injectedList.includes(k.keyword)).length;
  const missingCount = keywords.length - foundCount;

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              ATS Keyword Compatibility
            </h2>
            <p className="text-xs text-slate-400">
              Scanned for HR Recruiter & Talent Acquisition benchmark
            </p>
          </div>
        </div>

        {/* Status Count Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-lg bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 font-bold text-emerald-300">
            {foundCount} Found
          </span>
          <span className="rounded-lg bg-rose-950/80 border border-rose-800/60 px-2.5 py-1 font-bold text-rose-300">
            {missingCount} Missing
          </span>
        </div>
      </div>

      {/* Recruiter Alert Callout */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-bold text-amber-300">
            "Your CV may be missing these keywords."
          </h4>
          <p className="mt-0.5 text-slate-300 leading-relaxed">
            Enterprise applicant tracking systems (Workday, Taleo, Greenhouse) automatically filter out resumes lacking quantitative talent metrics like <em>Time-to-Hire Optimization</em> and <em>Offer Acceptance Ratio</em> before human recruiters ever open the document.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            filter === 'all'
              ? 'bg-amber-400 text-slate-950 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Keywords ({keywords.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('missing')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            filter === 'missing'
              ? 'bg-rose-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Missing Only ({missingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('found')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            filter === 'found'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Found ({foundCount})
        </button>
      </div>

      {/* Keywords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((k, index) => {
          const isFound = k.status === 'found' || injectedList.includes(k.keyword);
          const wasJustInjected = injectedList.includes(k.keyword);

          return (
            <div
              key={index}
              className={`rounded-xl border p-3.5 flex flex-col justify-between transition ${
                isFound
                  ? 'border-emerald-800/40 bg-slate-900/60'
                  : 'border-rose-900/40 bg-slate-900/80 hover:border-amber-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isFound ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <span className="text-sm font-bold text-white">
                      {k.keyword}
                    </span>
                  </div>

                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      k.category === 'Required'
                        ? 'bg-[#FFB319]/15 text-[#FFB319] border border-[#FFB319]/35'
                        : k.category === 'Recommended'
                        ? 'bg-[#131924] text-[#F7D07A] border border-[#2B3340]'
                        : 'bg-[#1D2533] text-[#C6CCD8]'
                    }`}
                  >
                    {k.category}
                  </span>
                </div>

                {k.contextSnippet ? (
                  <p className="mt-2 text-[11px] text-slate-400 italic">
                    Found in CV: "{k.contextSnippet}"
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-rose-300/80">
                    Not detected in candidate summary or job experience.
                  </p>
                )}
              </div>

              {!isFound ? (
                <button
                  type="button"
                  onClick={() => handleInject(k.keyword)}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Auto-Inject to Experience</span>
                </button>
              ) : wasJustInjected ? (
                <div className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 py-1 rounded-lg">
                  <Check className="h-3.5 w-3.5" />
                  <span>Injected into Resume</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
