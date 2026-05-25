import { useState, useMemo } from "preact/hooks";
import type { OddsMetric } from "@/types";
import { UNLOCKED_PACKS, PACK_MAP } from "@/lib/data";
import {
  calculateMetricProbabilityV2,
  calculateBlookProbability,
  calculateOpenCount,
  formatPercent,
  getRiskBand,
  DEFAULT_TOKENS,
} from "@/lib/math";

const RARITY_COLORS: Record<string, string> = {
  Common: "text-slate-400",
  Uncommon: "text-emerald-400",
  Rare: "text-sky-400",
  Epic: "text-violet-400",
  Legendary: "text-amber-400",
  Chroma: "text-teal-400",
};

const RARITY_BG: Record<string, string> = {
  Common: "bg-slate-400/10",
  Uncommon: "bg-emerald-400/10",
  Rare: "bg-sky-400/10",
  Epic: "bg-violet-400/10",
  Legendary: "bg-amber-400/10",
  Chroma: "bg-teal-400/10",
};

const RARITY_DOT: Record<string, string> = {
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

export function PackOddsCalc() {
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [packId, setPackId] = useState("space");
  const [metric, setMetric] = useState<OddsMetric>("legendary");
  const [dupes, setDupes] = useState(false);

  const pack = PACK_MAP[packId];
  const pulls = calculateOpenCount(tokens, pack, dupes);
  const probability = calculateMetricProbabilityV2(pack, tokens, dupes, metric);
  const risk = getRiskBand(probability);

  const targetBlooks = useMemo(() => {
    const rarities =
      metric === "epicPlus"
        ? new Set(["Epic", "Legendary", "Chroma"])
        : metric === "legendary"
          ? new Set(["Legendary"])
          : new Set(["Chroma"]);
    return pack.featuredBlooks
      .filter((b) => rarities.has(b.rarity))
      .sort((a, b) => b.dropRate - a.dropRate);
  }, [pack, metric]);

  const metricLabel = metric === "epicPlus" ? "Epic+" : metric.charAt(0).toUpperCase() + metric.slice(1);

  // Best value pack for current metric
  const bestPack = useMemo(() => {
    let best = UNLOCKED_PACKS[0];
    let bestScore = 0;
    for (const p of UNLOCKED_PACKS) {
      const prob = calculateMetricProbabilityV2(p, tokens, dupes, metric);
      const score = prob / p.costPerPull;
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
    return best;
  }, [tokens, dupes, metric]);

  const isBestPack = bestPack.id === packId;

  return (
    <div class="space-y-3">
      {/* Token input with preset buttons */}
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
            {[100, 500, 1000].map((v) => (
              <button
                key={v}
                onClick={() => setTokens(v)}
                class={`rounded-lg border px-2 py-1 text-[10px] font-semibold transition-all hover-lift ${
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

      {/* Pack selector — visual card grid */}
      <div>
        <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-1.5 block">
          Pack
        </label>
        <div class="grid grid-cols-4 gap-1.5">
          {UNLOCKED_PACKS.map((p) => {
            const isActive = packId === p.id;
            const isBest = bestPack.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPackId(p.id)}
                class={`relative rounded-xl border px-1.5 py-2 text-center transition-all hover-lift ${
                  isActive
                    ? "border-violet-400/40 bg-violet-400/10 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                }`}
              >
                {isBest && !isActive && (
                  <span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 shadow-sm" />
                )}
                <div class="text-base leading-none">{PACK_ICONS[p.id] ?? "\u{1F4E6}"}</div>
                <div class={`text-[9px] font-semibold leading-tight mt-1 truncate ${isActive ? "text-white" : "text-white/50"}`}>
                  {p.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Best value recommendation */}
      {!isBestPack && tokens > 0 && (
        <div class="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-2.5 flex items-center gap-2">
          <span class="text-emerald-400 text-xs">\u2605</span>
          <span class="text-[11px] text-white/60">
            Best value: <button onClick={() => setPackId(bestPack.id)} class="text-emerald-300 font-semibold hover:underline">{bestPack.name}</button> pack
          </span>
        </div>
      )}

      {/* Target rarity — pill buttons */}
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
                  ? "bg-violet-400/10 text-violet-200 border border-violet-400/40 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                  : "bg-white/[0.02] text-white/50 border border-white/[0.06] hover:text-white/80"
              }`}
            >
              {m === "epicPlus" ? "Epic+" : m === "legendary" ? "Legendary" : "Chroma"}
            </button>
          ))}
        </div>
      </div>

      {/* Resell toggle — compact switch */}
      <button
        onClick={() => setDupes(!dupes)}
        class={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-all ${
          dupes
            ? "border-emerald-400/25 bg-emerald-400/[0.05]"
            : "border-white/[0.06] bg-white/[0.02] hover:border-white/12"
        }`}
      >
        <span class="text-[11px] font-medium text-white/60">Sell duplicates</span>
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

      {/* Result — hero display with animated progress */}
      {tokens > 0 ? (
        <div class="glass-panel-rim rounded-2xl p-4 text-center relative overflow-hidden">
          {/* Glow effect behind result */}
          <div class={`pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 h-12 w-32 rounded-full blur-2xl ${
            risk.tone === "green" ? "bg-emerald-400/20" : risk.tone === "yellow" ? "bg-amber-400/15" : "bg-red-400/15"
          }`} />
          <div class="relative">
            <p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">
              Chance of {metricLabel}
            </p>
            <p class={`text-3xl font-black tracking-tight ${
              risk.tone === "green" ? "text-emerald-300" : risk.tone === "yellow" ? "text-amber-300" : "text-red-400"
            }`}>
              {formatPercent(probability)}
            </p>
            <p class="text-[10px] text-white/30 mt-1">
              across {Math.floor(pulls)} pack opens
            </p>
            {/* Animated progress bar */}
            <div class="mx-auto mt-3 h-1.5 max-w-[180px] overflow-hidden rounded-full bg-white/[0.06]">
              <div
                class={`h-full rounded-full progress-bar ${
                  risk.tone === "green" ? "bg-emerald-400" : risk.tone === "yellow" ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ width: `${Math.min(probability * 100, 100)}%` }}
              />
            </div>
            {/* Risk label */}
            <p class={`text-[9px] font-semibold uppercase tracking-wider mt-1.5 ${
              risk.tone === "green" ? "text-emerald-400/60" : risk.tone === "yellow" ? "text-amber-400/60" : "text-red-400/60"
            }`}>
              {risk.label}
            </p>
          </div>
        </div>
      ) : (
        <div class="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
          <p class="text-xs text-white/30">Enter tokens to see your odds</p>
        </div>
      )}

      {/* Individual blooks — compact list with progress bars */}
      {targetBlooks.length > 0 && tokens > 0 && (
        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-2">
            Per-blook chances
          </p>
          <div class="space-y-1">
            {targetBlooks.map((blook) => {
              const blookProb = calculateBlookProbability(tokens, pack, blook, dupes);
              return (
                <div
                  key={blook.id}
                  class={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${RARITY_BG[blook.rarity]}`}
                >
                  <span class={`h-1.5 w-1.5 rounded-full shrink-0 ${RARITY_DOT[blook.rarity]}`} />
                  <span class="text-[11px] font-medium text-white flex-1 truncate">{blook.name}</span>
                  <div class="flex items-center gap-2 shrink-0">
                    <div class="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        class={`h-full rounded-full progress-bar ${RARITY_DOT[blook.rarity]}`}
                        style={{ width: `${Math.min(blookProb * 100, 100)}%` }}
                      />
                    </div>
                    <span class={`text-[10px] font-bold w-12 text-right ${RARITY_COLORS[blook.rarity]}`}>
                      {formatPercent(blookProb)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
