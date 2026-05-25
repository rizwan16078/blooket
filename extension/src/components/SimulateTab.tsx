import { useState, useMemo, useCallback } from "preact/hooks";
import type { OddsMetric, Rarity, Blook } from "@/types";
import { UNLOCKED_PACKS, PACK_MAP } from "@/lib/data";
import {
  DEFAULT_TOKENS,
  calculateOpenCount,
  calculateMetricProbability,
  formatPercent,
} from "@/lib/math";

/* ─── Rarity visual config ─── */

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "text-slate-400",
  Uncommon: "text-emerald-400",
  Rare: "text-sky-400",
  Epic: "text-violet-400",
  Legendary: "text-amber-400",
  Chroma: "text-teal-400",
};

const RARITY_BG: Record<Rarity, string> = {
  Common: "bg-slate-400/10",
  Uncommon: "bg-emerald-400/10",
  Rare: "bg-sky-400/10",
  Epic: "bg-violet-400/10",
  Legendary: "bg-amber-400/10",
  Chroma: "bg-teal-400/10",
};

const RARITY_BORDER: Record<Rarity, string> = {
  Common: "border-slate-400/20",
  Uncommon: "border-emerald-400/30",
  Rare: "border-sky-400/30",
  Epic: "border-violet-400/40",
  Legendary: "border-amber-400/50",
  Chroma: "border-teal-400/50",
};

const RARITY_DOT: Record<Rarity, string> = {
  Common: "bg-slate-400",
  Uncommon: "bg-emerald-400",
  Rare: "bg-sky-400",
  Epic: "bg-violet-400",
  Legendary: "bg-amber-400",
  Chroma: "bg-teal-400",
};

const PACK_ICONS: Record<string, string> = {
  space: "\u{1F680}",
  medieval: "\u{1F5FA}",
  aquatic: "\u{1F30A}",
  lunch: "\u{1F35C}",
  bug: "\u{1F41C}",
  pirate: "\u2693",
  breakfast: "\u{1F95E}",
  bot: "\u{1F916}",
  safari: "\u{1F981}",
  dino: "\u{1F9B4}",
  wonderland: "\u{1F300}",
  outback: "\u{1F419}",
  "ice-monster": "\u2744\uFE0F",
};

/* ─── Simulation logic ─── */

interface SimulatedBlook {
  id: string;
  name: string;
  rarity: Rarity;
  sellValue: number;
  isNew: boolean;
}

function weightedPick(blooks: Blook[]): Blook {
  // Normalize rates — pack drop rates may not sum to 1.0
  const total = blooks.reduce((s, b) => s + b.dropRate, 0);
  const roll = Math.random() * total;
  let cumulative = 0;
  for (const blook of blooks) {
    cumulative += blook.dropRate;
    if (roll <= cumulative) return blook;
  }
  return blooks[blooks.length - 1];
}

function simulatePackOpens(blooks: Blook[], pullCount: number, ownedIds: Set<string>): SimulatedBlook[] {
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
      isNew,
    });
  }
  return results;
}

/* ─── Component ─── */

export function SimulateTab() {
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [metric, setMetric] = useState<OddsMetric>("legendary");
  const [dupes, setDupes] = useState(false);

  // Simulation state
  const [results, setResults] = useState<SimulatedBlook[] | null>(null);
  const [simPackId, setSimPackId] = useState<string | null>(null);
  const [ownedBlooks, setOwnedBlooks] = useState<Set<string>>(new Set());
  const [remainingTokens, setRemainingTokens] = useState<number>(0);
  const [originalTokens, setOriginalTokens] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const simPack = simPackId ? PACK_MAP[simPackId] : null;

  const metricRarities = useMemo(() => {
    if (metric === "epicPlus") return new Set<Rarity>(["Epic", "Legendary", "Chroma"]);
    if (metric === "legendary") return new Set<Rarity>(["Legendary"]);
    return new Set<Rarity>(["Chroma"]);
  }, [metric]);

  const metricLabel = metric === "epicPlus" ? "Epic+" : metric.charAt(0).toUpperCase() + metric.slice(1);

  // Open a specific pack — this IS the simulate action
  const handleOpenPack = useCallback((packId: string) => {
    const pack = PACK_MAP[packId];
    if (!pack || tokens < pack.costPerPull) return;

    setResults(null);
    setIsSimulating(true);
    setSimPackId(packId);
    setOriginalTokens(tokens);

    const currentPullCount = Math.floor(calculateOpenCount(tokens, pack, dupes));
    const packBlooks = pack.featuredBlooks;
    const newOwned = new Set(ownedBlooks);

    setTimeout(() => {
      const simResults = simulatePackOpens(packBlooks, currentPullCount, newOwned);

      const cost = currentPullCount * pack.costPerPull;
      const dupeRefund = dupes
        ? simResults.filter((r) => !r.isNew).reduce((sum, r) => sum + r.sellValue, 0)
        : 0;
      const newRemaining = Math.max(0, dupes ? tokens - cost + dupeRefund : tokens - cost);

      setResults(simResults);
      setOwnedBlooks(newOwned);
      setRemainingTokens(newRemaining);
      setIsSimulating(false);
    }, 300);
  }, [tokens, dupes, ownedBlooks]);

  // Reopen same pack with remaining tokens
  const handleSellAndReopen = useCallback(() => {
    if (!simPackId) return;
    setTokens(remainingTokens);
    setResults(null);
    // Immediately re-simulate with remaining tokens
    setTimeout(() => handleOpenPack(simPackId), 50);
  }, [simPackId, remainingTokens, handleOpenPack]);

  // Simulate again with original token amount
  const handleSimulateAgain = useCallback(() => {
    if (!simPackId) return;
    setTokens(originalTokens);
    setResults(null);
    setTimeout(() => handleOpenPack(simPackId), 50);
  }, [simPackId, originalTokens, handleOpenPack]);

  // Back to pack picker
  const handleBack = useCallback(() => {
    setResults(null);
    setSimPackId(null);
  }, []);

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
    const probability = calculateMetricProbability(simPack, originalTokens, dupes, metric);

    return (
      <div class="space-y-3 animate-in">
        {/* Back button + pack header */}
        <div class="flex items-center gap-2">
          <button
            onClick={handleBack}
            class="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.04] hover:text-white/80 transition-colors"
            title="Back to pack picker"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <span class="text-base">{PACK_ICONS[simPackId ?? ""] ?? "\u{1F4E6}"}</span>
          <span class="text-sm font-bold text-white">{simPack.name} Pack</span>
          <span class="text-[10px] text-white/30 ml-auto">{results.length} opens</span>
        </div>

        {/* Token summary */}
        <div class="glass-panel-rim rounded-2xl p-3 relative overflow-hidden">
          <div class="pointer-events-none absolute -top-4 right-0 h-10 w-16 rounded-full bg-cyan-400/15 blur-2xl" />
          <div class="relative space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-widest text-white/40">Spent</span>
              <span class="text-xs font-bold text-red-400">-{resultStats.cost.toLocaleString()} tkn</span>
            </div>
            {dupes && resultStats.dupeRefund > 0 && (
              <div class="flex items-center justify-between">
                <span class="text-[10px] uppercase tracking-widest text-white/40">Dupe refund</span>
                <span class="text-xs font-bold text-emerald-300">+{resultStats.dupeRefund.toLocaleString()} tkn</span>
              </div>
            )}
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-widest text-white/40">Sell value (all)</span>
              <span class="text-xs font-bold text-white/50">+{resultStats.totalSellValue.toLocaleString()} tkn</span>
            </div>
            <div class="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
              <span class="text-[10px] uppercase tracking-widest text-white/40">Remaining</span>
              <span class="text-sm font-bold text-white">{remainingTokens.toLocaleString()} tkn</span>
            </div>
          </div>
        </div>

        {/* Hits / No hits */}
        {resultStats.hits.length > 0 ? (
          <div class="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-2 flex items-center gap-2">
            <span class="text-amber-400">{"\u2B50"}</span>
            <span class="text-[11px] text-amber-200 font-semibold">
              {resultStats.hits.length} {metricLabel} hit{resultStats.hits.length !== 1 ? "s" : ""}!
            </span>
            <span class="ml-auto text-[9px] text-white/30">{formatPercent(probability)} expected</span>
          </div>
        ) : (
          <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2">
            <p class="text-[11px] text-white/40 text-center">
              No {metricLabel} this time <span class="text-white/20">({formatPercent(probability)} chance)</span>
            </p>
            {probability < 0.5 && (
              <p class="text-[9px] text-white/20 text-center mt-0.5">Try more tokens or a different pack</p>
            )}
          </div>
        )}

        {/* Blook grid */}
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">Your pulls</p>
            <div class="flex gap-1">
              <span class="text-[9px] text-emerald-400">{resultStats.newBlooks.length} new</span>
              <span class="text-[9px] text-white/20">{"\u00B7"}</span>
              <span class="text-[9px] text-white/30">{resultStats.dupes.length} dupe</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-1">
            {results.map((item, i) => {
              const isHit = metricRarities.has(item.rarity);
              return (
                <div
                  key={`${item.id}-${i}`}
                  class={`relative flex flex-col items-center justify-center rounded-lg border-2 transition-all overflow-hidden ${
                    isHit
                      ? `${RARITY_BORDER[item.rarity]} ${RARITY_BG[item.rarity]} shadow-[0_0_8px_rgba(251,191,36,0.2)]`
                      : item.isNew
                        ? `border-white/10 ${RARITY_BG[item.rarity]}`
                        : "border-white/5 bg-white/[0.02] opacity-40"
                  }`}
                  style={{ width: "44px", height: "44px" }}
                  title={`${item.rarity}${item.isNew ? " - NEW" : " - dupe"}`}
                >
                  <span class={`h-1.5 w-1.5 rounded-full ${RARITY_DOT[item.rarity]}`} />
                  <span class={`text-[7px] font-semibold leading-tight text-center px-0.5 mt-0.5 truncate w-full ${
                    isHit ? RARITY_COLORS[item.rarity] : "text-white/50"
                  }`}>
                    {item.name.length > 8 ? item.name.slice(0, 7) + "\u2026" : item.name}
                  </span>
                  {isHit && (
                    <span class="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 text-[6px] font-black text-black shadow-sm">
                      {"\u2605"}
                    </span>
                  )}
                  {item.isNew && !isHit && (
                    <span class="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400 text-[5px] font-black text-black">
                      N
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rarity breakdown */}
        <div class="space-y-1">
          {(["Chroma", "Legendary", "Epic", "Rare", "Uncommon", "Common"] as Rarity[]).map((rarity) => {
            const count = results.filter((r) => r.rarity === rarity).length;
            if (count === 0) return null;
            const pct = (count / results.length) * 100;
            return (
              <div key={rarity} class="flex items-center gap-2 rounded-lg px-2 py-1 bg-white/[0.02]">
                <span class={`h-1.5 w-1.5 rounded-full shrink-0 ${RARITY_DOT[rarity]}`} />
                <span class={`text-[9px] font-semibold ${RARITY_COLORS[rarity]} w-16`}>{rarity}</span>
                <div class="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div class={`h-full rounded-full progress-bar ${RARITY_DOT[rarity]}`} style={{ width: `${pct}%` }} />
                </div>
                <span class="text-[9px] font-bold text-white/50 w-5 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div class="space-y-1.5">
          {canReopen && (
            <button
              onClick={handleSellAndReopen}
              class="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {dupes ? "Sell dupes & reopen" : "Reopen"} with {remainingTokens.toLocaleString()} tokens
            </button>
          )}
          <button
            onClick={handleSimulateAgain}
            class="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white/60 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-white transition-all"
          >
            {"\u{1F504}"} Simulate Again ({originalTokens.toLocaleString()} tokens)
          </button>
          <button
            onClick={handleReset}
            class="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[11px] text-white/30 hover:text-white/60 transition-all"
          >
            Reset Simulation
          </button>
        </div>
      </div>
    );
  }

  /* ─── PACK PICKER VIEW (default) ─── */
  return (
    <div class="space-y-3">
      {/* Token input */}
      <div>
        <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-1.5 block">
          Tokens
        </label>
        <div class="flex gap-2">
          <input
            type="number"
            value={tokens}
            onInput={(e) => setTokens(Math.max(0, Number((e.target as HTMLInputElement).value)))}
            class="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-lg font-bold text-white placeholder:text-white/20 focus:border-violet-400/40"
            min="0"
            max="100000"
            placeholder="0"
          />
          <div class="flex flex-col gap-1">
            {[100, 500, 5000].map((v) => (
              <button
                key={v}
                onClick={() => setTokens(v)}
                class={`rounded-lg border px-2 py-1 text-[10px] font-semibold transition-all ${
                  tokens === v
                    ? "border-violet-400/40 bg-violet-400/10 text-violet-300"
                    : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:text-white"
                }`}
              >
                {v >= 1000 ? `${v / 1000}K` : v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target rarity + dupes toggle — compact row */}
      <div class="flex gap-1.5">
        {(["epicPlus", "legendary", "chroma"] as OddsMetric[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            class={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold transition-all ${
              metric === m
                ? "bg-violet-400/10 text-violet-200 border border-violet-400/40"
                : "bg-white/[0.02] text-white/40 border border-white/[0.06] hover:text-white/70"
            }`}
          >
            {m === "epicPlus" ? "Epic+" : m === "legendary" ? "Leg" : "Chroma"}
          </button>
        ))}
        <button
          onClick={() => setDupes(!dupes)}
          class={`rounded-lg border px-2 py-1.5 text-[10px] font-semibold transition-all ${
            dupes
              ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-300"
              : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/70"
          }`}
        >
          {dupes ? "Resell ON" : "Resell"}
        </button>
      </div>

      {/* Pack grid — each card IS the open button */}
      <div>
        <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-1.5 block">
          Click a pack to open
        </label>
        <div class="grid grid-cols-3 gap-2">
          {UNLOCKED_PACKS.map((p) => {
            const canAfford = tokens >= p.costPerPull;
            const pullCount = canAfford ? Math.floor(calculateOpenCount(tokens, p, dupes)) : 0;
            const prob = canAfford ? calculateMetricProbability(p, tokens, dupes, metric) : 0;

            return (
              <button
                key={p.id}
                onClick={() => handleOpenPack(p.id)}
                disabled={!canAfford || isSimulating}
                class={`relative rounded-xl border p-2.5 text-left transition-all group ${
                  canAfford
                    ? "border-white/[0.08] bg-white/[0.02] hover:border-violet-400/30 hover:bg-violet-400/[0.04] active:scale-[0.97]"
                    : "border-white/[0.04] bg-white/[0.01] opacity-40 cursor-not-allowed"
                }`}
              >
                {/* Pack icon + name */}
                <div class="flex items-center gap-1.5 mb-1.5">
                  <span class="text-lg leading-none">{PACK_ICONS[p.id] ?? "\u{1F4E6}"}</span>
                  <span class="text-[10px] font-bold text-white/80 truncate">{p.name}</span>
                </div>

                {/* Cost */}
                <div class="text-[9px] text-white/30">
                  {p.costPerPull} tkn/pack
                </div>

                {/* Opens + probability */}
                {canAfford && (
                  <div class="mt-1.5 space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-[9px] text-white/40">{pullCount} opens</span>
                      <span class={`text-[10px] font-bold ${
                        prob >= 0.7 ? "text-emerald-400" : prob >= 0.3 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {formatPercent(prob)}
                      </span>
                    </div>
                    <div class="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        class={`h-full rounded-full transition-all duration-300 ${
                          prob >= 0.7 ? "bg-emerald-400" : prob >= 0.3 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${Math.min(100, prob * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Hover CTA */}
                {canAfford && (
                  <div class="mt-1.5 text-[9px] font-semibold text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to open {"\u2192"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {tokens <= 0 && (
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <p class="text-sm text-white/40">Enter tokens above, then click a pack to open it</p>
          <p class="text-[10px] text-white/20 mt-1">Each pack shows your {metricLabel} chance</p>
        </div>
      )}

      {/* Simulating overlay */}
      {isSimulating && (
        <div class="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-center animate-pulse">
          <p class="text-xs font-bold text-cyan-300">Opening packs\u2026</p>
        </div>
      )}
    </div>
  );
}
