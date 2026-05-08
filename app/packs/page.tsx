import type { Metadata } from "next";

import PacksDisplay from "@/components/packs/PacksDisplay";
import { LOCKED_PACKS, PACKS, PACK_BLOOKS_MAP, UNLOCKED_PACKS } from "@/lib/constants";
import { buildPacksPageSchema, serializeJsonLd } from "@/lib/seo/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Pack Drop Rates & Odds Tables",
  description:
    "Explore server-rendered Blooket pack drop rate tables, sell values, and direct simulator launch links from the loot economics authority hub.",
  alternates: {
    canonical: `${siteUrl}/packs`,
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

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">
              Total datasets
            </p>
            <p className="mt-2 text-2xl font-black text-white">{PACKS.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">
              Live simulator packs
            </p>
            <p className="mt-2 text-2xl font-black text-white">
              {UNLOCKED_PACKS.length}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">
              Archived references
            </p>
            <p className="mt-2 text-2xl font-black text-white">
              {LOCKED_PACKS.length}
            </p>
          </div>
        </div>

        <PacksDisplay />
      </main>
    </>
  );
}
