import type { Metadata } from "next";
import { Suspense } from "react";

import CalculatorCard from "@/components/calculator/CalculatorCard";
import FaqAccordion from "@/components/FaqAccordion";
import HomeQuickLinks from "@/components/home/HomeQuickLinks";

import { buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Free Blooket Calculator 2026 — Exact Pack Odds & Drop Rates" },
  description:
    "Free Blooket pack odds calculator with exact probability math, Monte Carlo simulation, duplicate refunds, and live drop rates for every pack. Try it now →",
  keywords: [
    "blooket calculator",
    "blooket pack odds",
    "blooket drop rates",
    "blooket box simulator",
    "blooket probability",
    "free blooket calculator",
    "blooket calculator 2026",
  ],
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: "Free Blooket Calculator 2026 — Exact Pack Odds & Drop Rates",
    description:
      "Free Blooket pack odds calculator with exact probability math, Monte Carlo simulation, duplicate refunds, and live drop rates for every pack. Try it now →",
    type: "website",
    url: siteUrl,
  },
};

function CalculatorCardFallback() {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 shadow-2xl sm:p-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-12 w-72 animate-pulse rounded-full bg-white/[0.08]" />
          <div className="h-5 w-96 animate-pulse rounded-full bg-white/[0.06]" />
        </div>
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
          <div className="h-12 animate-pulse rounded-xl bg-violet-500/10" />
          <div className="mt-4 h-3 animate-pulse rounded-full bg-violet-500/5" />
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const faqEntries: FaqEntry[] = [
  {
    question: "How does the Blooket Calculator work?",
    answer:
      "The calculator uses exact binomial probability for every live update. It converts your tokens into expected box opens, then computes the chance of at least one Epic+, Legendary, or Chroma without using Monte Carlo in the real-time path.",
  },
  {
    question: "How does dupe refund mode work?",
    answer:
      "Dupe refund mode uses a static effective cost for each pack. Effective cost equals the box price minus the precomputed average sell-back value, which keeps updates instant and avoids recursive refund simulation.",
  },
  {
    question: "What does Run Full Simulation do?",
    answer:
      "Run Full Simulation launches a 5,000-iteration Monte Carlo process in a Web Worker. It returns only aggregated summary values such as expected sell-back, P90 worst case, and P10 best case.",
  },
];

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteName,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  description:
    "Production-grade Blooket calculator with exact probability math, static pack costs, and worker-based full simulations.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildFaqSchema(faqEntries)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(softwareSchema),
        }}
      />

      <main className="flex-1">
        <section className="relative mx-auto w-full max-w-[96rem] px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          {/* Top ambient glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

          <div className="relative mx-auto grid max-w-[92rem] items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <section className="min-w-0" aria-label="Pack Calculator">
              <h1 className="mb-6 font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
                Blooket Calculator
                <span className="mt-2 block text-xl font-medium text-violet-300">
                  Exact pack odds, drop rates &amp; loot simulations
                </span>
              </h1>
              <Suspense fallback={<CalculatorCardFallback />}>
                <CalculatorCard />
              </Suspense>
            </section>
            <HomeQuickLinks />
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-24 sm:px-6 lg:px-8">
          <article className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-2xl backdrop-blur-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              How drop rates work
            </p>
            <h2 className="mt-3 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              Exact probability first. Simulation only when you ask for it.
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-white/45 lg:grid-cols-2">
              <p>
                Every live update uses the exact binomial formula
                {" "}
                <span className="font-bold text-violet-300">
                  P(at least 1 success) = 1 - (1 - p)^n
                </span>
                .
                The pack drop rate is the success value, and the number of expected
                box opens comes from your tokens divided by either the standard box cost
                or the pack&apos;s static effective cost.
              </p>
              <p>
                Duplicate refund mode never simulates recursive sell-back loops.
                Instead, each pack ships with a precomputed effective cost constant.
                That keeps the slider path fast, hydration-safe, and stable under load.
                Full simulation runs separately in a Web Worker with 5,000 iterations.
              </p>
            </div>
          </article>



          <article className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-2xl backdrop-blur-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">FAQ</p>
            <h2 className="mt-3 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              Common questions about Blooket drop rates
            </h2>
            <FaqAccordion entries={faqEntries} />
          </article>
        </section>
      </main>
    </>
  );
}
