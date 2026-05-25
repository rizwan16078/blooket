"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, BarChart3, ChevronDown, Minus, Plus, RotateCw, Sparkles, Trophy, Volume2, VolumeX } from "lucide-react";

import { formatPercent } from "@/lib/calculator-v2";
import {
  DEFAULT_PACK_SLUG,
  DEFAULT_TOKENS,
  calculateAtLeastOneSuccess,
  calculateOpenCount,
  calculateMetricProbability,
  getRarityRate,
} from "@/lib/math";
import {
  getBlooksForPack,
  getPackById,
  PACKS,
  type PackSlug,
} from "@/lib/packs";
import {
  METRIC_REQUIRED_RARITY,
  packHasRarity,
} from "@/lib/blook-probabilities";
import type { Blook, Rarity } from "@/types";

import { MonoLabel, SubPanel } from "./parts";

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

/* ─── Constants ─── */

type OddsMetric = "epicPlus" | "legendary" | "chroma";

const METRIC_LABEL: Record<OddsMetric, string> = {
  epicPlus: "Epic+",
  legendary: "Legendary",
  chroma: "Chroma",
};

const METRIC_OPTIONS: { key: OddsMetric; label: string }[] = [
  { key: "epicPlus", label: "Epic+" },
  { key: "legendary", label: "Legendary" },
  { key: "chroma", label: "Chroma" },
];

const SLIDER_MAX = 100;
const STAGGER_MAX_TIME = 3000; // cap total reveal animation at 3s

const RARITY_ORDER: Rarity[] = ["Chroma", "Legendary", "Epic", "Rare", "Uncommon", "Common"];

/* ─── Types ─── */

interface SimulatedBlook {
  id: string;
  name: string;
  rarity: Rarity;
  sellValue: number;
  imageUrl: string;
  isNew: boolean;
}

interface SessionStats {
  totalPacks: number;
  totalTokensSpent: number;
  totalHits: number;
  luckiestPull: SimulatedBlook | null;
  simulationCount: number;
}

/* ─── Sound helpers (no external files) ─── */

function playHitSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch { /* AudioContext not available */ }
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

  // Staggered reveal: how many blooks are visible
  const [revealedCount, setRevealedCount] = useState(0);
  const revealTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Session stats — persisted across simulations
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalPacks: 0,
    totalTokensSpent: 0,
    totalHits: 0,
    luckiestPull: null,
    simulationCount: 0,
  });

  const pack = getPackById(selectedPack);
  const metricRarities = getMetricRarities(metric);
  const metricLabel = METRIC_LABEL[metric];
  const simPack = simPackId ? getPackById(simPackId) : null;

  // Same impossibility guard as SimpleOddsView
  const metricAvailability = useMemo(
    () => ({
      epicPlus: packHasRarity(pack.id, METRIC_REQUIRED_RARITY.epicPlus),
      legendary: packHasRarity(pack.id, METRIC_REQUIRED_RARITY.legendary),
      chroma: packHasRarity(pack.id, METRIC_REQUIRED_RARITY.chroma),
    }),
    [pack.id],
  );
  useEffect(() => {
    if (!metricAvailability[metric]) {
      if (metricAvailability.legendary) setMetric("legendary");
      else if (metricAvailability.epicPlus) setMetric("epicPlus");
      else if (metricAvailability.chroma) setMetric("chroma");
    }
  }, [metric, metricAvailability]);

  // Staggered reveal effect — only starts when results first appear
  useEffect(() => {
    if (!results || results.length === 0 || revealedCount !== 0) return;

    const total = results.length;
    const delay = Math.max(10, Math.min(40, STAGGER_MAX_TIME / total));
    let idx = 0;

    const tick = () => {
      if (idx >= total) {
        revealTimerRef.current = null;
        return;
      }
      const item = results[idx];
      // Only play sound for target rarity hits — avoids spam
      if (soundEnabled && metricRarities.has(item.rarity)) {
        playHitSound();
      }
      idx++;
      setRevealedCount(idx);

      if (idx < total) {
        revealTimerRef.current = setTimeout(tick, delay) as unknown as ReturnType<typeof setInterval>;
      } else {
        revealTimerRef.current = null;
      }
    };

    // Start first reveal immediately
    revealTimerRef.current = setTimeout(tick, 0) as unknown as ReturnType<typeof setInterval>;
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current as unknown as ReturnType<typeof setTimeout>);
    };
  }, [results]); // eslint-disable-line react-hooks/exhaustive-deps

  // Open the selected pack
  const handleSimulate = useCallback(() => {
    if (!pack || tokens < pack.costPerPull) return;

    setResults(null);
    setRevealedCount(0);
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

      // Update session stats
      const hits = simResults.filter((r) => metricRarities.has(r.rarity));
      const luckiest = hits.length > 0
        ? hits.reduce((best, r) =>
            RARITY_ORDER.indexOf(r.rarity) < RARITY_ORDER.indexOf(best.rarity) ? r : best,
          )
        : null;

      setSessionStats((prev) => ({
        totalPacks: prev.totalPacks + simResults.length,
        totalTokensSpent: prev.totalTokensSpent + cost,
        totalHits: prev.totalHits + hits.length,
        luckiestPull:
          !prev.luckiestPull
            ? luckiest
            : luckiest && RARITY_ORDER.indexOf(luckiest.rarity) < RARITY_ORDER.indexOf(prev.luckiestPull.rarity)
              ? luckiest
              : prev.luckiestPull,
        simulationCount: prev.simulationCount + 1,
      }));
    }, 300);
  }, [selectedPack, pack, tokens, dupesEnabled, ownedBlooks, metricRarities]);

  // Sell dupes only & reopen
  const handleSellDupesAndReopen = useCallback(() => {
    setTokens(remainingTokens);
    setResults(null);
    setSimPackId(null);
    setRevealedCount(0);
  }, [remainingTokens]);

  // Sell ALL blooks & reopen — sells everything for maximum token recovery
  const handleSellAllAndReopen = useCallback(() => {
    if (!results) return;
    const allSellValue = results.reduce((sum, r) => sum + r.sellValue, 0);
    const cost = results.length * (simPack?.costPerPull ?? 0);
    const allInTokens = Math.max(0, originalTokens - cost + allSellValue);
    setTokens(allInTokens);
    setResults(null);
    setSimPackId(null);
    setRevealedCount(0);
  }, [results, simPack, originalTokens]);

  // Simulate again with original tokens
  const handleSimulateAgain = useCallback(() => {
    setTokens(originalTokens);
    setResults(null);
    setSimPackId(null);
    setRevealedCount(0);
  }, [originalTokens]);

  // Back to configuration
  const handleBack = useCallback(() => {
    if (remainingTokens > 0) setTokens(remainingTokens);
    setResults(null);
    setSimPackId(null);
    setRevealedCount(0);
  }, [remainingTokens]);

  // Full reset (including session)
  const handleReset = useCallback(() => {
    setResults(null);
    setSimPackId(null);
    setOwnedBlooks(new Set());
    setRemainingTokens(0);
    setOriginalTokens(0);
    setRevealedCount(0);
    setSessionStats({
      totalPacks: 0,
      totalTokensSpent: 0,
      totalHits: 0,
      luckiestPull: null,
      simulationCount: 0,
    });
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

  // Per-rarity expected vs actual
  const rarityComparison = useMemo(() => {
    if (!results || !simPack) return null;
    const pullCount = results.length;
    return RARITY_ORDER.map((rarity) => {
      const rate = getRarityRate(simPack.id, rarity);
      const expected = rate * pullCount;
      const actual = results.filter((r) => r.rarity === rarity).length;
      const chance = calculateAtLeastOneSuccess(rate, pullCount);
      return { rarity, rate, expected, actual, chance };
    }).filter((r) => r.rate > 0);
  }, [results, simPack]);

  const canReopen = simPack && remainingTokens >= simPack.costPerPull;
  const sellAllTokens = results && resultStats
    ? Math.max(0, originalTokens - resultStats.cost + resultStats.totalSellValue)
    : 0;
  const canSellAllReopen = simPack && sellAllTokens >= simPack.costPerPull;
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
        {/* Back button + pack header + sound toggle */}
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
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-lg p-1.5 text-slate-500 hover:text-white transition-colors"
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
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

        {/* Per-blook results — name + rarity, staggered reveal */}
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
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((item, i) => {
              const isHit = metricRarities.has(item.rarity);
              const isRevealed = i < revealedCount;
              return (
                <div
                  key={`${item.id}-${i}`}
                  className={`flex items-center gap-2 rounded-lg border px-2 py-2 sm:py-1.5 transition-all duration-200 ${
                    !isRevealed
                      ? "border-white/5 bg-white/[0.01] opacity-0 scale-95"
                      : isHit
                        ? `${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]} shadow-[0_0_12px_rgba(251,191,36,0.2)] opacity-100 scale-100`
                        : item.isNew
                          ? `border-white/10 ${RARITY_BG[item.rarity]} opacity-100 scale-100`
                          : "border-white/5 bg-white/[0.02] opacity-50 scale-100"
                  }`}
                >
                  <div className="relative h-8 w-8 sm:h-7 sm:w-7 shrink-0 overflow-hidden rounded">
                    {item.imageUrl && isRevealed && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="28px"
                        className={`object-cover ${isHit ? "brightness-110 saturate-150" : "brightness-[0.7]"}`}
                      />
                    )}
                    {!isRevealed && (
                      <div className="h-full w-full bg-white/5 animate-pulse rounded" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-[11px] font-semibold truncate ${isHit ? RARITY_COLORS[item.rarity] : "text-white/60"}`}>
                      {isRevealed ? item.name : "???"}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${RARITY_DOT[item.rarity]}`} />
                      <span className={`text-[10px] sm:text-[9px] ${RARITY_COLORS[item.rarity]}`}>
                        {isRevealed ? item.rarity : ""}
                      </span>
                      {item.isNew && isRevealed && (
                        <span className="text-[9px] sm:text-[8px] font-bold text-emerald-400">NEW</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rarity breakdown — expected vs actual */}
        {rarityComparison && (
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rarity breakdown</p>
              <p className="text-[10px] text-slate-600">expected → actual</p>
            </div>
            {rarityComparison.map(({ rarity, expected, actual, chance }) => {
              const maxVal = Math.max(expected, actual, 1);
              const pct = (actual / maxVal) * 100;
              const expectedPct = (expected / maxVal) * 100;
              return (
                <div
                  key={rarity}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 bg-white/[0.02]"
                >
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${RARITY_DOT[rarity]}`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-semibold w-14 sm:w-20 ${RARITY_COLORS[rarity]}`}
                  >
                    {rarity}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden relative">
                    <div
                      className="absolute h-full rounded-full bg-white/10"
                      style={{ width: `${expectedPct}%` }}
                    />
                    <div
                      className={`h-full rounded-full ${RARITY_DOT[rarity]} relative z-10`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 w-14 sm:w-16 text-right tabular-nums">
                    {expected.toFixed(1)}→{actual}
                  </span>
                  <span className={`text-[10px] font-semibold w-10 sm:w-12 text-right ${chance >= 0.5 ? "text-emerald-400" : "text-slate-500"}`}>
                    {formatPercent(chance)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Session stats */}
        {sessionStats.simulationCount > 0 && (
          <div className="rounded-xl border border-violet-400/20 bg-violet-400/[0.04] p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                Session stats
              </span>
              <span className="ml-auto text-[10px] text-slate-600">
                {sessionStats.simulationCount} sim{sessionStats.simulationCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-base sm:text-lg font-bold text-white">{sessionStats.totalPacks.toLocaleString()}</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500">Packs opened</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-red-400">{sessionStats.totalTokensSpent.toLocaleString()}</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500">Tokens spent</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-amber-400">{sessionStats.totalHits}</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500">{metricLabel} hits</p>
              </div>
            </div>
            {sessionStats.luckiestPull && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/[0.02] px-2 py-1">
                <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-400">Luckiest:</span>
                <span className={`text-xs font-bold ${RARITY_COLORS[sessionStats.luckiestPull.rarity]}`}>
                  {sessionStats.luckiestPull.name}
                </span>
                <span className={`text-[10px] ${RARITY_COLORS[sessionStats.luckiestPull.rarity]}`}>
                  ({sessionStats.luckiestPull.rarity})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={!canReopen}
            onClick={handleSellDupesAndReopen}
            className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
              canReopen
                ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98]"
                : "border border-white/10 bg-white/[0.02] text-slate-600 cursor-not-allowed"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="truncate">Sell dupes & reopen ({remainingTokens.toLocaleString()} tkn)</span>
          </button>
          <button
            type="button"
            disabled={!canSellAllReopen}
            onClick={handleSellAllAndReopen}
            className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
              canSellAllReopen
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98]"
                : "border border-white/10 bg-white/[0.02] text-slate-600 cursor-not-allowed"
            }`}
          >
            <RotateCw className="h-4 w-4 shrink-0" />
            <span className="truncate">Sell all & reopen ({sellAllTokens.toLocaleString()} tkn)</span>
          </button>
          <button
            type="button"
            onClick={handleSimulateAgain}
            className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-white"
          >
            <RotateCw className="h-4 w-4 shrink-0" /> <span className="truncate">Simulate Again ({originalTokens.toLocaleString()} tkn)</span>
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" /> Back to pack picker
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

  /* ─── CONFIGURATION VIEW (default) — same layout as SimpleOddsView ─── */
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      {/* ── LEFT: inputs ── */}
      <SubPanel className="space-y-6">
        {/* Row 1 — Pack chip + Target rarity */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">
          {/* Pack chip — image + dropdown */}
          <div>
            <MonoLabel tooltip="Pick which pack you want to open. Each pack has different drop rates.">
              Pack
            </MonoLabel>
            <div className="relative mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition focus-within:border-cyan-400/40">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                <Image
                  src={pack.imageUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="flex-1 truncate text-base font-semibold text-white">
                {pack.name} Pack
                <span className="ml-2 cyber-mono text-sm font-normal text-slate-400">
                  ({pack.costPerPull} tkn)
                </span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
              <select
                value={selectedPack}
                onChange={(event) =>
                  setSelectedPack(event.target.value as PackSlug)
                }
                aria-label="Select pack"
                className="absolute inset-0 cursor-pointer opacity-0"
              >
                {PACKS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#06080f]">
                    {p.name} Pack ({p.costPerPull} tkn)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target rarity */}
          <div>
            <MonoLabel tooltip="Which rarity tier do you want to pull? Higher rarity = lower chance.">
              Target rarity
            </MonoLabel>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
              {METRIC_OPTIONS.map((option) => {
                const isAvailable = metricAvailability[option.key];
                const isActive = metric === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setMetric(option.key)}
                    disabled={!isAvailable}
                    title={
                      !isAvailable
                        ? `${pack.name} has no ${option.label} blooks`
                        : undefined
                    }
                    className={`cyber-mono rounded-lg px-2 py-3 text-sm uppercase tracking-wider transition ${
                      !isAvailable
                        ? "cursor-not-allowed text-slate-600 line-through"
                        : isActive
                          ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]"
                          : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2 — Tokens */}
        <div>
          <MonoLabel tooltip="How many tokens you have to spend on this pack. Use + / - to adjust one at a time, or type directly.">
            How many tokens?
          </MonoLabel>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTokens(Math.max(0, tokens - 1))}
              aria-label="Decrease tokens by 1"
              className="cyber-ghost inline-flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center"
            >
              <Minus className="h-5 w-5" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={tokens}
              onChange={(event) =>
                setTokens(Math.max(0, Number(event.target.value) || 0))
              }
              className="cyber-mono w-full rounded-xl border border-white/10 bg-white/[0.02] px-2 sm:px-3 py-3 sm:py-3.5 text-center text-2xl sm:text-3xl font-semibold text-white outline-none focus:border-cyan-400/50"
              aria-label="Tokens"
            />
            <button
              type="button"
              onClick={() => setTokens(tokens + 1)}
              aria-label="Increase tokens by 1"
              className="cyber-ghost inline-flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={SLIDER_MAX}
            step={1}
            value={Math.min(tokens, SLIDER_MAX)}
            onChange={(event) => setTokens(Number(event.target.value))}
            className="cyber-range mt-4"
            aria-label="Tokens slider"
          />
          <div className="cyber-mono mt-2 flex justify-between text-xs uppercase tracking-wider text-slate-400">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100+</span>
          </div>
        </div>

        {/* Row 3 — Resell toggle */}
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
      </SubPanel>

      {/* ── RIGHT: simulate CTA + probability preview ── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-4">
        {tokens <= 0 ? (
          <div className="cyber-glass-sub text-center px-4 py-10">
            <p className="cyber-display text-2xl text-slate-300 sm:text-3xl">
              Enter tokens to simulate
            </p>
            <p className="cyber-mono mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Type a number on the left or drag the slider
            </p>
          </div>
        ) : !canSimulate ? (
          <div className="cyber-glass-sub text-center px-4 py-10">
            <p className="cyber-display text-2xl text-orange-300 sm:text-3xl">
              Need at least {pack.costPerPull} tokens
            </p>
            <p className="cyber-mono mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
              {pack.name} Pack costs {pack.costPerPull} tkn per pull
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Probability preview */}
            <div className="text-center">
              <p className="cyber-display cyber-glow-cyan text-5xl sm:text-7xl md:text-8xl text-cyan-300" style={{ lineHeight: 1 }}>
                {formatPercent(probability)}
              </p>
              <p className="cyber-mono mt-3 text-xs uppercase tracking-[0.22em] text-slate-300">
                Chance for {metricLabel} in {pullCount} opens
              </p>
              <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                    probability >= 0.7
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                      : probability >= 0.3
                        ? "bg-gradient-to-r from-amber-400 to-orange-400"
                        : "bg-gradient-to-r from-red-400 to-orange-400"
                  }`}
                  style={{ width: `${probability * 100}%` }}
                />
              </div>
            </div>

            {/* Simulate CTA */}
            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulate}
              className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
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
      </div>
    </div>
  );
}
