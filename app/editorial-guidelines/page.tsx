import type { Metadata } from "next";

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Guidelines",
  description: "Our standards for publishing accurate and reliable Blooket information.",
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
            We strictly rely on proven data and mathematical formulas. All drop rates and pack costs are cross-referenced with the most reliable community sources. We do not publish rumors or unverified claims.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">2. Transparent Methodologies</h2>
          <p>
            Every calculation on our site is based on the binomial formula P(≥1) = 1 − (1 − p)ⁿ. We show our work, and we provide clear explanations for how probabilities are determined.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">3. Corrections and Updates</h2>
          <p>
            If Blooket changes its drop rates or introduces new packs, we strive to update our calculator as swiftly as possible. When a significant change occurs, we clearly note the update in our change logs and update the relevant pages.
          </p>
          <h2 className="text-2xl font-black text-white mt-8">4. No Affiliation</h2>
          <p>
            We clearly state that we are not affiliated with, endorsed by, or connected to Blooket LLC. We maintain an independent, objective perspective.
          </p>
        </article>
      </section>
    </main>
  );
}
