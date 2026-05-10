"use client";

import Link from "next/link";
import { useState } from "react";

import { PACKS } from "@/lib/packs";
import { siteName } from "@/lib/site";

const RESOURCES = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/team", label: "Authors & Team" },
  { href: "/editorial-guidelines", label: "Editorial Guidelines" },
  { href: "/html-sitemap", label: "HTML Sitemap" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

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
              {PACKS.slice(0, 5).map((pack) => (
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
                  href="/"
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
              Stay Updated
            </p>
            <p className="mt-5 text-sm leading-6 text-white/50">
              Get notified when new packs are added or odds get updated.
            </p>

            {subscribed ? (
              <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm font-bold text-emerald-400">
                ✓ You&apos;re subscribed! We&apos;ll keep you posted.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4">
                <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.08] transition focus-within:border-violet-500/30">
                  <div className="flex items-center pl-4 text-white/30">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-3 text-sm font-semibold text-white/90 placeholder:text-white/25 outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="my-1.5 mr-1.5 flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 text-white shadow-lg shadow-violet-500/15 transition-all hover:brightness-110 active:scale-95"
                    aria-label="Subscribe"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 flex gap-3">
              <a
                href="https://facebook.com/blooketcalculator"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 transition hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20"
                aria-label="Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V7.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/blooketcalculator"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 transition hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20"
                aria-label="Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/blooketcalc"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 transition hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20"
                aria-label="X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </a>
              <a
                href="https://discord.gg/blooketcalculator"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 transition hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20"
                aria-label="Discord"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
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
                href="https://www.dmca.com/Protection/Status.aspx?ID=dummy-id" 
                title="DMCA.com Protection Status" 
                className="dmca-badge"
                target="_blank"
                rel="noreferrer"
              >
                <img src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=dummy-id" alt="DMCA.com Protection Status" width="100" height="20" />
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
