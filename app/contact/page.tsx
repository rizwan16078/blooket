import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Blooket Calculator — Data Corrections, Bug Reports & Feedback",
  description:
    "Contact the Blooket Calculator team for drop rate corrections, bug reports, or feature requests. We typically respond within 48 hours.",
  keywords: [
    "blooket calculator contact",
    "blooket calculator feedback",
    "blooket drop rate correction",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
    languages: {
      "en-US": `${siteUrl}/contact`,
      "x-default": `${siteUrl}/contact`,
    },
  },
};

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            Get in touch
          </div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
            Found a Bug? Have a Suggestion?
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-white/50">
            Reach out to the Blooket Calculator team for data corrections, feature requests, or general inquiries.
          </p>
          <div className="mt-6 flex flex-col space-y-4 text-base leading-8 text-white/40 max-w-3xl">
            <p>
              We take data accuracy seriously. If you have spotted a discrepancy in our drop rates, pack costs, or sell values compared to the live game, please let us know. Be sure to specify the exact pack or blook you are reporting.
            </p>
            <p>
              Our team typically reviews and verifies all corrections within 48 hours. For feature requests or mathematical questions about our binomial probability engine, please be as detailed as possible in your message so we can give you the best response.
            </p>
            <p>
              The Blooket Calculator is an independent, community-driven tool created to provide players with exact, transparent odds. We rely on active players like you to help keep our drop rate tables and pack data accurate. Whenever a new pack is released or drop rates change, your reports ensure that the calculator remains the most reliable probability tool for the community. Whether you are suggesting a new visual feature, reporting an obscure bug, or sharing your token spending strategies, we value every single submission.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <ContactForm />

          {/* Info Cards */}
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-white">
                Data Corrections
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/40">
                Found a drop rate that doesn&apos;t match your testing? Let us
                know with the pack name, rarity, and your observed data. We take
                every correction seriously.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-white">
                Feature Requests
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/40">
                Want a specific pack added? Need a new metric? We prioritize
                features based on community demand.
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-black text-white">
                Response Time
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/40">
                We typically respond within 48 hours. Data corrections are
                prioritized and may ship in the same day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
