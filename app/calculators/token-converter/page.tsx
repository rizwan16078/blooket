import type { Metadata } from "next";
import Link from "next/link";

import { PACKS } from "@/lib/packs";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Token to Pack Converter — How Many Packs Can You Open?",
  description:
    "Enter your token balance and instantly see how many packs you can open for every Blooket market pack, with and without duplicate sell-back.",
  keywords: [
    "blooket token calculator",
    "blooket token converter",
    "how many blooket packs can I open",
    "blooket pack count",
    "blooket token budget",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/token-converter`,
    languages: {
      "en-US": `${siteUrl}/calculators/token-converter`,
      "x-default": `${siteUrl}/calculators/token-converter`,
    },
  },
  openGraph: {
    title: `Token → Pack Converter | ${siteName}`,
    description:
      "See how many packs your tokens can buy across all Blooket market packs.",
    type: "website",
    url: `${siteUrl}/calculators/token-converter`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Token Converter", item: `${siteUrl}/calculators/token-converter` },
]);

const TOKEN_TIERS = [250, 500, 1000, 2500, 5000];

export default function TokenConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Token Converter
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Token → Pack Converter
            <span className="mt-2 block text-xl font-medium text-violet-300">
              How many packs can your tokens buy?
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            This table shows how many packs you can open at common token budgets.
            The &quot;Standard&quot; column uses the base pack price. The
            &quot;With Resell&quot; column uses the effective cost after average
            duplicate sell-back. For a live interactive experience, use the{" "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              main calculator
            </Link>
            .
          </p>
        </section>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Price</th>
                <th className="py-3 px-3 font-bold text-white/70">Eff. Cost</th>
                {TOKEN_TIERS.map((tokens) => (
                  <th key={tokens} className="py-3 px-3 font-bold text-violet-300">
                    {tokens} tokens
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PACKS.map((pack) => (
                <tr
                  key={pack.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-3 font-semibold text-white">
                    <Link
                      href={pack.isLocked ? "/packs" : `/packs#${pack.id}`}
                      className="hover:text-violet-300"
                    >
                      {pack.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-white/60">{pack.price}</td>
                  <td className="py-3 px-3 text-white/60">
                    {pack.effectiveCost.toFixed(1)}
                  </td>
                  {TOKEN_TIERS.map((tokens) => {
                    const standard = Math.floor(tokens / pack.price);
                    const withResell = Math.floor(tokens / pack.effectiveCost);

                    return (
                      <td key={tokens} className="py-3 px-3 text-white/70">
                        <span>{standard}</span>
                        {withResell > standard && (
                          <span className="ml-1 text-emerald-400/70 text-xs">
                            → {withResell} w/ resell
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            How duplicate resell stretches your tokens
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              When you open a pack and get a duplicate blook, you can sell it back for
              tokens. The <strong className="text-white">effective cost</strong> is
              the pack price minus the average sell-back value. This means your tokens
              go further than the raw price suggests.
            </p>
            <p>
              For example, the Space Pack costs 20 tokens per pull, but the average
              sell-back is about 3.2 tokens, making the effective cost roughly 16.8
              tokens. With 500 tokens, that jumps from 25 standard opens to 29 with
              resell — almost 4 extra pulls.
            </p>
            <p>
              The resell advantage grows with your token budget because more opens
              means more duplicates means more sell-back. Use the{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                main calculator
              </Link>{" "}
              with &quot;Include Resell&quot; enabled for exact numbers.
            </p>
          </div>
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
            href="/guides/blooket-tokens"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Token Guide
          </Link>
        </aside>
      </main>
    </>
  );
}
