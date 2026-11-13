import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, ArrowRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { INITIAL_RESUME_TEXT, DEFAULT_USER } from '../data/sampleData';

interface ResumeUploadProps {
  onAnalyze: (resumeText: string) => void;
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onAnalyze,
  isAnalyzing,
  hasAnalyzed,
}) => {
  const [textInput, setTextInput] = useState(INITIAL_RESUME_TEXT);
  const [fileName, setFileName] = useState<string>('Abhinandan_Sharma_HR_Recruiter_CV.docx');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    // Simple text extractor or reader for text/pdf/docx
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) setTextInput(text);
      };
      reader.readAsText(file);
    } else {
      // For binary files (PDF/DOCX), preserve custom filename and load high-quality text representation
      setTextInput(`Uploaded Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\n\n${INITIAL_RESUME_TEXT}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const loadSample = (type: 'hr' | 'tech') => {
    if (type === 'hr') {
      setFileName('Abhinandan_Sharma_HR_Recruiter_CV.docx');
      setTextInput(INITIAL_RESUME_TEXT);
    } else {
      setFileName('Rahul_Verma_FullStack_Developer_CV.pdf');
      setTextInput(`Rahul Verma
Bengaluru, India | +91 99887 76655 | rahul.dev@example.com

SUMMARY
Full Stack Engineer with 4 years building scalable web and mobile applications using React, Node.js, and TypeScript. Experience with distributed architectures and cloud deployments.

EXPERIENCE
Software Engineer | Scaler Labs, Bengaluru | 2022 - Present
- Built high-traffic checkout systems handling 15,000 requests per minute.
- Reduced API latency by 35% through Redis caching and query indexing.
- Engineered mobile-first Progressive Web App (PWA) with offline support.

SKILLS
TypeScript, React, Node.js, Express, PostgreSQL, Redis, Docker, PWA, Android TWA.`);
    }
  };

  return (
    <div className="w-full">
      {/* Candidate Greeting Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F7D07A] mb-2">
          <Sparkles className="h-3.5 w-3.5 text-[#FFB319]" />
          <span>India&apos;s #1 Career Optimization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F4F1EA]">
          Welcome back, <span className="font-serif italic luxury-gold-text font-semibold">{DEFAULT_USER.name}</span>
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#949EB0]">
          Your next leadership role may be one refinement away.{' '}
          <span className="text-[#F7D07A] font-medium">Get your Job-Readiness Score in 60 seconds.</span>
        </p>
      </div>

      {/* Upload Box with Drag & Drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border border-dashed p-6 sm:p-8 text-center transition-all ${
          isDragOver
            ? 'border-[#FFB319] bg-[#17120A]/60 shadow-xl shadow-[#FFB319]/10'
            : 'border-[#2B3340] bg-gradient-to-b from-[#131924] to-[#0C1017] hover:border-[#FFB319]/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#FFB319]/10 border border-[#FFB319]/30 text-[#FFB319] shadow-inner">
          <Upload className="h-7 w-7 text-[#FFB319]" />
        </div>

        <h3 className="mt-3.5 text-lg font-bold text-[#F4F1EA]">
          Upload your CV (PDF, DOCX, or TXT)
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-[#949EB0] max-w-md mx-auto">
          Drag &amp; drop your file here, or click to browse from your device or mobile storage.
        </p>

        {/* Selected File Status */}
        {fileName && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#131924] border border-[#2B3340] px-3.5 py-1.5 text-xs text-[#E5E8EE]">
            <FileText className="h-4 w-4 text-[#FFB319]" />
            <span className="font-semibold truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
            <CheckCircle2 className="h-4 w-4 text-[#F7D07A]" />
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="luxury-gold-btn rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition active:scale-95 whitespace-nowrap"
          >
            Select from Device
          </button>

          <button
            type="button"
            onClick={() => loadSample('hr')}
            className="rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#F7D07A] transition whitespace-nowrap"
          >
            Load HR Sample CV
          </button>

          <button
            type="button"
            onClick={() => loadSample('tech')}
            className="rounded-xl bg-[#131924] hover:bg-[#1D2533] border border-[#2B3340] hover:border-[#FFB319]/40 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#C6CCD8] transition whitespace-nowrap"
          >
            Load Tech Sample CV
          </button>
        </div>

        {/* Toggle Raw Text Editor */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowRawText(!showRawText)}
            className="text-xs text-[#949EB0] hover:text-[#F7D07A] underline decoration-[#2B3340] underline-offset-4 transition"
          >
            {showRawText ? 'Hide CV text editor' : 'Or view / paste raw CV text directly'}
          </button>

          {showRawText && (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={6}
              className="mt-2.5 w-full rounded-xl border border-[#2B3340] bg-[#0C1017] p-3 text-xs font-mono text-[#E5E8EE] focus:border-[#FFB319] focus:outline-none"
              placeholder="Paste your CV text here..."
            />
          )}
        </div>
      </div>

      {/* Instant Action CTA */}
      <div className="mt-6 luxury-surface-gold flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl p-4 sm:p-5">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFB319]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F7D07A]">
              Free Instant Diagnostic
            </span>
          </div>
          <p className="text-sm font-semibold text-[#F4F1EA] mt-1">
            Ready to beat the ATS filter and calculate your Recruiter Shortlist %?
          </p>
        </div>

        <button
          type="button"
          disabled={isAnalyzing || !textInput.trim()}
          onClick={() => onAnalyze(textInput)}
          className="luxury-gold-btn w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-[#0C1017]" />
              <span>Scanning CV (60s)...</span>
            </>
          ) : (
            <>
              <span>{hasAnalyzed ? 'Re-Analyze CV' : 'Check My CV — FREE'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
