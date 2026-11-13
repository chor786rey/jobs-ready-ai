import { JobListing, InterviewQuestion, PricingPlan, ATSKeyword, RewrittenBullet } from '../types';

export const DEFAULT_USER = {
  name: 'Abhinandan Pandey',
  targetRole: 'Lead Talent Acquisition & HR Strategy Specialist',
  targetLocation: 'Chandigarh / Mohali & Remote Pan-India',
  targetCTC: '₹8–14 LPA',
  experienceYears: 5,
};

export const INITIAL_RESUME_TEXT = `Abhinandan Pandey
Chandigarh, India | +91 98765 43210 | abhinandan@696969marketing.com | linkedin.com/in/abhinandan-pandey-hr

EXECUTIVE SUMMARY
Strategic Talent Acquisition Lead and HR Operations Specialist with 5+ years of full-lifecycle hiring excellence across enterprise SaaS, FinTech, and high-growth Indian startups. Proven record partnering with C-suite executives, slashing time-to-hire by 32%, scaling technical engineering pods, and designing ATS scorecard frameworks. Expert in LinkedIn Recruiter, Boolean sourcing, campus drives, and end-to-end compensation structuring.

CORE COMPETENCIES
• Full-Cycle Talent Acquisition & Executive Sourcing
• Applicant Tracking Systems: Greenhouse, Workday, Zoho Recruit, Lever
• Stakeholder Management, Hiring Scorecards & SLA Optimization
• Time-to-Hire & Cost-per-Hire Metrics Analytics
• Salary Benchmarking, Offer Negotiation & 92% Acceptance Rate
• Campus Recruitment & Pan-India Talent Pipeline Development
• Diversity, Equity & Inclusion (DE&I) Sourcing Frameworks

PROFESSIONAL EXPERIENCE
Senior Lead Talent Acquisition Specialist | Apex Cloud Solutions, Chandigarh | 2023 - Present
• Spearheaded full-cycle talent acquisition for engineering, AI product, and enterprise sales teams across Chandigarh, Gurugram, and Bengaluru.
• Streamlined technical interview loops and established 48-hour hiring manager SLA feedback cadences, reducing average time-to-hire from 44 days to 30 days (32% reduction).
• Sourced 85+ high-performing engineers and product managers using advanced Boolean search strings, LinkedIn Recruiter, and internal employee referral programs.
• Orchestrated offer rollout and executive compensation structuring, maintaining an industry-leading 92% offer acceptance ratio across 70+ requisitions.
• Implemented standardized Greenhouse ATS scorecards that eliminated evaluation bias and boosted 90-day candidate retention to 96%.

Talent Acquisition Specialist | Global Talent Bridge, Mohali | 2021 - 2023
• Managed end-to-end hiring workflows for high-volume staffing mandates, screening 200+ profiles weekly with rapid triage.
• Directed annual campus placement recruitment drives across 6 premier engineering institutions in North India, closing 60+ graduate trainees in single hiring seasons.
• Partnered directly with VP of Engineering to calibrate job descriptions, salary bands, and market availability indexes for niche cloud roles.
• Managed pre-onboarding engagement, document verification, and background checks, ensuring 0% Day-1 drop-off rate.

HR Executive & Talent Sourcer | Nexa Digital Labs, Chandigarh | 2019 - 2021
• Built active talent communities and candidate talent pools for backend developers (Python/Node.js), DevOps, and UI/UX designers.
• Conducted comprehensive HR cultural fit screening rounds, salary expectation leveling, and candidate experience journey reviews.
• Automated interview scheduling workflows through Calendly and ATS integration, saving 12 hours weekly for recruitment pods.

EDUCATION & CREDENTIALS
• Master of Business Administration (HR & Operations) | Panjab University, Chandigarh | 2017 - 2019
• Bachelor of Commerce (Honours) | Panjab University, Chandigarh | 2014 - 2017
• Certified Talent Acquisition Strategist (CTAS) | SHRM Member & LinkedIn Certified Professional Recruiter`;

export const SAMPLE_ATS_KEYWORDS: ATSKeyword[] = [
  { keyword: 'Full-Cycle Recruitment', category: 'Required', status: 'found', contextSnippet: '5+ years of full-lifecycle hiring excellence across enterprise SaaS' },
  { keyword: 'Stakeholder Management', category: 'Required', status: 'found', contextSnippet: 'Stakeholder Management, Hiring Scorecards & SLA Optimization' },
  { keyword: 'Time-to-Hire Optimization', category: 'Required', status: 'found', contextSnippet: 'reducing average time-to-hire from 44 days to 30 days' },
  { keyword: 'Cost-per-Hire Analytics', category: 'Required', status: 'missing' },
  { keyword: 'Boolean Search & Sourcing', category: 'Recommended', status: 'found', contextSnippet: 'advanced Boolean search strings, LinkedIn Recruiter' },
  { keyword: 'Diversity & Inclusion (DE&I)', category: 'Recommended', status: 'found', contextSnippet: 'Diversity, Equity & Inclusion (DE&I) Sourcing Frameworks' },
  { keyword: 'Offer Acceptance Ratio', category: 'Recommended', status: 'found', contextSnippet: 'industry-leading 92% offer acceptance ratio' },
  { keyword: 'Greenhouse / Workday ATS', category: 'Bonus', status: 'found', contextSnippet: 'Greenhouse, Workday, Zoho Recruit, Lever' },
  { keyword: 'Employer Branding', category: 'Bonus', status: 'missing' },
  { keyword: 'Talent Pipeline Funnel Analytics', category: 'Bonus', status: 'missing' },
];

export const SAMPLE_REWRITTEN_BULLETS: RewrittenBullet[] = [
  {
    id: 'b1',
    original: 'Reduced average time-to-hire by working closely with hiring managers to streamline interview loops.',
    improved: 'Accelerated time-to-hire by 32% (44 to 30 days) across 85+ technical openings by instituting structured ATS scorecard evaluations and mandatory 48-hour hiring manager SLA feedback cadences.',
    impactReason: 'Quantified time saved (32%), sample size (85 openings), and concrete methodology (Google XYZ formula).',
    formula: 'Google XYZ'
  },
  {
    id: 'b2',
    original: 'Extended offers and negotiated compensation packages within approved departmental budgets.',
    improved: 'Maintained a 92% offer acceptance rate across 70+ technical offers by conducting proactive market benchmarking, competitive counter-offer mitigation, and transparent total-rewards counseling.',
    impactReason: 'Highlights conversion rate (92%) and business acumen over passive task execution.',
    formula: 'Action-Metric-Result'
  },
  {
    id: 'b3',
    original: 'Handled recruitment for engineering, product, and sales teams across multiple locations.',
    improved: 'Partnered with C-suite and VP of Engineering to fulfill 85+ headcount requirements across Chandigarh and Bengaluru, achieving 96% 90-day retention and saving ₹14L in agency fees.',
    impactReason: 'Names executive stakeholders, scale of hires, financial ROI, and quality of hire retention metric.',
    formula: 'Google XYZ'
  }
];

export const SAMPLE_JOBS: JobListing[] = [
  {
    id: 'job-1',
    title: 'Lead Talent Acquisition Partner (Tech & AI)',
    company: 'Innovacx Cloud Systems',
    location: 'Chandigarh / Mohali (Hybrid)',
    salaryRange: '₹10.5 – 14.0 LPA',
    type: 'Hybrid',
    experienceRequired: '4-7 years',
    matchScore: 96,
    skillsRequired: ['Full-Cycle Hiring', 'Boolean Search', 'Stakeholder Management', 'Greenhouse ATS'],
    postedDaysAgo: 1,
    description: 'Lead end-to-end technical staffing for our AI core team in Mohali. Work directly with CTO and global engineering heads.'
  },
  {
    id: 'job-2',
    title: 'Senior HR Recruiter - Engineering & Product',
    company: 'RazorPay Digital Lab',
    location: 'Remote (India)',
    salaryRange: '₹11.0 – 15.5 LPA',
    type: 'Remote',
    experienceRequired: '4+ years',
    matchScore: 92,
    skillsRequired: ['Technical Recruiting', 'ATS Systems', 'Salary Negotiation', 'Offer Closure'],
    postedDaysAgo: 2,
    description: 'Drive end-to-end recruitment for high-growth FinTech engineering pods. 100% remote with bi-annual offsites in Bengaluru.'
  },
  {
    id: 'job-3',
    title: 'Corporate Talent Acquisition Manager',
    company: 'Zomato Operations Hub',
    location: 'Gurugram / Delhi NCR',
    salaryRange: '₹9.0 – 12.5 LPA',
    type: 'Full-time',
    experienceRequired: '3-6 years',
    matchScore: 88,
    skillsRequired: ['High-Volume Staffing', 'Naukri Recruiter', 'Onboarding', 'Funnel Analytics'],
    postedDaysAgo: 3,
    description: 'Manage high-tempo corporate staffing requirements and design campus engagement programs across North India universities.'
  },
  {
    id: 'job-4',
    title: 'Executive Recruiter - Global Shared Services',
    company: 'Teleperformance India',
    location: 'Chandigarh IT Park',
    salaryRange: '₹8.0 – 10.5 LPA',
    type: 'Full-time',
    experienceRequired: '3-5 years',
    matchScore: 85,
    skillsRequired: ['Bulk Hiring', 'HR Screening', 'Background Verification', 'Workday'],
    postedDaysAgo: 4,
    description: 'Drive strategic hiring programs for enterprise client accounts in our state-of-the-art Chandigarh IT Park center.'
  }
];

export const SAMPLE_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    category: 'Behavioral',
    question: 'Tell me about a time a critical engineering candidate rejected your offer at the last minute. How did you handle the situation with the hiring manager?',
    difficulty: 'Mid',
    expectedKeyPoints: [
      'Identified root cause without blaming the candidate',
      'Promptly notified hiring manager with a pre-identified backup pipeline',
      'Audited compensation / offer package against market benchmarks',
      'Closed the role within 10 days using runner-up candidate'
    ],
    sampleAnswer: 'In my third quarter at Apex Cloud, a senior frontend engineer candidate accepted a competing counter-offer 48 hours before joining. Rather than panicking, I immediately contacted the hiring manager with our ranked silver-medalist pipeline from the final round. Simultaneously, I debriefed the reneging candidate to analyze why our package fell short (it was a remote flexibility policy difference). By having maintained warm candidate engagement with candidate #2, we extended a calibrated offer within 24 hours and saved the project timeline.'
  },
  {
    id: 'q2',
    category: 'Situational',
    question: 'How do you convince a passive, top-tier candidate who isn’t actively looking for a job to consider your company?',
    difficulty: 'Senior',
    expectedKeyPoints: [
      'Deep personalization based on GitHub / LinkedIn contributions',
      'Focusing on high-impact projects rather than generic salary pitch',
      'Connecting them directly with tech leaders for casual exploratory chat',
      'Respectful, persistent follow-up sequence'
    ],
    sampleAnswer: 'Passive candidates ignore generic recruiter emails. I research their recent work—such as an open-source library or conference talk—and write a custom 3-sentence note referencing their exact engineering problem. Instead of asking for an interview, I invite them for an informal 15-minute coffee chat with our VP of Engineering to discuss our upcoming architecture migration. This reduces friction and turns a cold outreach into an intellectual curiosity discussion.'
  },
  {
    id: 'q3',
    category: 'Leadership',
    question: 'How do you partner with demanding hiring managers who have unrealistic job specifications or below-market salary budgets?',
    difficulty: 'Senior',
    expectedKeyPoints: [
      'Bring concrete market data (e.g. salary surveys, candidate supply pool)',
      'Run a calibrated live search together to showcase available talent',
      'Propose trade-offs (e.g. hire high-potential junior and upskill vs wait 3 months)',
      'Establish weekly recruitment metrics reviews'
    ],
    sampleAnswer: 'I rely on objective data rather than opinion. When a manager asks for a 5-year specialist at 3-year pay, I show them live LinkedIn Talent Insights data demonstrating only 14 candidates exist in our city at that bracket. I then offer two strategic options: either broaden our location to remote talent, or hire a high-aptitude professional with 3 years experience and pair them with an internal mentor.'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceINR: 0,
    description: 'Instant CV health check and job readiness score in 60 seconds.',
    features: [
      'Instant AI Resume Score (out of 100)',
      'Basic ATS Keyword Check',
      '1 Career Readiness Diagnostic',
      'Standard Job Matches',
      'Cloud Persistence in Firestore',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    priceINR: 99,
    description: 'Transform your CV into an ATS-proof, recruiter-approved format.',
    badge: 'Quick Fix',
    features: [
      'Everything in Free',
      'Professional AI Resume Rewriter',
      'Google XYZ Formula Bullet Enhancements',
      'Apply-Ready PDF & Word CV Download',
      'Full ATS Keyword Injection Sheet',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceINR: 199,
    popular: true,
    badge: 'Most Popular',
    description: 'Complete application toolkit from resume rewrite to interview prep.',
    features: [
      'Everything in Starter',
      'Tailored Cover Letter Generator',
      'AI Mock Interview Simulator with Voice practice',
      'Recruiter’s Eye™ Shortlist Probability Audit',
      'Priority Job Match alerts',
    ],
  },
  {
    id: 'monthly',
    name: 'Job Search Pro',
    priceINR: 499,
    billingPeriod: '/month',
    description: 'Unlimited AI career assistant until you land your dream offer.',
    features: [
      'Unlimited CV Tailoring for Every Job',
      'Unlimited AI Interview Coaching & Audio evaluations',
      '24/7 AI Career Coach Chat (Ask any question)',
      'LinkedIn Profile Booster & Headline Optimizer',
      'Salary Negotiation Script Generator',
      'Real-Time Live API Voice Coach Session',
    ],
  },
  {
    id: 'elite',
    name: 'Elite Career',
    priceINR: 999,
    description: 'All-inclusive executive accelerator with recruiter network visibility.',
    badge: 'Career Accelerator',
    features: [
      'Everything in Job Search Pro',
      'Executive Career Strategy Audit',
      'Veo Video Pitch & AI Headshot Synthesis',
      'Direct Recruiter Database Spotlight',
      'Customized 30-60-90 Day Career Action Plan',
      'Lifetime Access to Career Tools Updates',
    ],
  }
];

export const MARKETING_AD_HOOKS = [
  {
    title: 'Ad #1 - ATS Gatekeeper Hook',
    headline: 'Your CV isn’t getting rejected by the recruiter.',
    subtext: 'It may be getting rejected by the ATS first. Check your ATS score FREE.',
    cta: 'Upload CV in 60 Seconds →',
    channel: 'Instagram / LinkedIn'
  },
  {
    title: 'Ad #2 - Application Ratio Hook',
    headline: '100 applications. 0 interviews?',
    subtext: 'Your CV might be the problem. Upload it. Get your score. Fix it. Apply again.',
    cta: 'Get Job-Readiness Score FREE',
    channel: 'WhatsApp / Shorts'
  },
  {
    title: 'Ad #3 - Shortlist Strategy Hook',
    headline: 'Don’t just apply for jobs.',
    subtext: 'Apply with a CV designed to get shortlisted. Recruiter’s Eye™ shows you what hiring managers look for.',
    cta: 'Beat The Recruiter Filter',
    channel: 'Instagram Feed'
  },
  {
    title: 'Ad #4 - Salary Opportunity Hook',
    headline: 'What salary should you actually be earning in 2026?',
    subtext: 'Enter your experience + job role. Get your AI market salary and career assessment in 60 seconds.',
    cta: 'Check My Market Worth',
    channel: 'LinkedIn Post'
  },
  {
    title: 'Ad #5 - Candidate Magnetism Hook',
    headline: 'Your dream job isn’t looking for you.',
    subtext: 'You need to become the candidate they’re looking for. JobReady AI transforms your profile into an interview magnet.',
    cta: 'Start With ₹0 Today',
    channel: 'WhatsApp Broadcast'
  }
];

export const WHATSAPP_VIRAL_TEMPLATE = `🚨 JOB SEEKERS — I’ve launched something super useful!

I’m Abhinandan Pandey, and our team at *696969 Marketing* has launched *JobReady AI*, an AI career tool that checks your CV and provides:
✅ AI Resume Score (out of 100 in 60s)
✅ ATS Compatibility & Missing Indian IT/Corporate Keywords
✅ Instant Recruiter-Approved Bullet Improvements
✅ Real Interview Questions & Voice Practice
✅ Market Salary Guidance for Pan-India roles

🎁 *You can check your CV for 100% FREE right now!*

Try it here on mobile (Android App ready):
👉 https://jobready.ai

Join our Facebook Community & Career Coaching page:
👉 https://www.facebook.com/share/1CE62Y7JGU/

Published with ❤️ by 696969 Marketing (Abhinandan Pandey)
*Your Skills. Our AI. Your Dream Job.*`;
