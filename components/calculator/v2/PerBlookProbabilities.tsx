"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Crosshair, RotateCw } from "lucide-react";

import { formatPercent } from "@/lib/math";
import {
  RARITY_DESIGN,
  RARITY_ORDER,
  getBlookProbabilities,
  type BlookWithProbability,
} from "@/lib/blook-probabilities";
import type { Pack } from "@/lib/packs";
import type { Rarity } from "@/types";

import { MonoLabel, SubPanel, Tooltip } from "./parts";

type Props = {
  pack: Pack;
  tokens: number;
  dupesEnabled: boolean;
  onChaseBlook: (blookId: string) => void;
  className?: string;
};

/**
 * Default-expanded rarities. Rare blooks are the interesting ones — common
 * tiers get auto-collapsed to keep the section short.
 */
const DEFAULT_EXPANDED: Rarity[] = ["Chroma", "Legendary", "Epic"];

export default function PerBlookProbabilities({
  pack,
  tokens,
  dupesEnabled,
  onChaseBlook,
  className = "",
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(
    () => getBlookProbabilities(pack, tokens, dupesEnabled),
    [pack, tokens, dupesEnabled],
  );
  const pulls = tokens / pack.costPerPull;

  const [expanded, setExpanded] = useState<Record<Rarity, boolean>>({
    Common: false,
    Uncommon: false,
    Rare: false,
    Epic: true,
    Legendary: true,
    Chroma: true,
  });

  // Hide entirely empty rarity groups (e.g. Medieval has no Chroma)
  const visibleRarities = RARITY_ORDER.filter(
    (rarity) => grouped[rarity].length > 0,
  );

  const totalBlooks = visibleRarities.reduce(
    (sum, rarity) => sum + grouped[rarity].length,
    0,
  );

  return (
    <div ref={sectionRef} className="scroll-mt-4">
    <SubPanel className={`space-y-3 ${className}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <MonoLabel
            tooltip="Probability of pulling each specific blook in this pack with your current token budget."
          >
            Individual blook chances
          </MonoLabel>
          <p className="mt-1 text-xs text-slate-400">
            {totalBlooks} blooks · {Math.floor(pulls).toLocaleString()} pulls
            with {tokens.toLocaleString()} tkn
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const allOpen = visibleRarities.every((r) => expanded[r]);
            setExpanded(
              Object.fromEntries(
                visibleRarities.map((r) => [r, !allOpen]),
              ) as Record<Rarity, boolean>,
            );

            // Scroll the section into view after expanding
            if (!allOpen && sectionRef.current) {
              setTimeout(() => {
                sectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 50);
            }
          }}
          className="cyber-mono inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/15 hover:text-cyan-100"
        >
          {visibleRarities.every((r) => expanded[r]) ? "Collapse all" : "Expand all"}
        </button>
      </header>

      <div className="space-y-2">
        {visibleRarities.map((rarity) => (
          <RarityGroup
            key={rarity}
            rarity={rarity}
            blooks={grouped[rarity]}
            expanded={expanded[rarity]}
            onToggle={() =>
              setExpanded((prev) => ({ ...prev, [rarity]: !prev[rarity] }))
            }
            onChaseBlook={onChaseBlook}
          />
        ))}
      </div>
    </SubPanel>
    </div>
  );
}

/* ─── RarityGroup ─────────────────────────────────────────────────── */

function RarityGroup({
  rarity,
  blooks,
  expanded,
  onToggle,
  onChaseBlook,
}: {
  rarity: Rarity;
  blooks: BlookWithProbability[];
  expanded: boolean;
  onToggle: () => void;
  onChaseBlook: (blookId: string) => void;
}) {
  const design = RARITY_DESIGN[rarity];
  if (blooks.length === 0) return null;

  const min = blooks[blooks.length - 1].probability;
  const max = blooks[0].probability;

  return (
    <div className="cyber-glass-sub overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.02]"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
          <span className={`h-2 w-2 rounded-full ${design.dot}`} />
          <span className="cyber-mono text-xs font-semibold uppercase tracking-wider text-white">
            {design.label}
          </span>
          <span className="cyber-mono text-[11px] text-slate-400">
            {blooks.length}
          </span>
        </span>
        <span className="cyber-mono text-[11px] text-slate-400">
          {formatPercent(max)}
          {min !== max ? ` – ${formatPercent(min)}` : ""}
        </span>
      </button>

      {expanded ? (
        <ul className="grid grid-cols-1 gap-1.5 px-3 pb-3 md:grid-cols-2">
          {blooks.map((blook) => (
            <BlookRow
              key={blook.id}
              blook={blook}
              onChase={() => onChaseBlook(blook.id)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ─── BlookRow ────────────────────────────────────────────────────── */

function BlookRow({
  blook,
  onChase,
}: {
  blook: BlookWithProbability;
  onChase: () => void;
}) {
  const design = RARITY_DESIGN[blook.rarity];
  const isMissingArt = !blook.imageUrl || blook.imageUrl === "/icon.svg";

  return (
    <li
      className={`group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.015] p-2.5 transition ${design.hoverBorder}`}
    >
      {/* Art */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
        {!isMissingArt ? (
          <Image
            src={blook.imageUrl}
            alt={blook.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center text-[9px] font-bold uppercase ${design.text}`}
          >
            {blook.name.slice(0, 2)}
          </div>
        )}
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <Link
          href={`/blooks/${blook.id}`}
          className="block truncate text-sm font-medium text-white hover:text-cyan-200 hover:underline"
        >
          {blook.name}
        </Link>
        <div className="cyber-mono flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Drop {formatPercent(blook.dropRate)}</span>
          {blook.rotationSize > 1 ? (
            <Tooltip
              content={`This blook shares a rotation slot with ${blook.rotationSize - 1} other${blook.rotationSize > 2 ? "s" : ""}. Only one is active in the pool per day, so on a non-active day your chance is 0.`}
            >
              <span className="inline-flex items-center gap-0.5 rounded bg-orange-500/15 px-1 py-0.5 text-[10px] text-orange-300">
                <RotateCw className="h-2.5 w-2.5" />
                rotates
              </span>
            </Tooltip>
          ) : null}
        </div>
      </div>

      {/* Probability + chase */}
      <div className="flex flex-col items-end gap-0.5">
        <span className={`cyber-mono text-sm font-semibold ${design.text}`}>
          {formatPercent(blook.probability)}
        </span>
        <button
          type="button"
          onClick={onChase}
          className="cyber-mono inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-cyan-400 transition hover:text-cyan-200"
          aria-label={`Chase ${blook.name}`}
        >
          <Crosshair className="h-2.5 w-2.5" />
          Chase
        </button>
      </div>
    </li>
  );
}
