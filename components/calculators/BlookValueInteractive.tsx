"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BLOOKS, PACK_MAP, SELL_VALUES } from "@/lib/constants";
import { CalculatorBanner } from "@/components/calculators/CalculatorBanner";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/types";

type SortBy = "sellValue" | "dropRate" | "name";

const RARITY_ORDER: Record<string, number> = {
  Chroma: 0,
  Legendary: 1,
  Epic: 2,
  Rare: 3,
  Uncommon: 4,
  Common: 5,
};

const RARITY_COLORS: Record<string, string> = {
  Common: "text-slate-300",
  Uncommon: "text-emerald-300",
  Rare: "text-sky-300",
  Epic: "text-violet-300",
  Legendary: "text-amber-300",
  Chroma: "text-teal-300",
};

export default function BlookValueInteractive() {
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState<string>("all");
  const [pack, setPack] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("sellValue");

  const filtered = useMemo(() => {
    let result = BLOOKS.filter((b) => b.rarity !== "Common");

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((b) => b.name.toLowerCase().includes(q));
    }
    if (rarity !== "all") {
      result = result.filter((b) => b.rarity === rarity);
    }
    if (pack !== "all") {
      result = result.filter((b) => b.packId === pack);
    }

    return [...result]
      .map((b) => {
        const p = PACK_MAP[b.packId];
        const packCost = p?.costPerPull ?? 20;
        const expectedTokens = b.dropRate > 0 ? packCost / b.dropRate : Infinity;
        return { ...b, expectedTokens };
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "dropRate") return b.dropRate - a.dropRate;
        return b.sellValue - a.sellValue;
      });
  }, [search, rarity, pack, sortBy]);

  const uniquePacks = useMemo(
    () =>
      Array.from(new Set(BLOOKS.filter((b) => b.rarity !== "Common").map((b) => b.packId)))
        .map((id) => ({ id, name: PACK_MAP[id]?.name ?? id }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  return (
    <div className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <CalculatorBanner />

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Value Calculator
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blooket Blook Values{" "}
          <span className="mt-2 block text-xl font-medium text-violet-300">
            Sell values, drop rates &amp; expected token cost
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          Filter and sort all blooks by sell value, drop rate, or expected token
          cost. Lower cost means easier to obtain.
        </p>
      </section>

      {/* Sell Value Cards */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {Object.entries(SELL_VALUES).map(([r, value]) => (
          <div
            key={r}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">
              {r} sell value
            </p>
            <p className="mt-2 text-2xl font-black text-white">{value} tokens</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blooks..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:border-teal-400/40 focus:outline-none"
            />
          </div>

          {/* Rarity */}
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white focus:border-teal-400/40 focus:outline-none"
          >
            <option value="all">All Rarities</option>
            {(["Uncommon", "Rare", "Epic", "Legendary", "Chroma"] as Rarity[]).map(
              (r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ),
            )}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-white focus:border-teal-400/40 focus:outline-none"
          >
            <option value="sellValue">Sort: Sell Value</option>
            <option value="dropRate">Sort: Drop Rate</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>

        {/* Pack filter */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setPack("all")}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
              pack === "all"
                ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
            )}
          >
            All Packs
          </button>
          {uniquePacks.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => setPack(p.id)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                pack === p.id
                  ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                  : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/[0.06] p-4 text-sm text-white/60">
          Showing {filtered.length} of{" "}
          {BLOOKS.filter((b) => b.rarity !== "Common" && !b.rotationGroup).length}{" "}
          blooks
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-4 font-bold text-white/70">Blook</th>
                <th className="py-3 px-4 font-bold text-white/70">Rarity</th>
                <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                <th className="py-3 px-4 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-4 font-bold text-white/70">Sell Value</th>
                <th className="py-3 px-4 font-bold text-white/70">
                  Est. Token Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((blook) => (
                <tr
                  key={blook.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blooks/${blook.id}`}
                        className="hover:text-violet-300"
                      >
                        {blook.name}
                      </Link>
                      {blook.rotationGroup && (
                        <span
                          className="rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-orange-300"
                          title="This blook rotates daily in the pack pool."
                        >
                          Rotates
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className={cn(
                      "py-3 px-4",
                      RARITY_COLORS[blook.rarity] ?? "text-white/60",
                    )}
                  >
                    {blook.rarity}
                  </td>
                  <td className="py-3 px-4 text-white/60">
                    <Link
                      href={`/packs#${blook.packId}`}
                      className="text-emerald-400/70 hover:text-emerald-300"
                    >
                      {PACK_MAP[blook.packId]?.name ?? blook.packId}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-white/60">
                    {(blook.dropRate * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-emerald-300/80 font-semibold">
                    {blook.sellValue} tokens
                  </td>
                  <td className="py-3 px-4 text-white/70">
                    {blook.expectedTokens === Infinity
                      ? "N/A"
                      : `${Math.round(blook.expectedTokens).toLocaleString()} tokens`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-white">
          How expected token cost works
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
          <p>
            <strong className="text-white">
              Expected token cost = pack price / drop rate.
            </strong>{" "}
            If a blook has a 0.5% drop rate and its pack costs 20 tokens, you
            would expect to spend 4,000 tokens to pull it once on average.
          </p>
          <p>
            This is an <strong className="text-white">expected value</strong>, not
            a guarantee. Some players will spend far less, others far more. Use
            the{" "}
            <Link
              href="/calculators/chase"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Chase Calculator
            </Link>{" "}
            for probability-at-budget numbers.
          </p>
          <p>
            Sell values are fixed by rarity tier: Common blooks sell for{" "}
            {SELL_VALUES.Common} tokens, Uncommon for {SELL_VALUES.Uncommon},
            Rare for {SELL_VALUES.Rare}, Epic for {SELL_VALUES.Epic}, Legendary
            for {SELL_VALUES.Legendary}, and Chroma for {SELL_VALUES.Chroma}.
          </p>
        </div>
      </section>

      <aside className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/calculators"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          All Calculators
        </Link>
        <Link
          href="/calculators/chase"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Chase Calculator
        </Link>
        <Link
          href="/calculators/roi"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          ROI Calculator
        </Link>
      </aside>
    </div>
  );
}
