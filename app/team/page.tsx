import type { Metadata } from "next";

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Authors & Team Behind Blooket Calculator",
  description: "Meet the developers, mathematicians, and Blooket enthusiasts who built and maintain the Blooket Calculator probability engine.",
  keywords: [
    "blooket calculator team",
    "blooket calculator authors",
    "blooket calculator developers",
  ],
  alternates: {
    canonical: `${siteUrl}/team`,
    languages: {
      "en-US": `${siteUrl}/team`,
      "x-default": `${siteUrl}/team`,
    },
  },
};

export default function TeamPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            Our Team
          </div>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Authors & Team
          </h1>
          <p className="text-lg leading-8 text-white/50">
            Meet the mathematicians, developers, and Blooket enthusiasts behind the Blooket Calculator.
          </p>
        </div>

        <article className="mt-12 glass-panel rounded-[2rem] p-6 sm:p-8 text-white/70 space-y-6">
          <h2 className="text-2xl font-black text-white">The Creators</h2>
          <p>
            The Blooket Calculator was founded by a small team of developers who wanted to bring transparency to the drop rates in Blooket.
            We observed that many players were spending their hard-earned tokens without understanding the true mathematical odds of pulling rare Blooks.
          </p>
          <p>
            Our mission is simple: give every Blooket player accurate, verifiable probability data before they spend a single token. We believe
            informed decisions lead to better gameplay experiences and a more engaged community.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white">Alex M.</h3>
              <p className="text-sm text-violet-400 mb-2">Lead Developer & Mathematician</p>
              <p className="text-sm">Alex handles the core probability engine and ensures all drop rates reflect accurate binomial distributions. With a background in statistics and game theory, Alex brings rigorous mathematical thinking to every feature.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white">Sam T.</h3>
              <p className="text-sm text-violet-400 mb-2">UI/UX Designer</p>
              <p className="text-sm">Sam focuses on making the calculator intuitive and visually appealing, bringing the glassmorphic design to life. Sam specializes in data visualization and accessibility-first interface design.</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-lg font-bold text-white">Our Commitment to Accuracy</h3>
            <p className="mt-2 text-sm leading-7">
              Every probability displayed on the Blooket Calculator is computed using the exact binomial formula P(at least 1) = 1 − (1 − p)^n.
              We cross-reference all drop rates against community-sourced data from iBlooket and the Blooket Wiki, and we clearly label every data source.
              We are not affiliated with, endorsed by, or officially connected to Blooket LLC in any capacity.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="text-lg font-bold text-white">Contributing & Corrections</h3>
            <p className="mt-2 text-sm leading-7">
              We welcome community contributions. If you spot a drop rate discrepancy, find a bug, or want to suggest a new feature,
              please reach out via our contact page. Data corrections are our highest priority — we typically ship fixes within 24 hours.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
