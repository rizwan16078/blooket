"use client";

import { useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { ArrowLeft, RotateCw, Sparkles, Minus, Plus } from "lucide-react";

import { formatPercent } from "@/lib/calculator-v2";
import {
  DEFAULT_PACK_SLUG,
  DEFAULT_TOKENS,
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

type OddsMetric = "epicPlus" | "legendary" | "chroma";

const TOKEN_PRESETS = [0, 25, 50, 75, 100] as const;

/* ─── Types ─── */

interface SimulatedBlook {
  id: string;
  name: string;
  rarity: Rarity;
  sellValue: number;
  imageUrl: string;
  isNew: boolean;
}

/* ─── Helpers ─── */

function getMetricRarities(metric: OddsMetric): Set<Rarity> {
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

export default function SimulateTab() {
  // Self-contained state — independent from Odds tab
  const [selectedPack, setSelectedPack] = useState<PackSlug>(DEFAULT_PACK_SLUG);
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [metric, setMetric] = useState<OddsMetric>("legendary");
  const [dupesEnabled, setDupesEnabled] = useState(false);

  // Simulation state
  const [results, setResults] = useState<SimulatedBlook[] | null>(null);
  const [simPackId, setSimPackId] = useState<PackSlug | null>(null);
  const [ownedBlooks, setOwnedBlooks] = useState<Set<string>>(new Set());
  const [remainingTokens, setRemainingTokens] = useState(0);
  const [originalTokens, setOriginalTokens] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const pack = getPackById(selectedPack);
  const metricRarities = getMetricRarities(metric);
  const metricLabel = metric === "epicPlus" ? "Epic+" : metric;
  const simPack = simPackId ? getPackById(simPackId) : null;
  const unlockedPacks = PACKS.filter(
    (p) => !("isLocked" in p) || !(p as { isLocked?: boolean }).isLocked,
  );

  // Open the selected pack — this IS the simulate action
  const handleSimulate = useCallback(() => {
    if (!pack || tokens < pack.costPerPull) return;

    setResults(null);
    setIsSimulating(true);
    setSimPackId(selectedPack);
    setOriginalTokens(tokens);

    const blooks = getBlooksForPack(selectedPack) ?? [];
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
  }, [selectedPack, pack, tokens, dupesEnabled, ownedBlooks]);

  // Reopen with remaining tokens
  const handleSellAndReopen = useCallback(() => {
    setTokens(remainingTokens);
    setResults(null);
    setSimPackId(null);
  }, [remainingTokens]);

  // Simulate again with original tokens
  const handleSimulateAgain = useCallback(() => {
    setTokens(originalTokens);
    setResults(null);
    setSimPackId(null);
  }, [originalTokens]);

  // Back to configuration
  const handleBack = useCallback(() => {
    if (remainingTokens > 0) setTokens(remainingTokens);
    setResults(null);
    setSimPackId(null);
  }, [remainingTokens]);

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
  const canSimulate = tokens >= pack.costPerPull;
  const pullCount = canSimulate
    ? Math.floor(calculateOpenCount(tokens, pack, dupesEnabled))
    : 0;
  const probability = canSimulate
    ? calculateMetricProbability(pack, tokens, dupesEnabled, metric)
    : 0;

  /* ─── RESULTS VIEW ─── */
  if (results && resultStats && simPack) {
    const resultProbability = calculateMetricProbability(
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
              {formatPercent(resultProbability)} expected
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <p className="text-sm text-slate-400 text-center">
              No {metricLabel} this time{" "}
              <span className="text-slate-600">
                ({formatPercent(resultProbability)} chance)
              </span>
            </p>
            {resultProbability < 0.5 && (
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
                  {isHit && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black shadow-md">
                      ★
                    </span>
                  )}
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

  /* ─── CONFIGURATION VIEW (default) ─── */
  return (
    <div className="space-y-5">
      {/* ─── Pack selector ─── */}
      <div>
        <label className="block text-sm font-semibold text-white mb-1">
          Pack
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Pick which pack you want to open. Each pack has different drop rates.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {unlockedPacks.map((p) => {
            const isSelected = selectedPack === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPack(p.id as PackSlug)}
                className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_12px_rgba(34,211,238,0.12)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate ${
                      isSelected ? "text-cyan-200" : "text-white/70"
                    }`}
                  >
                    {p.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {p.costPerPull} tkn
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Target rarity ─── */}
      <div>
        <label className="block text-sm font-semibold text-white mb-1">
          Target rarity
        </label>
        <p className="text-xs text-slate-500 mb-2">
          Which rarity tier do you want to pull? Higher rarity = lower chance.
        </p>
        <div className="flex gap-2">
          {(["epicPlus", "legendary", "chroma"] as OddsMetric[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                metric === m
                  ? "bg-violet-400/15 text-violet-200 border border-violet-400/40 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                  : "bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-white/70 hover:border-white/15"
              }`}
            >
              {m === "epicPlus" ? "Epic+" : m === "legendary" ? "Legendary" : "Chroma"}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Token input ─── */}
      <div>
        <label className="block text-sm font-semibold text-white mb-1">
          How many tokens?
        </label>
        <p className="text-xs text-slate-500 mb-2">
          How many tokens you have to spend on this pack. Use + / - to adjust
          one at a time, or type directly.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTokens(Math.max(0, tokens - pack.costPerPull))}
            className="shrink-0 rounded-lg border border-white/10 bg-white/[0.02] p-2 text-slate-400 hover:text-white hover:border-white/20 transition"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={tokens}
            onChange={(e) =>
              setTokens(Math.max(0, Number(e.target.value)))
            }
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-center text-2xl font-bold text-white placeholder:text-white/20 focus:border-violet-400/40 focus:outline-none transition"
            min="0"
            max="100000"
            placeholder="0"
          />
          <button
            type="button"
            onClick={() => setTokens(tokens + pack.costPerPull)}
            className="shrink-0 rounded-lg border border-white/10 bg-white/[0.02] p-2 text-slate-400 hover:text-white hover:border-white/20 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {/* Token presets */}
        <div className="flex gap-1.5 mt-2">
          {TOKEN_PRESETS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTokens(v === 100 ? 1000 : v)}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
                tokens === (v === 100 ? 1000 : v)
                  ? "border-violet-400/40 bg-violet-400/10 text-violet-300"
                  : "border-white/[0.06] bg-white/[0.02] text-slate-500 hover:text-white"
              }`}
            >
              {v === 100 ? "1K" : v}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Resell toggle ─── */}
      <button
        type="button"
        onClick={() => setDupesEnabled(!dupesEnabled)}
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

      {/* ─── Simulate button + probability preview ─── */}
      {canSimulate && (
        <div className="space-y-3">
          {/* Probability preview */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">
                {pullCount} opens · {metricLabel} chance
              </span>
              <span
                className={`text-sm font-bold ${
                  probability >= 0.7
                    ? "text-emerald-400"
                    : probability >= 0.3
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              >
                {formatPercent(probability)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  probability >= 0.7
                    ? "bg-emerald-400"
                    : probability >= 0.3
                      ? "bg-amber-400"
                      : "bg-red-400"
                }`}
                style={{ width: `${Math.min(100, probability * 100)}%` }}
              />
            </div>
          </div>

          {/* Simulate CTA */}
          <button
            type="button"
            disabled={isSimulating}
            onClick={handleSimulate}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              isSimulating
                ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 animate-pulse"
                : "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98]"
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" /> Opening packs…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Open {pullCount} {pack.name} Packs
              </>
            )}
          </button>
        </div>
      )}

      {!canSimulate && tokens > 0 && (
        <p className="text-center text-xs text-slate-500">
          Need at least {pack.costPerPull} tokens to open one {pack.name} pack
        </p>
      )}
    </div>
  );
}
