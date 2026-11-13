# JobReady AI — Architecture & Developer Documentation

> **AI-Powered Career & Resume Optimization Platform**  
> Built by **696969 Marketing (Abhinandan Pandey)**  
> Production-grade PWA, ATS Resume Compiler, AI Career Coach, and Full Diagnostic Suite.

---

## 1. Executive Overview & System Topology

**JobReady AI** is an all-in-one AI career co-pilot designed to bridge the gap between job candidates and ATS (Applicant Tracking System) algorithms as well as human executive recruiters.

### Live Environment Details
- **Hosting Environment**: Google Cloud Run (Fully managed serverless container on GCP)
- **GCP Region**: `asia-southeast1` (Singapore)
- **GCP Project Number**: `941503175392`
- **Application Port**: 3000 (Internal Vite dev server & production bundle)
- **PWA Ready**: Offline-capable service worker, Web App Manifest, install prompts, standalone Android frame simulation.

---

## 2. Tech Stack & Dependencies

| Layer | Technology | Key Details |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Strict typing, hooks-based modular components |
| **Bundler / Build** | Vite 6 | Lightning-fast HMR, optimized tree-shaken production output |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Modern `@import "tailwindcss";` pipeline in `src/index.css` |
| **Icons & Visuals** | `lucide-react`, `canvas-confetti` | High-fidelity vectors, interactive celebratory feedback |
| **Document Generation** | `jspdf` | Client-side ATS-compliant 1-page/multi-page PDF synthesis |
| **AI SDK** | `@google/genai` (v2.4.0) | Official Gemini TypeScript SDK for career advice & content rewriting |
| **Progressive Web App**| `vite-plugin-pwa` | Web manifest, offline status hook, home screen installation |

---

## 3. Directory Structure

```
├── public/
│   ├── assets/               # Generated PWA icons (192x192, 512x512, maskable)
│   └── favicon.ico           # Application favicon
├── src/
│   ├── App.tsx               # Primary root component with state machine & tab orchestration
│   ├── main.tsx              # React DOM 19 bootstrap
│   ├── index.css             # Tailwind v4 root stylesheet
│   ├── types.ts              # Core TypeScript interfaces & domain types
│   ├── components/           # Functional feature components:
│   │   ├── DashboardView.tsx # Executive summary, animated score gauges & 5 diagnostic metrics
│   │   ├── AtsResumePreviewModal.tsx # Interactive PDF modal, paper preview & bullet audit
│   │   ├── ResumeRewriter.tsx# Google XYZ & Action-Metric-Result rewrite engine
│   │   ├── ATSChecker.tsx    # ATS keyword scanner & density breakdown
│   │   ├── RecruiterMode.tsx # "Recruiter's Eye™" simulation (6-second HR scan)
│   │   ├── InterviewCoach.tsx# AI interview rehearsal & STAR method feedback
│   │   ├── CoverLetterGenerator.tsx # Tailored cover letter synthesis
│   │   ├── JobMatcher.tsx    # Role compatibility & skills gap analyzer
│   │   ├── LinkedInBooster.tsx# Profile headline & summary optimizer
│   │   ├── SalaryGuide.tsx   # Market benchmark & compensation negotiation tips
│   │   ├── CareerCoachChat.tsx# Interactive career advisor chat
│   │   ├── PricingModal.tsx  # Monetization modal (Free / Pro ₹199 / VIP ₹499)
│   │   ├── AndroidLaunchCenterModal.tsx # Android APK download & Play Store instructions
│   │   ├── AndroidFrame.tsx  # Mobile device emulator frame
│   │   ├── Header.tsx        # Navigation bar & quick tab switcher
│   │   ├── BottomNav.tsx     # Mobile-first floating tab navigation
│   │   ├── Footer.tsx        # Brand attribution & legal disclaimer
│   │   ├── Logo.tsx          # Brand mark with SVG gradient
│   │   └── OfflineIndicator.tsx # Visual PWA connection state banner
│   ├── data/
│   │   └── sampleData.ts     # Default initial resume text, bullets, job listings & questions
│   ├── hooks/
│   │   ├── useOnlineStatus.ts# Navigator online/offline event listener
│   │   └── usePWAInstall.ts  # `beforeinstallprompt` lifecycle management
│   └── utils/
│       └── atsResumeGenerator.ts # ATS PDF document synthesis & text merger
├── metadata.json             # AI Studio configuration & permissions
├── vite.config.ts            # Vite & VitePWA build configuration
└── package.json              # Project dependencies & npm scripts
```

---

## 4. Key Architectural Subsystems

### A. ATS Resume PDF Generator (`src/utils/atsResumeGenerator.ts`)
- **Single-Column Standard Layout**: Emits pure ATS-friendly PDFs using standard Helvetica fonts, eliminating table-based parsing traps.
- **Dynamic Bullet Insertion**: Parses the candidate's raw resume into structural sections (Contact, Summary, Experience, Skills, Education) and merges Google XYZ quantified bullet rewrites into relevant job descriptions.
- **Section Parsing Engine**:
  ```ts
  parseResumeSections(rawText: string) -> ParsedResume
  mergeResumeWithSuggestedBullets(rawText, suggestedBullets) -> MergedText
  generateAndDownloadAtsPdf({ rawResumeText, suggestedBullets }) -> PDF Download
  ```

### B. Animated Diagnostic Breakdown (`src/components/DashboardView.tsx`)
- Circular SVG gauge with smooth stroke-dashoffset transition (`1.2s cubic-bezier(0.16, 1, 0.3, 1)`).
- 5 staggered core metric progress bars (ATS Match, Skills Depth, Experience, Keywords, Achievements) transitioning from `0%` to their analyzed state on initial load with staggered CSS delays (`delay-75`, `delay-150`, `delay-200`, `delay-300`).

### C. State Machine & Navigation (`src/App.tsx`)
- Controlled via `ActiveTab`:
  `'dashboard' | 'ats' | 'rewriter' | 'cover-letter' | 'jobs' | 'interview' | 'salary' | 'linkedin' | 'career-coach' | 'recruiter-mode'`
- Shared state preserves `resumeText`, `score`, `assessment`, and `bullets` across navigation changes.

---

## 5. Development & Contribution Guide

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start dev server (bound to port 3000)
npm run dev

# 3. Typecheck / Lint
npm run lint

# 4. Production build test
npm run build
```

### Critical Rules for AI Agents Modifying This Codebase
1. **SVG Attribute Naming**: Always use camelCase React attributes (`stopColor`, `strokeWidth`, `strokeLinecap`) rather than kebab-case (`stop-color`), or React will log DOM warnings.
2. **PWA Dev Options**: Keep `devOptions.enabled: false` in `vite.config.ts` during development to prevent Vite dev server HTML fallbacks from intercepting `/dev-sw.js` script imports.
3. **Tailwind CSS v4**: Do NOT create separate `.css` modules or import external CSS plugins. Use utility classes and keep `@import "tailwindcss";` in `src/index.css`.
4. **App Branding**: The brand name is **JobReady AI** by **696969 Marketing (Abhinandan Pandey)**. Keep `metadata.json` and page titles synchronized.
