import type { Metadata } from "next";

import CalculatorHero from "@/components/calculator/v2/CalculatorHero";
import FaqAccordion from "@/components/FaqAccordion";

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
        <CalculatorHero />

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
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
