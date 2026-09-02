import Link from "next/link";

import { PACKS } from "@/lib/packs";
import { siteName } from "@/lib/site";

// Every entry here renders in server HTML. The games, token grinder and
// extension pages are only linked from the navbar's client-side dropdown and
// mobile menu, so before they were added here no crawler could reach them —
// they were absent from the sitemap too, making them fully orphaned.
const RESOURCES = [
  { href: "/games", label: "Blooket Mini Games" },
  { href: "/games/blookle", label: "Blookle Word Game" },
  { href: "/games/guess-the-blook", label: "Guess the Blook" },
  { href: "/games/rarity-quiz", label: "Rarity Quiz" },
  { href: "/calculators/token-grinder", label: "Token Grinder" },
  { href: "/extension", label: "Chrome Extension" },
  { href: "/guides", label: "Guides & Glossary" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/methodology", label: "Methodology" },
  { href: "/updates", label: "Updates & Change Log" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/team", label: "Authors & Team" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines" },
  { href: "/html-sitemap", label: "HTML Sitemap" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/unblocked", label: "Blooket Unblocked" },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="bg-[#070a14]/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
          <div className="space-y-5">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20 transition">
                <span className="text-2xl font-black text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>B</span>
              </div>
              <span className="font-sans text-lg font-black tracking-wide text-white/95">
                Blooket Calculator
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-white/50">
              Production-grade probability engine for Blooket packs. Exact math,
              not guesses.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40 mb-5">
              Pack Calculators
            </p>
            <ul className="space-y-3">
              {PACKS.map((pack) => (
                <li key={pack.slug}>
                  <Link
                    href={pack.route}
                    className="group flex items-center gap-2 text-sm text-white/50 transition hover:text-white/80"
                  >
                    <span
                      className="h-2 w-2 rounded-full opacity-60 transition group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, ${pack.accent.from}, ${pack.accent.to})`,
                      }}
                    />
                    {pack.name} Pack
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/packs"
                  className="inline-flex items-center gap-1 text-sm font-bold text-violet-400 transition hover:text-violet-300"
                >
                  All Packs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40 mb-5">
              Resources
            </p>
            <ul className="space-y-3">
              {RESOURCES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition hover:text-white/80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">
              Trust & Updates
            </p>
            <p className="mt-5 text-sm leading-6 text-white/50">
              Follow the pages that show how the data works, when it changed, and which
              guides support the calculator.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/updates"
                className="block rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-violet-500/25 hover:text-white"
              >
                View the change log
              </Link>
              <Link
                href="/methodology"
                className="block rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-violet-500/25 hover:text-white"
              >
                Read the methodology
              </Link>
              <a
                href="/rss.xml"
                className="block rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/75 transition hover:border-violet-500/25 hover:text-white"
              >
                Subscribe via RSS
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
            <div className="text-center sm:text-left">
              <p className="text-xs text-white/40">
                © {new Date().getFullYear()} {siteName}. All rights reserved.
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400/50">
                Powered by exact probability math
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a 
                href="https://www.dmca.com/Protection/Status.aspx" 
                title="DMCA.com Protection Status" 
                className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/50 transition hover:text-white/70 hover:border-white/[0.12]"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                DMCA Protected
              </a>
              <a href="mailto:contact@blooketcalculator.com" className="text-xs text-white/40 transition hover:text-white/70">
                contact@blooketcalculator.com
              </a>
              <Link
                href="/privacy"
                className="text-xs text-white/40 transition hover:text-white/70"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-white/40 transition hover:text-white/70"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
