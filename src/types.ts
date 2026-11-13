export interface ResumeScore {
  overall: number; // 0 - 100
  atsCompatibility: number; // e.g. 70
  skills: number; // e.g. 90
  experience: number; // e.g. 80
  keywords: number; // e.g. 70
  achievements: number; // e.g. 60
}

export interface RecruitersEyeAssessment {
  shortlistProbability: number; // e.g. 82%
  verdict: 'Strong Candidate' | 'Borderline Candidate' | 'High Risk' | 'Exceptional Fit';
  summary: string;
  strengths: string[];
  missingMetrics: string[];
  redFlags: string[];
  recommendedRoleLevel: string;
}

export interface ATSKeyword {
  keyword: string;
  category: 'Required' | 'Recommended' | 'Bonus';
  status: 'found' | 'missing';
  contextSnippet?: string;
}

export interface RewrittenBullet {
  id: string;
  original: string;
  improved: string;
  impactReason: string;
  formula: 'Google XYZ' | 'Action-Metric-Result';
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  type: 'Full-time' | 'Hybrid' | 'Remote';
  experienceRequired: string;
  matchScore: number;
  skillsRequired: string[];
  postedDaysAgo: number;
  description: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Behavioral' | 'Technical' | 'Situational' | 'Leadership';
  question: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  expectedKeyPoints: string[];
  sampleAnswer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceINR: number;
  billingPeriod?: string;
  badge?: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export type ActiveTab = 
  | 'home'
  | 'dashboard'
  | 'ats'
  | 'rewriter'
  | 'cover-letter'
  | 'jobs'
  | 'interview'
  | 'salary'
  | 'linkedin'
  | 'career-coach'
  | 'recruiter-mode'
  | 'live-voice'
  | 'multimedia-studio';
