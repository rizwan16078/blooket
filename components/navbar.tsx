"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const CALCULATOR_LINKS = [
  {
    href: "/",
    icon: "🎯",
    label: "Main Calculator",
    description: "All-in-one interactive tool",
    isFeatured: true,
  },
  {
    href: "/calculators/pack-odds",
    icon: "📊",
    label: "Pack Odds",
    description: "Live drop rates for every pack",
  },
  {
    href: "/calculators/roi",
    icon: "💰",
    label: "ROI Calculator",
    description: "Best value pack per token",
  },
  {
    href: "/calculators/token-converter",
    icon: "🪙",
    label: "Token → Pack",
    description: "How many packs your tokens buy",
  },
  {
    href: "/calculators/value",
    icon: "💎",
    label: "Blook Value",
    description: "Sell values for every blook",
  },
  {
    href: "/calculators/chase",
    icon: "👑",
    label: "Chase Calculator",
    description: "Tokens needed for any blook",
  },
];

const NAV_ITEMS = [
  { href: "/packs", label: "Packs" },
  { href: "/blooks", label: "Blooks" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isCalculatorActive = CALCULATOR_LINKS.some(
    (link) => pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)),
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-2xl" />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
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

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {/* Calculators Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-200",
                isCalculatorActive
                  ? "bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]"
                  : "text-white/55 hover:bg-white/[0.04] hover:text-white/85",
              )}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Calculators
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  dropdownOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0e1a]/95 shadow-2xl backdrop-blur-xl"
                >
                  <div className="p-2">
                    {CALCULATOR_LINKS.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setDropdownOpen(false)}
                          className={cn(
                            "flex items-start gap-3 rounded-xl p-3 transition-colors",
                            isActive
                              ? "bg-violet-500/10"
                              : "hover:bg-white/[0.04]",
                            link.isFeatured && !isActive && "bg-teal-500/5",
                          )}
                        >
                          <span className="mt-0.5 text-2xl">{link.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-sm font-semibold",
                                  isActive ? "text-violet-200" : "text-white",
                                )}
                              >
                                {link.label}
                              </span>
                              {link.isFeatured && (
                                <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                                  Best
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-white/50 leading-snug">
                              {link.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Standard Nav Items */}
          {NAV_ITEMS.map((item) => {
            const isActive = isLinkActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white/85",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110 active:scale-[0.97] sm:flex"
          >
            <Zap className="h-4 w-4" />
            Open Calculator
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-white/70 transition-transform",
                  mobileOpen && "translate-y-2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-white/70 transition-opacity",
                  mobileOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-white/70 transition-transform",
                  mobileOpen && "-translate-y-2 -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.06] bg-[#0a0e1a]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-400">
                Calculators
              </p>
              {CALCULATOR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition",
                    pathname === link.href
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white/85",
                  )}
                >
                  <span className="text-xl">{link.icon}</span>
                  {link.label}
                  {link.isFeatured && (
                    <span className="ml-auto rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                      Best
                    </span>
                  )}
                </Link>
              ))}

              <p className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-400">
                Browse
              </p>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-3 text-sm font-bold transition",
                    isLinkActive(pathname, item.href)
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white/85",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-3">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 sm:hidden"
                >
                  <Zap className="h-4 w-4" />
                  Open Calculator
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
