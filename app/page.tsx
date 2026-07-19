import type { Metadata } from "next";
import Link from "next/link";

import CalculatorHero from "@/components/calculator/v2/CalculatorHero";
import FaqAccordion from "@/components/FaqAccordion";

import { buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { formatPercent, getRarityRate } from "@/lib/math";
import { UNLOCKED_PACKS } from "@/lib/constants";
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
    question: "Is the Blooket Calculator a hack or cheat?",
    answer:
      "No. The calculator never connects to your Blooket account, cannot generate free tokens or blooks, and does not interact with Blooket's servers. It is a purely mathematical tool that shows the odds behind the packs you already open in the real game.",
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
  {
    question: "Which Blooket pack has the best Legendary or Chroma odds?",
    answer:
      "It varies as Blooket rotates its market packs. The pack comparison table on this page lists the live combined Legendary and Chroma rate for every pack, and the ROI Calculator ranks packs by expected value per token once pack cost is factored in.",
  },
  {
    question: "What is the difference between the calculator and the pack simulator?",
    answer:
      "The calculator computes your exact probability across all possible outcomes for a given token budget. The Pack Opening Simulator rolls one random session against the same drop rates, so you can see what a real run of openings feels like before spending tokens.",
  },
  {
    question: "How many tokens do I need to pull a specific blook?",
    answer:
      "Use the Chase Calculator: pick any blook and it converts the drop rate into the exact token budget you need for a 50%, 90%, or 99% chance, including the cheaper effective cost when you resell duplicates.",
  },
  {
    question: "How do I earn Blooket tokens faster?",
    answer:
      "Tokens come from playing games, with daily limits on how much you can earn. The Token Grinder calculator compares game modes and estimates how long your target token goal takes at realistic rates.",
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
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              Compare every pack
            </p>
            <h2 className="mt-3 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              Blooket pack odds at a glance
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/45">
              Every market pack&apos;s live combined drop rate per rarity tier.
              Click a pack for its full blook-by-blook breakdown, or open the{" "}
              <Link href="/calculators/pack-odds" className="text-emerald-400 transition hover:text-emerald-300">
                Pack Odds Calculator
              </Link>{" "}
              to turn these rates into a real probability for your token
              balance.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                    <th className="py-3 px-4 font-bold text-white/70">Cost</th>
                    <th className="py-3 px-4 font-bold text-violet-400">Epic</th>
                    <th className="py-3 px-4 font-bold text-amber-400">Legendary</th>
                    <th className="py-3 px-4 font-bold text-teal-400">Chroma</th>
                  </tr>
                </thead>
                <tbody>
                  {UNLOCKED_PACKS.map((pack) => (
                    <tr
                      key={pack.id}
                      className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                    >
                      <td className="py-3 px-4 font-semibold text-white">
                        <Link href={pack.route} className="hover:text-violet-300">
                          {pack.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-white/60">
                        {pack.costPerPull} tokens
                      </td>
                      <td className="py-3 px-4 text-violet-300/80">
                        {formatPercent(getRarityRate(pack.id, "Epic"))}
                      </td>
                      <td className="py-3 px-4 text-amber-300/80">
                        {formatPercent(getRarityRate(pack.id, "Legendary"))}
                      </td>
                      <td className="py-3 px-4 text-teal-300/80">
                        {formatPercent(getRarityRate(pack.id, "Chroma"))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-2xl backdrop-blur-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              Free Blooket tools
            </p>
            <h2 className="mt-3 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              One calculator for every token decision
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-white/45 lg:grid-cols-2">
              <p>
                The main calculator above answers the big question — what your
                tokens are actually worth in a given pack. The{" "}
                <Link href="/calculators/simulator" className="text-emerald-400 transition hover:text-emerald-300">
                  Pack Opening Simulator
                </Link>{" "}
                lets you open unlimited practice packs against the same drop
                rates, the{" "}
                <Link href="/calculators/chase" className="text-emerald-400 transition hover:text-emerald-300">
                  Chase Calculator
                </Link>{" "}
                converts any target blook into a concrete token budget at 50%,
                90%, or 99% confidence, and the{" "}
                <Link href="/calculators/roi" className="text-emerald-400 transition hover:text-emerald-300">
                  ROI Calculator
                </Link>{" "}
                ranks every pack by expected value per token.
              </p>
              <p>
                Rounding out the set: the{" "}
                <Link href="/calculators/token-converter" className="text-emerald-400 transition hover:text-emerald-300">
                  Token Converter
                </Link>{" "}
                maps your balance to pack counts, the{" "}
                <Link href="/calculators/value" className="text-emerald-400 transition hover:text-emerald-300">
                  Blook Value Calculator
                </Link>{" "}
                lists sell values and expected pull costs for all{" "}
                <Link href="/blooks" className="text-emerald-400 transition hover:text-emerald-300">
                  blooks in the library
                </Link>
                , and the{" "}
                <Link href="/calculators/token-grinder" className="text-emerald-400 transition hover:text-emerald-300">
                  Token Grinder
                </Link>{" "}
                plans the fastest route to your next token goal. Everything is
                free, runs in your browser, and never touches your Blooket
                account — see the{" "}
                <Link href="/methodology" className="text-emerald-400 transition hover:text-emerald-300">
                  methodology
                </Link>{" "}
                for how the drop-rate dataset is sourced and validated.
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
