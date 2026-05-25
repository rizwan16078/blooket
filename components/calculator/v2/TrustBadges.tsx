"use client";

import { Activity, BadgeCheck, Database } from "lucide-react";

import { LAST_UPDATED } from "@/lib/constants";
import { PACKS } from "@/lib/packs";

/**
 * Tiny credibility strip directly under the headline. Addresses the iBlooket
 * "outdated / inaccurate" reputation gap users complain about.
 */
export default function TrustBadges() {
  const updatedDate = formatDate(LAST_UPDATED);

  const badges = [
    {
      icon: BadgeCheck,
      tone: "emerald",
      label: "Verified drop rates",
      value: `Updated ${updatedDate}`,
    },
    {
      icon: Activity,
      tone: "cyan",
      label: "Monte Carlo tested",
      value: "10,000 sims per query",
    },
    {
      icon: Database,
      tone: "violet",
      label: "All packs covered",
      value: `${PACKS.length} packs · live`,
    },
  ] as const;

  return (
    <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2">
      {badges.map((badge) => {
        const Icon = badge.icon;
        const tone =
          badge.tone === "emerald"
            ? "border-emerald-400/25 bg-emerald-400/[0.04] text-emerald-300"
            : badge.tone === "cyan"
              ? "border-cyan-400/25 bg-cyan-400/[0.04] text-cyan-300"
              : "border-violet-400/25 bg-violet-400/[0.04] text-violet-300";
        return (
          <span
            key={badge.label}
            className={`cyber-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wider ${tone}`}
          >
            <Icon className="h-3 w-3" />
            <span className="text-white/90">{badge.label}</span>
            <span className="text-slate-400">·</span>
            <span>{badge.value}</span>
          </span>
        );
      })}
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "this week";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "this week";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
