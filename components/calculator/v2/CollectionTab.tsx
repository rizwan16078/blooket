"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

import { PACK_BLOOKS_MAP } from "@/lib/constants";
import { PACKS, type Pack } from "@/lib/packs";
import { RARITY_ORDER, getTokensForGuarantee } from "@/lib/blook-probabilities";
import type { Blook, Rarity } from "@/types";
import { MonoLabel, SubPanel } from "./parts";

const STORAGE_KEY = "blooket-collection-v1";

const RARITY_COLOR: Record<Rarity, string> = {
  Chroma: "#c084fc",
  Legendary: "#fbbf24",
  Epic: "#a855f7",
  Rare: "#60a5fa",
  Uncommon: "#4ade80",
  Common: "#94a3b8",
};

type PackRow = {
  pack: Pack;
  blooks: Blook[];
  ownedCount: number;
  missingBlooks: Blook[];
  pct: number;
  missingTokenCost: number;
};

type Props = {
  dupesEnabled?: boolean;
};

export default function CollectionTab({ dupesEnabled = false }: Props) {
  const [rawOwned, setRawOwned] = useLocalStorage<string[]>(STORAGE_KEY, [], {
    initializeWithValue: false,
  });
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  const ownedSet = useMemo(() => new Set(rawOwned ?? []), [rawOwned]);

  const packRows = useMemo((): PackRow[] => {
    return PACKS.map((pack) => {
      const allBlooks: Blook[] = PACK_BLOOKS_MAP[pack.id] ?? [];
      // Deduplicate rotation groups — only count the first blook per group
      const seenGroups = new Set<string>();
      const blooks = allBlooks.filter((b) => {
        if (!b.rotationGroup) return true;
        if (seenGroups.has(b.rotationGroup)) return false;
        seenGroups.add(b.rotationGroup);
        return true;
      });
      const sorted = [...blooks].sort((a, b) => {
        const ra = RARITY_ORDER.indexOf(a.rarity);
        const rb = RARITY_ORDER.indexOf(b.rarity);
        if (ra !== rb) return ra - rb;
        return a.name.localeCompare(b.name);
      });
      const missingBlooks = sorted.filter((b) => !ownedSet.has(b.id));
      const ownedCount = sorted.length - missingBlooks.length;
      const pct = sorted.length > 0 ? (ownedCount / sorted.length) * 100 : 0;
      const missingTokenCost = missingBlooks.reduce((sum, blook) => {
        const { tokens } = getTokensForGuarantee(blook, pack, 0.5, 500, dupesEnabled);
        return sum + (Number.isFinite(tokens) ? tokens : 0);
      }, 0);
      return { pack, blooks: sorted, ownedCount, missingBlooks, pct, missingTokenCost };
    });
  }, [ownedSet]);

  const totalBlooks = packRows.reduce((s, r) => s + r.blooks.length, 0);
  const totalOwned = packRows.reduce((s, r) => s + r.ownedCount, 0);
  const totalMissingCost = packRows.reduce((s, r) => s + r.missingTokenCost, 0);
  const globalPct = totalBlooks > 0 ? (totalOwned / totalBlooks) * 100 : 0;

  const toggleBlook = (id: string) => {
    setRawOwned((prev) => {
      const set = new Set(prev ?? []);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return Array.from(set);
    });
  };

  const markAllInPack = (blooks: Blook[]) => {
    setRawOwned((prev) => {
      const set = new Set(prev ?? []);
      blooks.forEach((b) => set.add(b.id));
      return Array.from(set);
    });
  };

  const clearAllInPack = (blooks: Blook[]) => {
    setRawOwned((prev) => {
      const set = new Set(prev ?? []);
      blooks.forEach((b) => set.delete(b.id));
      return Array.from(set);
    });
  };

  const visible = showIncompleteOnly
    ? packRows.filter((r) => r.pct < 100)
    : packRows;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <SubPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <MonoLabel>Collection progress</MonoLabel>
            <div className="flex items-baseline gap-2">
              <span className="cyber-mono text-3xl font-bold text-white">
                {totalOwned.toLocaleString()}
              </span>
              <span className="cyber-mono text-sm text-slate-400">
                / {totalBlooks.toLocaleString()} blooks
              </span>
              <span className="cyber-mono text-sm font-semibold text-violet-300 ml-1">
                {globalPct.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 w-64 max-w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{ width: `${globalPct}%` }}
              />
            </div>
            {totalOwned < totalBlooks && (
              <p className="cyber-mono text-[11px] text-slate-500">
                ~{totalMissingCost.toLocaleString()} tkn estimated to complete at 50% confidence
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowIncompleteOnly((v) => !v)}
              className={`cyber-mono inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] uppercase tracking-wider transition ${
                showIncompleteOnly
                  ? "border-violet-400/40 bg-violet-400/10 text-violet-200"
                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              Incomplete only
            </button>
            <button
              type="button"
              onClick={() => setRawOwned([])}
              className="cyber-mono inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] uppercase tracking-wider text-slate-400 transition hover:border-red-500/30 hover:text-red-300"
            >
              Reset all
            </button>
          </div>
        </div>
      </SubPanel>

      {/* Pack list */}
      <div className="space-y-2">
        {visible.map((row) => (
          <PackCard
            key={row.pack.id}
            row={row}
            ownedSet={ownedSet}
            onToggle={toggleBlook}
            onMarkAll={() => markAllInPack(row.blooks)}
            onClearAll={() => clearAllInPack(row.blooks)}
          />
        ))}
      </div>

      {visible.length === 0 && showIncompleteOnly && (
        <SubPanel>
          <p className="text-center text-sm text-emerald-400">
            All packs complete! Every blook accounted for.
          </p>
        </SubPanel>
      )}

      <p className="cyber-mono text-center text-[10px] text-slate-600">
        Stored locally in your browser · Never leaves your device
      </p>
    </div>
  );
}

function PackCard({
  row,
  ownedSet,
  onToggle,
  onMarkAll,
  onClearAll,
}: {
  row: PackRow;
  ownedSet: Set<string>;
  onToggle: (id: string) => void;
  onMarkAll: () => void;
  onClearAll: () => void;
}) {
  const { pack, blooks, ownedCount, missingBlooks, pct, missingTokenCost } = row;
  const isComplete = pct >= 100;
  const isStarted = ownedCount > 0;
  const [open, setOpen] = useState(isStarted && !isComplete);

  return (
    <div className="cyber-glass-sub overflow-hidden rounded-xl">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.02]"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        )}

        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{
            background: pack.themeColor,
            boxShadow: `0 0 5px ${pack.themeColor}80`,
          }}
        />

        <span className="min-w-0 flex-1">
          <span className="cyber-mono block text-xs font-semibold uppercase tracking-wider text-white">
            {pack.name} Pack
          </span>
          <span className="mt-1 flex items-center gap-2">
            <span
              className="relative h-1 overflow-hidden rounded-full bg-white/[0.05]"
              style={{ width: 100 }}
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: isComplete ? "#10b981" : pack.themeColor,
                }}
              />
            </span>
            <span className="cyber-mono text-[10px] text-slate-500">
              {ownedCount}/{blooks.length}
            </span>
          </span>
        </span>

        <span
          className={`cyber-mono shrink-0 text-xs font-semibold ${
            isComplete
              ? "text-emerald-400"
              : isStarted
                ? "text-violet-300"
                : "text-slate-500"
          }`}
        >
          {isComplete ? "✓ 100%" : `${pct.toFixed(0)}%`}
        </span>
      </button>

      {/* Expanded blook grid */}
      {open ? (
        <div className="border-t border-white/[0.04] px-4 pb-4 pt-3">
          {/* Quick controls */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onMarkAll}
              className="cyber-mono text-[10px] uppercase tracking-wider text-slate-400 transition hover:text-emerald-300"
            >
              Mark all
            </button>
            <span className="text-slate-700">·</span>
            <button
              type="button"
              onClick={onClearAll}
              className="cyber-mono text-[10px] uppercase tracking-wider text-slate-400 transition hover:text-red-300"
            >
              Clear
            </button>
            {missingBlooks.length > 0 && (
              <>
                <span className="text-slate-700">·</span>
                <span className="cyber-mono text-[10px] text-slate-500">
                  {missingBlooks.length} missing
                  {missingTokenCost > 0
                    ? ` · ~${missingTokenCost.toLocaleString()} tkn at 50%`
                    : ""}
                </span>
              </>
            )}
          </div>

          {/* Blooks */}
          <div className="flex flex-wrap gap-1.5">
            {blooks.map((blook) => (
              <BlookToggle
                key={blook.id}
                blook={blook}
                owned={ownedSet.has(blook.id)}
                onToggle={() => onToggle(blook.id)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BlookToggle({
  blook,
  owned,
  onToggle,
}: {
  blook: Blook;
  owned: boolean;
  onToggle: () => void;
}) {
  const isMissingArt = !blook.imageUrl || blook.imageUrl === "/icon.svg";
  const rarityColor = RARITY_COLOR[blook.rarity];

  return (
    <button
      type="button"
      onClick={onToggle}
      title={`${blook.name} — ${blook.rarity}${owned ? " (owned)" : " (missing)"}`}
      className={`group relative flex w-[66px] flex-col items-center gap-1 rounded-xl border p-1.5 transition-all duration-150 ${
        owned
          ? "border-violet-500/40 bg-violet-500/[0.08] shadow-[0_0_8px_rgba(139,92,246,0.12)]"
          : "border-white/[0.04] bg-white/[0.01] opacity-35 hover:opacity-60 hover:border-white/[0.08]"
      }`}
    >
      {/* Rarity dot */}
      <span
        className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
        style={{ background: rarityColor }}
      />

      {/* Owned check */}
      {owned ? (
        <span className="absolute right-1 top-1">
          <Check className="h-3 w-3 text-violet-400" />
        </span>
      ) : null}

      {/* Art */}
      <div className="relative mt-1 h-9 w-9 overflow-hidden rounded-lg">
        {!isMissingArt ? (
          <Image
            src={blook.imageUrl}
            alt={blook.name}
            fill
            sizes="36px"
            className="object-contain"
            unoptimized
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[9px] font-bold"
            style={{ color: rarityColor }}
          >
            {blook.name.slice(0, 2)}
          </div>
        )}
      </div>

      {/* Name */}
      <span className="w-full truncate text-center text-[8.5px] leading-tight text-slate-400 group-hover:text-white">
        {blook.name}
      </span>
    </button>
  );
}
