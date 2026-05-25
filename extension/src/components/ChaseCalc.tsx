import { useState, useMemo } from "preact/hooks";
import { BLOOKS, PACK_MAP } from "@/lib/data";
import {
  calculateEstimatedTokensForBlook,
  formatTokenLabel,
  DAILY_CAP,
} from "@/lib/math";
import type { Blook, Rarity } from "@/types";

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
  Uncommon: "border-emerald-400/20",
  Rare: "border-sky-400/20",
  Epic: "border-violet-400/20",
  Legendary: "border-amber-400/30",
  Chroma: "border-teal-400/30",
};

const RARITY_GLOW: Record<Rarity, string> = {
  Common: "",
  Uncommon: "",
  Rare: "",
  Epic: "shadow-[0_0_12px_rgba(139,92,246,0.1)]",
  Legendary: "shadow-[0_0_12px_rgba(251,191,36,0.15)]",
  Chroma: "shadow-[0_0_12px_rgba(94,234,212,0.15)]",
};

export function ChaseCalc() {
  const [search, setSearch] = useState("");
  const [selectedBlookId, setSelectedBlookId] = useState<string | null>(null);

  const filteredBlooks = useMemo(() => {
    if (!search) return BLOOKS.filter((b) => b.rarity === "Chroma" || b.rarity === "Legendary").slice(0, 20);
    const q = search.toLowerCase();
    return BLOOKS.filter(
      (b) => b.name.toLowerCase().includes(q) && (b.rarity === "Chroma" || b.rarity === "Legendary" || b.rarity === "Epic"),
    ).slice(0, 20);
  }, [search]);

  const selectedBlook = selectedBlookId ? BLOOKS.find((b) => b.id === selectedBlookId) ?? null : null;
  const pack = selectedBlook ? PACK_MAP[selectedBlook.packId] : null;

  const chaseStats = useMemo(() => {
    if (!selectedBlook || !pack) return null;
    const est = calculateEstimatedTokensForBlook(selectedBlook, pack);
    const p50 = Math.ceil(Math.log(0.5) / Math.log(1 - selectedBlook.dropRate)) * pack.costPerPull;
    const p90 = Math.ceil(Math.log(0.1) / Math.log(1 - selectedBlook.dropRate)) * pack.costPerPull;
    const p99 = Math.ceil(Math.log(0.01) / Math.log(1 - selectedBlook.dropRate)) * pack.costPerPull;
    return { est, p50, p90, p99 };
  }, [selectedBlook, pack]);

  if (selectedBlook && pack && chaseStats) {
    const maxTokens = chaseStats.p99;
    return (
      <div class="space-y-3">
        <button
          onClick={() => setSelectedBlookId(null)}
          class="text-[11px] text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
        >
          <span>\u2190</span> Back to picker
        </button>

        {/* Blook hero card */}
        <div class={`glass-panel-rim rounded-2xl p-4 text-center relative overflow-hidden ${RARITY_GLOW[selectedBlook.rarity]}`}>
          <div class={`pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 h-12 w-32 rounded-full blur-2xl ${
            selectedBlook.rarity === "Chroma" ? "bg-teal-400/20" : selectedBlook.rarity === "Legendary" ? "bg-amber-400/20" : "bg-violet-400/15"
          }`} />
          <div class="relative">
            <span class={`rarity-badge ${RARITY_BG[selectedBlook.rarity]} ${RARITY_COLORS[selectedBlook.rarity]}`}>
              {selectedBlook.rarity}
            </span>
            <p class="text-lg font-bold text-white mt-2">{selectedBlook.name}</p>
            <p class="text-[11px] text-white/40 mt-1">
              {pack.name} Pack &middot; {(selectedBlook.dropRate * 100).toFixed(2)}% drop
            </p>
            <p class="text-[10px] text-white/30 mt-0.5">Sells for {selectedBlook.sellValue} tokens</p>
          </div>
        </div>

        {/* Probability tiers with progress bars */}
        <div class="space-y-2">
          <ChaseRow label="50% chance" tokens={chaseStats.p50} maxTokens={maxTokens} color="emerald" />
          <ChaseRow label="90% chance" tokens={chaseStats.p90} maxTokens={maxTokens} color="amber" />
          <ChaseRow label="99% chance" tokens={chaseStats.p99} maxTokens={maxTokens} color="red" />
        </div>

        {/* Daily cap warning */}
        <div class="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-2.5">
          <div class="flex items-start gap-2">
            <span class="text-amber-400 text-xs">\u26A0</span>
            <div>
              <div class="text-[11px] font-semibold text-amber-300">Daily Cap: {DAILY_CAP} tokens</div>
              <div class="text-[10px] text-white/50 mt-0.5">
                <span class="text-amber-300 font-bold">{Math.ceil(chaseStats.p90 / DAILY_CAP)} day{Math.ceil(chaseStats.p90 / DAILY_CAP) !== 1 ? "s" : ""}</span> at cap for 90%
              </div>
            </div>
          </div>
        </div>

        {/* Expected cost */}
        <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
          <p class="text-[10px] text-white/30 uppercase tracking-wider">Expected cost for one</p>
          <p class="text-sm font-bold text-white mt-1">{isFinite(chaseStats.est) ? formatTokenLabel(chaseStats.est) : "N/A"}</p>
        </div>
      </div>
    );
  }

  return (
    <div class="space-y-3">
      <div>
        <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400 mb-1.5 block">
          Search blooks
        </label>
        <input
          type="text"
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          placeholder="Type a blook name..."
          class="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-400/40"
        />
      </div>

      <div class="space-y-1.5">
        {filteredBlooks.map((blook) => (
          <button
            key={blook.id}
            onClick={() => setSelectedBlookId(blook.id)}
            class={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all hover-lift ${
              `border-white/[0.06] bg-white/[0.02] hover:${RARITY_BORDER[blook.rarity]} hover:${RARITY_BG[blook.rarity]}`
            }`}
          >
            <span class={`h-2 w-2 rounded-full shrink-0 ${
              blook.rarity === "Chroma" ? "bg-teal-400" : blook.rarity === "Legendary" ? "bg-amber-400" : "bg-violet-400"
            }`} />
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-semibold text-white truncate">{blook.name}</p>
              <p class="text-[9px] text-white/40">{blook.rarity} &middot; {PACK_MAP[blook.packId]?.name ?? blook.packId}</p>
            </div>
            <span class="text-[10px] font-bold text-white/40">{(blook.dropRate * 100).toFixed(2)}%</span>
          </button>
        ))}
        {filteredBlooks.length === 0 && (
          <p class="text-center text-[11px] text-white/30 py-4">No blooks found</p>
        )}
      </div>
    </div>
  );
}

function ChaseRow({ label, tokens, maxTokens, color }: { label: string; tokens: number; maxTokens: number; color: string }) {
  const pct = maxTokens > 0 ? Math.min((tokens / maxTokens) * 100, 100) : 0;
  const colorMap: Record<string, { text: string; bar: string; bg: string }> = {
    emerald: { text: "text-emerald-300", bar: "bg-emerald-400", bg: "bg-emerald-400/5" },
    amber: { text: "text-amber-300", bar: "bg-amber-400", bg: "bg-amber-400/5" },
    red: { text: "text-red-400", bar: "bg-red-400", bg: "bg-red-400/5" },
  };
  const c = colorMap[color] ?? colorMap.amber;
  return (
    <div class={`rounded-xl border border-white/[0.06] ${c.bg} px-3 py-2.5`}>
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-[10px] text-white/40">{label}</span>
        <span class={`text-xs font-bold ${c.text}`}>{Math.round(tokens).toLocaleString()} tkn</span>
      </div>
      <div class="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div class={`h-full rounded-full progress-bar ${c.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
