"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { formatPercent, formatTokenLabel } from "@/lib/math";
import { CalculatorBanner } from "@/components/calculators/CalculatorBanner";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function tokensForProbability(
  dropRate: number,
  packCost: number,
  targetProb: number,
) {
  if (dropRate <= 0) return Infinity;
  const n = Math.log(1 - targetProb) / Math.log(1 - dropRate);
  return Math.ceil(n) * packCost;
}

const CHASE_BLOOKS = BLOOKS.filter(
  (b) => b.rarity === "Chroma" || b.rarity === "Legendary",
).sort((a, b) => a.dropRate - b.dropRate);

const RARITY_COLORS: Record<string, string> = {
  Legendary: "text-amber-300",
  Chroma: "text-teal-300",
};

export default function ChaseCalculatorInteractive() {
  const [search, setSearch] = useState("");
  const [selectedBlookId, setSelectedBlookId] = useState(CHASE_BLOOKS[0].id);

  const filteredBlooks = useMemo(() => {
    if (!search) return CHASE_BLOOKS;
    const q = search.toLowerCase();
    return CHASE_BLOOKS.filter((b) =>
      b.name.toLowerCase().includes(q),
    );
  }, [search]);

  const selectedBlook = useMemo(
    () => CHASE_BLOOKS.find((b) => b.id === selectedBlookId) ?? CHASE_BLOOKS[0],
    [selectedBlookId],
  );

  const calc = useMemo(() => {
    const pack = PACK_MAP[selectedBlook.packId];
    if (!pack) return null;

    const cost = pack.costPerPull;
    const t50 = tokensForProbability(selectedBlook.dropRate, cost, 0.5);
    const t90 = tokensForProbability(selectedBlook.dropRate, cost, 0.9);
    const t99 = tokensForProbability(selectedBlook.dropRate, cost, 0.99);

    return { pack, t50, t90, t99 };
  }, [selectedBlook]);

  if (!calc) return null;

  return (
    <div className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <CalculatorBanner />

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Chase Calculator
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blooket Chase Calculator
          <span className="mt-2 block text-xl font-medium text-violet-300">
            Token budgets for specific blook targets
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          Pick a blook you want to chase. See exactly how many tokens you need
          for a 50%, 90%, or 99% chance of pulling it at least once.
        </p>
      </section>

      {/* Blook Browser */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for any blook..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:border-teal-400/40 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
          {filteredBlooks.map((blook) => (
            <button
              key={blook.id}
              onClick={() => setSelectedBlookId(blook.id)}
              className={cn(
                "rounded-lg border p-2 transition-all",
                selectedBlook.id === blook.id
                  ? "border-teal-400/40 bg-teal-400/10 ring-2 ring-teal-400/40"
                  : "border-white/[0.06] hover:border-white/20",
              )}
            >
              <Image
                src={blook.imageUrl}
                alt={blook.name}
                width={48}
                height={48}
                className="mx-auto rounded"
              />
              <div className="mt-1 truncate text-[10px] text-white/60">
                {blook.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Result */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-4">
          <Image
            src={selectedBlook.imageUrl}
            alt={selectedBlook.name}
            width={80}
            height={80}
            className="rounded-xl"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selectedBlook.name}
            </h2>
            <div className="mt-1 text-sm text-white/60">
              <span
                className={
                  RARITY_COLORS[selectedBlook.rarity] ?? "text-white/60"
                }
              >
                {selectedBlook.rarity}
              </span>{" "}
              •{" "}
              <Link
                href={`/packs#${selectedBlook.packId}`}
                className="text-emerald-400/70 hover:text-emerald-300"
              >
                {calc.pack.name}
              </Link>{" "}
              • {formatPercent(selectedBlook.dropRate)} drop rate
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "50% Chance",
              tokens: calc.t50,
              color: "amber",
              isFeatured: false,
            },
            {
              label: "90% Chance",
              tokens: calc.t90,
              color: "teal",
              isFeatured: true,
            },
            {
              label: "99% Chance",
              tokens: calc.t99,
              color: "rose",
              isFeatured: false,
            },
          ].map((target) => (
            <div
              key={target.label}
              className={cn(
                "rounded-xl border p-5",
                target.isFeatured
                  ? "border-teal-400/40 bg-teal-400/5"
                  : "border-white/[0.06]",
              )}
            >
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-teal-400 mb-2">
                {target.label}
                {target.isFeatured && " • PICK"}
              </div>
              <div className="text-3xl font-bold text-white">
                {target.tokens === Infinity
                  ? "N/A"
                  : `${formatTokenLabel(target.tokens)}`}{" "}
                <span className="text-base text-white/40">tkn</span>
              </div>
              <div className="mt-1 text-sm text-white/50">
                {target.tokens === Infinity
                  ? "—"
                  : `${Math.ceil(target.tokens / calc.pack.costPerPull)} packs`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Table Reference */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-2">
          Reference: All Chase Targets
        </h2>
        <p className="text-sm text-white/50 mb-4">
          Token budgets for every Legendary and Chroma blook.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Rarity</th>
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-emerald-400">
                  50% Chance
                </th>
                <th className="py-3 px-3 font-bold text-amber-400">
                  90% Chance
                </th>
                <th className="py-3 px-3 font-bold text-red-400">
                  99% Chance
                </th>
              </tr>
            </thead>
            <tbody>
              {CHASE_BLOOKS.map((blook) => {
                const pack = PACK_MAP[blook.packId];
                if (!pack) return null;
                const cost = pack.costPerPull;
                const t50 = tokensForProbability(blook.dropRate, cost, 0.5);
                const t90 = tokensForProbability(blook.dropRate, cost, 0.9);
                const t99 = tokensForProbability(blook.dropRate, cost, 0.99);

                return (
                  <tr
                    key={blook.id}
                    className={cn(
                      "border-b border-white/[0.04] transition hover:bg-white/[0.02]",
                      blook.id === selectedBlook.id && "bg-teal-500/5",
                    )}
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <button
                        onClick={() => setSelectedBlookId(blook.id)}
                        className="hover:text-violet-300 text-left"
                      >
                        {blook.name}
                      </button>
                    </td>
                    <td
                      className={cn(
                        "py-3 px-3",
                        RARITY_COLORS[blook.rarity] ?? "text-white/60",
                      )}
                    >
                      {blook.rarity}
                    </td>
                    <td className="py-3 px-3 text-white/60">
                      <Link
                        href={`/packs#${blook.packId}`}
                        className="text-emerald-400/70 hover:text-emerald-300"
                      >
                        {pack.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-white/60">
                      {formatPercent(blook.dropRate)}
                    </td>
                    <td className="py-3 px-3 text-emerald-300/80">
                      {t50 === Infinity ? "N/A" : formatTokenLabel(t50)}
                    </td>
                    <td className="py-3 px-3 text-amber-300/80">
                      {t90 === Infinity ? "N/A" : formatTokenLabel(t90)}
                    </td>
                    <td className="py-3 px-3 text-red-300/80">
                      {t99 === Infinity ? "N/A" : formatTokenLabel(t99)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-white">
          How chase math works
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
          <p>
            The formula is{" "}
            <strong className="text-white">
              n = log(1 - P) / log(1 - p)
            </strong>
            , where P is your target probability and p is the single-pull drop
            rate. Multiply n by the pack cost to get the token budget.
          </p>
          <p>
            A 50% chance is the &quot;coin flip&quot; threshold — you are as
            likely to succeed as not. A 90% chance is a strong bet but still
            fails 1 in 10 times. A 99% chance is near-certain but extremely
            expensive for ultra-rare blooks.
          </p>
          <p>
            These numbers assume no duplicate resell. Enable resell in the{" "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              main calculator
            </Link>{" "}
            for effective-cost-adjusted budgets.
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
          href="/calculators/value"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Value Calculator
        </Link>
        <Link
          href="/calculators/roi"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          ROI Calculator
        </Link>
        <Link
          href="/guides/chroma-blooks"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Chroma Guide
        </Link>
      </aside>
    </div>
  );
}
