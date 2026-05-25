"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PACKS } from "@/lib/packs";
import {
  calculateAtLeastOneSuccess,
  calculateOpenCount,
  formatPercent,
  getRarityRate,
  type OddsMetric,
} from "@/lib/math";
import type { Rarity } from "@/types";
import { CalculatorBanner } from "@/components/calculators/CalculatorBanner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type TargetRarity = "epicPlus" | "legendary" | "chroma";

const TARGETS: { key: TargetRarity; oddsKey: OddsMetric; label: string }[] = [
  { key: "epicPlus", oddsKey: "epicPlus", label: "Epic+" },
  { key: "legendary", oddsKey: "legendary", label: "Legendary" },
  { key: "chroma", oddsKey: "chroma", label: "Chroma" },
];

const TOKEN_PRESETS = [500, 1000, 2500, 5000, 10000, 25000];

export default function PackOddsInteractive() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tokens, setTokens] = useState(
    Number(searchParams.get("tokens")) || 500,
  );
  const [target, setTarget] = useState<TargetRarity>(
    (searchParams.get("target") as TargetRarity) || "epicPlus",
  );
  const [dupes, setDupes] = useState(
    searchParams.get("dupes") === "true",
  );

  const updateUrl = (updates: Record<string, string | number | boolean>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const oddsKey = TARGETS.find((t) => t.key === target)!.oddsKey;

  const results = useMemo(() => {
    return PACKS.map((pack) => {
      const pulls = calculateOpenCount(tokens, pack, dupes);
      const rate = getRarityRate(pack.id, "Uncommon");

      const targetRate = getMetricRateFromPack(pack, oddsKey);
      const probability = calculateAtLeastOneSuccess(targetRate, pulls);

      return { pack, pulls, targetRate, probability };
    }).sort((a, b) => b.probability - a.probability);
  }, [tokens, target, dupes, oddsKey]);

  // Static drop rates table data
  const rarityColumns: { key: string; label: string; color: string }[] = [
    { key: "Uncommon", label: "Uncommon", color: "text-emerald-400" },
    { key: "Rare", label: "Rare", color: "text-sky-400" },
    { key: "Epic", label: "Epic", color: "text-violet-400" },
    { key: "Legendary", label: "Legendary", color: "text-amber-400" },
    { key: "Chroma", label: "Chroma", color: "text-teal-400" },
  ];

  return (
    <div className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <CalculatorBanner />

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Pack Odds Calculator
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blooket Pack Odds
          <span className="mt-2 block text-xl font-medium text-violet-300">
            Live drop rates for every market pack
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          Enter your token budget to see your live probability for each pack.
          The interactive table ranks packs by your chance of pulling at least
          one blook of your target rarity.
        </p>
      </section>

      {/* Interactive Controls */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Token Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400 mb-3 block">
              Your Tokens:{" "}
              <span className="text-white text-base">
                {tokens.toLocaleString()}
              </span>
            </label>
            <Slider
              value={[tokens]}
              onValueChange={(values) => {
                setTokens(values[0]);
                updateUrl({ tokens: values[0] });
              }}
              min={0}
              max={25000}
              step={50}
              className="my-3"
            />
            <div className="flex gap-2 flex-wrap">
              {TOKEN_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setTokens(preset);
                    updateUrl({ tokens: preset });
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                    tokens === preset
                      ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                      : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
                  )}
                >
                  {preset >= 1000 ? `${preset / 1000}K` : preset}
                </button>
              ))}
            </div>
          </div>

          {/* Target Rarity + Dupes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400 mb-3 block">
              Target Rarity
            </label>
            <div className="flex gap-2">
              {TARGETS.map((option) => (
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

            <div className="mt-4 flex items-center justify-between">
              <label className="text-sm text-white/70">
                Include duplicate resell?
              </label>
              <Switch
                checked={dupes}
                onCheckedChange={(checked) => {
                  setDupes(checked);
                  updateUrl({ dupes: checked });
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Live Results — Ranked by Best Odds */}
      <section className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/[0.06] p-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.28em] text-teal-400">
            Live Results — Ranked by Best Odds
          </h2>
          <p className="text-xs text-white/50 mt-1">
            For {tokens.toLocaleString()} tokens, chasing{" "}
            {TARGETS.find((t) => t.key === target)!.label}
            {dupes && " (with duplicate resell)"}
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
                <th className="py-3 px-4 font-bold text-white/70 text-right">
                  Your Chance
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr
                  key={result.pack.id}
                  className={cn(
                    "border-b border-white/[0.04] transition hover:bg-white/[0.02]",
                    idx === 0 && "bg-teal-500/5",
                  )}
                >
                  <td className="py-3 px-4 text-white/40 font-mono">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={
                          result.pack.isLocked
                            ? "/packs"
                            : `/packs#${result.pack.id}`
                        }
                        className="font-semibold text-white hover:text-violet-300"
                      >
                        {result.pack.name}
                      </Link>
                      {idx === 0 && (
                        <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                          Best
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      {result.pack.costPerPull} tkn / pull
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/80 tabular-nums">
                    {Math.floor(result.pulls).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-white/60">
                    {formatPercent(result.targetRate)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={cn(
                        "text-lg font-bold tabular-nums",
                        result.probability >= 0.9
                          ? "text-emerald-300"
                          : result.probability >= 0.5
                            ? "text-amber-300"
                            : "text-rose-300",
                      )}
                    >
                      {formatPercent(result.probability)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Static Reference: Drop Rates per Rarity */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-2">
          Reference: Drop Rates per Pack
        </h2>
        <p className="text-sm text-white/50 mb-4">
          Combined drop rates for each rarity tier in a single pack opening.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                <th className="py-3 px-4 font-bold text-white/70">Cost</th>
                {rarityColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3 px-4 font-bold ${col.color}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PACKS.map((pack) => (
                <tr
                  key={pack.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    <Link
                      href={pack.isLocked ? "/packs" : `/packs#${pack.id}`}
                      className="hover:text-violet-300"
                    >
                      {pack.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-white/60">
                    {pack.costPerPull} tokens
                  </td>
                  {rarityColumns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "py-3 px-4",
                        col.key === "Uncommon" && "text-emerald-300/80",
                        col.key === "Rare" && "text-sky-300/80",
                        col.key === "Epic" && "text-violet-300/80",
                        col.key === "Legendary" && "text-amber-300/80",
                        col.key === "Chroma" && "text-teal-300/80",
                      )}
                    >
                      {formatPercent(getRarityRate(pack.id, col.key as Rarity))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Educational content */}
      <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-white">
          How to read these odds
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
          <p>
            Each percentage in the reference table is the{" "}
            <strong className="text-white">combined drop rate</strong> for that
            rarity tier in a single pack opening. For example, if a pack has two
            Legendaries at 0.5% each, the Legendary column shows 1.0%.
          </p>
          <p>
            A 1% drop rate does{" "}
            <strong className="text-white">not</strong> mean a 1-in-100
            guarantee. The real chance of pulling at least one Legendary from
            100 opens is{" "}
            <strong className="text-white">
              1 - (1 - 0.01)^100 = 63.4%
            </strong>
            , not 100%. Use the interactive controls above to compute your
            actual probability based on your token budget.
          </p>
          <p>
            Packs with rotating Chromas (like Space) show the rate for a single
            active rotation, not the combined rate across all colors.
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
          href="/calculators/token-converter"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Token Converter
        </Link>
        <Link
          href="/calculators/roi"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          ROI Calculator
        </Link>
        <Link
          href="/packs"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
        >
          Pack Details
        </Link>
      </aside>
    </div>
  );
}

function getMetricRateFromPack(
  pack: (typeof PACKS)[number],
  metric: OddsMetric,
): number {
  if (metric === "epicPlus") {
    return (
      getRarityRate(pack.id, "Epic" as Rarity) +
      getRarityRate(pack.id, "Legendary" as Rarity) +
      getRarityRate(pack.id, "Chroma" as Rarity)
    );
  }
  if (metric === "legendary") {
    return (
      getRarityRate(pack.id, "Legendary" as Rarity) +
      getRarityRate(pack.id, "Chroma" as Rarity)
    );
  }
  return getRarityRate(pack.id, "Chroma" as Rarity);
}
