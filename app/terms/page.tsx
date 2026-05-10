import type { Metadata } from "next";
import Link from "next/link";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use & Disclaimers | Blooket Calculator",
  description: `Terms of use for ${siteName}. Understand the scope, limitations, and disclaimers of the probability data provided by this independent fan tool.`,
  keywords: [
    "blooket calculator terms",
    "blooket calculator disclaimer",
    "blooket fan tool terms",
  ],
  alternates: {
    canonical: `${siteUrl}/terms`,
    languages: {
      "en-US": `${siteUrl}/terms`,
      "x-default": `${siteUrl}/terms`,
    },
  },
};

export default function TermsPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-4xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            Legal
          </div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
            Terms of Use
          </h1>
          <p className="text-sm text-white/40">
            Last updated: May 2026
          </p>
        </div>

        <article className="glass-panel mt-12 rounded-[2rem] p-6 sm:p-8">
          <div className="max-w-none space-y-8">
            <section>
              <h2 className="font-sans text-xl font-black text-white">
                Acceptance
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/40">
                By using the {siteName}, you agree to these terms. If you do not
                agree, please do not use the calculator.
              </p>
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section>
              <h2 className="font-sans text-xl font-black text-white">
                Nature of the Service
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/40">
                This tool provides probability calculations based on
                community-referenced drop rate tables for Blooket packs. It is an
                independent fan tool and is not affiliated with, endorsed by, or
                connected to Blooket in any way.
              </p>
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section>
              <h2 className="font-sans text-xl font-black text-white">
                Data Accuracy Disclaimer
              </h2>
              <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-5">
                <p className="text-sm leading-7 text-white/40">
                  <strong className="text-amber-400">Important:</strong> The
                  drop rates used by this calculator are based on public
                  community reference pages and have not been officially
                  confirmed by Blooket. Actual drop rates may differ. We label
                  every data source clearly and never claim official publisher
                  confirmation.
                </p>
              </div>
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section>
              <h2 className="font-sans text-xl font-black text-white">
                No Financial Advice
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/40">
                The probabilities and cost estimates displayed are for
                informational purposes only. They should not be construed as
                advice on how to spend in-game currency. You are solely
                responsible for your own token spending decisions.
              </p>
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section>
              <h2 className="font-sans text-xl font-black text-white">
                Intellectual Property
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/40">
                &quot;Blooket&quot; and all related game content, Blook names,
                and pack names are trademarks of their respective owners. This
                calculator is a fan-made tool and uses these names solely for
                reference purposes.
              </p>
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section>
              <h2 className="font-sans text-xl font-black text-white">
                Limitation of Liability
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/40">
                This tool is provided &quot;as is&quot; without warranty of any
                kind. We are not liable for any losses, damages, or
                dissatisfaction resulting from decisions made based on the
                calculator&apos;s output.
              </p>
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section>
              <h2 className="font-sans text-xl font-black text-white">
                Updates to Terms
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/40">
                We may update these terms at any time. The &quot;last
                updated&quot; date at the top of this page will reflect the most
                recent revision. Continued use of the calculator after changes
                constitutes acceptance.
              </p>
            </section>

            <div className="h-px bg-white/[0.06]" />

            <section id="contact">
              <h2 className="font-sans text-xl font-black text-white">
                Contact Information
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/40">
                Questions about these terms? Reach out via our{" "}
                <Link
                  href="/contact"
                  className="text-violet-400 underline underline-offset-4 transition hover:text-violet-300"
                >
                  contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
