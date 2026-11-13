import React, { useState } from 'react';
import { 
  Header 
} from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ResumeUpload } from './components/ResumeUpload';
import { DashboardView } from './components/DashboardView';
import { ATSChecker } from './components/ATSChecker';
import { ResumeRewriter } from './components/ResumeRewriter';
import { CoverLetterGenerator } from './components/CoverLetterGenerator';
import { JobMatcher } from './components/JobMatcher';
import { InterviewCoach } from './components/InterviewCoach';
import { SalaryGuide } from './components/SalaryGuide';
import { LinkedInBooster } from './components/LinkedInBooster';
import { CareerCoachChat } from './components/CareerCoachChat';
import { LiveVoiceCoach } from './components/LiveVoiceCoach';
import { MultimediaStudio } from './components/MultimediaStudio';
import { RecruiterMode } from './components/RecruiterMode';
import { PricingModal } from './components/PricingModal';
import { AndroidLaunchCenterModal } from './components/AndroidLaunchCenterModal';
import { AndroidFrame } from './components/AndroidFrame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';
import { GoldenDust } from './components/GoldenDust';
import { 
  auth, 
  onAuthStateChanged, 
  User, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  testFirestoreConnection 
} from './lib/firebase';

import { 
  ActiveTab, 
  ResumeScore, 
  RecruitersEyeAssessment, 
  PricingPlan,
  JobListing
} from './types';

import { 
  INITIAL_RESUME_TEXT, 
  SAMPLE_ATS_KEYWORDS, 
  SAMPLE_REWRITTEN_BULLETS, 
  PRICING_PLANS 
} from './data/sampleData';

import { 
  Target, 
  FileEdit, 
  Mail, 
  Briefcase, 
  MessageSquare, 
  IndianRupee, 
  Share2, 
  Compass, 
  Smartphone,
  Sparkles,
  ArrowRight,
  Radio,
  Video
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resumeText, setResumeText] = useState(INITIAL_RESUME_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [isCloudSaving, setIsCloudSaving] = useState(false);
  const [cloudSaveMessage, setCloudSaveMessage] = useState<string | null>(null);

  // Resume Scores (As detailed in PDF page 6, 7, 14, 21, 22)
  const [score, setScore] = useState<ResumeScore>({
    overall: 78,
    atsCompatibility: 70,
    skills: 90,
    experience: 80,
    keywords: 70,
    achievements: 60,
  });

  // Recruiter's Eye™ Assessment (PDF page 21-22)
  const [assessment, setAssessment] = useState<RecruitersEyeAssessment>({
    shortlistProbability: 82,
    verdict: 'Strong Candidate',
    summary: 'Your experience is strong and full-cycle staffing knowledge is evident, but your achievements aren’t quantified with concrete %, ₹, or SLA metrics. Adding 4 missing talent keywords will make this an instant top-tier shortlist.',
    strengths: [
      'Full-cycle IT and technical recruitment ownership',
      'Solid tenure progression and multi-team stakeholder management',
      'Strong ATS familiarity with Workday and Greenhouse'
    ],
    missingMetrics: [
      'Unquantified time-to-hire savings and cost-per-hire ROI',
      'Missing offer acceptance percentage benchmarks',
      'No explicit headcount volume targets per quarter'
    ],
    redFlags: [
      'Generic bullet points that sound like job duty descriptions rather than quantifiable achievements'
    ],
    recommendedRoleLevel: 'Senior Talent Acquisition Partner / Lead Recruiter',
  });

  const [atsKeywords, setAtsKeywords] = useState(SAMPLE_ATS_KEYWORDS);
  const [bullets, setBullets] = useState(SAMPLE_REWRITTEN_BULLETS);

  // Modals
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [currentTier, setCurrentTier] = useState<string>('free');

  // Modes
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [isAndroidFrameMode, setIsAndroidFrameMode] = useState(false);

  // Track Firebase Auth user and sync with Firestore database
  React.useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Sync profile
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Candidate',
            photoURL: user.photoURL || '',
            updatedAt: new Date().toISOString(),
          }, { merge: true });

          // Fetch saved resume
          const snap = await getDoc(doc(db, 'users', user.uid, 'resumes', 'primary_resume'));
          if (snap.exists()) {
            const data = snap.data();
            if (data.resumeText) setResumeText(data.resumeText);
            if (data.score) setScore(data.score);
            if (data.assessment) setAssessment(data.assessment);
            if (data.atsKeywords) setAtsKeywords(data.atsKeywords);
          } else {
            // Seed initial resume
            await setDoc(doc(db, 'users', user.uid, 'resumes', 'primary_resume'), {
              id: 'primary_resume',
              userId: user.uid,
              resumeText: INITIAL_RESUME_TEXT,
              score,
              assessment,
              atsKeywords: SAMPLE_ATS_KEYWORDS,
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Firestore initial sync notice:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const saveResumeToCloud = async (customText?: string, customScore?: ResumeScore) => {
    if (!currentUser) return;
    setIsCloudSaving(true);
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'resumes', 'primary_resume'), {
        id: 'primary_resume',
        userId: currentUser.uid,
        resumeText: customText || resumeText,
        score: customScore || score,
        assessment,
        atsKeywords,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setCloudSaveMessage('Resume & scores synced with Firestore');
      setTimeout(() => setCloudSaveMessage(null), 3500);
    } catch (e) {
      console.error('Firestore save failed:', e);
    } finally {
      setIsCloudSaving(false);
    }
  };

  // Simulated 60s AI CV Analysis
  const handleAnalyze = (newText: string) => {
    setResumeText(newText);
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      setActiveTab('dashboard');
      if (currentUser) {
        saveResumeToCloud(newText);
      }
    }, 1200);
  };

  const handleInjectKeyword = (keyword: string) => {
    setAtsKeywords((prev) =>
      prev.map((k) =>
        k.keyword === keyword
          ? { ...k, status: 'found', contextSnippet: 'Injected into ATS profile' }
          : k
      )
    );
    setScore((prev) => {
      const updated = {
        ...prev,
        atsCompatibility: Math.min(100, prev.atsCompatibility + 5),
        keywords: Math.min(100, prev.keywords + 5),
        overall: Math.min(100, prev.overall + 3),
      };
      if (currentUser) {
        setTimeout(() => saveResumeToCloud(undefined, updated), 300);
      }
      return updated;
    });
    setAssessment((prev) => ({
      ...prev,
      shortlistProbability: Math.min(96, prev.shortlistProbability + 3),
    }));
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setCurrentTier(plan.id);
  };

  const subFeaturePills = [
    { id: 'ats' as ActiveTab, label: 'ATS Checker', icon: Target },
    { id: 'rewriter' as ActiveTab, label: 'AI Rewriter', icon: FileEdit },
    { id: 'career-coach' as ActiveTab, label: 'Gemini Coach', icon: Compass },
    { id: 'live-voice' as ActiveTab, label: 'Live Voice (3.8)', icon: Radio },
    { id: 'multimedia-studio' as ActiveTab, label: 'Media Studio', icon: Video },
    { id: 'cover-letter' as ActiveTab, label: 'Cover Letter', icon: Mail },
    { id: 'jobs' as ActiveTab, label: 'Job Matcher', icon: Briefcase },
    { id: 'interview' as ActiveTab, label: 'Interview Coach', icon: MessageSquare },
    { id: 'salary' as ActiveTab, label: 'Salary Guide', icon: IndianRupee },
    { id: 'linkedin' as ActiveTab, label: 'LinkedIn Booster', icon: Share2 },
  ];

  const appContent = (
    <div
      className="relative min-h-screen bg-[#0C1017] text-[#F4F1EA] flex flex-col font-sans pb-24 md:pb-12"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(255, 179, 25, 0.07), transparent 65%)',
      }}
    >
      {/* Ambient Micro Golden Dust Canvas */}
      <GoldenDust />

      {/* Top Header */}
      <Header
        onOpenAndroidCenter={() => setIsAndroidModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenMarketing={() => {
          setIsAndroidModalOpen(true);
        }}
        isRecruiterMode={isRecruiterMode}
        onToggleRecruiterMode={() => setIsRecruiterMode(!isRecruiterMode)}
        isAndroidFrameMode={isAndroidFrameMode}
        onToggleAndroidFrameMode={() => setIsAndroidFrameMode(!isAndroidFrameMode)}
        currentUser={currentUser}
      />

      {/* Android Launch Notice Strip */}
      <div className="relative z-10 bg-[#111620]/85 backdrop-blur-sm border-b border-[#2B3340]/80 px-3 sm:px-6 py-2">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#C6CCD8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFB319] shrink-0" />
            <span className="font-semibold text-[#F7D07A] tracking-wide">Android Launch Ready</span>
            <span className="text-[#465063]">·</span>
            <span className="text-[#949EB0]">Web App Manifest, Service Worker, and Play Store TWA packaged.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAndroidModalOpen(true)}
              className="font-semibold text-[#F7D07A] hover:text-[#FCE6A6] underline decoration-[#FFB319]/40 underline-offset-4 flex items-center gap-1 transition whitespace-nowrap shrink-0"
            >
              <span>Android Launch Setup Guide</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-3 sm:px-6 py-5 sm:py-8">
        {/* Recruiter Mode View */}
        {isRecruiterMode ? (
          <RecruiterMode onBack={() => setIsRecruiterMode(false)} />
        ) : (
          <>
            {/* Quick Navigation Scrollable Tab Strip */}
            <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === 'home'
                    ? 'luxury-gold-btn font-bold'
                    : 'bg-[#131924] text-[#C6CCD8] border border-[#2B3340] hover:border-[#FFB319]/40 hover:text-[#F4F1EA]'
                }`}
              >
                Upload & Overview
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold tabular-nums transition ${
                  activeTab === 'dashboard'
                    ? 'luxury-gold-btn font-bold'
                    : 'bg-[#131924] text-[#C6CCD8] border border-[#2B3340] hover:border-[#FFB319]/40 hover:text-[#F4F1EA]'
                }`}
              >
                Scorecard ({score.overall}/100)
              </button>

              {subFeaturePills.map((p) => {
                const Icon = p.icon;
                const isActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveTab(p.id)}
                    className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                      isActive
                        ? 'luxury-gold-btn font-bold'
                        : 'bg-[#131924] text-[#949EB0] border border-[#2B3340] hover:border-[#FFB319]/40 hover:text-[#F4F1EA]'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0C1017]' : 'text-[#FFB319]/80'}`} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Views */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <ResumeUpload
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  hasAnalyzed={hasAnalyzed}
                />

                {/* If already analyzed, show brief dashboard snapshot below */}
                {hasAnalyzed && (
                  <div className="pt-4 border-t border-[#2B3340]/70">
                    <DashboardView
                      score={score}
                      assessment={assessment}
                      resumeText={resumeText}
                      suggestedBullets={bullets}
                      atsKeywords={atsKeywords}
                      onNavigate={(tab) => setActiveTab(tab)}
                      onOpenPricing={() => setIsPricingModalOpen(true)}
                      currentUser={currentUser}
                      onSaveToCloud={saveResumeToCloud}
                      isCloudSaving={isCloudSaving}
                      cloudSaveMessage={cloudSaveMessage}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                score={score}
                assessment={assessment}
                resumeText={resumeText}
                suggestedBullets={bullets}
                atsKeywords={atsKeywords}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenPricing={() => setIsPricingModalOpen(true)}
                currentUser={currentUser}
                onSaveToCloud={saveResumeToCloud}
                isCloudSaving={isCloudSaving}
                cloudSaveMessage={cloudSaveMessage}
              />
            )}

            {activeTab === 'ats' && (
              <ATSChecker
                keywords={atsKeywords}
                onInjectKeyword={handleInjectKeyword}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'rewriter' && (
              <ResumeRewriter
                bullets={bullets}
                resumeText={resumeText}
                onBack={() => setActiveTab('dashboard')}
                onOpenPricing={() => setIsPricingModalOpen(true)}
              />
            )}

            {activeTab === 'cover-letter' && (
              <CoverLetterGenerator onBack={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'jobs' && (
              <JobMatcher
                onBack={() => setActiveTab('dashboard')}
                onSelectJobForCoverLetter={() => setActiveTab('cover-letter')}
              />
            )}

            {activeTab === 'interview' && (
              <InterviewCoach onBack={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'salary' && (
              <SalaryGuide onBack={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'linkedin' && (
              <LinkedInBooster onBack={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'career-coach' && (
              <CareerCoachChat 
                currentUser={currentUser}
                onBack={() => setActiveTab('dashboard')} 
              />
            )}

            {activeTab === 'live-voice' && (
              <LiveVoiceCoach onBack={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'multimedia-studio' && (
              <MultimediaStudio 
                currentUser={currentUser}
                onBack={() => setActiveTab('dashboard')} 
              />
            )}
          </>
        )}
      </main>

      {/* Global Brand & Publisher Footer */}
      <div className="relative z-10">
        <Footer
          onOpenAndroidCenter={() => setIsAndroidModalOpen(true)}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenMarketing={() => setIsAndroidModalOpen(true)}
        />
      </div>

      {/* Native Android Bottom Navigation Bar (Mobile / Touch Devices) */}
      <div className="md:hidden">
        <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      </div>

      {/* Modals & Android Launch Center */}
      <AndroidLaunchCenterModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentTier={currentTier}
        onSelectPlan={handleSelectPlan}
      />

      {/* Offline Alert Indicator */}
      <OfflineIndicator />
    </div>
  );

  return (
    <AndroidFrame
      isActive={isAndroidFrameMode}
      onToggle={() => setIsAndroidFrameMode(!isAndroidFrameMode)}
    >
      {appContent}
    </AndroidFrame>
  );
}
