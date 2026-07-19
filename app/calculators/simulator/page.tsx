import type { Metadata } from "next";
import Link from "next/link";

import FaqAccordion from "@/components/FaqAccordion";
import PackOpeningSimulator from "@/components/calculators/PackOpeningSimulator";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  serializeJsonLd,
  type FaqEntry,
} from "@/lib/schema";
import { formatPercent, getRarityRate } from "@/lib/math";
import { UNLOCKED_PACKS } from "@/lib/constants";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Pack Opening Simulator — Free Online Pack Opener",
  description:
    "Open unlimited Blooket packs for free with a simulator that uses the real published drop rates. Test your luck on any market pack — no account, no tokens, no risk.",
  keywords: [
    "blooket pack opening simulator",
    "blooket simulator",
    "blooket pack simulator",
    "blooket pack opener",
    "blooket box simulator",
    "blooket opening simulator",
    "blooket pack opening game",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/simulator`,
    languages: {
      "en-US": `${siteUrl}/calculators/simulator`,
      "x-default": `${siteUrl}/calculators/simulator`,
    },
  },
  openGraph: {
    title: `Blooket Pack Opening Simulator | ${siteName}`,
    description:
      "Open unlimited Blooket packs with real drop rates. Free online pack opener — no account, no tokens, no risk.",
    type: "website",
    url: `${siteUrl}/calculators/simulator`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Pack Opening Simulator", item: `${siteUrl}/calculators/simulator` },
]);

const faqEntries: FaqEntry[] = [
  {
    question: "Is this Blooket pack opening simulator free?",
    answer:
      "Yes. The simulator is completely free, requires no signup, and runs entirely in your browser. You can open as many simulated packs as you want without spending real Blooket tokens.",
  },
  {
    question: "Does the simulator use real Blooket drop rates?",
    answer:
      "Yes. Every simulated pull rolls against the same published drop rates listed on our pack odds pages — the identical dataset that powers every calculator on this site. Your simulated results follow the same probability distribution as real pack openings.",
  },
  {
    question: "Is the pack opening simulator a Blooket hack?",
    answer:
      "No. The simulator never connects to your Blooket account, cannot add blooks or tokens to it, and does not interact with Blooket's servers in any way. It is a purely mathematical practice tool for understanding pack odds before you spend real tokens.",
  },
  {
    question: "Why did I pull a Chroma in the simulator but not in the real game?",
    answer:
      "Randomness. A 0.05% Chroma rate means most sessions of 100 opens contain zero Chromas — in the simulator and in the real game alike. Each simulated session is one random outcome; run the Chase Calculator to see how many tokens you need for a 50%, 90%, or 99% chance instead of relying on one lucky run.",
  },
  {
    question: "How is a simulator different from the Blooket calculator?",
    answer:
      "The simulator shows you one random outcome, like actually opening packs. The calculator computes your exact mathematical probability across all possible outcomes. Use the simulator to feel how streaky pack luck really is, and the calculator to plan how many tokens you actually need.",
  },
  {
    question: "Which pack should I simulate for the best Chroma odds?",
    answer:
      "Check the drop rate table on this page — it lists the live Legendary and Chroma rate for every market pack. The ROI Calculator ranks packs by expected value per token if you want the mathematically best pack rather than a lucky run.",
  },
];

export default function PackOpeningSimulatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildFaqSchema(faqEntries)),
        }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Pack Opening Simulator
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Pack Opening Simulator
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Open unlimited packs with real drop rates — free, no account
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            This free Blooket simulator opens packs using the same published
            drop rates as the real in-game market. Pick any pack, open 1, 10,
            or 100 at a time, and see exactly what you would have pulled —
            without spending a single real token. It never touches your Blooket
            account, so there is nothing to lose and nothing to unlock.
          </p>
        </section>

        <section className="mt-8">
          <PackOpeningSimulator />
        </section>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            How the pack opening simulator works
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Every time you press Open, the simulator rolls a random number and
              maps it onto the pack&apos;s drop table — the same rates shown in
              our{" "}
              <Link
                href="/calculators/pack-odds"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Pack Odds Calculator
              </Link>
              . A blook with an 18.75% rate wins 18.75% of rolls; a Chroma at
              0.05% wins one roll in two thousand. Nothing is weighted in your
              favor and nothing is rigged against you, so long simulated
              sessions converge on the exact published percentages.
            </p>
            <p>
              For packs with rotating Chromas — like the Space Pack&apos;s
              Colored Astronauts — only one Chroma from the rotation is live at
              a time, exactly as in the real market. The simulator picks one
              active rotation blook per session, so your simulated Chroma odds
              match the true single-day rate instead of an inflated combined
              rate.
            </p>
            <p>
              The <strong className="text-white">Luck check</strong> row
              compares what you actually pulled against the mathematical
              expectation for your number of opens. It is the fastest way to
              build intuition for how streaky low-probability pulls really are:
              pulling zero Legendaries in 50 opens is not bad luck — it is the
              most likely outcome for most packs.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            Simulator drop rates by pack
          </h2>
          <p className="text-sm text-white/50 mb-4">
            The simulator rolls against these live combined rates. Rotating
            Chroma packs show the single active rotation rate.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                  <th className="py-3 px-4 font-bold text-white/70">Cost</th>
                  <th className="py-3 px-4 font-bold text-violet-400">Epic</th>
                  <th className="py-3 px-4 font-bold text-amber-400">
                    Legendary
                  </th>
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
                      <Link
                        href={pack.route}
                        className="hover:text-violet-300"
                      >
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
        </section>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            Simulator vs calculator: which should you use?
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              <strong className="text-white">
                Use the simulator when you want to feel the odds.
              </strong>{" "}
              One hundred simulated opens shows you what pack luck actually
              looks like — streaks of duplicates, dry runs, and the occasional
              jackpot. It is the honest answer to &quot;what would probably
              happen if I spent my tokens right now?&quot;
            </p>
            <p>
              <strong className="text-white">
                Use a calculator when you want to plan.
              </strong>{" "}
              The{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                main Blooket Calculator
              </Link>{" "}
              gives your exact probability for any token budget, the{" "}
              <Link
                href="/calculators/chase"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Chase Calculator
              </Link>{" "}
              tells you the token cost of a 50%, 90%, or 99% shot at a specific
              blook, and the{" "}
              <Link
                href="/calculators/roi"
                className="text-emerald-400 hover:text-emerald-300"
              >
                ROI Calculator
              </Link>{" "}
              ranks every pack by expected value per token.
            </p>
            <p>
              The two together beat either alone: simulate to set expectations,
              then calculate to budget. If you are saving for a specific
              Legendary or Chroma, start with the{" "}
              <Link
                href="/calculators/token-grinder"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Token Grinder
              </Link>{" "}
              to plan how fast you can earn the tokens you need.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-2xl backdrop-blur-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            FAQ
          </p>
          <h2 className="mt-3 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
            Pack opening simulator questions
          </h2>
          <FaqAccordion entries={faqEntries} />
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/calculators"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            All Calculators
          </Link>
          <Link
            href="/calculators/pack-odds"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Pack Odds
          </Link>
          <Link
            href="/calculators/chase"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Chase Calculator
          </Link>
          <Link
            href="/packs"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Pack Details
          </Link>
        </aside>
      </main>
    </>
  );
}
