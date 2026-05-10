import type { Metadata } from "next";

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial & Data Standards",
  description: "Our rigorous editorial standards for publishing accurate, verified, and unbiased Blooket probability data and drop rate information.",
  keywords: [
    "blooket editorial guidelines",
    "blooket data accuracy",
    "blooket calculator standards",
    "blooket probability transparency",
  ],
  alternates: {
    canonical: `${siteUrl}/editorial-guidelines`,
    languages: {
      "en-US": `${siteUrl}/editorial-guidelines`,
      "x-default": `${siteUrl}/editorial-guidelines`,
    },
  },
};

export default function EditorialGuidelinesPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            Policies
          </div>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Editorial Guidelines
          </h1>
          <p className="text-lg leading-8 text-white/50">
            Our commitment to accuracy, transparency, and mathematical rigor.
          </p>
        </div>

        <article className="mt-12 glass-panel rounded-[2rem] p-6 sm:p-8 text-white/70 space-y-6 prose prose-invert prose-violet">
          <h2 className="text-2xl font-black text-white">1. Data Accuracy</h2>
          <p>
            We strictly rely on proven data and mathematical formulas. All drop rates and pack costs are cross-referenced with the most reliable community sources including iBlooket and the Blooket Wiki. We do not publish rumors or unverified claims. Every piece of data on this site is labeled with its source so readers can verify independently.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">2. Transparent Methodologies</h2>
          <p>
            Every calculation on our site is based on the binomial formula P(≥1) = 1 − (1 − p)ⁿ. We show our work, and we provide clear explanations for how probabilities are determined. Our formulas and assumptions are documented in the How It Works page, which is kept up to date with any engine changes.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">3. Corrections and Updates</h2>
          <p>
            If Blooket changes its drop rates or introduces new packs, we strive to update our calculator as swiftly as possible. When a significant change occurs, we clearly note the update in our change logs and update the relevant pages. We acknowledge corrections publicly and never quietly alter data without noting the change.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">4. No Affiliation</h2>
          <p>
            We clearly state that we are not affiliated with, endorsed by, or connected to Blooket LLC. We maintain an independent, objective perspective. This independence ensures our data is never influenced by commercial interests or publisher relationships.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">5. Community Accountability</h2>
          <p>
            We welcome correction submissions from the community. If a user identifies a discrepancy between our displayed drop rates and observed gameplay data, they can report it through our contact page. We investigate every submission and respond within 48 hours. Our editorial decisions are guided by statistical evidence, not personal preference.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">6. Scope of Coverage</h2>
          <p>
            Our editorial coverage is limited to Blooket pack mechanics, drop rate tables, and probability calculations. We do not editorialize about game balance, player strategy beyond mathematical probability, or monetization ethics. Our role is to present verifiable data clearly and let players make their own informed decisions.
          </p>
        </article>
      </section>
    </main>
  );
}
