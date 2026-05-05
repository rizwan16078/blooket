import type { Metadata } from "next";
import { Suspense } from "react";

import BlookLibrary from "@/components/blooks/BlookLibrary";
import { BLOOKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blook Library",
  description:
    "Browse the full SEO-optimized Blook library, inspect rarity and drop rates, and deep-link into the loot simulator.",
};

type BlooksPageProps = {
  searchParams: Promise<{
    blookId?: string;
  }>;
};

function BlookLibraryFallback() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[1.6rem] border-4 border-sky-100 bg-white p-3"
        >
          <div className="aspect-square animate-pulse rounded-[1.2rem] bg-sky-50" />
          <div className="mt-3 h-4 w-24 animate-pulse rounded-full bg-sky-100" />
          <div className="mt-2 h-3 w-16 animate-pulse rounded-full bg-sky-100" />
        </div>
      ))}
    </div>
  );
}

export default async function BlooksPage({ searchParams }: BlooksPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="mx-auto flex-1 w-full max-w-7xl bg-gradient-to-b from-sky-400 to-sky-500 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <section className="space-y-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-white/85 drop-shadow-sm">
          SEO Blook Library
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white drop-shadow-md sm:text-5xl">
          Full catalog discovery for every indexed blook in the hub.
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/90">
          This library is optimized for high-cardinality discovery. Every blook has
          its own detail page, every card lazy-loads, and the catalog uses CSS rendering
          containment to stay smooth past 100 entries.
        </p>
      </section>

      <div className="mt-8 rounded-[2rem] border-4 border-sky-200/50 bg-white p-5 shadow-lg">
        <p className="text-sm text-slate-500">
          Indexed blooks: <span className="font-bold text-slate-900">{BLOOKS.length}</span>
        </p>
      </div>

      <section className="mt-8">
        <Suspense fallback={<BlookLibraryFallback />}>
          <BlookLibrary initialBlookId={resolvedSearchParams.blookId ?? null} />
        </Suspense>
      </section>
    </main>
  );
}
