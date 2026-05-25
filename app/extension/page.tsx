import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Calculator Chrome Extension — Free Download",
  description:
    "Install the free Blooket Calculator Chrome extension. Calculate pack odds, simulate openings, chase blooks, and optimize your token strategy — right from your browser.",
  alternates: {
    canonical: `${siteUrl}/extension`,
  },
  openGraph: {
    title: "Blooket Calculator Chrome Extension — Free Download",
    description:
      "Calculate pack odds, simulate openings, and optimize your token strategy — right in your browser.",
    url: `${siteUrl}/extension`,
    siteName,
    type: "website",
  },
};

const STEPS = [
  {
    num: 1,
    title: "Download the extension",
    desc: "Click the download button below to get the ZIP file.",
  },
  {
    num: 2,
    title: "Unzip the file",
    desc: "Extract the ZIP to a folder you can find easily (e.g. your Desktop).",
  },
  {
    num: 3,
    title: "Open Chrome Extensions",
    desc: 'Go to chrome://extensions in your address bar (or Menu → Extensions → Manage Extensions).',
  },
  {
    num: 4,
    title: "Enable Developer Mode",
    desc: "Toggle the \"Developer mode\" switch in the top-right corner.",
  },
  {
    num: 5,
    title: "Load the extension",
    desc: 'Click \"Load unpacked\" and select the unzipped folder (the one containing manifest.json).',
  },
  {
    num: 6,
    title: "Pin it & enjoy!",
    desc: "Click the puzzle piece icon in your toolbar and pin Blooket Calculator for quick access.",
  },
];

const FEATURES = [
  {
    icon: "🎲",
    title: "Pack Odds",
    desc: "Exact probability of pulling Epic+, Legendary, or Chroma from any pack.",
  },
  {
    icon: "🎮",
    title: "Simulator",
    desc: "Open packs virtually — see what you get, sell duplicates, and chain simulations.",
  },
  {
    icon: "👑",
    title: "Chase Calculator",
    desc: "Target any blook and see how many tokens you need for 50%, 90%, or 99% chance.",
  },
  {
    icon: "⚡",
    title: "Token Grinder",
    desc: "Find the fastest game modes to earn tokens with time estimates per mode.",
  },
  {
    icon: "💎",
    title: "Value Guide",
    desc: "Browse all blooks with search, rarity filters, and sorting by value or drop rate.",
  },
  {
    icon: "🔒",
    title: "100% Private",
    desc: "No accounts, no data collection, no external API calls. Runs entirely offline.",
  },
];

export default function ExtensionPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-block rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 ring-1 ring-violet-400/20">
          Chrome Extension
        </span>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Blooket Calculator —{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            in your browser
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-400">
          Calculate pack odds, simulate openings, chase blooks, and optimize your
          token strategy — right from your browser toolbar.
        </p>
      </div>

      {/* Download CTA */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <a
          href="/downloads/blooket-calculator-extension.zip"
          download
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Extension (Free)
        </a>
        <p className="text-xs text-slate-500">
          v1.0.0 · Chrome &amp; Chromium browsers · No account needed
        </p>
      </div>

      {/* Features grid */}
      <div className="mt-16">
        <h2 className="text-center text-lg font-semibold text-white">
          What&apos;s inside
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-2 text-sm font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Installation steps */}
      <div className="mt-16">
        <h2 className="text-center text-lg font-semibold text-white">
          How to install
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-400">
          No Chrome Web Store account needed. Just 6 simple steps.
        </p>
        <ol className="mt-8 space-y-4">
          {STEPS.map((step) => (
            <li key={step.num} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-sm font-bold text-violet-300 ring-1 ring-violet-400/20">
                {step.num}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ */}
      <div className="mt-16 space-y-4">
        <h2 className="text-center text-lg font-semibold text-white">
          Common questions
        </h2>
        {[
          {
            q: "Is this a hack or cheat?",
            a: "No. This is a mathematical simulation tool. It does not connect to your Blooket account, modify game data, or give you free tokens.",
          },
          {
            q: "Why do I see a 'Disable developer mode extensions' warning?",
            a: "Chrome shows this warning for extensions installed outside the Chrome Web Store. It's safe to dismiss — our extension is open-source and runs entirely offline with no external connections.",
          },
          {
            q: "Does it work on Firefox or Safari?",
            a: "Currently Chrome and Chromium browsers only (Edge, Brave, Opera, Arc). Firefox and Safari support may come later.",
          },
          {
            q: "Is it really free?",
            a: "Yes, 100% free. No ads, no premium tier, no data collection. Built by calculatorblooket.com for the Blooket community.",
          },
        ].map((faq) => (
          <details
            key={faq.q}
            className="group rounded-xl border border-white/5 bg-white/[0.02]"
          >
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-white list-none">
              {faq.q}
              <svg
                className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
            </summary>
            <p className="px-4 pb-3 text-xs text-slate-400">{faq.a}</p>
          </details>
        ))}
      </div>

      {/* Back to calculator */}
      <div className="mt-16 text-center">
        <a
          href="/"
          className="text-sm text-violet-400 hover:text-violet-300 transition"
        >
          ← Back to Calculator
        </a>
      </div>
    </main>
  );
}
