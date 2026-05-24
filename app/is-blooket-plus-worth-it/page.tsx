import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Is Blooket Plus Worth It? — Honest Breakdown for 2026",
  description:
    "An honest breakdown of Blooket Plus pricing, features, and value. Does the subscription save tokens, unlock better odds, or just add cosmetics? We ran the numbers.",
  keywords: [
    "is blooket plus worth it",
    "blooket plus review",
    "blooket plus worth it",
    "blooket subscription",
    "blooket plus features",
  ],
  alternates: {
    canonical: `${siteUrl}/is-blooket-plus-worth-it`,
    languages: {
      "en-US": `${siteUrl}/is-blooket-plus-worth-it`,
      "x-default": `${siteUrl}/is-blooket-plus-worth-it`,
    },
  },
  openGraph: {
    title: `Is Blooket Plus Worth It? | ${siteName}`,
    description:
      "Honest breakdown of Blooket Plus pricing, features, and value for 2025.",
    type: "article",
    url: `${siteUrl}/is-blooket-plus-worth-it`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Is Blooket Plus Worth It?", item: `${siteUrl}/is-blooket-plus-worth-it` },
]);

export default function IsBlooketPlusWorthItPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Editorial
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Is Blooket Plus Worth It?
            <span className="mt-2 block text-xl font-medium text-violet-300">
              An honest breakdown for 2026
            </span>
          </h1>
          <p className="text-sm text-white/40">Last updated: May 2026</p>
        </section>

        <article className="mt-10 space-y-10 text-sm leading-8 text-white/60">
          <section>
            <h2 className="text-xl font-bold text-white">What is Blooket Plus?</h2>
            <p className="mt-3">
              Blooket Plus is the paid subscription for Blooket. It adds cosmetic
              upgrades, enhanced game host controls, and early access to new
              features. It does <strong className="text-white">not</strong> change
              pack odds, drop rates, or token earning rates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">What you actually get</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-white">Custom blook skins</strong> — cosmetic overlays that do not affect gameplay or odds</li>
              <li><strong className="text-white">Enhanced host controls</strong> — longer game timers, custom question sets, and fog-of-war options</li>
              <li><strong className="text-white">Priority game creation</strong> — less queue time during peak hours</li>
              <li><strong className="text-white">Plus-exclusive game modes</strong> — access to modes not available to free users</li>
              <li><strong className="text-white">Ad-free experience</strong> — removes interstitial ads during gameplay</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">What you do NOT get</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>No improved pack odds or drop rates</li>
              <li>No bonus tokens or token multipliers</li>
              <li>No exclusive Chroma or Legendary blooks</li>
              <li>No advantage in pack opening outcomes</li>
            </ul>
            <p className="mt-3">
              Every pack opening uses the same probability table regardless of
              subscription status. A Chroma at 0.03% is 0.03% for free and Plus
              users alike.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">The token math</h2>
            <p className="mt-3">
              Blooket Plus costs roughly $4.99/month or $59.88/year. At current
              token earning rates (roughly 250-300 tokens per game session), a free
              user can earn enough for 12-15 pack opens per session. Plus does not
              increase this rate.
            </p>
            <p className="mt-3">
              If your goal is collecting rare blooks, your token budget is the
              bottleneck — not your subscription status. Use the{" "}
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">
                Chase Calculator
              </Link>{" "}
              to plan your token spend, and the{" "}
              <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300">
                ROI Calculator
              </Link>{" "}
              to find the best pack per token.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white">Verdict</h2>
            <p className="mt-3">
              <strong className="text-white">For teachers and hosts:</strong> Plus is worth it if you run
              frequent classroom games and want custom controls, ad-free sessions,
              and priority hosting. The teaching features are genuinely useful.
            </p>
            <p className="mt-3">
              <strong className="text-white">For collectors and pack hunters:</strong> Plus does not help
              you collect blooks faster or improve your odds. Your tokens and the
              probability math are the same either way. Skip it unless you also
              host games.
            </p>
            <p className="mt-3">
              <strong className="text-white">For casual players:</strong> The ad-free experience and
              cosmetic skins are nice-to-haves but do not justify the cost for
              most casual players.
            </p>
          </section>
        </article>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/calculators" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Calculators
          </Link>
          <Link href="/guides/blooket-tokens" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Token Guide
          </Link>
          <Link href="/best-blooket-calculator" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Best Calculator
          </Link>
        </aside>
      </main>
    </>
  );
}
