import { useState, useMemo, useCallback, useRef } from "preact/hooks";
import type { OddsMetric, Rarity, Blook, Pack } from "@/types";
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
  const [packId, setPackId] = useState("space");
  const [metric, setMetric] = useState<OddsMetric>("legendary");
  const [dupes, setDupes] = useState(false);

  // Simulation state
  const [results, setResults] = useState<SimulatedBlook[] | null>(null);
  const [ownedBlooks, setOwnedBlooks] = useState<Set<string>>(new Set());
  const [remainingTokens, setRemainingTokens] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [originalTokens, setOriginalTokens] = useState<number>(0);

  // Ref to track the tokens used for the current simulation
  const simTokensRef = useRef(0);

  const pack = PACK_MAP[packId];
  const packBlooks = pack?.featuredBlooks ?? [];

  const metricRarities = useMemo(() => {
    if (metric === "epicPlus") return new Set<Rarity>(["Epic", "Legendary", "Chroma"]);
    if (metric === "legendary") return new Set<Rarity>(["Legendary"]);
    return new Set<Rarity>(["Chroma"]);
  }, [metric]);

  const metricLabel = metric === "epicPlus" ? "Epic+" : metric.charAt(0).toUpperCase() + metric.slice(1);

  const canSimulate = tokens >= (pack?.costPerPull ?? 999);

  // Use compounding pull count when dupes enabled (matches main site's calculateOpenCount)
  const pullCount = pack
    ? Math.floor(calculateOpenCount(tokens, pack, dupes))
    : 0;

  // Probability context from math module
  const probability = pack
    ? calculateMetricProbability(pack, tokens, dupes, metric)
    : 0;

  const handleSimulate = useCallback(() => {
    if (!canSimulate || !pack) return;

    // Clear previous results immediately
    setResults(null);
    setIsSimulating(true);
    simTokensRef.current = tokens;
    setOriginalTokens(tokens);

    const currentPullCount = Math.floor(calculateOpenCount(tokens, pack, dupes));
    const newOwned = new Set(ownedBlooks);

    // Simulate with a tiny delay for animation feel
    setTimeout(() => {
      const simResults = simulatePackOpens(packBlooks, currentPullCount, newOwned);

      // Calculate token flow
      const cost = currentPullCount * pack.costPerPull;
      const totalSellValue = simResults.reduce((sum, r) => sum + r.sellValue, 0);
      const dupeRefund = simResults.filter((r) => !r.isNew).reduce((sum, r) => sum + r.sellValue, 0);

      // Remaining = what's left after spending, plus dupe refund if enabled
      const newRemaining = dupes
        ? tokens - cost + dupeRefund
        : tokens - cost;

      setResults(simResults);
      setOwnedBlooks(newOwned);
      setRemainingTokens(Math.max(0, newRemaining));
      setIsSimulating(false);
    }, 300);
  }, [canSimulate, pack, packBlooks, tokens, dupes, ownedBlooks]);

  const handleSellAndReopen = useCallback(() => {
    // Use remaining tokens (which already includes dupe refund) as new input
    setTokens(remainingTokens);
    setResults(null);
  }, [remainingTokens]);

  const handleSimulateAgain = useCallback(() => {
    // Re-run with original token amount
    setTokens(originalTokens);
    setResults(null);
  }, [originalTokens]);

  const handleReset = useCallback(() => {
    setResults(null);
    setOwnedBlooks(new Set());
    setRemainingTokens(0);
    setOriginalTokens(0);
  }, []);

  // Stats from results
  const resultStats = useMemo(() => {
    if (!results) return null;
    const hits = results.filter((r) => metricRarities.has(r.rarity));
    const dupeItems = results.filter((r) => !r.isNew);
    const dupeRefund = dupeItems.reduce((sum, r) => sum + r.sellValue, 0);
    const newBlooks = results.filter((r) => r.isNew);
    const totalSellValue = results.reduce((sum, r) => sum + r.sellValue, 0);
    const cost = results.length * (pack?.costPerPull ?? 0);
    return { hits, dupes: dupeItems, dupeRefund, newBlooks, totalSellValue, cost };
  }, [results, metricRarities, pack]);

  const canReopen = remainingTokens >= (pack?.costPerPull ?? 999);

  /* ─── Render ─── */
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

      {/* Pack selector */}
      <div>
        <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-1.5 block">
          Pack
        </label>
        <div class="grid grid-cols-4 gap-1.5">
          {UNLOCKED_PACKS.map((p) => {
            const isActive = packId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPackId(p.id)}
                class={`relative rounded-xl border px-1.5 py-2 text-center transition-all ${
                  isActive
                    ? "border-violet-400/40 bg-violet-400/10 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                }`}
              >
                <div class="text-base leading-none">{PACK_ICONS[p.id] ?? "\u{1F4E6}"}</div>
                <div class={`text-[9px] font-semibold leading-tight mt-1 truncate ${isActive ? "text-white" : "text-white/50"}`}>
                  {p.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target rarity */}
      <div>
        <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-1.5 block">
          Target
        </label>
        <div class="flex gap-1.5">
          {(["epicPlus", "legendary", "chroma"] as OddsMetric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              class={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                metric === m
                  ? "bg-violet-400/10 text-violet-200 border border-violet-400/40"
                  : "bg-white/[0.02] text-white/50 border border-white/[0.06] hover:text-white/80"
              }`}
            >
              {m === "epicPlus" ? "Epic+" : m === "legendary" ? "Legendary" : "Chroma"}
            </button>
          ))}
        </div>
      </div>

      {/* Sell duplicates toggle */}
      <button
        onClick={() => setDupes(!dupes)}
        class={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-all ${
          dupes
            ? "border-emerald-400/25 bg-emerald-400/[0.05]"
            : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
        }`}
      >
        <span class="text-[11px] font-medium text-white/60">Sell duplicates for tokens</span>
        <span
          class={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
            dupes ? "bg-emerald-500" : "bg-white/10"
          }`}
        >
          <span
            class={`inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
              dupes ? "translate-x-[14px]" : "translate-x-[2px]"
            }`}
          />
        </span>
      </button>

      {/* Probability context — shown before simulating */}
      {!results && tokens > 0 && pack && (
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
          <p class="text-[10px] text-white/30 uppercase tracking-wider">
            {metricLabel} chance with {tokens.toLocaleString()} tokens
          </p>
          <p class="text-base font-bold text-white mt-0.5">{formatPercent(probability)}</p>
          <p class="text-[9px] text-white/20 mt-0.5">
            {pullCount} pack opens{dupes ? " (with resell)" : ""}
          </p>
        </div>
      )}

      {/* Simulate button */}
      {!results && (
        <button
          onClick={handleSimulate}
          disabled={!canSimulate || isSimulating}
          class={`w-full rounded-xl py-3 text-sm font-bold uppercase tracking-wider transition-all ${
            !canSimulate
              ? "border border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed"
              : isSimulating
                ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 animate-pulse"
                : "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98]"
          }`}
        >
          {isSimulating
            ? "Simulating\u2026"
            : canSimulate
              ? `Open ${pullCount} ${pack.name} Pack${pullCount !== 1 ? "s" : ""}`
              : "Open Packs"}
        </button>
      )}

      {!canSimulate && tokens > 0 && !results && (
        <p class="text-center text-[11px] text-white/30">
          Need at least {pack?.costPerPull ?? 20} tokens to open one pack
        </p>
      )}

      {/* ─── Results ─── */}
      {results && resultStats && pack && (
        <div class="space-y-3 animate-in">
          {/* Token summary */}
          <div class="glass-panel-rim rounded-2xl p-3.5 relative overflow-hidden">
            <div class="pointer-events-none absolute -top-4 right-0 h-12 w-20 rounded-full bg-cyan-400/15 blur-2xl" />
            <div class="relative">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] uppercase tracking-widest text-white/40">Spent</span>
                <span class="text-xs font-bold text-red-400">-{resultStats.cost.toLocaleString()} tkn</span>
              </div>
              {dupes && resultStats.dupeRefund > 0 && (
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[10px] uppercase tracking-widest text-white/40">Dupe refund</span>
                  <span class="text-xs font-bold text-emerald-300">+{resultStats.dupeRefund.toLocaleString()} tkn</span>
                </div>
              )}
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] uppercase tracking-widest text-white/40">Sell value (all)</span>
                <span class="text-xs font-bold text-white/60">+{resultStats.totalSellValue.toLocaleString()} tkn</span>
              </div>
              <div class="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <span class="text-[10px] uppercase tracking-widest text-white/40">Remaining</span>
                <span class="text-sm font-bold text-white">{remainingTokens.toLocaleString()} tkn</span>
              </div>
            </div>
          </div>

          {/* Hits / No hits banner */}
          {resultStats.hits.length > 0 ? (
            <div class="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-2.5 flex items-center gap-2">
              <span class="text-amber-400">{"\u2B50"}</span>
              <span class="text-[11px] text-amber-200 font-semibold">
                {resultStats.hits.length} {metricLabel} hit{resultStats.hits.length !== 1 ? "s" : ""}!
              </span>
              <span class="ml-auto text-[9px] text-white/30">
                {formatPercent(probability)} expected
              </span>
            </div>
          ) : (
            <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
              <p class="text-[11px] text-white/40 text-center">
                No {metricLabel} this time{" "}
                <span class="text-white/20">({formatPercent(probability)} chance)</span>
              </p>
              {probability < 0.5 && (
                <p class="text-[9px] text-white/20 text-center mt-1">
                  Try more tokens or a different pack
                </p>
              )}
            </div>
          )}

          {/* Blook grid — with names */}
          <div>
            <div class="flex items-center justify-between mb-2">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                Your pulls ({results.length})
              </p>
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
                <div key={rarity} class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 bg-white/[0.02]">
                  <span class={`h-2 w-2 rounded-full shrink-0 ${RARITY_DOT[rarity]}`} />
                  <span class={`text-[10px] font-semibold ${RARITY_COLORS[rarity]} w-20`}>{rarity}</span>
                  <div class="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      class={`h-full rounded-full progress-bar ${RARITY_DOT[rarity]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span class="text-[10px] font-bold text-white/60 w-6 text-right">{count}</span>
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
      )}
    </div>
  );
}
