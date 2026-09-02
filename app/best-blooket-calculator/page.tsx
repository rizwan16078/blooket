import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Blooket Calculator — Why This One Is Different",
  description:
    "Not all Blooket calculators are the same. This one uses exact probability math, worker-based simulation, and live pack data. Here is what makes it the best.",
  keywords: [
    "best blooket calculator",
    "blooket calculator comparison",
    "blooket odds calculator",
    "blooket pack calculator",
    "blooket probability calculator",
  ],
  alternates: {
    canonical: `${siteUrl}/best-blooket-calculator`,
    languages: {
      "en-US": `${siteUrl}/best-blooket-calculator`,
      "x-default": `${siteUrl}/best-blooket-calculator`,
    },
  },
  openGraph: {
    title: `Best Blooket Calculator | ${siteName}`,
    description:
      "Why this Blooket calculator uses exact probability math and worker-based simulation instead of rough estimates.",
    type: "article",
    url: `${siteUrl}/best-blooket-calculator`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Best Blooket Calculator", item: `${siteUrl}/best-blooket-calculator` },
]);

export default function BestBlooketCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Why This Calculator
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Best Blooket Calculator{" "}
            <span className="mt-2 block text-xl font-medium text-violet-300">
              What makes this one different
            </span>
          </h1>
        </section>

        <article className="mt-10 space-y-10 text-sm leading-8 text-white/60">
          <section>
            <h2 className="text-xl font-bold text-white">The problem with most Blooket calculators</h2>
            <p className="mt-3">
              Most Blooket calculators show a single drop rate and call it a day.
              But a 1% drop rate does not mean a 1-in-100 guarantee. It means
              each pull has a 1% chance, and the real question is: &quot;If I open
              25 packs, what is my actual probability?&quot; That requires
              cumulative probability math, not just a raw rate.
            </p>
            <p className="mt-3">
              Some calculators also use stale data — pack odds that changed
              months ago when Blooket updated drop tables. Others round
              percentages in ways that distort the real odds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">How this calculator is different</h2>
            <ul className="mt-3 space-y-3">
              <li>
                <strong className="text-white">Exact probability math</strong> — Uses the
                binomial survival formula (1 - (1 - p)^n) for cumulative
                probability, not rough estimates or linear approximations.
              </li>
              <li>
                <strong className="text-white">Worker-based simulation</strong> — Runs
                Monte Carlo simulations in a Web Worker so you get real
                distribution data (P10 best case, P90 worst case) without
                freezing the page.
              </li>
              <li>
                <strong className="text-white">Live pack data</strong> — Drop rates are
                sourced from the current Blooket drop tables, not outdated wiki
                pages. Seasonal packs are marked as locked when they rotate out.
              </li>
              <li>
                <strong className="text-white">Duplicate resell modeling</strong> —
                Calculates effective pack cost after average duplicate sell-back,
                so you see the real cost per pull, not just the sticker price.
              </li>
              <li>
                <strong className="text-white">Five specialized tools</strong> — Pack
                odds, token converter, ROI, value, and chase calculators in one
                hub. Most sites only offer one.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">The math behind it</h2>
            <p className="mt-3">
              The core formula is <strong className="text-white">P(at least 1) = 1 - (1 - p)^n</strong>,
              where p is the combined drop rate for your target rarity and n is
              the number of pack opens. This gives the exact probability of at
              least one success in n independent trials.
            </p>
            <p className="mt-3">
              For simulation, the calculator runs 5,000 Monte Carlo iterations per
              calculation, tracking the full distribution of outcomes. This lets
              you see not just the average case but the P10 (lucky) and P90
              (unlucky) bounds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Try it yourself</h2>
            <p className="mt-3">
              The best way to see the difference is to use it. Pick a pack, set
              your token budget, and compare the probability output with any
              other calculator. The numbers will be different because the math
              is different — and ours is correct.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
              >
                Open Main Calculator
              </Link>
              <Link
                href="/calculators"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
              >
                All Calculators
              </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
