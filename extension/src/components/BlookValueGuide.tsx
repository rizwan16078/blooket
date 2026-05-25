import { useState, useMemo } from "preact/hooks";
import { BLOOKS, PACK_MAP } from "@/lib/data";
import type { Rarity } from "@/types";

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

const RARITY_DOT: Record<Rarity, string> = {
  Common: "bg-slate-400",
  Uncommon: "bg-emerald-400",
  Rare: "bg-sky-400",
  Epic: "bg-violet-400",
  Legendary: "bg-amber-400",
  Chroma: "bg-teal-400",
};

const ALL_RARITIES: Rarity[] = ["Chroma", "Legendary", "Epic", "Rare", "Uncommon", "Common"];

type SortKey = "sellValue" | "dropRate" | "name";

export function BlookValueGuide() {
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("sellValue");

  const filtered = useMemo(() => {
    let list = BLOOKS;
    if (rarityFilter !== "all") list = list.filter((b) => b.rarity === rarityFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q));
    }
    // Sort
    const sorted = [...list].sort((a, b) => {
      if (sortBy === "sellValue") return b.sellValue - a.sellValue;
      if (sortBy === "dropRate") return b.dropRate - a.dropRate;
      return a.name.localeCompare(b.name);
    });
    return sorted.slice(0, 30);
  }, [search, rarityFilter, sortBy]);

  const maxSellValue = Math.max(...BLOOKS.map((b) => b.sellValue), 1);

  return (
    <div class="space-y-3">
      {/* Search */}
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

      {/* Rarity filter — compact pills */}
      <div class="flex flex-wrap gap-1">
        <button
          onClick={() => setRarityFilter("all")}
          class={`rounded-lg px-2 py-1 text-[10px] font-semibold transition ${
            rarityFilter === "all"
              ? "bg-white/10 text-white border border-white/20"
              : "bg-white/[0.02] text-white/40 border border-white/[0.06] hover:text-white"
          }`}
        >
          All
        </button>
        {ALL_RARITIES.map((r) => (
          <button
            key={r}
            onClick={() => setRarityFilter(r)}
            class={`rounded-lg px-2 py-1 text-[10px] font-semibold transition flex items-center gap-1 ${
              rarityFilter === r
                ? `${RARITY_BG[r]} ${RARITY_COLORS[r]} border border-current/20`
                : "bg-white/[0.02] text-white/40 border border-white/[0.06] hover:text-white"
            }`}
          >
            <span class={`h-1.5 w-1.5 rounded-full ${RARITY_DOT[r]}`} />
            {r}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] text-white/30 uppercase tracking-wider">Sort:</span>
        {([
          { key: "sellValue" as SortKey, label: "Value" },
          { key: "dropRate" as SortKey, label: "Drop %" },
          { key: "name" as SortKey, label: "Name" },
        ]).map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            class={`rounded-md px-2 py-0.5 text-[9px] font-semibold transition ${
              sortBy === s.key
                ? "bg-violet-400/10 text-violet-300 border border-violet-400/30"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {s.label}
          </button>
        ))}
        <span class="ml-auto text-[9px] text-white/20">{filtered.length} results</span>
      </div>

      {/* Blook list */}
      <div class="space-y-1">
        {filtered.map((blook) => {
          const pack = PACK_MAP[blook.packId];
          return (
            <div
              key={blook.id}
              class={`flex items-center gap-2 rounded-lg border border-white/[0.06] px-2.5 py-1.5 ${RARITY_BG[blook.rarity]}`}
            >
              <span class={`h-2 w-2 rounded-full shrink-0 ${RARITY_DOT[blook.rarity]}`} />
              <div class="min-w-0 flex-1">
                <p class="text-[11px] font-semibold text-white truncate">{blook.name}</p>
                <p class="text-[9px] text-white/30">
                  <span class={RARITY_COLORS[blook.rarity]}>{blook.rarity}</span>
                  {" \u00B7 "}
                  {pack?.name ?? blook.packId}
                </p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[11px] font-bold text-white">{blook.sellValue} tkn</p>
                <div class="mt-0.5 h-0.5 w-10 rounded-full bg-white/[0.06] overflow-hidden ml-auto">
                  <div
                    class={`h-full rounded-full ${RARITY_DOT[blook.rarity]}`}
                    style={{ width: `${(blook.sellValue / maxSellValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p class="text-center text-[11px] text-white/30 py-4">No blooks found</p>
        )}
      </div>
    </div>
  );
}
