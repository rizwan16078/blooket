import type { Metadata } from "next";
import Link from "next/link";
import { Archive, Database } from "lucide-react";

import PacksDisplay from "@/components/packs/PacksDisplay";
import { LOCKED_PACKS, PACKS, PACK_BLOOKS_MAP, UNLOCKED_PACKS } from "@/lib/constants";
import { buildPacksPageSchema, serializeJsonLd } from "@/lib/seo/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Pack Drop Rates & Odds Tables",
  description:
    "Explore server-rendered Blooket pack drop rate tables, sell values, and direct simulator launch links from the loot economics authority hub.",
  keywords: [
    "blooket packs",
    "blooket pack drop rates",
    "blooket odds tables",
    "blooket loot economics",
    "blooket pack sell values",
  ],
  alternates: {
    canonical: `${siteUrl}/packs`,
    languages: {
      "en-US": `${siteUrl}/packs`,
      "x-default": `${siteUrl}/packs`,
    },
  },
};

const packsPageSchema = buildPacksPageSchema({
  packs: PACKS,
  packBlooksMap: PACK_BLOOKS_MAP,
  siteName,
  siteUrl,
});

export default function PacksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(packsPageSchema),
        }}
      />
      <style>{`
        @keyframes packs-target-glow {
          0% {
            box-shadow:
              0 0 0 1px rgba(34, 211, 238, 0.7),
              0 0 0 8px rgba(34, 211, 238, 0.18),
              0 30px 80px -48px rgba(34, 211, 238, 0.75);
          }

          100% {
            box-shadow:
              0 0 0 1px rgba(34, 211, 238, 0),
              0 0 0 8px rgba(34, 211, 238, 0),
              0 30px 80px -48px rgba(15, 23, 42, 0.95);
          }
        }

        .packs-target:target > [data-slot="card"] {
          animation: packs-target-glow 2s ease-out;
        }
      `}</style>

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Loot Economics Knowledge Center
          </p>
          <h1 className="max-w-5xl font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Pack Drop Rates & Odds Tables
          </h1>
          <p className="max-w-4xl text-lg font-medium leading-8 text-white/80">
            Authority-grade pack tables, deep links, and simulator launch paths for
            every indexed pack.
          </p>
          <p className="max-w-4xl text-base leading-8 text-white/50">
            `/packs` now acts as the hub layer for loot economics research: every pack
            table is crawlable, hash-linkable, and powered directly from the same
            constants that drive the hero engine, sell values, and library surfaces.
          </p>
        </section>

        <h2 className="sr-only">Pack Database Statistics</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 shadow-lg transition-all hover:border-violet-400/40 hover:from-violet-500/[0.08]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                Total datasets
              </p>
              <Database
                className="h-4 w-4 text-violet-300/70 transition-colors group-hover:text-violet-300"
                aria-hidden
              />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {PACKS.length}
            </p>
            <p className="mt-1 text-xs text-white/40">indexed pack records</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 shadow-lg transition-all hover:border-emerald-400/40 hover:from-emerald-500/[0.08]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                Live simulator packs
              </p>
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {UNLOCKED_PACKS.length}
            </p>
            <p className="mt-1 text-xs text-white/40">openable in calculator</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 shadow-lg transition-all hover:border-amber-400/40 hover:from-amber-500/[0.08]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                Archived references
              </p>
              <Archive
                className="h-4 w-4 text-amber-300/70 transition-colors group-hover:text-amber-300"
                aria-hidden
              />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-white">
              {LOCKED_PACKS.length}
            </p>
            <p className="mt-1 text-xs text-white/40">retired or seasonal</p>
          </div>
        </div>

        <h2 className="sr-only">Available Packs & Odds Tables</h2>
        <PacksDisplay />

        {/* Server-rendered pack index — ensures Googlebot can follow all pack
            links without executing JavaScript. The client component above
            renders the rich interactive UI; this section provides the crawlable
            HTML anchor graph. */}
        <nav aria-label="Pack index" className="mt-16 border-t border-white/[0.06] pt-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/40 mb-5">
            Pack Index
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {PACKS.map((pack) => (
              <li key={pack.id}>
                <Link
                  href={pack.route}
                  className="block rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-violet-500/25 hover:text-white"
                >
                  {pack.name} Pack
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
