# Statoma — Statistics Calculator Suite

## Brand
- Name: Statoma
- Domain: statoma.com
- Tagline: Statistics calculators that show you how.
- One-liner: A free, modern statistics calculator suite that explains
  every step so users actually learn — not just get a number.
- Voice: Clear, friendly, pedagogically rigorous. Like a patient
  university professor who refuses to hand-wave. No marketing fluff,
  no emojis, no exclamation points in body content.

## Audience
Primary: undergraduate/graduate students, researchers, journalists
working with data, anyone doing a statistics class or thesis.

Secondary (Phase 2 expansion, ~Month 6+): growth marketers, PMs,
e-commerce optimizers using A/B testing. Same math, different copy.
Plan for this from day one: never hardcode example copy or numbers
into calculator components.

## Tech Stack (Do NOT change without explicit approval)
- Framework: Next.js 15 (App Router) + TypeScript strict mode
- Styling: Tailwind CSS + shadcn/ui
- Math: simple-statistics, mathjs, jstat
- Formulas: katex + react-katex
- Charts: Recharts
- Content: MDX for long-form sections
- Hosting: Cloudflare Pages (static export mode)
- Analytics: Cloudflare Web Analytics + GA4 (added later, not at init)

## Output Mode
- next.config.js: output: 'export', images: { unoptimized: true },
  trailingSlash: true
- Build output: /out (Cloudflare Pages reads from here)
- DO NOT use: Server Actions, dynamic API routes, ISR, middleware,
  Next.js Image Optimization, runtime cookies/headers
- All calculations run client-side. No server runtime required.

## Directory Structure
```
/app
  /(content)/about/page.tsx
  /(content)/privacy/page.tsx
  /(content)/terms/page.tsx
  /(content)/contact/page.tsx
  /calculators/page.tsx              Index hub of all calculators
  /calculators/[slug]/page.tsx       Pattern for calculator pages
                                     (initially: stub pages per Phase 1)
  /topics/page.tsx                   Phase 2 placeholder
  /sitemap.ts                        Auto-generates sitemap.xml
  /layout.tsx
  /page.tsx                          Homepage
/components
  /calculator/                       Shared calculator parts:
    CalculatorLayout.tsx
    InputPanel.tsx
    ResultPanel.tsx
    RelatedCalculators.tsx
    CalculatorGrid.tsx               5-card grid component
  /content/                          Formula, WorkedExample, FAQ
  /layout/                           Header, Footer, MobileNav
  /ui/                               shadcn/ui components
/lib
  /stats/                            Pure calc functions + vitest tests
  /seo/                              Metadata + JSON-LD helpers
  /audience/                         Phase 2: swap copy by audience
  /utils.ts                          shadcn utility (cn)
/content
  /[calculator-slug].mdx             Long-form content per calculator
/public
  /robots.txt
```

## URL Conventions
- Calculator URL pattern: /calculators/[test-slug]
  (e.g., /calculators/t-test, /calculators/chi-square)
- Calculator index hub: /calculators
- Phase 2 topic pillars: /topics/[topic-slug]
- All URLs lowercase, hyphen-separated, with trailing slash

## Page Structure (all calculator pages, once implemented)
Every calculator page contains, in this order:
1. H1 + 1-sentence subtitle
2. Calculator UI (above the fold on desktop, immediately visible on mobile)
3. Plain English result interpretation (auto-generated from inputs)
4. "What is this test" (~120 words)
5. "When to use it" (bullet list of scenarios)
6. "How it works" (formula in KaTeX + brief math explanation)
7. "Worked example" (real numbers walked through step by step)
8. "Common mistakes" (4-6 specific pitfalls — Statoma's signature)
9. FAQ (3-5 Q&As targeting People Also Ask)
10. RelatedCalculators (4-6 internal links with descriptive anchors)

Total content per page: minimum 1500 words beyond the UI itself.

## SEO Non-Negotiables
- Unique title and meta description per page
- Exactly one H1 per page, hierarchical H2/H3 below
- Descriptive internal link anchor text (no "click here")
- Alt text on every image
- sitemap.xml and robots.txt always current
- JSON-LD on every calculator: SoftwareApplication + FAQPage
- Open Graph and Twitter Card metadata on every page
- Canonical URL on every page
- Mobile-first; calculator must be usable at 360px viewport width

## Never Do
- No thin content (every published page ≥1500 words beyond the UI)
- No AI-generated stock images
- No tracking scripts beyond Cloudflare Analytics and GA4
- No tech stack changes without updating this file first
- No hardcoded example numbers or copy in component files (use MDX)
- No skipping unit tests for /lib/stats/ functions
- No marketing fluff in body content
- No exclamation points outside of headers/CTAs
- No emojis in body content
- No server-side features (static export only)
- No src/ directory wrapper

## Development Workflow
- Plan before code: output implementation plan first, wait for "go"
- One feature per commit, atomic changes
- Run `npm run verify` (lint + test + build) before any commit
- Reference existing patterns — don't reinvent
- Commit messages: conventional commits (feat:, fix:, docs:, etc.)
- Use path alias @/* for all internal imports
- Use npm only (not pnpm or yarn)

## Phase 1 Scope (first 8 weeks)
Build these 5 calculators to launch:

1. /calculators/t-test
   — independent + paired + one-sample + Welch, tabs to switch mode

2. /calculators/p-value
   — accepts t / z / χ² / F statistic

3. /calculators/confidence-interval
   — mean / proportion / difference, with sampling distribution viz

4. /calculators/sample-size
   — survey mode + power analysis mode

5. /calculators/chi-square
   — goodness of fit + independence

Plus required public pages:
/, /calculators, /topics, /about, /privacy, /terms, /contact.

## Phase 2 Hints (do not implement yet, but design for)
After Month 6, /ab-testing/ subdirectory will host B2B-flavored
versions of t-test, sample size, etc. Same /lib/stats/ functions,
different copy and examples loaded from /content/. Keep this
separation clean from day one — never hardcode user-facing copy
or example numbers into calculator components.

/topics/[slug] will host pillar educational content
(e.g., "Understanding p-values", "What is statistical power")
that links out to related calculators.
