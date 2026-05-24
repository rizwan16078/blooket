import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Who Made Blooket? — Founder, History & Timeline",
  description:
    "Blooket was created by Tom Stewart in 2020. Learn about the founder, the platform's history, major updates, and how it grew into one of the most popular classroom games.",
  keywords: [
    "who made blooket",
    "who created blooket",
    "who invented blooket",
    "blooket founder",
    "tom stewart blooket",
    "when was blooket created",
    "blooket history",
  ],
  alternates: {
    canonical: `${siteUrl}/about/who-made-blooket`,
    languages: {
      "en-US": `${siteUrl}/about/who-made-blooket`,
      "x-default": `${siteUrl}/about/who-made-blooket`,
    },
  },
  openGraph: {
    title: `Who Made Blooket? | ${siteName}`,
    description: "Blooket was created by Tom Stewart in 2020. The full history and timeline.",
    type: "article",
    url: `${siteUrl}/about/who-made-blooket`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "About", item: `${siteUrl}/about` },
  { name: "Who Made Blooket", item: `${siteUrl}/about/who-made-blooket` },
]);

export default function WhoMadeBlooketPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            About Blooket
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Who Made Blooket?
          </h1>
          <p className="text-lg leading-8 text-white/65">
            Blooket was created by <strong className="text-white">Tom Stewart</strong> in
            2020. Here is the full story of the founder, the platform&apos;s history, and
            how it grew into one of the most popular classroom review games in the
            United States.
          </p>
        </section>

        <article className="mt-10 space-y-10 text-white/70">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">The Founder: Tom Stewart</h2>
            <p className="leading-relaxed">
              Tom Stewart is the creator and lead developer of Blooket. He built the
              platform as an educational review game that combines quiz-based learning
              with a collection mechanic inspired by gacha games. The core idea: students
              answer questions to earn tokens, then spend those tokens opening packs to
              collect blooks of different rarities.
            </p>
            <p className="mt-4 leading-relaxed">
              Stewart&apos;s insight was that the collection mechanic — chasing rare blooks,
              comparing drop rates, strategizing which packs to open — gave students a
              reason to keep answering questions long after a traditional quiz would have
              ended. That engagement loop is what made Blooket take off in classrooms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Blooket Timeline</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-violet-500" />
                  <div className="flex-1 w-px bg-white/10" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-400">2020</p>
                  <p className="mt-1 leading-relaxed">Blooket launches as a classroom review tool. Initial release includes basic game modes and a small set of blooks.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-violet-500" />
                  <div className="flex-1 w-px bg-white/10" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-400">2021</p>
                  <p className="mt-1 leading-relaxed">Rapid growth during remote learning. New packs added (Space, Aquatic, Medieval). The pack opening mechanic becomes the dominant engagement driver.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-violet-500" />
                  <div className="flex-1 w-px bg-white/10" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-400">2022</p>
                  <p className="mt-1 leading-relaxed">Major updates: new game modes (Tower Defense, Cafe, Factory), more packs, and the introduction of seasonal/limited packs. Blooket becomes a top-3 classroom game alongside Kahoot and Gimkit.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-violet-500" />
                  <div className="flex-1 w-px bg-white/10" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-400">2023</p>
                  <p className="mt-1 leading-relaxed">Blooket Plus subscription launches, offering cosmetic enhancements and organizational features. The Market system is refined. Chroma blooks become the top collector target.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-violet-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-400">2024–2026</p>
                  <p className="mt-1 leading-relaxed">Continued pack additions, seasonal rotations, and balance updates. The community grows around pack strategy, drop rate analysis, and probability optimization — which is exactly what this calculator site was built to serve.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Why Blooket Works</h2>
            <p className="leading-relaxed">
              The genius of Blooket is the combination of education and collection.
              Traditional quiz tools have a motivation problem: once students answer
              the questions, there is no reason to keep playing. Blooket solves this
              by attaching a gacha-style collection system to the quiz mechanic. Students
              keep answering questions because they want tokens to open more packs.
            </p>
            <p className="mt-4 leading-relaxed">
              The rarity system (Common → Chroma) creates a natural progression ladder.
              Players chase increasingly rare blooks, and the low drop rates for
              Legendary and Chroma blooks create the same engagement loop that makes
              gacha games compelling — but in an educational context.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Blooket vs. Competitors</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 px-3 font-bold text-white/70">Feature</th>
                    <th className="py-3 px-3 font-bold text-white/70">Blooket</th>
                    <th className="py-3 px-3 font-bold text-white/70">Kahoot</th>
                    <th className="py-3 px-3 font-bold text-white/70">Gimkit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-white/60">Collection mechanic</td>
                    <td className="py-3 px-3 text-emerald-400">Yes (blooks)</td>
                    <td className="py-3 px-3 text-white/40">No</td>
                    <td className="py-3 px-3 text-white/40">Limited</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-white/60">Multiple game modes</td>
                    <td className="py-3 px-3 text-emerald-400">10+</td>
                    <td className="py-3 px-3 text-white/40">3–4</td>
                    <td className="py-3 px-3 text-white/40">5+</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-white/60">Rarity tiers</td>
                    <td className="py-3 px-3 text-emerald-400">6 (Common–Chroma)</td>
                    <td className="py-3 px-3 text-white/40">None</td>
                    <td className="py-3 px-3 text-white/40">None</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-white/60">Probability tools</td>
                    <td className="py-3 px-3 text-emerald-400">This site!</td>
                    <td className="py-3 px-3 text-white/40">N/A</td>
                    <td className="py-3 px-3 text-white/40">N/A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/about" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            About This Site
          </Link>
          <Link href="/faq" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            FAQ
          </Link>
          <Link href="/guides" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Guides
          </Link>
          <Link href="/" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Calculator
          </Link>
        </aside>
      </main>
    </>
  );
}
