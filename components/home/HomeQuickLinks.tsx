import Link from "next/link";
import { ArrowUpRight, Link2, Sparkles } from "lucide-react";

const quickLinks = [
  { href: "/blooks", label: "All Blook Library" },
  { href: "/packs", label: "Pack Data Center" },
  { href: "/how-it-works", label: "How The Odds Work" },
  { href: "/about", label: "About The Engine" },
];

const packShortcuts = [
  { href: "/packs#space", label: "Space Pack" },
  { href: "/packs#pirate", label: "Pirate Pack" },
  { href: "/packs#safari", label: "Safari Pack" },
];

export default function HomeQuickLinks() {
  return (
    <aside className="w-full lg:sticky lg:top-28">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-white shadow-2xl backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-violet-400">
              Interactive Rail
            </p>
            <h2 className="mt-2 font-sans text-2xl font-black tracking-wide text-white">
              Quick Links
            </h2>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
            <Sparkles className="size-4" />
          </span>
        </div>

        <div className="mt-5 grid gap-1">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/50 transition hover:bg-white/[0.04] hover:text-white/80"
            >
              <Link2 className="size-4 shrink-0 text-violet-400/60" />
              <span className="text-base font-bold">{link.label}</span>
              <ArrowUpRight className="ml-auto size-4 text-white/20 opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/35">
            Pack Shortcuts
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {packShortcuts.map((pack) => (
              <Link
                key={pack.href}
                href={pack.href}
                className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-violet-500/15 transition-all hover:brightness-110 active:scale-95"
              >
                {pack.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
