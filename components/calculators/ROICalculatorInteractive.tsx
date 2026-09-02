"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PACKS } from "@/lib/packs";
import {
  getMetricRate,
  formatPercent,
  calculateAtLeastOneSuccess,
  calculateOpenCount,
  type OddsMetric,
} from "@/lib/math";
import { CalculatorBanner } from "@/components/calculators/CalculatorBanner";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type TargetRarity = "epicPlus" | "legendary" | "chroma";
type PackFilter = "all" | "20tkn" | "25tkn";

const METRICS: { key: TargetRarity; oddsKey: OddsMetric; label: string; color: string }[] = [
  { key: "epicPlus", oddsKey: "epicPlus", label: "Epic+", color: "violet" },
  { key: "legendary", oddsKey: "legendary", label: "Legendary", color: "amber" },
  { key: "chroma", oddsKey: "chroma", label: "Chroma", color: "teal" },
];

const TOKEN_PRESETS = [500, 1000, 2500, 5000, 10000, 25000];

export default function ROICalculatorInteractive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [budget, setBudget] = useState(
    Number(searchParams.get("budget")) || 500,
  );
  const [target, setTarget] = useState<TargetRarity>(
    (searchParams.get("target") as TargetRarity) || "epicPlus",
  );
  const [filter, setFilter] = useState<PackFilter>(
    (searchParams.get("filter") as PackFilter) || "all",
  );

  const updateUrl = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const results = useMemo(() => {
    let filteredPacks = PACKS;
    if (filter === "20tkn") filteredPacks = PACKS.filter((p) => p.costPerPull === 20);
    if (filter === "25tkn") filteredPacks = PACKS.filter((p) => p.costPerPull === 25);

    const oddsKey = METRICS.find((m) => m.key === target)!.oddsKey;

    return filteredPacks
      .map((pack) => {
        const rate = getMetricRate(pack, oddsKey);
        const opens = calculateOpenCount(budget, pack, false);
        const prob = calculateAtLeastOneSuccess(rate, opens);
        const roi = budget > 0 ? prob / budget : 0;

        return { pack, rate, opens, prob, roi };
      })
      .sort((a, b) => b.roi - a.roi);
  }, [budget, target, filter]);

  return (
    <div className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <CalculatorBanner />

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          ROI Calculator
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blooket Pack ROI{" "}
          <span className="mt-2 block text-xl font-medium text-violet-300">
            Which pack gives the best return per token?
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          Enter your token budget and target rarity. The table ranks every pack
          by ROI — probability per token spent. Higher ROI means more bang for
          your buck.
        </p>
      </section>

      {/* Interactive Controls */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        {/* Budget Slider */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400 mb-3 block">
            Your Budget:{" "}
            <span className="text-white text-lg">
              {budget.toLocaleString()} tokens
            </span>
          </label>
          <Slider
            value={[budget]}
            onValueChange={(values) => {
              setBudget(values[0]);
              updateUrl({ budget: values[0] });
            }}
            min={100}
            max={25000}
            step={100}
            className="my-3"
          />
          <div className="flex gap-2 flex-wrap">
            {TOKEN_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setBudget(preset);
                  updateUrl({ budget: preset });
                }}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                  budget === preset
                    ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                    : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
                )}
              >
                {preset >= 1000 ? `${preset / 1000}K` : preset}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Target Rarity */}
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400 mb-3 block">
              Target Rarity
            </label>
            <div className="flex gap-2">
              {METRICS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setTarget(option.key);
                    updateUrl({ target: option.key });
                  }}
                  className={cn(
                    "flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                    target === option.key
                      ? "border-teal-400/40 bg-teal-400/10 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                      : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pack Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400 mb-3 block">
              Show Packs
            </label>
            <div className="flex gap-2">
              {([
                { value: "all", label: "All" },
                { value: "20tkn", label: "20-token" },
                { value: "25tkn", label: "25-token" },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    updateUrl({ filter: option.value });
                  }}
                  className={cn(
                    "flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                    filter === option.value
                      ? "border-violet-400/40 bg-violet-400/10 text-violet-300"
                      : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/[0.06] p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.28em] text-teal-400">
            Live Results — Ranked by Best ROI
          </h2>
          <p className="text-xs text-white/50 mt-1">
            For {budget.toLocaleString()} tokens, chasing{" "}
            {METRICS.find((m) => m.key === target)!.label}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-4 font-bold text-white/70">#</th>
                <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                <th className="py-3 px-4 font-bold text-white/70">Opens</th>
                <th className="py-3 px-4 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-4 font-bold text-white/70">ROI (prob/token)</th>
                <th className="py-3 px-4 font-bold text-white/70 text-right">
                  P(at least 1)
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr
                  key={row.pack.id}
                  className={cn(
                    "border-b border-white/[0.04] transition hover:bg-white/[0.02]",
                    idx === 0 && "bg-emerald-500/5",
                  )}
                >
                  <td className="py-3 px-4 font-mono text-white/40">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={
                          row.pack.isLocked
                            ? "/packs"
                            : `/packs#${row.pack.id}`
                        }
                        className="font-semibold text-white hover:text-violet-300"
                      >
                        {row.pack.name}
                      </Link>
                      {idx === 0 && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                          Best ROI
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      {row.pack.costPerPull} tkn / pull
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/80 tabular-nums">
                    {Math.floor(row.opens).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-white/60">
                    {formatPercent(row.rate)}
                  </td>
                  <td className="py-3 px-4 text-violet-300 tabular-nums">
                    {(row.roi * 100).toFixed(4)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={cn(
                        "text-lg font-bold tabular-nums",
                        row.prob >= 0.9
                          ? "text-emerald-300"
                          : row.prob >= 0.5
                            ? "text-amber-300"
                            : "text-rose-300",
                      )}
                    >
                      {formatPercent(row.prob)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-white">How ROI is calculated</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
          <p>
            <strong className="text-white">
              ROI = probability of at least one success / token budget.
            </strong>{" "}
            A pack with a 1% Legendary rate at 20 tokens has a Legendary ROI that
            depends on how many opens you can afford. With 500 tokens you get 25
            opens, giving a ~22.2% chance — an ROI of 0.044% per token. A pack
            with a 0.5% rate at 25 tokens gives only 20 opens and a ~9.5% chance
            — an ROI of 0.019% per token. The first pack is more than twice as
            efficient for Legendary hunting per token.
          </p>
          <p>
            ROI changes with your budget because probability is non-linear. A
            small budget might favor cheaper packs, while a large budget can
            make expensive packs with higher drop rates more efficient overall.
            Use the slider above to find the sweet spot for your situation.
          </p>
          <p>
            ROI does not account for duplicate resell. Enable resell in the{" "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              main calculator
            </Link>{" "}
            for effective-cost-adjusted numbers.
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
          href="/calculators/pack-odds"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Pack Odds
        </Link>
        <Link
          href="/calculators/token-converter"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Token Converter
        </Link>
        <Link
          href="/guides/best-blooket-pack-to-open"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Best Pack Guide
        </Link>
      </aside>
    </div>
  );
}
