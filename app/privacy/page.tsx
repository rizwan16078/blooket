import type { Metadata } from "next";
import Link from "next/link";
import { siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteName}. Learn what data we collect (almost none) and how the calculator stores your settings.`,
};

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-sky-400 to-sky-500">
      <section className="mx-auto max-w-4xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_46%)]" />

        <div className="space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white drop-shadow-sm">
            Legal
          </div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white drop-shadow-md sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/85">
            Last updated: May 2026
          </p>
        </div>

        <article className="glass-panel mt-12 rounded-[2rem] p-6 sm:p-8">
          <div className="max-w-none space-y-8">
            <section>
              <h2 className="font-sans text-xl font-black text-slate-900">
                Overview
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                The {siteName} is a client-side probability calculator. We are
                committed to minimal data collection. This policy explains what
                data is stored and how it is used.
              </p>
            </section>

            <div className="h-px bg-sky-100" />

            <section>
              <h2 className="font-sans text-xl font-black text-slate-900">
                Data We Store
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    Local Storage
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Your pack selection, token budget, and dupe refund toggle are
                    saved in your browser&apos;s localStorage so they persist between
                    sessions. This data never leaves your device.
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    URL Parameters
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Calculator state is reflected in the URL query string for
                    shareability. This is purely client-side routing and is not
                    logged by our servers.
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px bg-sky-100" />

            <section>
              <h2 className="font-sans text-xl font-black text-slate-900">
                Data We Do NOT Collect
              </h2>
              <ul className="mt-4 space-y-2">
                {[
                  "No personal information (name, email, phone)",
                  "No tracking cookies",
                  "No analytics or telemetry by default",
                  "No Blooket account credentials",
                  "No gameplay data or token balances",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-500">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 text-xs">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <div className="h-px bg-sky-100" />

            <section>
              <h2 className="font-sans text-xl font-black text-slate-900">
                Third-Party Services
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                This site uses Google Fonts for typography (Space Grotesk and IBM
                Plex Mono). Font requests are subject to Google&apos;s privacy
                policy. No other third-party services are integrated.
              </p>
            </section>

            <div className="h-px bg-sky-100" />

            <section>
              <h2 className="font-sans text-xl font-black text-slate-900">
                Web Workers
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                The Monte Carlo simulation runs entirely in your browser via a
                web worker. No simulation data is transmitted to any server. All
                computation happens on your device.
              </p>
            </section>

            <div className="h-px bg-sky-100" />

            <section>
              <h2 className="font-sans text-xl font-black text-slate-900">
                Changes to This Policy
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                If we add analytics or any data collection in the future, this
                page will be updated and the change date will be revised. We will
                never retroactively collect data without updating this policy
                first.
              </p>
            </section>

            <div className="h-px bg-sky-100" />

            <section>
              <h2 className="font-sans text-xl font-black text-slate-900">
                Contact
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Questions about privacy? Reach out via our{" "}
                <Link
                  href="/contact"
                  className="text-sky-600 underline underline-offset-4 transition hover:text-sky-700"
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
