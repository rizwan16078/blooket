import type { Metadata } from "next";
import Link from "next/link";

import { buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteUrl } from "@/lib/site";
import { PACKS } from "@/lib/packs";

export const metadata: Metadata = {
  title: "Blooket Calculator Unblocked — Free Pack Odds Tool",
  description:
    "Use the Blooket Calculator unblocked — no login, no download, no school filter required. Calculate exact Blooket pack odds and drop rates instantly.",
  alternates: {
    canonical: `${siteUrl}/unblocked`,
  },
};

const faqEntries: FaqEntry[] = [
  {
    question: "Is the Blooket Calculator unblocked?",
    answer:
      "Yes. The Blooket Calculator at calculatorblooket.com runs entirely in your browser with no login, no download, and no school network restrictions. It is a standard web tool that calculates pack odds using publicly known drop rates.",
  },
  {
    question: "Why is the Blooket Calculator blocked at school?",
    answer:
      "Many school content filters block gaming-related sites by category, not by individual URL. Because this calculator is a math tool — not the Blooket game itself — it is typically accessible on most filtered networks.",
  },
  {
    question: "Does the unblocked Blooket Calculator require sign-in?",
    answer:
      "No. The calculator has zero account requirements. Just open the site, choose a pack, enter your token count, and see your exact odds instantly.",
  },
  {
    question: "Which Blooket packs can I calculate odds for?",
    answer: `You can calculate exact odds for all ${PACKS.length} Blooket packs including Space, Aquatic, Medieval, Breakfast, and more. Every pack has its own detailed odds page with Legendary and Chroma probabilities.`,
  },
];

export default function UnblockedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildFaqSchema(faqEntries)),
        }}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              No login · No download · Works anywhere
            </p>
            <h1 className="mt-4 font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
              Blooket Calculator{" "}
              <span className="text-violet-300">Unblocked</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
              Calculate exact Blooket pack odds — Legendary, Chroma, Epic —
              right in your browser. No account, no app, no restrictions.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-500 hover:shadow-violet-500/30"
              >
                Open Calculator →
              </Link>
              <Link
                href="/packs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-8 py-4 text-base font-bold text-white transition hover:bg-white/[0.08]"
              >
                Browse All Packs
              </Link>
            </div>
          </div>
        </section>

        {/* Why it works anywhere */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🌐",
                title: "Runs in any browser",
                body: "Pure web app — Chrome, Firefox, Safari, Edge. No installs.",
              },
              {
                icon: "🔓",
                title: "No account needed",
                body: "Zero sign-up, zero cookies, zero tracking. Open and use.",
              },
              {
                icon: "⚡",
                title: "Instant exact math",
                body: "Probabilities update live using exact binomial formulas, not guesses.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-xl"
              >
                <p className="text-3xl">{card.icon}</p>
                <p className="mt-3 text-lg font-black">{card.title}</p>
                <p className="mt-2 text-sm leading-7 text-white/50">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pack quick links */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
            Jump to a pack calculator
          </h2>
          <p className="mt-3 text-base leading-8 text-white/50">
            Every pack has its own page with a live odds calculator, full drop
            rate table, and Legendary/Chroma probabilities.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PACKS.filter((p) => !p.isLocked).map((pack) => (
              <Link
                key={pack.id}
                href={pack.route}
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition hover:border-violet-500/30 hover:bg-white/[0.04]"
              >
                <span className="font-bold text-white group-hover:text-violet-300 transition">
                  {pack.name} Pack
                </span>
                <span className="text-xs text-white/30">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
          <article className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-2xl sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              FAQ
            </p>
            <h2 className="mt-3 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              Common questions about the unblocked calculator
            </h2>

            <div className="mt-8 grid gap-4">
              {faqEntries.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
                >
                  <summary className="cursor-pointer list-none pr-6 text-base font-black text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-white/40">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
