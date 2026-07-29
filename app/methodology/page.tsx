import type { Metadata } from "next";
import Link from "next/link";

import ContentMeta from "@/components/content/ContentMeta";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Calculator Methodology — How Drop Rates & Odds Are Calculated",
  description:
    "How the Blooket Calculator models pack odds: exact binomial probability, duplicate refund effective costs, verified data sources, and update policy. Transparent math, no guesses.",
  keywords: [
    "blooket calculator methodology",
    "blooket odds methodology",
    "blooket drop rate sources",
  ],
  alternates: {
    canonical: `${siteUrl}/methodology`,
    languages: {
      "en-US": `${siteUrl}/methodology`,
      "x-default": `${siteUrl}/methodology`,
    },
  },
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildBreadcrumbSchema([
              { name: "Home", item: siteUrl },
              { name: "Methodology", item: `${siteUrl}/methodology` },
            ]),
          ),
        }}
      />

      <header className="space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Trust Center
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Methodology
        </h1>
        <p className="text-lg leading-8 text-white/65">
          This page documents how the site turns pack tables into calculator outputs,
          where the data comes from, and where we deliberately refuse to overclaim.
        </p>
        <ContentMeta
          updatedAt="2026-07-30"
          sources={[
            {
              label: "Blooket Help: How to Collect Blooks",
              href: "https://help.blooket.com/hc/en-us/articles/16620639672599-How-to-Collect-Blooks",
            },
            {
              label: "Blooket Help: Blooks Page Overview",
              href: "https://help.blooket.com/hc/en-us/articles/31595510812183-Blooks-Page-Overview",
            },
            {
              label: "Blooket Wiki: Packs",
              href: "https://blooket.fandom.com/wiki/Packs",
            },
          ]}
          note="Pack drop-rate tables were last verified on July 30, 2026 against the Blooket Wiki and community drop-rate references. Methodology and trust documentation were last reviewed on July 30, 2026."
        />
      </header>

      <div className="mt-10 space-y-10 text-base leading-8 text-white/70">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">What the calculator models</h2>
          <p>
            The real-time calculator path uses the exact at-least-one-success formula:
            {" "}
            <strong className="text-white">P(at least 1) = 1 - (1 - p)^n</strong>.
            {" "}Here, <strong className="text-white">p</strong> is the single-open success
            rate for the selected pack target and <strong className="text-white">n</strong>
            {" "}is the number of expected opens your token budget can fund.
          </p>
          <p>
            That means the site is not faking odds with vague rarity language. It is
            converting known pack rates into a budget-specific probability.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">How duplicate refunds are handled</h2>
          <p>
            Duplicate refunds are modeled with a precomputed effective-cost constant for
            each pack instead of recursively simulating every possible sell-back loop in
            the live UI path. This keeps the calculator fast and stable while still
            reflecting the long-run effect of selling duplicates.
          </p>
          <p>
            When you want a heavier simulation pass, the optional worker-based flow runs
            separately so the main interface stays responsive.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">What our sources are</h2>
          <p>
            We use official Blooket help articles for current product behavior such as the
            Market flow, Blook Score behavior, and selling interface. We use community
            references for pack tables and broader collector taxonomy where official public
            documentation is limited.
          </p>
          <p>
            If a topic cannot be responsibly tied back to the pack data we index, we say
            so. That is why pages like{" "}
            <Link href="/guides/mystical-blooks" className="text-emerald-400 hover:text-emerald-300">
              Mystical Blooks
            </Link>{" "}
            explain taxonomy without pretending there is a normal pack probability behind it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white">Update policy</h2>
          <p>
            We do not quietly invent fresh data. Pack tables, support pages, and topical
            guides should move together. When a major change lands, we update the relevant
            content, refresh machine-readable surfaces like the sitemap and feeds, and log
            the change in the <Link href="/updates" className="text-emerald-400 hover:text-emerald-300">updates</Link> page.
          </p>
        </section>
      </div>
    </main>
  );
}

