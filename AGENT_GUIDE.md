# AI Agent Context & Handoff Guide

This file provides context for subsequent AI coding assistants working on **JobReady AI**.

## 1. Project Identity & Owner
- **Name**: JobReady AI
- **Tagline**: From Resume to Job Offer, Faster
- **Created for**: 696969 Marketing (Abhinandan Pandey)
- **Primary Mission**: Free + Pro ATS Resume Diagnostics, Rewrite suggestions (Google XYZ formula), Recruiter simulation, PDF generation, and job prep tools.

## 2. Important Files & What They Do
- `src/App.tsx`: Central coordinator managing active tab, upload state, resume text state, and header/bottom nav.
- `src/components/DashboardView.tsx`: Main diagnostic view with animated radial score gauge, 5 metric progress bars, ATS summary banner, and direct links to other tabs.
- `src/components/AtsResumePreviewModal.tsx`: Visual preview modal displaying rendered paper view, bullet comparisons, and instant PDF download trigger.
- `src/utils/atsResumeGenerator.ts`: Client-side ATS resume builder leveraging `jspdf`. Splits sections cleanly, strips markdown, calculates page bounds, replaces weak bullet points with upgraded Google XYZ formulas.
- `src/components/ResumeRewriter.tsx`: Interactive bullet point transformer using Google XYZ & Action-Metric-Result models with 1-click copy & ATS PDF export.
- `src/types.ts`: All TypeScript interfaces. Keep all interfaces synchronized when adding fields.

## 3. Score Bar Animations & Transitions
- The radial gauge in `DashboardView.tsx` uses:
  - `circumference = 2 * Math.PI * 44`
  - `strokeDashoffset = isAnimated ? circumference - (score.overall / 100) * circumference : circumference`
  - `transition: stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)`
- The 5 metric bars animate from `0%` to their target percent using `isAnimated` and Tailwind `transition-all duration-1000 ease-out` with staggered delays (`delay-75`, `delay-150`, `delay-200`, `delay-300`).

## 4. Coding Conventions to Maintain
- Use React 19 functional components with TypeScript.
- Tailwind CSS v4 is used (`@import "tailwindcss";` in `src/index.css`). Avoid arbitrary inline styles except for dynamic calculated values like SVG offsets or widths.
- Keep `npm run lint` (`tsc --noEmit`) clean at all times.
- Avoid alerts or new popups (`window.alert`, `window.open`). Modals must be in-app React dialogs.
