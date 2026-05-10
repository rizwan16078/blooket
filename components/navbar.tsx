"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Calculator" },
  { href: "/packs", label: "Packs" },
  { href: "/blooks", label: "Blook Library" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-2xl" />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg shadow-violet-500/20 bg-gradient-to-br from-violet-500 to-indigo-600">
            <Image src="/logo.svg" alt="Blooket Calculator Logo" width={40} height={40} className="rounded-2xl" priority />
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition group-hover:opacity-100 pointer-events-none" />
          </div>
          <span className="font-sans text-lg font-black tracking-wide text-white/95">
            Blooket Calculator
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110 active:scale-[0.97]"
          >
            Open Calculator
          </Link>
        </div>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-white/70 transition-transform ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-white/70 transition-opacity ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-white/70 transition-transform ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {mobileOpen && (
        <div className="relative border-t border-white/[0.06] bg-[#0a0e1a]/95 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
              Navigate
            </p>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3 py-3 text-sm font-bold transition ${
                  isLinkActive(pathname, link.href)
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white/85"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-violet-500/20"
              >
                Open Calculator
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
