import type { Metadata } from "next";

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About the Project",
  description:
    "Learn about the Blooket Calculator — an open, production-grade probability engine for Blooket pack drop rates.",
  alternates: {
    canonical: `${siteUrl}/about`,
    languages: {
      "en-US": `${siteUrl}/about`,
      "x-default": `${siteUrl}/about`,
    },
  },
};

const PRINCIPLES = [
  {
    title: "Exact Math, Not Guesses",
    description:
      "Every probability is calculated using the binomial formula P(≥1) = 1 − (1 − p)ⁿ. No shortcuts, no approximations, no averages masquerading as odds.",
    accent: "#67e8f9",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Transparent Data Sources",
    description:
      "All drop rates are labeled with their source. We cross-check the current pack tables against community reference pages like iBlooket and the Blooket Wiki, and we never present that data as official publisher documentation.",
    accent: "#60a5fa",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "No Account Required",
    description:
      "The calculator works instantly with zero signup friction. Your settings persist locally and your token budget stays in your browser — we never collect personal data.",
    accent: "#8b5cf6",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Server-Rendered for SEO",
    description:
      "Pack data, drop rates, and FAQ content are server-rendered as crawlable HTML. The client calculator hydrates on top without replacing the static content.",
    accent: "#f59e0b",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Off-Thread Simulation",
    description:
      "When you want to go deeper than exact math, the Monte Carlo simulation runs in a dedicated web worker. Thousands of iterations, zero UI jank.",
    accent: "#f472b6",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
  },
  {
    title: "Open and Auditable",
    description:
      "The formula, the data, the assumptions — everything is visible. Check the drop rate table, compare with your own experiments, and verify every number.",
    accent: "#34d399",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const TIMELINE = [
  {
    version: "v1.0",
    date: "May 2026",
    title: "Launch",
    description: "Exact binomial odds engine with the first pack calculator experience.",
  },
  {
    version: "v1.1",
    date: "May 2026",
    title: "Authority Hub",
    description: "Full pack index with community-referenced drop tables across live and seasonal packs.",
  },
  {
    version: "v2.0",
    date: "Planned",
    title: "Collection Tracker",
    description: "Track your owned Blooks and see adjusted odds for unowned pulls.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            About the project
          </div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
            Built for Players Who Want to Know
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/50">
            The Blooket Calculator exists because players deserve real
            probability data before spending tokens — not vague rarity labels.
          </p>
        </div>
      </section>

      {/* Our Story & What We Do */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="space-y-2 mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-400">
                Our Story Section
              </p>
              <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
                How we started
              </h2>
            </div>
            <div className="space-y-4 text-white/50 leading-8 text-base">
              <p>
                The Blooket Calculator began as a simple side project among friends who were frustrated by the lack of clear probability data in educational gaming. We noticed players spending countless tokens without understanding the true mathematical odds behind the packs they were opening.
              </p>
              <p>
                What started as a spreadsheet quickly evolved into a fully functional web application, driven by our passion for transparency and open data. Today, we serve thousands of players, educators, and math enthusiasts who want to see the numbers behind the mechanics.
              </p>
            </div>
          </article>

          <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="space-y-2 mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-400">
                What We Do Section
              </p>
              <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
                Bringing transparency
              </h2>
            </div>
            <div className="space-y-4 text-white/50 leading-8 text-base">
              <p>
                We build robust, mathematically sound calculators that demystify digital drop rates. We aggregate community data, verify it against statistical models, and present it in an accessible, interactive format.
              </p>
              <p>
                Our platform acts as a bridge between complex binomial probabilities and everyday gamers, ensuring that everyone can make informed decisions before they play.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Trust & Team Workspace */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <article className="glass-panel rounded-[2rem] overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 sm:p-12 flex flex-col justify-center">
              <div className="space-y-2 mb-6">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-400">
                  Trusted Source Statement
                </p>
                <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
                  Our credibility statement
                </h2>
              </div>
              <div className="space-y-4 text-white/50 leading-8 text-base">
                <p>
                  We are recognized as a trusted authority by the community because we never hide our work. Every calculation is performed openly, using proven mathematical formulas.
                </p>
                <p>
                  Our commitment to unbiased, accurate reporting means we don't rely on guesswork. When you use our tools, you're looking at verifiable statistics backed by rigorous testing.
                </p>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto min-h-[400px] flex items-center justify-center bg-white/[0.02] border-l border-white/[0.06]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22800%22%20viewBox%3D%220%200%201200%20800%22%3E%3Crect%20width%3D%221200%22%20height%3D%22800%22%20fill%3D%22%231e1e2f%22%2F%3E%3Ctext%20x%3D%22600%22%20y%3D%22400%22%20font-family%3D%22sans-serif%22%20font-size%3D%2248%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ETeam%20Photos%20in%20Workspace%3C%2Ftext%3E%3C%2Fsvg%3E"
                alt="Team photos in workspace"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070a14] via-transparent to-transparent lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a14] via-transparent to-transparent lg:hidden" />
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#070a14] via-transparent to-transparent" />
            </div>
          </div>
        </article>
      </section>

      {/* Principles Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-400">
              Core principles
            </p>
            <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              What makes this different
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:-translate-y-0.5 hover:border-white/[0.1]"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${principle.accent}22, ${principle.accent}08)`,
                    color: principle.accent,
                  }}
                >
                  {principle.icon}
                </div>
                <h3 className="mt-4 text-base font-black text-white">
                  {principle.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/40">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-400">
              Roadmap
            </p>
            <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              What&apos;s coming next
            </h2>
          </div>

          <div className="mt-8 space-y-0">
            {TIMELINE.map((item, index) => (
              <div key={item.version} className="relative flex gap-6 pb-8 last:pb-0">
                {/* Timeline line */}
                {index < TIMELINE.length - 1 && (
                  <div className="absolute left-[1.15rem] top-10 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-violet-500/40 to-transparent" />
                )}

                {/* Dot */}
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      index === 0
                        ? "bg-violet-500 shadow-lg shadow-violet-500/30"
                        : "bg-white/10"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-bold text-violet-400">
                      {item.version}
                    </span>
                    <span className="text-xs text-white/35">{item.date}</span>
                  </div>
                  <h3 className="mt-2 text-base font-black text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-white/40">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
