"use client";

import { useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { ArrowLeft, RotateCw, Sparkles } from "lucide-react";

import { formatPercent } from "@/lib/calculator-v2";
import {
  calculateOpenCount,
  calculateMetricProbability,
} from "@/lib/math";
import {
  getBlooksForPack,
  getPackById,
  PACKS,
  type PackSlug,
} from "@/lib/packs";
import type { Blook, Rarity } from "@/types";

/* ─── Rarity visual config ─── */

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "text-slate-400",
  Uncommon: "text-emerald-400",
  Rare: "text-sky-400",
  Epic: "text-red-400",
  Legendary: "text-amber-400",
  Chroma: "text-purple-400",
};

const RARITY_BG: Record<Rarity, string> = {
  Common: "bg-slate-400/10",
  Uncommon: "bg-emerald-400/10",
  Rare: "bg-sky-400/10",
  Epic: "bg-red-400/10",
  Legendary: "bg-amber-400/10",
  Chroma: "bg-purple-400/10",
};

const RARITY_BORDER: Record<Rarity, string> = {
  Common: "border-slate-400/20",
  Uncommon: "border-emerald-400/30",
  Rare: "border-sky-400/30",
  Epic: "border-red-400/40",
  Legendary: "border-amber-400/50",
  Chroma: "border-purple-400/50",
};

const RARITY_DOT: Record<Rarity, string> = {
  Common: "bg-slate-400",
  Uncommon: "bg-emerald-400",
  Rare: "bg-sky-400",
  Epic: "bg-red-400",
  Legendary: "bg-amber-400",
  Chroma: "bg-purple-400",
};

/* ─── Types ─── */

type Props = {
  packSlug: PackSlug;
  tokens: number;
  dupesEnabled: boolean;
  onDupesChange: (value: boolean) => void;
  onPackChange?: (slug: PackSlug) => void;
  onTokensChange?: (tokens: number) => void;
  metric: "epicPlus" | "legendary" | "chroma";
};

interface SimulatedBlook {
  id: string;
  name: string;
  rarity: Rarity;
  sellValue: number;
  imageUrl: string;
  isNew: boolean;
}

/* ─── Helpers ─── */

function getMetricRarities(metric: Props["metric"]): Set<Rarity> {
  if (metric === "epicPlus") return new Set(["Epic", "Legendary", "Chroma"]);
  if (metric === "legendary") return new Set(["Legendary"]);
  return new Set(["Chroma"]);
}

function weightedPick(blooks: Blook[]): Blook {
  const total = blooks.reduce((s, b) => s + b.dropRate, 0);
  const roll = Math.random() * total;
  let cumulative = 0;
  for (const blook of blooks) {
    cumulative += blook.dropRate;
    if (roll <= cumulative) return blook;
  }
  return blooks[blooks.length - 1];
}

function simulatePackOpens(
  blooks: Blook[],
  pullCount: number,
  ownedIds: Set<string>,
): SimulatedBlook[] {
  const results: SimulatedBlook[] = [];
  for (let i = 0; i < pullCount; i++) {
    const blook = weightedPick(blooks);
    const isNew = !ownedIds.has(blook.id);
    if (isNew) ownedIds.add(blook.id);
    results.push({
      id: blook.id,
      name: blook.name,
      rarity: blook.rarity,
      sellValue: blook.sellValue,
      imageUrl: blook.imageUrl,
      isNew,
    });
  }
  return results;
}

/* ─── Component ─── */

export default function SimulateTab({
  packSlug,
  tokens,
  dupesEnabled,
  onDupesChange,
  onPackChange,
  onTokensChange,
  metric,
}: Props) {
  const metricRarities = getMetricRarities(metric);
  const metricLabel = metric === "epicPlus" ? "Epic+" : metric;

  // Simulation state
  const [results, setResults] = useState<SimulatedBlook[] | null>(null);
  const [simPackId, setSimPackId] = useState<PackSlug | null>(null);
  const [ownedBlooks, setOwnedBlooks] = useState<Set<string>>(new Set());
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [originalTokens, setOriginalTokens] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const simPack = simPackId ? getPackById(simPackId) : null;
  const unlockedPacks = PACKS.filter((p) => !("isLocked" in p) || !p.isLocked);

  // Open a specific pack — this IS the simulate action
  const handleOpenPack = useCallback(
    (packId: PackSlug) => {
      const pack = getPackById(packId);
      if (!pack || tokens < pack.costPerPull) return;

      setResults(null);
      setIsSimulating(true);
      setSimPackId(packId);
      setOriginalTokens(tokens);

      const blooks = getBlooksForPack(packId) ?? [];
      const currentPullCount = Math.floor(
        calculateOpenCount(tokens, pack, dupesEnabled),
      );
      const newOwned = new Set(ownedBlooks);

      setTimeout(() => {
        const simResults = simulatePackOpens(blooks, currentPullCount, newOwned);

        const cost = currentPullCount * pack.costPerPull;
        const dupeRefund = dupesEnabled
          ? simResults
              .filter((r) => !r.isNew)
              .reduce((sum, r) => sum + r.sellValue, 0)
          : 0;
        const newRemaining = Math.max(
          0,
          dupesEnabled ? tokens - cost + dupeRefund : tokens - cost,
        );

        setResults(simResults);
        setOwnedBlooks(newOwned);
        setRemainingTokens(newRemaining);
        setIsSimulating(false);
      }, 300);
    },
    [tokens, dupesEnabled, ownedBlooks],
  );

  // Reopen with remaining tokens — go back to picker
  const handleSellAndReopen = useCallback(() => {
    onTokensChange?.(remainingTokens);
    setResults(null);
    setSimPackId(null);
  }, [remainingTokens, onTokensChange]);

  // Simulate again with original tokens — go back to picker
  const handleSimulateAgain = useCallback(() => {
    onTokensChange?.(originalTokens);
    setResults(null);
    setSimPackId(null);
  }, [originalTokens, onTokensChange]);

  // Back to pack picker — apply remaining tokens
  const handleBack = useCallback(() => {
    if (remainingTokens > 0) onTokensChange?.(remainingTokens);
    setResults(null);
    setSimPackId(null);
  }, [remainingTokens, onTokensChange]);

  // Full reset
  const handleReset = useCallback(() => {
    setResults(null);
    setSimPackId(null);
    setOwnedBlooks(new Set());
    setRemainingTokens(0);
    setOriginalTokens(0);
  }, []);

  // Stats from results
  const resultStats = useMemo(() => {
    if (!results || !simPack) return null;
    const hits = results.filter((r) => metricRarities.has(r.rarity));
    const dupeItems = results.filter((r) => !r.isNew);
    const dupeRefund = dupeItems.reduce((sum, r) => sum + r.sellValue, 0);
    const newBlooks = results.filter((r) => r.isNew);
    const totalSellValue = results.reduce((sum, r) => sum + r.sellValue, 0);
    const cost = results.length * simPack.costPerPull;
    return { hits, dupes: dupeItems, dupeRefund, newBlooks, totalSellValue, cost };
  }, [results, metricRarities, simPack]);

  const canReopen = simPack && remainingTokens >= simPack.costPerPull;

  /* ─── RESULTS VIEW ─── */
  if (results && resultStats && simPack) {
    const probability = calculateMetricProbability(
      simPack,
      originalTokens,
      dupesEnabled,
      metric,
    );

    return (
      <div className="space-y-4 animate-in">
        {/* Back button + pack header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.04] hover:text-white transition-colors"
            title="Back to pack picker"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="relative h-8 w-8 overflow-hidden rounded-lg">
            <Image
              src={simPack.imageUrl}
              alt={simPack.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span className="text-lg font-bold text-white">
            {simPack.name} Pack
          </span>
          <span className="ml-auto text-sm text-slate-500">
            {results.length} opens
          </span>
        </div>

        {/* Token summary */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Spent
            </span>
            <span className="text-sm font-bold text-red-400">
              -{resultStats.cost.toLocaleString()} tkn
            </span>
          </div>
          {dupesEnabled && resultStats.dupeRefund > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-slate-500">
                Dupe refund
              </span>
              <span className="text-sm font-bold text-emerald-300">
                +{resultStats.dupeRefund.toLocaleString()} tkn
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Sell value (all)
            </span>
            <span className="text-sm font-bold text-slate-400">
              +{resultStats.totalSellValue.toLocaleString()} tkn
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs uppercase tracking-widest text-slate-500">
              Remaining
            </span>
            <span className="text-lg font-bold text-white">
              {remainingTokens.toLocaleString()} tkn
            </span>
          </div>
        </div>

        {/* Hits / No hits */}
        {resultStats.hits.length > 0 ? (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-200 font-semibold">
              {resultStats.hits.length} {metricLabel} hit
              {resultStats.hits.length !== 1 ? "s" : ""}!
            </span>
            <span className="ml-auto text-xs text-slate-500">
              {formatPercent(probability)} expected
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <p className="text-sm text-slate-400 text-center">
              No {metricLabel} this time{" "}
              <span className="text-slate-600">
                ({formatPercent(probability)} chance)
              </span>
            </p>
            {probability < 0.5 && (
              <p className="text-xs text-slate-600 text-center mt-1">
                Try more tokens or a different pack
              </p>
            )}
          </div>
        )}

        {/* Blook grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Your pulls</p>
            <div className="flex gap-2 text-xs">
              <span className="text-emerald-400">
                {resultStats.newBlooks.length} new
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">
                {resultStats.dupes.length} dupe
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {results.map((item, i) => {
              const isHit = metricRarities.has(item.rarity);
              return (
                <div
                  key={`${item.id}-${i}`}
                  className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-all ${
                    isHit
                      ? `${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]} shadow-[0_0_12px_rgba(251,191,36,0.3)] scale-105 z-10`
                      : item.isNew
                        ? `border-white/10 ${RARITY_BG[item.rarity]}`
                        : "border-white/5 bg-white/[0.02] opacity-40"
                  }`}
                  title={`${item.name} (${item.rarity})${item.isNew ? " - NEW" : " - dupe"}`}
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className={`object-cover ${isHit ? "brightness-110 saturate-150" : "brightness-[0.6]"}`}
                    />
                  )}
                  {/* Hit badge */}
                  {isHit && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black shadow-md">
                      ★
                    </span>
                  )}
                  {/* New badge */}
                  {item.isNew && !isHit && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400 text-[6px] font-black text-black">
                      N
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rarity breakdown */}
        <div className="space-y-1">
          {(
            ["Chroma", "Legendary", "Epic", "Rare", "Uncommon", "Common"] as Rarity[]
          ).map((rarity) => {
            const count = results.filter((r) => r.rarity === rarity).length;
            if (count === 0) return null;
            const pct = (count / results.length) * 100;
            return (
              <div
                key={rarity}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 bg-white/[0.02]"
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${RARITY_DOT[rarity]}`}
                />
                <span
                  className={`text-xs font-semibold w-20 ${RARITY_COLORS[rarity]}`}
                >
                  {rarity}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${RARITY_DOT[rarity]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500 w-6 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          {canReopen && (
            <button
              type="button"
              onClick={handleSellAndReopen}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-4 w-4" />
              {dupesEnabled ? "Sell dupes & reopen" : "Reopen"} (
              {remainingTokens.toLocaleString()} tkn left)
            </button>
          )}
          <button
            type="button"
            onClick={handleSimulateAgain}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-white"
          >
            <RotateCw className="h-4 w-4" /> Simulate Again (
            {originalTokens.toLocaleString()} tokens)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 text-xs text-slate-600 hover:text-slate-400 transition"
          >
            Reset Simulation
          </button>
        </div>
      </div>
    );
  }

  /* ─── PACK PICKER VIEW (default) ─── */
  return (
    <div className="space-y-4">
      {/* Empty state */}
      {tokens <= 0 && (
        <div className="text-center space-y-2 py-4">
          <p className="text-xl font-bold text-white">
            Open packs & see what you get
          </p>
          <p className="text-sm text-slate-400">
            Set your tokens above, then click a pack to open it
          </p>
        </div>
      )}

      {/* Resell toggle */}
      <button
        type="button"
        onClick={() => onDupesChange(!dupesEnabled)}
        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition ${
          dupesEnabled
            ? "border-emerald-400/30 bg-emerald-400/[0.06]"
            : "border-white/10 bg-white/[0.02] hover:border-white/15"
        }`}
        title={
          dupesEnabled
            ? "Selling dupes for tokens = more opens"
            : "Each pack costs full price"
        }
      >
        <span
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
            dupesEnabled ? "bg-emerald-500" : "bg-white/10"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition ${
              dupesEnabled ? "translate-x-[18px]" : "translate-x-[3px]"
            }`}
          />
        </span>
        <span className="text-xs font-medium text-slate-300">Resell dupes</span>
      </button>

      {/* Pack grid — each card IS the open button */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 mb-3">
          Click a pack to open
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {unlockedPacks.map((p) => {
            const canAfford = tokens >= p.costPerPull;
            const pullCount = canAfford
              ? Math.floor(calculateOpenCount(tokens, p, dupesEnabled))
              : 0;
            const prob = canAfford
              ? calculateMetricProbability(p, tokens, dupesEnabled, metric)
              : 0;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleOpenPack(p.id as PackSlug)}
                disabled={!canAfford || isSimulating}
                className={`relative rounded-xl border p-3 text-left transition-all group ${
                  canAfford
                    ? "border-white/10 bg-white/[0.02] hover:border-violet-400/30 hover:bg-violet-400/[0.04] active:scale-[0.97]"
                    : "border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed"
                }`}
              >
                {/* Pack image + name */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-white/80 truncate">
                    {p.name}
                  </span>
                </div>

                {/* Cost */}
                <p className="text-xs text-slate-500">
                  {p.costPerPull} tkn/pack
                </p>

                {/* Opens + probability */}
                {canAfford && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {pullCount} opens
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          prob >= 0.7
                            ? "text-emerald-400"
                            : prob >= 0.3
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {formatPercent(prob)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          prob >= 0.7
                            ? "bg-emerald-400"
                            : prob >= 0.3
                              ? "bg-amber-400"
                              : "bg-red-400"
                        }`}
                        style={{
                          width: `${Math.min(100, prob * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Hover CTA */}
                {canAfford && (
                  <p className="mt-2 text-xs font-semibold text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to open →
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulating overlay */}
      {isSimulating && (
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-center animate-pulse">
          <p className="text-sm font-bold text-cyan-300">Opening packs…</p>
        </div>
      )}
    </div>
  );
}
