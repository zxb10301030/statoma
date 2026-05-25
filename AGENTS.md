# Statoma — Statistics Calculator Suite

This file is the canonical reference for the project. Both humans and
AI agents must read it before making changes. If anything else in
the repository contradicts this file, this file wins.

---

## 1. Brand and Voice

- **Name**: Statoma
- **Domain**: statoma.com
- **Tagline**: Statistics calculators that show you how.
- **One-liner**: A free, modern statistics calculator suite that explains
  every step so users actually learn — not just get a number.
- **Voice**: Clear, friendly, pedagogically rigorous. Like a patient
  university professor who refuses to hand-wave. No marketing fluff,
  no emojis, no exclamation points in body content.
- **What we are**: an educational tool by a working math educator.
- **What we are not**: a SaaS, a course platform, a content farm.

## 2. Audience

**Primary** (current focus): undergraduate/graduate students, researchers,
journalists working with data, anyone doing a statistics class, thesis,
or data analysis at a learning-oriented level.

**Secondary** (Phase 2 expansion, Month 6+): growth marketers, PMs,
e-commerce optimizers using A/B testing. Same math, different copy.
Plan for this from day one: never hardcode example copy or numbers
into calculator components.

## 3. Tech Stack (Do NOT change without explicit approval)

- Framework: Next.js 15 (App Router) + TypeScript strict mode
- Styling: Tailwind CSS + shadcn/ui
- Math: simple-statistics, mathjs, jstat
- Formulas: katex + react-katex
- Charts: Recharts
- Content: MDX for long-form sections
- Hosting: Cloudflare Pages (static export mode)
- Analytics: Cloudflare Web Analytics + GA4
- Email forwarding: Cloudflare Email Routing

## 4. Output Mode

- next.config.js: output: 'export', images: { unoptimized: true },
  trailingSlash: true
- Build output: /out (Cloudflare Pages reads from here)
- DO NOT use: Server Actions, dynamic API routes, ISR, middleware,
  Next.js Image Optimization, runtime cookies/headers
- All calculations run client-side. No server runtime required.

## 5. Directory Structure

```
/app
  /(content)/about/page.tsx
  /(content)/privacy/page.tsx
  /(content)/terms/page.tsx
  /(content)/contact/page.tsx
  /calculators/page.tsx              Index hub of all calculators
  /calculators/[slug]/page.tsx       One file per calculator
  /topics/page.tsx                   Topics index
  /topics/[slug]/page.tsx            Pillar articles (Phase 1.75+)
  /sitemap.ts                        Auto-generates sitemap.xml
  /opengraph-image.tsx               Default OG image
  /icon.tsx, /apple-icon.tsx         Favicon family
  /not-found.tsx                     404 page
  /layout.tsx
  /page.tsx                          Homepage
/components
  /calculator/                       Shared calculator parts:
    CalculatorLayout.tsx
    InputPanel.tsx
    ResultPanel.tsx
    RelatedCalculators.tsx
    CalculatorGrid.tsx
  /content/                          Formula, WorkedExample, FAQ
  /layout/                           Header, Footer, MobileNav
  /ui/                               shadcn/ui components
/lib
  /stats/                            Pure calc functions + vitest tests
  /seo/                              Metadata + JSON-LD helpers
  /audience/                         Phase 2: swap copy by audience
  /format/                           Number formatting utilities
  /utils.ts                          shadcn utility (cn)
/content
  /calculators/[slug].mdx            Long-form calculator content
  /topics/[slug].mdx                 Pillar article content
/public
  /robots.txt
  /ads.txt                           After AdSense approval only
```

## 6. URL Conventions

- Calculator URL pattern: `/calculators/[test-slug]`
- Calculator index hub: `/calculators`
- Topic URL pattern: `/topics/[topic-slug]`
- All URLs lowercase, hyphen-separated, with trailing slash
- URLs are permanent contracts. Once a page is indexed by Google,
  do not change its URL without setting up a 301 redirect.

## 7. Calculator Page Structure

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

**Minimum total content per page: 1500 words beyond the UI itself.**

## 8. Topic Article Structure

Pillar articles at `/topics/[slug]`:

1. H1 + dek (subtitle, 1-2 sentences)
2. TL;DR (3-5 sentences, no bullet list)
3. Table of contents (auto-generated from H2s, sticky on desktop)
4. 5-8 H2 sections, each with 2-4 H3 subsections
5. At least one worked example with real numbers
6. "Common misconceptions" section
7. "How to compute this with Statoma" — internal links to calculators
8. Further reading (3-5 authoritative external citations)
9. FAQ (5-8 Q&As targeting People Also Ask)

**Length: 2500-4000 words.**

## 9. Math Correctness Standards

Math errors destroy the trust the entire site is built on. These rules
are non-negotiable.

- Every function in `/lib/stats/` must have vitest unit tests in a
  sibling `*.test.ts` file.
- Reference values must come from one of these sources, named in
  the test comment:
  - Cited textbook (Casella & Berger, DeGroot & Schervish, Wackerly,
    Hogg/McKean/Craig). Include page or example number.
  - R's `stats` package output (commit the R snippet in the test).
  - Python's `scipy.stats` output (commit the Python snippet).
  - Wolfram Alpha query (commit the query string).
- Tolerance:
  - Sample statistics (mean, SD, variance): absolute error ≤ 1e-10
  - Test statistics (t, χ², F, z): absolute error ≤ 1e-6
  - P-values: absolute error ≤ 1e-4
  - Confidence interval bounds: absolute error ≤ 1e-4
- Edge cases that must be tested for every calculator:
  - Minimum valid n (e.g., n=2 for variance)
  - All identical values (zero variance)
  - Very large samples (n=10000+)
  - Mixed signs, very small or very large magnitudes
  - Input validation: empty, NaN, Infinity, non-numeric strings
- Never silently truncate or coerce invalid inputs. Throw or return
  a typed error result.
- Never round intermediate values during calculation. Round only at
  display time.

## 10. Page Quality Standards

Before any new page is merged to main:

- Content depth verified ≥1500 words (calculator) or ≥2500 words (topic)
- All six required content sections present (calculators) or eight
  required sections present (topics)
- At least one worked example with concrete real-world numbers
- "Common mistakes" lists 4-6 specific, actionable items
  (not vague advice like "watch for assumptions")
- No "Coming soon", "Lorem ipsum", "TODO", or placeholder text
- No marketing fluff: cut adjectives, cut hedging, cut filler

## 11. Mobile UX Standards

- Calculator UI must be usable on a 360px wide viewport
- All tap targets ≥ 44×44px
- Input fields trigger appropriate keyboards
  (`inputMode="decimal"` for numeric inputs, `type="number"` only when
  the browser's native spinners are acceptable)
- No horizontal scrolling on any breakpoint
- KaTeX formulas must scroll horizontally inside a contained box,
  not overflow the page
- Results panel visible without scrolling on a 667px tall viewport
  (iPhone SE) after submitting

## 12. Accessibility Standards

Target: WCAG 2.1 AA minimum.

- All interactive elements keyboard accessible (Tab, Enter, Esc)
- Visible focus indicators on all focusable elements
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- Every input has an associated `<label>` element
  (placeholder is not a label substitute)
- Calculator results announced via `aria-live="polite"`
- No information conveyed by color alone
  (e.g., red-for-error must also include text/icon)
- Form errors announced and associated with their inputs via
  `aria-describedby`
- All images: descriptive alt text, or `alt=""` for decorative
- Avoid `<div onClick>` — use semantic `<button>` or `<a>`

## 13. Performance Budgets

Measured on mobile (slow 4G simulation, mid-tier Android):

- LCP < 2.0s
- CLS < 0.05
- INP < 200ms
- TBT < 200ms
- First-load JS (per route) < 180 KB gzipped
- Total page weight (first load) < 500 KB gzipped
- Lighthouse Performance score ≥ 95 for every calculator page

Verify before merging any change that touches the calculator pages.

## 14. SEO Non-Negotiables

- Unique title and meta description per page
- Exactly one H1 per page, hierarchical H2/H3 below
- Descriptive internal link anchor text (no "click here")
- Alt text on every meaningful image, `alt=""` on decorative
- sitemap.xml and robots.txt always current
- Open Graph and Twitter Card metadata on every page
- Canonical URL on every page (absolute, including https://statoma.com)
- 301 redirect any URL that changes

## 15. Structured Data

- Every calculator page: `SoftwareApplication` + `FAQPage` JSON-LD
- Every topic page: `Article` + `FAQPage` JSON-LD
- Homepage: `WebSite` + `SearchAction` (Phase 2)
- About page: `Organization` + `Person` (the educator)
- `SoftwareApplication.applicationCategory`: "EducationalApplication"
- `Article.author`: a `Person` schema linking to /about
- Validate every page with Google Rich Results Test before merge
- Never fake `aggregateRating` or `review` (no rating yet)

## 16. Number Formatting Rules

All numeric output uses `/lib/format/` utilities. Rules:

- Default: 4 significant figures
- Scientific notation when |x| < 0.0001 or |x| ≥ 100000
- P-values: show down to 0.0001; below that show `< 0.0001`
- Confidence interval bounds: 4 significant figures
- Degrees of freedom: integer unless Welch (then 2 decimals)
- Use `Intl.NumberFormat` with `en-US` locale for now
- Never display raw IEEE 754 noise
  (e.g., never `0.30000000000000004`)
- Never round during computation, only at display time

## 17. Image and Icon Policy

- All images self-created, licensed via Creative Commons, or from
  permission-cleared sources. Attribution recorded in `/content/credits.md`.
- No AI-generated stock images.
- Mathematical diagrams: rendered via SVG (Recharts, D3, custom) or
  KaTeX, never as raster images.
- Decorative images: `alt=""`. Informational images: descriptive alt.
- Format: WebP for raster, SVG for vector.
- Lazy load below-the-fold images with `loading="lazy"`.
- Favicon family generated via `app/icon.tsx` and `app/apple-icon.tsx`
  using the same simple wordmark or monogram.

## 18. Open Graph Strategy

- Site-wide default: `app/opengraph-image.tsx`, 1200×630 PNG,
  Statoma wordmark + tagline.
- Per-calculator: `app/calculators/[slug]/opengraph-image.tsx`,
  dynamically composed:
  - Statoma wordmark top-left
  - Calculator name, large, center
  - One-line description below name
  - Subtle faded formula or distribution curve in the background
- Per-topic article: same template, with article title.
- Twitter Card type: `summary_large_image`.
- All OG images prerendered at build time (static export compatible).

## 19. Analytics and Tracking

- Cloudflare Web Analytics: privacy-friendly, cookie-less,
  loaded on every page, primary metric source.
- Google Analytics 4: deeper funnel insights, loaded only after
  consent for EU/UK visitors.
- Custom events to track:
  - `calculator_view` (page view with calculator slug)
  - `calculator_submit` (user clicks Calculate; record slug + mode)
  - `result_copied` (Phase 2)
- Never track: raw input values, PII, IP-like identifiers.
- Anonymize IP in GA4 config.

## 20. Legal and AdSense Compliance

### Required pages (no placeholders allowed)

- **Privacy Policy** (`/privacy`):
  - What data is collected (analytics, future ad cookies)
  - Third parties: Cloudflare, Google (GA4, AdSense post-approval)
  - User rights: GDPR (EU/UK), CCPA (California)
  - Cookies: list each, purpose, opt-out instructions
  - Contact email for privacy inquiries
  - Last updated date
- **Terms of Service** (`/terms`):
  - Calculators are educational; not professional advice
  - No warranty on results; users verify independently
  - Copyright and acceptable use
  - Last updated date
- **About** (`/about`):
  - Real human author with credentials (E-A-T signal)
  - Mission statement
  - How the site is built and updated
  - Contact link
- **Contact** (`/contact`):
  - Real working email (forwarded via Cloudflare Email Routing)
  - Response expectation ("we respond within X days")

### Cookie consent

- Lightweight banner (Klaro or custom, under 10 KB)
- EU/UK visitors: explicit consent required before GA4 or AdSense
  cookies load
- US/other: opt-out model acceptable; banner still offered
- "Necessary" Cloudflare cookies: no consent needed

### AdSense pre-submission checklist

Do not submit until every box is ticked:

- [ ] Domain is at least 60 days old with stable hosting
- [ ] All 5 calculators live, each with full 1500+ word content
- [ ] At least 3 pillar articles live in /topics/
- [ ] Privacy, Terms, About, Contact pages live with real content
- [ ] No "Coming soon", no Lorem ipsum, no broken internal links
- [ ] Sitemap.xml submitted to Google Search Console
- [ ] At least 30 days of indexing activity visible in GSC
- [ ] All pages pass Google Rich Results Test for their schema
- [ ] Mobile-friendly per PageSpeed Insights
- [ ] HTTPS enforced site-wide
- [ ] No banned content categories
- [ ] Cookie consent banner deployed
- [ ] `ads.txt` plan ready (file created after approval)

If rejected, fix the cited issues and wait 30 days before resubmitting.
Do not panic-resubmit.

## 21. Pillar Content Strategy (/topics/)

Phase 1.75 deliverables (in priority order):

1. `/topics/understanding-p-values`
2. `/topics/statistical-power-and-sample-size`
3. `/topics/confidence-intervals-explained`

Phase 2 expansion candidates:
- `/topics/choosing-the-right-t-test`
- `/topics/chi-square-test-when-and-how`
- `/topics/effect-size-and-why-it-matters`
- `/topics/what-counts-as-statistical-significance`

Rules for pillar articles:

- 2500-4000 words, structured per Section 8
- AI may scaffold the outline; substance is human-written and reviewed
- Each article internally links to 3-5 calculator pages with
  descriptive anchor text
- Each article cites 3-5 authoritative external sources
  (peer-reviewed papers, textbook chapters, primary documentation)
- Tone: professorial, not bloggy. No "Hey there!", no rhetorical
  questions in headers, no listicle structure.

## 22. Internal Linking Rules

- Calculator pages link to:
  - 4-6 related calculators (in `RelatedCalculators` component)
  - 1-2 relevant topic articles
- Topic articles link to:
  - 3-5 relevant calculators (in flowing prose, not a link dump)
  - 2-3 other topic articles
- Anchor text describes the destination
  ("the independent samples t-test" not "this page")
- No reciprocal-link rings, no footer link dumps
- Update internal links whenever a new page is added — backlinks
  matter for SEO equity distribution

## 23. External Linking Rules

- Cite authoritative sources only (peer-reviewed papers, textbooks,
  primary documentation, government statistical agencies)
- `rel="noopener"` on all external `target="_blank"` links
- `rel="nofollow"` on user-generated or commercial links (Phase 2)
- `rel="sponsored"` on affiliate links (Phase 2, if/when used)
- Open in new tab for citations; same tab for educational sources

## 24. Error and Loading States

- Invalid input: inline error below the field, red text + icon
  (not color alone); preserve user's typed value
- Submitting: button shows spinner, inputs disabled, submit-region
  has `aria-busy="true"`
- Empty state (before first calculation): show one example data
  hint above inputs
- 404 page: friendly, math-themed, links back to /calculators
  and a one-line search box (Phase 2)

## 25. Operations and Monitoring

Weekly:
- Google Search Console: impressions, top queries, indexing errors
- Cloudflare Web Analytics: traffic anomalies, top pages
- Cloudflare Pages build status

Monthly:
- GA4 engagement metrics (post-consent)
- Core Web Vitals report
- Regression test suite: all `/lib/stats/` tests pass
- Manual smoke test: open every calculator on a phone, calculate

Quarterly:
- Content audit: any pages with 0 impressions in 90 days
- Update statistics if external references have changed
- Refresh About page if author credentials/work have changed

## 26. Never Do (Hard Rules)

- No thin content (every page ≥1500 words beyond the UI;
  topics ≥2500 words)
- No AI-generated stock images
- No AI-generated body content for pillar articles
  (scaffolding only; humans write substance)
- No tracking scripts beyond Cloudflare Analytics and GA4
- No tech stack changes without updating this file first
- No hardcoded example numbers or copy in component files (use MDX)
- No skipping unit tests for `/lib/stats/` functions
- No marketing fluff in body content
- No exclamation points outside of headers/CTAs
- No emojis in body content
- No server-side features (static export only)
- No `src/` directory wrapper
- No silent input coercion in math functions
- No URL changes after indexing without 301 redirects
- No AdSense submission before the Section 20 checklist is complete

## 27. Development Workflow

- Plan before code: output implementation plan first, wait for "go"
- One feature per commit, atomic changes
- Run `npm run verify` (lint + test + build) before any commit
- Reference existing patterns — don't reinvent
- Commit messages: conventional commits (feat:, fix:, docs:, test:, etc.)
- Use path alias `@/*` for all internal imports
- Use npm only (not pnpm or yarn)
- Branch naming: `feat/short-description`, `fix/short-description`
- Open a PR for any change to `/lib/stats/`; self-merge after CI passes

## 28. Roadmap

### Phase 1: Foundation — Weeks 1-8 (COMPLETED)

- Project skeleton, brand, deployment pipeline
- 5 calculator pages with full content:
  - /calculators/t-test
  - /calculators/p-value
  - /calculators/confidence-interval
  - /calculators/sample-size
  - /calculators/chi-square
- Index, legal, about, contact placeholders

### Phase 1.5: Quality Hardening — Weeks 9-10

- Math correctness test suite for every calculator
  (Section 9 standards)
- Content depth audit against Section 7 requirements
- Mobile UX audit on real devices
- Accessibility audit (axe-core, manual keyboard testing)
- Performance audit (PageSpeed Insights, fix anything below Section 13)
- Number formatting consolidation into `/lib/format/`

### Phase 1.75: Pre-Launch Infrastructure — Weeks 10-12

- Google Search Console + Bing Webmaster Tools setup
- Sitemap submitted, robots.txt verified
- Cloudflare Web Analytics installed
- GA4 installed with consent banner
- Open Graph images generated for all pages
- Favicon family via `app/icon.tsx`
- Schema validated for every page via Google Rich Results Test
- 404 page styled and tested
- Email forwarding via Cloudflare Email Routing
- Legal pages finalized (Privacy, Terms, About, Contact)

### Phase 1.9: Content Depth and Launch Posture — Weeks 12-14

- 3 pillar articles live in /topics/ per Section 21
- Internal link graph reviewed and densified
- External backlink building:
  - 5-10 substantive answers on Cross Validated linking to calculators
  - 3-5 helpful Reddit answers (r/AskStatistics, r/learnstatistics)
  - 1-2 GitHub awesome-list PRs
  - 1 technical writeup on dev.to or Hashnode
- Monitor GSC weekly; iterate on long-tail queries
- Domain age accumulates toward 60+ days

### Phase 2: AdSense + Growth Iteration — Months 4-6

- Submit AdSense application once Section 20 checklist is complete
- After approval: `ads.txt` deployed, ad slots placed conservatively
  (no above-fold ads on calculator pages; sidebar and inline only)
- Add 5-10 more calculators based on GSC query data
- Add 3-5 more topic articles
- Begin Phase 2 audience design work
  (audience switch helper in `/lib/audience/`)

### Phase 2.5: A/B Testing Expansion — Month 6+

- `/calculators/` page accepts a new "audience" filter:
  Academic vs Marketing
- Add B2B-flavored versions of relevant calculators
- New pillar articles for marketing audience
- New OG image template for B2B variant
- Consider affiliate partnerships (Statsig, PostHog, GrowthBook)

### Phase 3 and beyond: To be planned after Phase 2 data is in

---

When in doubt about a decision not covered above, default to:
1. What better serves a confused student trying to understand statistics?
2. What better serves the long-term trust of the site?
3. What better serves Google's stated quality guidelines?
