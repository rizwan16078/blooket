# AI Context — Blooket Calculator Project

> This file is the canonical reference for any AI agent working on this codebase.
> Read it before making changes. It contains the project overview, architecture,
> data model, conventions, SEO strategy, and a full page inventory.

---

## 1. Project Overview

- **Name:** Blooket Calculator (calculatorblooket.com)
- **Purpose:** A production-grade Blooket pack odds calculator with exact probability math, Monte Carlo simulation, and a comprehensive SEO content strategy targeting topical authority in the Blooket niche.
- **Goal:** Become the #1 website for Blooket pack odds, calculator tools, and strategy content — dominating search through programmatic SEO and topical authority.
- **Framework:** Next.js 16.2.4 (App Router, Turbopack, React 19, TypeScript 5)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Deployment:** Static export (SSG) — all 332 pages pre-rendered at build time
- **Site URL:** `https://www.calculatorblooket.com`

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Runtime | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui, class-variance-authority |
| Charts | Recharts 3.8 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Confetti | canvas-confetti |
| Hooks | usehooks-ts |
| Build | Turbopack (Next.js built-in) |
| Linting | ESLint 9 + eslint-config-next |

---

## 3. Architecture

### 3.1 App Router Structure

```
app/
├── page.tsx                          # Home — main interactive calculator
├── layout.tsx                        # Root layout (navbar, footer, theme)
├── globals.css                       # Global styles
├── sitemap.ts                        # Dynamic sitemap.xml generator
├── robots.ts                         # robots.txt
├── icon.svg                          # Site icon
│
├── [packSlug]/page.tsx               # Dynamic pack pages (/space-box-odds, etc.)
├── about/
│   ├── page.tsx                      # About page
│   └── who-made-blooket/page.tsx     # Founder, history & timeline (720/mo)
├── best-blooket-calculator/page.tsx  # Editorial: why this calculator is best
├── blog/
│   ├── page.tsx                      # Blog index
│   └── [slug]/page.tsx              # Individual blog posts (34 posts)
├── blooks/
│   ├── page.tsx                      # Blook library index (dynamic)
│   ├── [id]/page.tsx                # Individual blook detail pages (172 blooks)
│   ├── chroma/page.tsx              # Chroma rarity hub
│   ├── complete-list/page.tsx       # All 172 blooks sorted by rarity
│   ├── epic/page.tsx                # Epic rarity hub
│   ├── legendary/page.tsx           # Legendary rarity hub
│   ├── rare/page.tsx                # Rare rarity hub
│   ├── uncommon/page.tsx            # Uncommon rarity hub
│   └── starter/page.tsx             # Starter blooks page
├── calculators/
│   ├── page.tsx                      # Calculator hub
│   ├── pack-odds/page.tsx           # Pack odds table
│   ├── token-converter/page.tsx     # Token-to-pack converter
│   ├── roi/page.tsx                 # ROI calculator
│   ├── value/page.tsx              # Blook value calculator
│   └── chase/page.tsx              # Chase probability calculator
├── contact/page.tsx
├── editorial-guidelines/page.tsx
├── faq/page.tsx                      # Comprehensive FAQ (14 questions)
├── glossary/page.tsx                # 16-term glossary with cross-links
├── guides/
│   ├── page.tsx                     # Guide index
│   └── [slug]/page.tsx            # Individual guide pages (21 guides)
│   └── blooket-hack-alternative/page.tsx  # Hack→strategy redirect (4.4K/mo)
│   └── how-to-get-chroma-blooket/page.tsx  # Chroma hunting guide (1.3K/mo)
│   └── how-to-get-legendary-blooket/page.tsx  # Legendary hunting guide (110/mo)
├── how-it-works/page.tsx
├── html-sitemap/page.tsx
├── is-blooket-plus-worth-it/page.tsx # Editorial
├── llms.txt/route.ts               # AI-consumable site map
├── m/
│   └── [term]/page.tsx              # Misspelling landing pages (50 pages, 1.4M/mo)
├── methodology/page.tsx
├── packs/page.tsx                   # Pack data center
├── privacy/page.tsx
├── rss.xml/route.ts
├── team/page.tsx
├── terms/page.tsx
├── unblocked/page.tsx              # Alternate landing page
├── updates/page.tsx
└── value-guide/page.tsx            # Comprehensive value guide
```

### 3.2 Key Directories

| Directory | Purpose |
|---|---|
| `app/` | Next.js App Router pages and layouts |
| `components/` | React components (navbar, footer, calculator, guides, blog, packs, blooks, UI) |
| `components/ui/` | shadcn/ui primitives (Button, Card, Dialog, etc.) |
| `components/guides/GuideBody.tsx` | **Large file (~1200 lines)** — body content for all guide pages |
| `data/` | Static data: `guides.ts` (guide metadata), `blog.tsx` (blog posts with JSX content) |
| `lib/` | Core libraries: constants, math, packs, schema, authority, blog, odds |
| `types/` | TypeScript type definitions |
| `workers/` | Web Worker for Monte Carlo simulation |
| `public/` | Static assets (blook images, pack images, og images) |

---

## 4. Data Model

### 4.1 Core Types (`types/index.ts`)

```typescript
type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Chroma";

interface Blook {
  id: string;           // e.g. "space-pink-astronaut"
  packId: string;       // e.g. "space"
  name: string;         // e.g. "Pink Astronaut"
  rarity: Rarity;
  dropRate: number;      // Decimal probability (e.g. 0.0005 = 0.05%)
  imageUrl: string;
  sellValue: number;     // Tokens received when selling
  description: string;
  rotationGroup?: string; // Set if blook shares a drop slot (e.g. "space-colored-astronaut")
}

interface PackRecord {
  id: string;           // e.g. "space"
  name: string;         // e.g. "Space"
  route: string;        // e.g. "/space-box-odds"
  costPerPull: number;  // 20 or 25 tokens
  effectiveCost: number; // Average cost after duplicate sell-back
  isLocked: boolean;    // true = seasonal pack, currently unavailable
  // ... theme, accent, description fields
}
```

### 4.2 Data Constants (`lib/constants.ts`)

- **`BLOOKS`**: Array of all 172 blooks, built from `PACK_SEEDS`
- **`PACKS`**: Array of all pack records (PackRecord[])
- **`PACK_MAP`**: `Record<string, PackRecord>` — pack lookup by ID
- **`PACK_BLOOKS_MAP`**: `Record<string, Blook[]>` — blooks grouped by pack ID
- **`SELL_VALUES`**: `Record<Rarity, number>` — fixed sell values per rarity tier
  - Common: 2, Uncommon: 5, Rare: 20, Epic: 75, Legendary: 200, Chroma: 300
  - Exception: Megalodon sells for 250 instead of 300
- **`RARITY_DESIGN`**: Color and glow mapping per rarity for UI rendering
- **`LAST_UPDATED`**: "2026-05-03" — data freshness timestamp

### 4.3 Pack Data

- **Pack costs**: 20 tokens (most packs) or 25 tokens (Wonderland, Ice Monsters)
- **Seasonal packs** (`isLocked: true`): Blizzard, Spooky, Autumn — rotate in/out
- **Rotation groups**: Space Pack has 7 colored astronauts sharing one 0.05% slot
- **Effective cost**: Pre-computed `pack.price - averageDuplicateSellback`

---

## 5. Math & Probability (`lib/math.ts`)

### 5.1 Core Formulas

| Function | Formula | Purpose |
|---|---|---|
| `calculateAtLeastOneSuccess(rate, attempts)` | `1 - (1 - rate)^attempts` | Cumulative probability of at least one success |
| `calculateOpenCount(tokens, pack, dupesEnabled)` | `tokens / costPerPull` or `tokens / effectiveCost` | Number of pack opens for a token budget |
| `calculateEstimatedTokensForBlook(blook, pack)` | `pack.costPerPull / blook.dropRate` | Expected token cost to pull a blook once |
| `getRarityRate(packId, rarity)` | Sum of drop rates for that rarity in that pack | Combined drop rate per rarity tier |
| `getMetricRate(pack, metric)` | Sum of relevant rarity rates | "epicPlus" = Epic+Legendary+Chroma combined |
| `calculatePackProbabilities(pack, tokens, dupesEnabled)` | Applies cumulative formula to each metric | Main calculator output |

### 5.2 Constants

- `DEFAULT_TOKENS = 500`
- `MONTE_CARLO_ITERATIONS = 5000`
- `MAX_TOKENS = 100000`
- `MAX_PULLS_PER_RUN = 10000`
- `CONFETTI_THRESHOLD = 0.999`

### 5.3 Chase Calculator Formula

```
n = log(1 - P) / log(1 - p)
tokens = ceil(n) * packCost
```
Where P = target probability (0.5, 0.9, 0.99) and p = single-pull drop rate.

---

## 6. SEO Strategy

### 6.1 Topical Authority Approach

The site targets **topical authority** — covering every aspect of Blooket probability and strategy so comprehensively that search engines recognize it as the authoritative source. This means:

- **Programmatic SEO**: 172 blook detail pages + ~15 pack pages, all auto-generated from data
- **Calculator cluster**: 5 specialized calculators + hub page, each targeting distinct keyword clusters
- **Guide cluster**: 21 guide pages covering every Blooket mechanic and strategy topic
- **Editorial pages**: Long-form content targeting high-volume informational queries
- **Glossary**: 16-term glossary with internal cross-linking

### 6.2 On-Page SEO Requirements

Every page **must** include:

1. **Metadata** (`generateMetadata` or static `metadata` export):
   - `title`: Unique, keyword-rich, under 60 chars
   - `description`: Compelling, under 160 chars
   - `keywords`: Array of 4-8 target keywords
   - `alternates.canonical`: Full URL with `siteUrl` prefix
   - `alternates.languages`: `en-US` and `x-default`
   - `openGraph`: title, description, type, url

2. **BreadcrumbList schema** (JSON-LD):
   - Use `buildBreadcrumbSchema()` from `@/lib/schema`
   - Serialize with `serializeJsonLd()` (escapes `<` for safety)
   - Inject via `<script type="application/ld+json">`

3. **Article schema** (for guides and blog posts):
   - `@type: "Article"` with headline, description, datePublished, dateModified, author, publisher, mainEntityOfPage

4. **Internal links**: Every page must link to at least 2-3 related pages (calculators, guides, packs, blooks)

5. **Semantic HTML**: Use `<article>`, `<section>`, `<aside>`, `<header>`, proper heading hierarchy

### 6.3 Schema Types Used

| Schema | Where | Builder |
|---|---|---|
| BreadcrumbList | Every page | `buildBreadcrumbSchema()` |
| Article | Guide pages, blog posts | Inline in page component |
| SoftwareApplication | Pack calculator pages | `buildSoftwareSchema()` |
| FAQPage | Pack pages | `buildFaqSchema()` |
| Organization | Root layout | `buildOrganizationSchema()` |
| WebSite | Root layout | `buildWebSiteSchema()` |
| SiteNavigationElement | Root layout | `buildSiteNavigationSchema()` |
| Dataset | Blook detail pages | Inline in page component |

---

## 7. Page Inventory (332 pages total)

### 7.1 Calculator Pages (6)

| Route | Title | Priority |
|---|---|---|
| `/calculators` | All Blooket Calculators — Pack Odds, Token Converter, ROI & More | 0.95 |
| `/calculators/pack-odds` | Blooket Pack Odds Calculator — Live Drop Rates for Every Pack | 0.9 |
| `/calculators/token-converter` | Blooket Token to Pack Converter — How Many Packs Can You Open? | 0.9 |
| `/calculators/roi` | Blooket ROI Calculator — Best Pack Value per Token Spent | 0.9 |
| `/calculators/value` | Blooket Blook Value Calculator — Sell Values, Drop Rates & Token Cost | 0.9 |
| `/calculators/chase` | Blooket Chase Calculator — Token Budget for Any Blook at 50%, 90% & 99% | 0.9 |

### 7.2 Authority & Hub Pages (17)

| Route | Title | Priority |
|---|---|---|
| `/value-guide` | Blooket Value Guide — Sell Values, Drop Rates & Tier Filter | 0.9 |
| `/blooks/complete-list` | All Blooks in Blooket — Complete Visual Library (172 Blooks) | 0.9 |
| `/blooks/chroma` | All Chroma Blooks in Blooket — Drop Rates, Packs & Chase Odds | 0.9 |
| `/blooks/legendary` | All Legendary Blooks in Blooket — Drop Rates, Packs & Chase Odds | 0.9 |
| `/blooks/epic` | All Epic Blooks in Blooket — Drop Rates, Packs & Sell Values | 0.9 |
| `/blooks/rare` | All Rare Blooks in Blooket — Drop Rates, Packs & Sell Values | 0.9 |
| `/blooks/uncommon` | All Uncommon Blooks in Blooket — Drop Rates, Packs & Sell Values | 0.9 |
| `/blooks/starter` | Blooket Starter Blooks — What You Get Before Opening Any Pack | 0.7 |
| `/faq` | Blooket FAQ — Every Question Answered | 0.9 |
| `/guides/blooket-hack-alternative` | Blooket "Hack": The Math-Based Strategy That Actually Works | 0.85 |
| `/guides/how-to-get-chroma-blooket` | How to Get a Chroma in Blooket — 7 Proven Strategies (2026) | 0.9 |
| `/guides/how-to-get-legendary-blooket` | How to Get Legendary Blooks in Blooket — Pack Comparison & Drop Math | 0.9 |
| `/about/who-made-blooket` | Who Made Blooket? — Founder, History & Timeline | 0.8 |
| `/glossary` | Blooket Glossary — Every Term, Stat & Mechanic Explained | 0.85 |
| `/is-blooket-plus-worth-it` | Is Blooket Plus Worth It? — Honest Breakdown for 2026 | 0.85 |
| `/best-blooket-calculator` | Best Blooket Calculator — Why This One Is Different | 0.85 |

### 7.3 Dynamic Pages

| Route Pattern | Count | Schema |
|---|---|---|
| `/[packSlug]` | ~15 packs | SoftwareApplication + FAQPage + BreadcrumbList |
| `/blooks/[id]` | 172 blooks | Dataset + BreadcrumbList |
| `/m/[term]` | 50 misspellings | BreadcrumbList |
| `/guides/[slug]` | 21 guides | Article + BreadcrumbList |
| `/blog/[slug]` | 34 blog posts | Article + BreadcrumbList |

### 7.4 Guide Entries (21)

| Slug | Title | Category |
|---|---|---|
| `blooket-drop-rates` | Blooket Drop Rates Explained | Glossary |
| `blooket-tokens` | Blooket Tokens — How to Earn, Spend & Budget | Game Mechanics |
| `blooket-packs` | Blooket Packs — The Complete Pack Guide | Pack Strategy |
| `blooket-sell-values` | Blooket Sell Values — Every Rarity Explained | Glossary |
| `blook-score-explained` | Blook Score Explained | Game Mechanics |
| `best-blooket-pack-to-open` | Best Blooket Pack to Open | Pack Strategy |
| `best-pack-for-chromas` | Best Pack for Chromas | Pack Strategy |
| `chroma-blooks` | Chroma Blooks — The Rarest Tier | Rarity Hub |
| `legendary-blooks` | Legendary Blooks — The Second-Rarest Tier | Rarity Hub |
| `how-to-sell-blooks` | How to Sell Blooks | Game Mechanics |
| `how-the-blooket-market-works` | How the Blooket Market Works | Game Mechanics |
| `cumulative-probability` | Cumulative Probability in Blooket | Game Mechanics |
| `blooket-pack-set` | Blooket Pack Set Explained | Pack Strategy |
| `blooket-rookie-mistakes` | Blooket Rookie Mistakes to Avoid | Pack Strategy |
| `blooket-badge-roadmap` | Blooket Badge Roadmap | Game Mechanics |
| `blooket-streak-myths` | Blooket Streak Myths Debunked | Game Mechanics |
| `sell-or-keep-blooks` | Sell or Keep Blooks — The Decision Framework | Game Mechanics |
| + 4 more existing guides | | |

### 7.5 Glossary Terms (16)

Drop Rate, Rarity, Chroma, Legendary, Epic, Sell Value, Effective Cost, Cumulative Probability, Chase, Seasonal Pack, Duplicate Resell, Monte Carlo Simulation, Token, Rotation Group, Chase Calculator, Locked Pack

---

## 8. Component Architecture

### 8.1 Key Components

| Component | Location | Purpose |
|---|---|---|
| `CalculatorClient` | `components/calculator-client.tsx` | Main interactive calculator (client component, ~19KB) |
| `Navbar` | `components/navbar.tsx` | Site navigation with mobile menu |
| `Footer` | `components/footer.tsx` | Site footer with links |
| `GuideBody` | `components/guides/GuideBody.tsx` | **Body content for all 21 guides** (~1200 lines) |
| `ContentMeta` | `components/content/ContentMeta.tsx` | Published/updated dates, sources, editorial notes |
| `PackExperiencePage` | `components/pack-experience-page.tsx` | Pack detail page renderer |
| `FaqAccordion` | `components/FaqAccordion.tsx` | FAQ accordion for pack pages |

### 8.2 Navbar Links

```typescript
const NAV_LINKS = [
  { href: "/", label: "Calculator" },
  { href: "/calculators", label: "Calculators" },
  { href: "/packs", label: "Packs" },
  { href: "/blooks", label: "Blook Library" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/methodology", label: "Methodology" },
];
```

---

## 9. Conventions & Rules

### 9.1 Code Conventions

- **App Router only** — no Pages Router, no `pages/` directory
- **Static generation** — all pages use `generateStaticParams` or are static
- **`dynamicParams = false`** — unknown dynamic routes return 404
- **Server Components by default** — add `"use client"` only when needed (interactivity, hooks, browser APIs)
- **Path aliases** — `@/` maps to project root (configured in `tsconfig.json`)
- **Import style** — `import { X } from "@/lib/constants"` (named imports, path aliases)
- **No hardcoded site URLs** — always use `siteUrl` from `@/lib/site`
- **No hardcoded pack costs** — always use `pack.costPerPull` or `PACK_MAP[blook.packId]?.costPerPull`

### 9.2 SEO Conventions

- Every new page **must** be added to `app/sitemap.ts`
- Every new page **must** have `alternates.canonical` with full URL
- BreadcrumbList schema on every page
- Article schema on all guide and blog pages
- Internal links to at least 2-3 related pages per page
- OpenGraph metadata with `type: "article"` for editorial, `type: "website"` for tools
- Keywords array with 4-8 terms per page

### 9.3 Data Conventions

- **Drop rates are decimals** — 0.05% is stored as `0.0005`
- **Sell values are integers** — tokens, no decimals
- **Rotation groups** — blooks sharing a drop slot have the same `rotationGroup` string
- **Effective cost** — pre-computed per pack, accounts for average duplicate sell-back
- **Pack IDs** — lowercase strings: "space", "medieval", "bot", etc.
- **Blook IDs** — format: `{packId}-{name-slug}`: "space-pink-astronaut", "medieval-king"

### 9.4 UI Conventions

- **Dark theme** — background `#0a0e1a`, text white/white-opacity
- **Rarity colors**: Common=slate, Uncommon=emerald, Rare=sky, Epic=violet, Legendary=amber, Chroma=teal
- **Card style**: `rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg`
- **Link style**: `text-emerald-400 hover:text-emerald-300` for internal links
- **Tag/badge style**: `rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-medium text-white/40`
- **Section label**: `text-xs font-bold uppercase tracking-[0.28em] text-violet-400`
- **Related links aside**: `rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80`

---

## 10. Key Files Reference

| File | Purpose | Size |
|---|---|---|
| `lib/constants.ts` | All blook/pack data, sell values, rarity design | ~600 lines |
| `lib/math.ts` | Probability calculations, formatting, simulation constants | ~250 lines |
| `lib/packs.ts` | Pack type extensions, pack lookup, rarity key mapping | ~156 lines |
| `lib/schema.ts` | JSON-LD schema builders (Breadcrumb, FAQ, Software, Org, WebSite) | ~143 lines |
| `lib/authority.ts` | Rarity hub helpers (getBlooksByRarity, getRaritySummary, rankings) | ~86 lines |
| `lib/site.ts` | Site URL and name constants | 5 lines |
| `data/guides.ts` | Guide entry metadata (21 guides) | ~392 lines |
| `data/blog.tsx` | Blog post data (34 posts) — JSX content with PAS intros, tables, FAQs, internal links | ~3,500+ lines |
| `components/guides/GuideBody.tsx` | Body content for all guide pages | ~1200 lines |
| `app/sitemap.ts` | Dynamic sitemap generator for all 332 pages | ~185 lines |
| `app/llms.txt/route.ts` | AI-consumable site map | ~122 lines |
| `app/layout.tsx` | Root layout with org/website/nav schema | ~80 lines |
| `components/navbar.tsx` | Navigation bar | ~138 lines |
| `components/calculator-client.tsx` | Main interactive calculator | ~19KB |

---

## 11. Build & Deploy

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (generates 332 static pages)
npx next build

# Lint
npm run lint
```

- Build output: `.next/` directory
- All pages are statically generated at build time (SSG)
- No server-side rendering or ISR required
- Deploy target: Vercel or any static host

---

## 12. Content Strategy Notes

### 12.1 Internal Linking Map

The site uses a hub-and-spoke internal linking model:

- **Calculator Hub** (`/calculators`) links to all 5 calculators + main calculator
- **Each calculator** links back to hub + 1-2 related calculators + relevant guide
- **Rarity Hubs** (`/blooks/chroma`, `/blooks/legendary`) link to chase calculator, best-pack guides, blook library
- **Value Guide** links to rarity hubs, value calculator, sell guide
- **Glossary** links cross-reference between all 16 terms
- **Guides** link to calculators, other guides, and pack/blook pages
- **Blog posts** link to main calculator and related guides
- **Blook detail pages** link to their pack, chase calculator, and rarity hub

### 12.2 Keyword Targeting

- **Head terms**: "blooket calculator", "blooket pack odds", "blooket drop rates"
- **Calculator terms**: "blooket chase calculator", "blooket ROI calculator", "blooket token calculator"
- **Rarity terms**: "blooket chroma", "blooket legendary", "rarest blooket blook"
- **Strategy terms**: "best blooket pack to open", "how to get chroma blooket", "blooket rookie mistakes"
- **Editorial terms**: "is blooket plus worth it", "best blooket calculator"
- **Long-tail**: "{blook name} drop rate", "{blook name} chase odds", "how to get {blook name}"

### 12.3 llms.txt

The site exposes `/llms.txt` for AI consumption, containing:
- Site metadata (name, description, URL)
- Full site structure (21 routes documented)
- Featured content highlights
- Essential links
- Built dynamically from guide and blog data

---

## 13. Root Layout & Global Schema (`app/layout.tsx`)

The root layout wraps every page and injects three global JSON-LD schemas in `<head>`:

```html
<script type="application/ld+json">  <!-- Organization -->
<script type="application/ld+json">  <!-- WebSite with SearchAction -->
<script type="application/ld+json">  <!-- SiteNavigationElement -->
```

### Layout Metadata

- **Title template**: `%s | Blooket Calculator` — page titles auto-append site name
- **Default title**: `Blooket Calculator — Pack Odds & Drop Rates` (used on home via `title: { absolute: "..." }`)
- **metadataBase**: `new URL(siteUrl)` — required for resolving relative OG URLs
- **Twitter card**: `summary_large_image`
- **RSS alternate**: `application/rss+xml` → `/rss.xml`
- **Verification codes**: Google (`VgPxVDfXDX0pCFb4XqboGAhQhmVMylB7XN-EAmUQ7MY`), Yandex, Bing

### Layout Structure

```
<html lang="en" class="h-full antialiased font-sans">
  <head>
    <!-- Organization, WebSite, SiteNavigationElement schemas -->
    <!-- Fonts injected via next/font/google -->
  </head>
  <body class="min-h-full flex flex-col bg-[#0a0e1a] text-slate-100">
    <Navbar />
    <Toaster />
    {children}          ← page content goes here
    <Footer />
    <BackToTop />
  </body>
</html>
```

### Fonts

- **Space Grotesk** — primary font, CSS variable `--font-space`
- **IBM Plex Mono** — monospace font (weights 400, 500, 600), CSS variable `--font-plex`

---

## 14. Home Page (`app/page.tsx`)

The home page is the main interactive calculator. Key features:

- **CalculatorCard** wrapped in `<Suspense>` with skeleton fallback
- **HomeQuickLinks** sidebar with quick navigation
- **FAQ section** with `FaqAccordion` (3 questions about calculator mechanics)
- **"How drop rates work"** explainer section with the binomial formula
- **Two JSON-LD schemas**: FAQPage + SoftwareApplication (game category)
- **Title uses `absolute`**: `title: { absolute: "Blooket Calculator — Exact Pack Odds & Drop Rates" }` — bypasses the template

### Home Page FAQ Entries

1. "How does the Blooket Calculator work?" — binomial probability explanation
2. "How does dupe refund mode work?" — static effective cost explanation
3. "What does Run Full Simulation do?" — Monte Carlo Web Worker explanation

---

## 15. Monte Carlo Simulation (`workers/simulation.worker.ts`)

The simulation runs in a **Web Worker** to avoid blocking the main thread.

### How It Works

1. Receives `SimulationWorkerInput`: `{ pack, blooks, tokens, dupesEnabled, targetRarity }`
2. Calculates pull count via `calculateSimulationOpenCount(tokens, pack, dupesEnabled)`
3. Runs `MONTE_CARLO_ITERATIONS` (5,000) iterations:
   - Each iteration: opens `pullCount` packs using `weightedPick(blooks)`
   - Tracks refund tokens and target rarity hits per iteration
4. Sorts outcomes and computes quantiles:
   - `p10BestCase` = 90th percentile of refund outcomes (lucky)
   - `p90WorstCase` = 10th percentile of refund outcomes (unlucky)
5. Generates one `simulatedRun` for visual display
6. Returns `SimulationWorkerOutput`

### Weighted Pick Algorithm

```typescript
function weightedPick(blooks: Blook[]) {
  const roll = Math.random();
  let cumulativeWeight = 0;
  for (const blook of blooks) {
    cumulativeWeight += blook.dropRate;
    if (roll <= cumulativeWeight) return blook;
  }
  return blooks[blooks.length - 1]; // fallback for rounding
}
```

### Rerun Limits

- `MAX_RERUNS_PER_SESSION = 5` — prevents infinite re-simulation
- `rerunAllowed` flag in output; `rerunCount` tracks session state

---

## 16. Pre-Computed Odds Engine (`lib/odds.ts`)

A **performance-optimized** probability engine that pre-computes pack math for instant lookups.

### Architecture

```typescript
PRECOMPUTED_PACK_MATH: Record<PackSlug, { standard: PackMathEngine; refunded: PackMathEngine }>
```

- Built once at module load time from `PACKS` data
- Each `PackMathEngine` has: `costsPerBox`, `attempts(tokens)`, `epicPlus(tokens)`, `legendary(tokens)`, `chroma(tokens)`
- Two engines per pack: `standard` (no dupe refund) and `refunded` (with dupe refund)

### Key Functions

| Function | Purpose |
|---|---|
| `getCalculatorSnapshot(packSlug, tokens, dupeRefund)` | Returns `CalculatorSnapshot` with attempts, costs, and all 3 probabilities |
| `atLeastOneSuccess(perTryRate, attempts)` | Same binomial formula as `lib/math.ts` |
| `formatPercent(value)` | Percentage formatting (slightly different thresholds from `lib/math.ts`) |
| `formatTokens(value)` | Token number formatting |
| `formatDateLabel(value)` | Date formatting (e.g. "May 3, 2026") |
| `probabilityOneIn(rate)` | "1 in X" format (e.g. "1 in 2,000") |

### Relationship to `lib/math.ts`

Both files implement the same core probability formula. `lib/math.ts` is the primary library used by most pages. `lib/odds.ts` is the pre-computed engine used by the interactive calculator client for instant lookups without recalculating pack rates on every slider change.

---

## 17. SEO Schema Details (`lib/schema.ts` + `lib/seo/schema.ts`)

### 17.1 Core Schema Builders (`lib/schema.ts`)

| Builder | Output | Used By |
|---|---|---|
| `buildBreadcrumbSchema(items)` | BreadcrumbList | Every page |
| `buildFaqSchema(faqs)` | FAQPage | Home page, pack pages |
| `buildSoftwareSchema(pack)` | SoftwareApplication | Pack calculator pages |
| `buildOrganizationSchema()` | Organization (with `@id: siteUrl/#organization`) | Root layout |
| `buildWebSiteSchema()` | WebSite (with SearchAction targeting `/packs?search=`) | Root layout |
| `buildSiteNavigationSchema()` | ItemList of SiteNavigationElement | Root layout |
| `serializeJsonLd(value)` | JSON string with `<` escaped to `\u003c` | All schema injection |

### 17.2 Packs Page Schema (`lib/seo/schema.ts`)

The packs page uses a rich `@graph` schema with:

- **CollectionPage** — the packs hub itself
- **BreadcrumbList** — Home → Packs
- **DataCatalog** — indexed pack datasets
- **Per-pack**: BreadcrumbList (Home → Packs → {Pack}) + Dataset/ItemList with all blooks as ListItem entries

### 17.3 Article Schema (Inline in Guide/Blog Pages)

Applied to all `/guides/[slug]` and `/blog/[slug]` pages:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "url": "...",
  "datePublished": "...",
  "dateModified": "...",
  "author": { "@type": "Organization", "name": "Blooket Calculator" },
  "publisher": { "@type": "Organization", "name": "Blooket Calculator", "url": "..." },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "..." }
}
```

### 17.4 Blook Detail Page Schema (Inline)

Each `/blooks/[id]` page includes a **Dataset** schema describing the blook's stats:

```json
{
  "@type": "Dataset",
  "name": "{blook.name} — Drop Rate & Sell Value Data",
  "description": "...",
  "url": "...",
  "keywords": ["drop rate", "sell value", "chase odds", rarity]
}
```

---

## 18. Security & Headers (`next.config.ts`)

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data:;
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

### Security Headers (applied to all routes)

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | (see above) |

### Redirects

| Source | Destination | Type |
|---|---|---|
| `/about-us` | `/about` | 301 (permanent) |

### Image Optimization

- Formats: AVIF, WebP
- Device sizes: 320, 420, 640, 828, 1080, 1200, 1920
- Image sizes: 64, 128, 192, 256

---

## 19. Robots.txt (`app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /*?pack=
Disallow: /*?blook=
Disallow: /*?tokens=
Disallow: /*?autorun=
Disallow: /*?packId=
Disallow: /*?blookId=

Sitemap: https://www.calculatorblooket.com/sitemap.xml
```

Query parameter URLs are blocked to prevent duplicate content indexing (the calculator state is client-side only).

---

## 20. Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.calculatorblooket.com` | Canonical site URL |
| `NEXT_PUBLIC_SITE_NAME` | `Blooket Calculator` | Site name for OG/schema |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | `"The ultimate tool for calculating Blooket drop rates..."` | Site description for llms.txt fallback |

All env vars have safe defaults — the site works without any `.env` file.

---

## 21. Footer Structure (`components/footer.tsx`)

4-column grid layout:

| Column | Content |
|---|---|
| **Brand** | Logo, name, tagline ("Production-grade probability engine for Blooket packs. Exact math, not guesses.") |
| **Pack Calculators** | First 5 packs (dynamic from `PACKS`) + "All Packs →" link |
| **Resources** | 12 links: Guides, How It Works, Methodology, Updates, About, Contact, Team, Editorial Guidelines, HTML Sitemap, Privacy, Terms, Unblocked |
| **Trust & Updates** | Change log, Methodology, RSS subscription buttons |

Bottom bar: copyright, DMCA badge, contact email (`contact@blooketcalculator.com`), Privacy, Terms links.

---

## 22. Blog System

### Blog Data (`data/blog.tsx`)

- **34 blog posts** with rich JSX content (not strings — content is `React.ReactNode`)
- File extension is `.tsx` because `content` field contains inline JSX with `<Link>`, `<table>`, headings, etc.
- Each post includes: slug, title, excerpt, dates, category, imageUrl, hasCalculator flag, sources[], tags[], author, readTime, views, featured, content (JSX)
- Categories defined in `types/blog.ts` as `BLOG_CATEGORIES`: `GAME STRATEGY | ODDS & DATA | CALCULATOR TOOLS | TIPS & TRICKS | UPDATES`

### Blog Content Standards (`app/blog_content.md`)

Every blog post must comply with the editorial spec in `app/blog_content.md`. Verified standards (all 34 posts compliant as of May 2026):

- **Word count**: 350+ words (Phase 5 target; Phase 6 QA accepts ≥300)
- **PAS-style intro** (Problem-Agitation-Solution): 50-80 words, hooks the reader before any data
- **Body structure**: H2 sections, comparison tables (`<table>` with rarity-tier color cells), bullet lists, or rarity-card grids
- **Pro Tip / Trench Truth box**: bordered emerald-accent callout with insider-only insight
- **FAQ section**: 4-6 Q&A pairs in rounded card grid
- **Internal links**: 5-10 contextual `<Link>` references to calculators, packs, guides, other blog posts
- **External sources**: 3-5 authoritative `BlogSource` entries in the `sources` array
- **Banned phrases**: "In conclusion", "Look no further", "Welcome to the world of", "In this article we will", and similar AI-tells are forbidden

### Blog Library (`lib/blog.ts`)

Functions for filtering, sorting, and paginating blog posts:

| Function | Purpose |
|---|---|
| `getBlogPosts({ page, limit, search, category, sort })` | Paginated blog list with search/filter/sort |
| `searchPosts(posts, query)` | Search by title, excerpt, tags, category |
| `filterByCategory(posts, category)` | Filter by blog category |
| `sortPosts(posts, sort)` | Sort by: latest, oldest, popular, az |
| `getCategoryCounts(posts)` | Count posts per category |

### Blog Post Types (`types/blog.ts`)

```typescript
type BlogCategory =
  | "GAME STRATEGY"
  | "ODDS & DATA"
  | "CALCULATOR TOOLS"
  | "TIPS & TRICKS"
  | "UPDATES";

type SortOption = "latest" | "oldest" | "popular" | "az";
type ViewMode = "grid" | "list";

interface BlogSource {
  label: string;
  href: string;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  updatedAt: string;
  category: BlogCategory;
  imageUrl: string;
  hasCalculator: boolean;
  sources: BlogSource[];          // 3-5 external authoritative links per post
  content: React.ReactNode;       // JSX, not string — includes <Link>, <table>, FAQs, etc.
  tags: string[];
  author: { name: string; avatar?: string };
  readTime: string;
  views: number;
  featured: boolean;
}
```

Additional exports: `BlogCategoryCount`, `BlogPaginationResult`, `BLOG_CATEGORIES`, `POSTS_PER_PAGE` (12), `SORT_OPTIONS`.

---

## 23. Guide System

### Guide Data (`data/guides.ts`)

- 21 guide entries with: slug, title, excerpt, description, category, publishedAt, updatedAt, priority, keywords
- Categories: `"Glossary" | "Rarity Hub" | "Pack Strategy" | "Game Mechanics"`
- Priority: `"high" | "medium" | "low"` — affects sitemap priority (high=0.76, else=0.68)

### Guide Body Content (`components/guides/GuideBody.tsx`)

This is a **large file (~1200 lines)** that contains the actual body content for all 21 guides. It uses a switch on `guide.slug` to return the appropriate JSX. Each guide body includes:

- Section headings with `<h2>` tags
- Explanation paragraphs
- Bullet lists and numbered steps
- Internal links to calculators, other guides, and blook/pack pages
- Rarity tables and pack ranking tables where relevant
- "HowTo" style step-by-step instructions where applicable

### Guide Page Template (`app/guides/[slug]/page.tsx`)

- Uses `generateStaticParams` from `guideEntries` for SSG
- Uses `generateMetadata` for dynamic title/description/keywords
- Injects **BreadcrumbList** + **Article** schema
- Renders: breadcrumb nav, title, subtitle, ContentMeta, GuideBody, related links

---

## 24. Blook Detail Pages (`app/blooks/[id]/page.tsx`)

Each of the 172 blook detail pages includes:

- **Title format**: `"{blook.name} Blook — Drop Rate, Sell Value & Chase Odds"`
- **Keywords**: includes chase-specific terms: `"{name} chase odds"`, `"{rarity} blooket odds"`
- **H2 headings optimized for chase keywords**:
  - "How to Get the {blook.name} — Chase Odds"
  - "Is the {blook.name} Worth Chasing?"
- **Dataset schema** with blook stats
- **BreadcrumbList**: Home → Blooks → {blook.name}
- **Internal links**: pack page, chase calculator, rarity hub

---

## 25. Sitemap Priority Scale (`app/sitemap.ts`)

| Priority Range | Page Type |
|---|---|
| 1.0 | Home page |
| 0.95 | Calculators hub, Packs hub, Blooks hub |
| 0.9 | Individual calculators, Rarity hubs, Value guide |
| 0.85 | Glossary, Editorial pages, Unblocked |
| 0.8 | Individual packs, Blog index, Guides index |
| 0.76 | High-priority guides |
| 0.75 | Individual blooks |
| 0.72 | Individual blog posts |
| 0.7 | Starter blooks |
| 0.68 | Medium/low-priority guides |
| 0.65 | Methodology |
| 0.6 | About, How It Works, Contact |
| 0.55 | Updates |
| 0.5 | Team, Terms |
| 0.4 | Editorial Guidelines, HTML Sitemap |
| 0.3 | Privacy, Terms |

---

## 26. llms.txt Route (`app/llms.txt/route.ts`)

- **Revalidation**: 3600 seconds (1 hour)
- **Dynamic content**: Merges guide entries + blog posts, sorted by `updatedAt` descending
- **Structure**: Metadata → AI Usage Instructions → Site Structure (21 routes) → Featured Content (7 items) → Essential Links (top 12 recent posts) → Related Content categories
- **Fallback**: If generation fails, returns minimal 3-link version
- **Content-Type**: `text/plain; charset=utf-8`

---

## 27. Complete Component Tree

```
components/
├── calculator-client.tsx          # Main interactive calculator (client, ~19KB)
├── calculator/
│   └── CalculatorCard.tsx         # Calculator card wrapper
├── navbar.tsx                     # Site navigation (7 links, mobile menu)
├── footer.tsx                     # 4-column footer
├── FaqAccordion.tsx              # FAQ accordion component
├── pack-experience-page.tsx       # Pack detail page renderer (~16KB)
├── home/
│   └── HomeQuickLinks.tsx        # Sidebar quick links on home
├── guides/
│   └── GuideBody.tsx             # Body content for all 21 guides (~1200 lines)
├── blog/
│   └── (9 items)                 # Blog card, list, pagination, search, etc.
├── blooks/
│   └── (1 item)                  # Blook card/grid components
├── packs/
│   └── (5 items)                 # Pack card, grid, table, hero components
├── content/
│   └── ContentMeta.tsx           # Published/updated dates, sources
├── shared/
│   └── BackToTop.tsx             # Scroll-to-top button
├── loot/
│   └── (1 item)                  # Loot display/simulation results
└── ui/                           # shadcn/ui primitives
    └── (11 items)                # Button, Card, Dialog, Input, Select, Slider, etc.
```

---

## 28. Complete Library Reference

| File | Exports | Purpose |
|---|---|---|
| `lib/constants.ts` | `BLOOKS`, `PACKS`, `PACK_MAP`, `PACK_BLOOKS_MAP`, `SELL_VALUES`, `RARITY_DESIGN`, `LAST_UPDATED` | All game data |
| `lib/math.ts` | `calculateAtLeastOneSuccess`, `calculateOpenCount`, `calculatePackProbabilities`, `calculateEstimatedTokensForBlook`, `getRarityRate`, `getMetricRate`, `formatPercent`, `formatTokenLabel`, `formatHumanChance`, `getRiskBand`, `getBestValuePack`, `buildAdvisorLine`, `clampProbability`, `clampTokens` | Probability engine |
| `lib/odds.ts` | `PRECOMPUTED_PACK_MATH`, `getCalculatorSnapshot`, `atLeastOneSuccess`, `formatPercent`, `formatTokens`, `formatDateLabel`, `probabilityOneIn`, `formatCompactNumber`, `clampTokens` | Pre-computed odds for instant lookups |
| `lib/packs.ts` | `PACKS`, `PACK_IDS`, `getPackBySlug`, `RARITY_SELL_VALUES`, `Pack`, `PackSlug`, `RarityKey` | Pack type extensions and lookup |
| `lib/schema.ts` | `buildBreadcrumbSchema`, `buildFaqSchema`, `buildSoftwareSchema`, `buildOrganizationSchema`, `buildWebSiteSchema`, `buildSiteNavigationSchema`, `serializeJsonLd` | JSON-LD schema builders |
| `lib/seo/schema.ts` | `buildPacksPageSchema`, `serializeJsonLd` | Packs page rich schema (DataCatalog, Dataset per pack) |
| `lib/authority.ts` | `getBlooksByRarity`, `getRaritySummary`, `getPackMetricRankings`, `getLivePacks`, `getSeasonalPacks`, `getPackForBlook`, `formatRateLabel` | Rarity hub and ranking helpers |
| `lib/blog.ts` | `getBlogPosts` | Blog filtering, sorting, pagination |
| `lib/site.ts` | `siteUrl`, `siteName` | Site identity constants |
| `lib/simulation.ts` | Re-exports types from `@/types` | Simulation type aliases |
| `lib/utils.ts` | `cn()` | Tailwind class merge utility |
| `lib/search-params.ts` | Search parameter parsing | URL search param handling |

---

## 29. Type System (`types/`)

### `types/index.ts`

Core types: `Rarity`, `Pack`, `Blook`, `PackRecord`, `SimulatedLootItem`, `SimulationWorkerInput`, `SimulationWorkerOutput`

### `types/blog.ts`

Blog-specific types: `BlogPost`, `BlogCategory`, `BlogCategoryCount`, `BlogPaginationResult`, `SortOption`, `BLOG_CATEGORIES`, `POSTS_PER_PAGE`

---

## 30. Formatting Utilities Reference

| Function | File | Input | Output Example |
|---|---|---|---|
| `formatPercent(0.0035)` | `lib/math.ts` | `0.0035` | `"0.35%"` |
| `formatPercent(0.852)` | `lib/math.ts` | `0.852` | `"85.2%"` |
| `formatPercent(0.9999)` | `lib/math.ts` | `0.9999` | `"100.0%"` |
| `formatPercent(0.00001)` | `lib/math.ts` | `0.00001` | `"<0.01%"` |
| `formatTokenLabel(4200)` | `lib/math.ts` | `4200` | `"4,200 tokens"` |
| `formatHumanChance(0.003)` | `lib/math.ts` | `0.003` | `"1 in 333 chance"` |
| `formatHumanChance(0.35)` | `lib/math.ts` | `0.35` | `"4 in 10 chance"` |
| `formatDateLabel("2026-05-03")` | `lib/odds.ts` | ISO date | `"May 3, 2026"` |
| `formatTokens(4200)` | `lib/odds.ts` | `4200` | `"4,200"` |
| `probabilityOneIn(0.0005)` | `lib/odds.ts` | `0.0005` | `"1 in 2,000"` |
| `getRiskBand(0.8)` | `lib/math.ts` | `0.8` | `{ label: "Lucky range", tone: "green" }` |
| `getRiskBand(0.5)` | `lib/math.ts` | `0.5` | `{ label: "Normal range", tone: "yellow" }` |
| `getRiskBand(0.1)` | `lib/math.ts` | `0.1` | `{ label: "Risk zone", tone: "red" }` |

---

## 31. Common Pitfalls & Gotchas

- **Two `formatPercent` implementations**: `lib/math.ts` and `lib/odds.ts` both export `formatPercent` with slightly different rounding thresholds. Use `lib/math.ts` for page content, `lib/odds.ts` for calculator client.
- **Two `serializeJsonLd` implementations**: `lib/schema.ts` and `lib/seo/schema.ts` both export it. They are identical. Import from `@/lib/schema` for most pages.
- **Two `clampTokens` implementations**: `lib/math.ts` and `lib/odds.ts`. Same logic, different files.
- **`Pack` type vs `PackRecord` type**: `PackRecord` is the base type from constants. `Pack` (from `lib/packs.ts`) extends it with computed fields like `slug`, `dropRates`, `featuredBlooks`, `avgSellValue`.
- **`rotationGroup` filtering**: When calculating combined rarity rates, rotation group blooks must be deduplicated (only one active at a time). Use `getEffectiveBlooks()` or the `getRarityRate()` function which handles this.
- **`dynamicParams = false`**: Set on all dynamic route pages. Unknown slugs/IDs return 404, not a fallback page.
- **Title template override**: Home page uses `title: { absolute: "..." }` to bypass the `%s | Blooket Calculator` template. All other pages use the template.
- **`effectiveCost` is pre-computed**: Do NOT recalculate at runtime. It's stored on the `Pack`/`PackRecord` object.
- **Megalodon exception**: The only Chroma with a non-standard sell value (250 instead of 300). This is handled in the data, not in code logic.
- **Starter blooks**: Listed as Common rarity with 0 sell value on the starter page, but `SELL_VALUES.Common = 2` in constants. The starter page hardcodes 0 for display accuracy.

---

## 32. Known Edge Cases

- **Megalodon** sells for 250 tokens (not 300 like other Chromas) — exception in sell value
- **Space Pack rotation** — 7 colored astronauts share one 0.05% slot; only one active at a time
- **Seasonal packs** — `isLocked: true` means currently unavailable; their blooks can't be chased
- **Common blooks** — sell value is 2 tokens (not 0); starter blooks are Common but unsellable in-game
- **Wonderland Pack** — costs 25 tokens (not 20), affects expected token cost calculations
- **Effective cost** — pre-computed and stored on pack records; not calculated at runtime

---

## 33. When Adding New Pages

Follow this checklist:

1. **Create the page file** in `app/` with proper directory structure
2. **Export `metadata`** or `generateMetadata` with title, description, keywords, alternates, openGraph
3. **Add `BreadcrumbList` schema** using `buildBreadcrumbSchema()` + `serializeJsonLd()`
4. **Add `Article` schema** if it's a guide or blog post
5. **Include internal links** to 2-3 related pages (calculators, guides, packs, blooks)
6. **Add the route to `app/sitemap.ts`** with appropriate priority and changeFrequency
7. **Update `app/llms.txt/route.ts`** if it's a major new section
8. **If it's a guide**: add entry to `data/guides.ts` AND body content to `components/guides/GuideBody.tsx`
9. **If it's a blog post**: add entry to `data/blog.tsx` with all required fields per `app/blog_content.md` spec (PAS intro, 350+ words, 4-6 FAQs, 5-10 internal links, 3-5 sources, Pro Tip box)
10. **If it's a blook/pack page**: ensure data exists in `lib/constants.ts` PACK_SEEDS
11. **Run `npx next build`** to verify — must compile with zero errors
12. **Check the build output** — the new page must appear in the route list

### Page Template (Static Page)

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Title — Keyword Rich",
  description: "Compelling description under 160 characters.",
  keywords: ["keyword1", "keyword2", "keyword3"],
  alternates: {
    canonical: `${siteUrl}/page-slug`,
    languages: { "en-US": `${siteUrl}/page-slug`, "x-default": `${siteUrl}/page-slug` },
  },
  openGraph: {
    title: `Page Title | ${siteName}`,
    description: "Compelling description.",
    type: "website",
    url: `${siteUrl}/page-slug`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Page Name", item: `${siteUrl}/page-slug` },
]);

export default function PageNamePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        {/* Page content */}
        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/related-page" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Related Page
          </Link>
        </aside>
      </main>
    </>
  );
}
```

---

## 34. Quick Reference Card

### Imports You'll Use Most

```typescript
// Data
import { BLOOKS, PACK_MAP, SELL_VALUES, RARITY_DESIGN } from "@/lib/constants";
import { PACKS, getPackBySlug, type Pack, type PackSlug } from "@/lib/packs";

// Math
import { calculateAtLeastOneSuccess, calculateOpenCount, formatPercent, formatTokenLabel, getMetricRate, type OddsMetric } from "@/lib/math";

// Schema
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";

// Site
import { siteName, siteUrl } from "@/lib/site";

// Authority (rarity hubs)
import { getBlooksByRarity, getRaritySummary, formatRateLabel } from "@/lib/authority";

// Guides
import { guideEntries, getGuideBySlug, type GuideEntry } from "@/data/guides";

// Blog
import { blogPosts } from "@/data/blog";  // Resolves to data/blog.tsx
import { getBlogPosts } from "@/lib/blog";
import type { BlogPost, BlogCategory, BlogSource } from "@/types/blog";
```

### Key File Paths

| What | Where |
|---|---|
| Add a blook/pack | `lib/constants.ts` → `PACK_SEEDS` array |
| Add a guide | `data/guides.ts` → `guideEntries` + `components/guides/GuideBody.tsx` → switch case |
| Add a blog post | `data/blog.tsx` → `blogPosts` array (JSX content per `app/blog_content.md` spec) |
| Add a static page | `app/{slug}/page.tsx` |
| Add a dynamic page | `app/{pattern}/[param]/page.tsx` + `generateStaticParams` |
| Update sitemap | `app/sitemap.ts` |
| Update AI index | `app/llms.txt/route.ts` |
| Update navbar | `components/navbar.tsx` → `NAV_LINKS` |
| Update footer | `components/footer.tsx` → `RESOURCES` or pack list |
| Add schema builder | `lib/schema.ts` or `lib/seo/schema.ts` |
| Add utility function | `lib/math.ts` (probability) or `lib/odds.ts` (formatting) |

### Build Verification

```bash
npx next build    # Must pass with 0 errors, 332 static pages generated
npm run lint      # ESLint check
```
