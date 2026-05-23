import type { Metadata } from "next";
import Link from "next/link";

import { siteUrl } from "@/lib/site";

const updates = [
  {
    date: "2026-05-24",
    title: "Topical authority expansion",
    body:
      "Added the guide hub, rarity pages, glossary pages, Market explainers, methodology page, and discovery-surface fixes for sitemap, RSS, and llms.txt.",
  },
  {
    date: "2026-05-24",
    title: "Trust and discovery cleanup",
    body:
      "Aligned machine-readable content with real URLs, expanded internal links, and tightened content support around the calculator cluster.",
  },
  {
    date: "2026-05-03",
    title: "Pack data refresh",
    body:
      "Updated the indexed pack and blook datasets that feed the calculator, pack pages, and blook library.",
  },
];

export const metadata: Metadata = {
  title: "Updates & Change Log",
  description:
    "Track major site updates, data refreshes, and content changes for the Blooket Calculator authority hub.",
  alternates: {
    canonical: `${siteUrl}/updates`,
    languages: {
      "en-US": `${siteUrl}/updates`,
      "x-default": `${siteUrl}/updates`,
    },
  },
};

export default function UpdatesPage() {
  return (
    <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <header className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Trust Center
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Updates & Change Log
        </h1>
        <p className="text-lg leading-8 text-white/65">
          Major content, data, and product-surface changes are logged here so readers can
          see when the calculator hub was refreshed.
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {updates.map((update) => (
          <article
            key={`${update.date}-${update.title}`}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400">
              {update.date}
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">{update.title}</h2>
            <p className="mt-3 text-base leading-8 text-white/70">{update.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white/70">
        <p>
          For the current calculation model, read the{" "}
          <Link href="/methodology" className="text-emerald-400 hover:text-emerald-300">
            methodology page
          </Link>.
        </p>
      </div>
    </main>
  );
}
