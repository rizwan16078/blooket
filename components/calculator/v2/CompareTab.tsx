"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { formatPercent } from "@/lib/calculator-v2";
import {
  DEFAULT_TOKENS,
  calculateAtLeastOneSuccess,
  calculateMetricProbability,
  getBoxCost,
  getMetricRate,
  getRarityRate,
  type OddsMetric,
} from "@/lib/math";
import {
  getBlooksForPack,
  getPackById,
  PACKS,
  type PackSlug,
} from "@/lib/packs";
import type { Rarity } from "@/types";

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

const RARITY_DOT: Record<Rarity, string> = {
  Common: "bg-slate-400",
  Uncommon: "bg-emerald-400",
  Rare: "bg-sky-400",
  Epic: "bg-red-400",
  Legendary: "bg-amber-400",
  Chroma: "bg-purple-400",
};

const RARITY_ORDER: Rarity[] = ["Chroma", "Legendary", "Epic", "Rare", "Uncommon", "Common"];

const SLOT_COLORS = [
  { border: "border-cyan-400/50", bg: "bg-cyan-400/10", text: "text-cyan-300", fill: "#22d3ee" },
  { border: "border-violet-400/50", bg: "bg-violet-400/10", text: "text-violet-300", fill: "#a78bfa" },
  { border: "border-emerald-400/50", bg: "bg-emerald-400/10", text: "text-emerald-300", fill: "#34d399" },
  { border: "border-amber-400/50", bg: "bg-amber-400/10", text: "text-amber-300", fill: "#fbbf24" },
];

/* ─── Types ─── */

type Metric = OddsMetric;

interface ComparisonRow {
  label: string;
  tooltip?: string;
  values: (string | number | null)[];
  bestIndex: number | null; // index of best value (lower = better for cost, higher = better for rate)
  direction: "lower" | "higher"; // which direction is "better"
}

/* ─── Helpers ─── */

function getTopChase(packId: PackSlug) {
  const blooks = getBlooksForPack(packId);
  const rarest = blooks
    .filter((b) => b.rarity !== "Common" && b.rarity !== "Uncommon" && b.rarity !== "Rare")
    .sort((a, b) => a.dropRate - b.dropRate)[0];
  return rarest ?? null;
}

function buildChaseCurvePoints(packId: PackSlug, metric: Metric, dupesEnabled: boolean) {
  const pack = getPackById(packId);
  if (!pack) return [];
  const rate = getMetricRate(pack, metric);
  if (rate <= 0) return [];
  const maxPacks = Math.ceil(Math.log(0.01) / Math.log(1 - rate)); // packs for 99%
  const step = Math.max(1, Math.floor(maxPacks / 60));
  const points: { packs: number; probability: number }[] = [];
  for (let p = 0; p <= maxPacks; p += step) {
    points.push({ packs: p, probability: calculateAtLeastOneSuccess(rate, p) });
  }
  // ensure last point
  if (points[points.length - 1]?.packs !== maxPacks) {
    points.push({ packs: maxPacks, probability: calculateAtLeastOneSuccess(rate, maxPacks) });
  }
  return points;
}

/* ─── Component ─── */

export default function CompareTab() {
  const [selectedSlugs, setSelectedSlugs] = useState<(PackSlug | null)[]>(["space", "medieval", null, null]);
  const [metric, setMetric] = useState<Metric>("legendary");
  const [dupesEnabled, setDupesEnabled] = useState(false);
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);

  const UNLOCKED = PACKS.filter((p) => !p.isLocked);

  const setSlot = (index: number, slug: PackSlug | null) => {
    setSelectedSlugs((prev) => {
      const next = [...prev];
      next[index] = slug;
      return next;
    });
  };

  const activePacks = selectedSlugs
    .map((slug, i) => (slug ? { slug, pack: getPackById(slug), slotIndex: i } : null))
    .filter((x): x is { slug: PackSlug; pack: NonNullable<ReturnType<typeof getPackById>>; slotIndex: number } => !!x?.pack);

  // Build comparison rows
  const comparisonRows = useMemo<ComparisonRow[]>(() => {
    if (activePacks.length === 0) return [];

    const packs = activePacks.map((a) => a.pack);
    const values = (fn: (p: typeof packs[0]) => number | null) => activePacks.map((a) => fn(a.pack));

    const row = (
      label: string,
      vals: (string | number | null)[],
      direction: "lower" | "higher",
      tooltip?: string,
    ): ComparisonRow => {
      const numeric = vals.map((v, i) => (v != null && typeof v === "number" ? { v, i } : null)).filter(Boolean);
      const bestVal = direction === "lower"
        ? Math.min(...numeric.map((n) => n!.v))
        : Math.max(...numeric.map((n) => n!.v));
      const bestIndex = numeric.find((n) => n!.v === bestVal)?.i ?? null;
      return { label, tooltip, values: vals, bestIndex, direction };
    };

    const rows: ComparisonRow[] = [];

    // Cost
    rows.push(row("Cost / pull", values((p) => p.costPerPull), "lower", "Token price per single pack open"));
    rows.push(row("Effective cost", values((p) => dupesEnabled ? p.effectiveCost : null), "lower", "Cost after dupe sell-back refund"));

    // Rates
    for (const rarity of RARITY_ORDER) {
      const rateVals = values((p) => getRarityRate(p.id, rarity));
      if (rateVals.some((v) => v != null && v > 0)) {
        rows.push(row(
          `${rarity} rate`,
          rateVals.map((v) => (v != null && v > 0 ? formatPercent(v) : "—")),
          "higher",
          `Combined drop rate for all ${rarity} blooks`,
        ));
      }
    }

    // Metric rate
    rows.push(row(
      `${metric === "epicPlus" ? "Epic+" : metric.charAt(0).toUpperCase() + metric.slice(1)} rate`,
      values((p) => getMetricRate(p, metric)),
      "higher",
      `Aggregate rate for your target tier`,
    ));

    // Probability at current tokens
    rows.push(row(
      `Chance @ ${tokens.toLocaleString()} tkn`,
      values((p) => calculateMetricProbability(p, tokens, dupesEnabled, metric)),
      "higher",
      `Probability of at least one ${metric === "epicPlus" ? "Epic+" : metric} with your tokens`,
    ));

    // Packs for 50%
    const packsFor50 = values((p) => {
      const rate = getMetricRate(p, metric);
      if (rate <= 0) return null;
      return Math.ceil(Math.log(0.5) / Math.log(1 - rate));
    });
    rows.push(row("Packs for 50%", packsFor50, "lower", "Number of pulls needed for 50% chance"));

    // Tokens for 50%
    rows.push(row(
      "Tokens for 50%",
      packsFor50.map((v, i) => {
        if (v == null) return null;
        const cost = dupesEnabled ? packs[i].effectiveCost : packs[i].costPerPull;
        return Math.ceil(v * cost);
      }),
      "lower",
      "Total token budget for 50% chance",
    ));

    // ROI
    rows.push(row(
      "Avg sell value",
      values((p) => p.avgSellValue),
      "higher",
      "Expected tokens returned per pull from selling",
    ));

    // ROI ratio
    rows.push(row(
      "ROI ratio",
      values((p) => p.avgSellValue / p.costPerPull),
      "higher",
      "Sell value ÷ cost — higher = better dupe refund",
    ));

    // Blook count
    rows.push(row(
      "Blooks in pack",
      values((p) => p.featuredBlooks.length),
      "higher",
      "Total blooks available in this pack",
    ));

    // Top chase
    const chaseVals = activePacks.map((a) => {
      const chase = getTopChase(a.slug);
      return chase ? `${chase.name} (${formatPercent(chase.dropRate)})` : "—";
    });
    rows.push(row("Rarest blook", chaseVals, "higher" as const, "Hardest-to-pull blook in the pack"));

    return rows;
  }, [activePacks, metric, dupesEnabled, tokens]);

  // Verdict
  const verdict = useMemo(() => {
    if (activePacks.length < 2) return null;
    const packs = activePacks.map((a) => a.pack);
    const scores = packs.map((p) => {
      const rate = getMetricRate(p, metric);
      const cost = getBoxCost(p, dupesEnabled);
      return rate / cost; // rate-per-token efficiency
    });
    const bestIdx = scores.indexOf(Math.max(...scores));
    const best = packs[bestIdx];
    const bestSlot = activePacks[bestIdx].slotIndex;
    return { best, bestIdx, bestSlot, scores };
  }, [activePacks, metric, dupesEnabled]);

  // Overlaid chase curves
  const chaseCurves = useMemo(
    () => activePacks.map((a) => ({
      slug: a.slug,
      slotIndex: a.slotIndex,
      points: buildChaseCurvePoints(a.slug, metric, dupesEnabled),
    })),
    [activePacks, metric, dupesEnabled],
  );

  return (
    <div className="space-y-5">
      {/* ── Row 1: Pack selectors + settings ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <SubPanel className="space-y-4">
          <MonoLabel tooltip="Select 2–4 packs to compare side-by-side">
            Packs to compare
          </MonoLabel>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {selectedSlugs.map((slug, i) => {
              const color = SLOT_COLORS[i];
              return (
                <div key={i} className={`relative rounded-xl border ${slug ? color.border : "border-white/10"} ${slug ? color.bg : "bg-white/[0.02]"} p-2.5 transition`}>
                  {slug ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${color.text}`}>
                          {getPackById(slug)?.name ?? slug}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSlot(i, null)}
                          className="text-white/30 hover:text-white/60 transition"
                          aria-label="Remove pack"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="cyber-mono mt-1 text-[10px] text-slate-400">
                        {getPackById(slug)?.costPerPull} tkn/pull
                      </p>
                    </>
                  ) : (
                    <select
                      value=""
                      onChange={(e) => {
                        const val = (e.target as HTMLSelectElement).value;
                        if (val) setSlot(i, val as PackSlug);
                      }}
                      className="w-full rounded-lg border border-white/10 bg-[#0a0e1a] px-2 py-2 text-xs text-slate-300 outline-none cursor-pointer hover:border-white/20 transition"
                      aria-label={`Select pack ${i + 1}`}
                    >
                      <option value="" disabled>+ Add pack</option>
                      {UNLOCKED
                        .filter((p) => !selectedSlugs.includes(p.id))
                        .map((p) => (
                          <option key={p.id} value={p.id} className="bg-[#0a0e1a] text-slate-200">
                            {p.name} ({p.costPerPull} tkn)
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </SubPanel>

        <SubPanel className="space-y-4">
          {/* Metric selector */}
          <div>
            <MonoLabel>Target rarity</MonoLabel>
            <div className="mt-2 flex gap-1.5">
              {(["epicPlus", "legendary", "chroma"] as Metric[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetric(m)}
                  className={`cyber-mono flex-1 rounded-lg border px-2 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${
                    metric === m
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {m === "epicPlus" ? "Epic+" : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dupes toggle */}
          <button
            type="button"
            onClick={() => setDupesEnabled(!dupesEnabled)}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition ${
              dupesEnabled
                ? "border-emerald-400/30 bg-emerald-400/[0.06]"
                : "border-white/10 bg-white/[0.02] hover:border-white/15"
            }`}
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

          {/* Token input */}
          <div>
            <MonoLabel tooltip="Token budget used for probability calculations">
              Token budget
            </MonoLabel>
            <div className="mt-2 flex gap-1.5">
              {[0, 500, 1000, 2000, 5000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTokens(v)}
                  className={`cyber-mono flex-1 rounded-lg border px-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                    tokens === v
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {v === 0 ? "0" : v >= 1000 ? `${v / 1000}K` : v}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTokens(tokens + 500)}
                className="cyber-mono flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:border-white/20 hover:text-white transition"
              >
                +500
              </button>
            </div>
          </div>
        </SubPanel>
      </div>

      {/* ── Row 2: Comparison matrix ── */}
      {activePacks.length >= 2 ? (
        <SubPanel className="overflow-x-auto">
          <MonoLabel tooltip="Each row compares one metric across selected packs. Best value is highlighted.">
            Comparison matrix
          </MonoLabel>

          <table className="mt-3 w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-2 pr-4 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Metric
                </th>
                {activePacks.map((a, i) => (
                  <th
                    key={a.slug}
                    className={`pb-2 px-3 text-[11px] font-semibold uppercase tracking-wider ${SLOT_COLORS[a.slotIndex].text}`}
                  >
                    {a.pack.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b border-white/[0.03]">
                  <td className="py-2 pr-4 text-[11px] text-slate-400 whitespace-nowrap">
                    {row.label}
                  </td>
                  {row.values.map((val, i) => {
                    const isBest = row.bestIndex === i && activePacks.length > 1;
                    const slotColor = SLOT_COLORS[activePacks[i].slotIndex];
                    return (
                      <td
                        key={i}
                        className={`py-2 px-3 cyber-mono text-[11px] font-semibold whitespace-nowrap ${
                          isBest
                            ? `${slotColor.text} ${slotColor.bg} rounded-lg`
                            : "text-slate-300"
                        }`}
                      >
                        {val != null
                          ? typeof val === "number"
                            ? val >= 1000
                              ? val.toLocaleString(undefined, { maximumFractionDigits: 1 })
                              : val < 0.01 && val > 0
                                ? formatPercent(val)
                                : Number.isInteger(val)
                                  ? val.toLocaleString()
                                  : val.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : val
                          : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </SubPanel>
      ) : (
        <div className="cyber-glass-sub text-center px-4 py-10">
          <p className="cyber-display text-2xl text-slate-300">
            Select at least 2 packs
          </p>
          <p className="cyber-mono mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Use the slots above to add packs for comparison
          </p>
        </div>
      )}

      {/* ── Row 3: Overlaid chase curves ── */}
      {activePacks.length >= 2 && chaseCurves.some((c) => c.points.length > 0) && (
        <SubPanel>
          <MonoLabel tooltip="Chase curves overlaid — how probability climbs as you open more packs">
            Chase curve comparison
          </MonoLabel>

          <div className="mt-3 relative">
            {/* Multi-curve SVG */}
            <svg
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              className="block h-auto w-full"
              style={{ maxHeight: 200 }}
            >
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((y) => (
                <line
                  key={y}
                  x1={24}
                  x2={976}
                  y1={200 - 12 - (200 - 24) * y}
                  y2={200 - 12 - (200 - 24) * y}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={1}
                />
              ))}
              {/* 50% line */}
              <line
                x1={24}
                x2={976}
                y1={200 - 12 - (200 - 24) * 0.5}
                y2={200 - 12 - (200 - 24) * 0.5}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />

              {chaseCurves.map((curve) => {
                if (curve.points.length < 2) return null;
                const color = SLOT_COLORS[curve.slotIndex];
                const maxX = curve.points[curve.points.length - 1].packs;
                const sx = (x: number) => 24 + ((1000 - 48) * x) / Math.max(1, maxX);
                const sy = (y: number) => 200 - 12 - (200 - 24) * y;

                const pathLine = curve.points
                  .map((p, idx) => `${idx === 0 ? "M" : "L"} ${sx(p.packs).toFixed(1)} ${sy(p.probability).toFixed(1)}`)
                  .join(" ");

                return (
                  <g key={curve.slug}>
                    <path
                      d={pathLine}
                      fill="none"
                      stroke={color.fill}
                      strokeWidth={2.5}
                      style={{ filter: `drop-shadow(0 0 6px ${color.fill}80)` }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-2 flex flex-wrap gap-3">
              {chaseCurves.map((curve) => {
                const color = SLOT_COLORS[curve.slotIndex];
                const pack = getPackById(curve.slug);
                return (
                  <div key={curve.slug} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${RARITY_DOT.Legendary}`} style={{ backgroundColor: color.fill }} />
                    <span className={`text-[10px] font-semibold ${color.text}`}>{pack?.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Y-axis labels */}
            <div className="cyber-mono mt-1 flex justify-between text-[9px] text-slate-500">
              <span>0 packs</span>
              <span>50%</span>
              <span>~99%</span>
            </div>
          </div>
        </SubPanel>
      )}

      {/* ── Row 4: Rarity composition bars ── */}
      {activePacks.length >= 2 && (
        <SubPanel>
          <MonoLabel tooltip="What each pack actually drops — rarity composition as a percentage">
            Rarity composition
          </MonoLabel>

          <div className="mt-3 space-y-3">
            {activePacks.map((a) => {
              const color = SLOT_COLORS[a.slotIndex];
              const rates = RARITY_ORDER.map((rarity) => ({
                rarity,
                rate: getRarityRate(a.pack.id, rarity),
              })).filter((r) => r.rate > 0);

              const total = rates.reduce((sum, r) => sum + r.rate, 0);

              return (
                <div key={a.slug}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold ${color.text}`}>{a.pack.name}</span>
                    <span className="text-[9px] text-slate-500">{a.pack.costPerPull} tkn</span>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden bg-white/[0.03]">
                    {rates.map((r) => (
                      <div
                        key={r.rarity}
                        className={`${RARITY_BG[r.rarity]} transition-all`}
                        style={{ width: `${(r.rate / total) * 100}%` }}
                        title={`${r.rarity}: ${formatPercent(r.rate)}`}
                      />
                    ))}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {rates.map((r) => (
                      <span key={r.rarity} className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${RARITY_DOT[r.rarity]}`} />
                        <span className={`text-[9px] ${RARITY_COLORS[r.rarity]}`}>
                          {r.rarity} {formatPercent(r.rate)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SubPanel>
      )}

      {/* ── Row 5: Verdict ── */}
      {verdict && (
        <div className="cyber-glass-sub rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl leading-none">{"\u{1F3C6}"}</span>
            <div>
              <p className="text-sm font-semibold text-cyan-200">
                Best value: {verdict.best.name} Pack
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {verdict.best.name} delivers the highest {metric === "epicPlus" ? "Epic+" : metric} rate per token spent
                {dupesEnabled ? " (with dupe refund)" : ""}.
                {" "}Efficiency score:{" "}
                <span className="text-cyan-300 font-semibold">
                  {(verdict.scores[verdict.bestIdx] * 1000).toFixed(2)}
                </span>{" "}
                vs{" "}
                {verdict.scores
                  .filter((_, i) => i !== verdict.bestIdx)
                  .map((s) => (s * 1000).toFixed(2))
                  .join(", ")}{" "}
                for the others.
              </p>
              {verdict.scores.some((s, i) => i !== verdict.bestIdx && s > 0) && (
                <p className="mt-1.5 text-[11px] text-slate-500">
                  {"\u2192"} Switch to {verdict.best.name} for{" "}
                  {(() => {
                    const bestRate = getMetricRate(verdict.best, metric);
                    const bestCost = getBoxCost(verdict.best, dupesEnabled);
                    const runnerUp = activePacks.find((_, i) => i !== verdict.bestIdx && verdict.scores[i] > 0);
                    if (!runnerUp) return "better odds";
                    const runnerRate = getMetricRate(runnerUp.pack, metric);
                    const runnerCost = getBoxCost(runnerUp.pack, dupesEnabled);
                    const improvement = ((bestRate / bestCost) / (runnerRate / runnerCost) - 1) * 100;
                    return `${improvement.toFixed(0)}% better ${metric === "epicPlus" ? "Epic+" : metric} efficiency`;
                  })()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
