"use client";

import { Crown, Target, Wallet } from "lucide-react";

import { rankPacksByValue, tokensForConfidence } from "@/lib/calculator-v2";
import { PACKS, type PackSlug } from "@/lib/packs";

type ScenarioApply = {
  packSlug?: PackSlug;
  tokens?: number;
  metric?: "epicPlus" | "legendary" | "chroma";
  switchToCompareTab?: boolean;
};

type Props = {
  onApply: (config: ScenarioApply) => void;
};

/**
 * 3 one-click presets that pre-fill the calculator with sensible defaults
 * for the most common Blooket questions. Reduces decision paralysis for
 * casual users.
 *
 *  - "Can I get a Chroma?"  → Space pack, chroma metric, 5,000 tkn
 *  - "How to get Legendary?" → cheapest legendary pack at 90%, that token amount
 *  - "What's the cheapest pack?" → highest-PVI pack
 */
export default function QuickScenarios({ onApply }: Props) {
  // Compute the cheapest legendary pack at 90% confidence
  const cheapestLegendary = PACKS.map((pack) => ({
    pack,
    tokens: tokensForConfidence(pack as never, "legendary", 0.9, true),
  }))
    .filter((entry) => Number.isFinite(entry.tokens))
    .sort((a, b) => a.tokens - b.tokens)[0];

  // Highest-PVI pack
  const bestValue = rankPacksByValue(PACKS as never)[0];

  const scenarios = [
    {
      icon: Target,
      label: "Can I pull a Chroma?",
      sublabel: "Space · 5,000 tkn · chroma chase",
      onClick: () =>
        onApply({
          packSlug: "space" as PackSlug,
          tokens: 5000,
          metric: "chroma",
        }),
    },
    {
      icon: Crown,
      label: "How to get a Legendary?",
      sublabel: cheapestLegendary
        ? `${cheapestLegendary.pack.name} · ${cheapestLegendary.tokens.toLocaleString()} tkn`
        : "Cheapest legendary path",
      onClick: () =>
        onApply({
          packSlug: cheapestLegendary?.pack.id as PackSlug,
          tokens: cheapestLegendary?.tokens,
          metric: "legendary",
        }),
    },
    {
      icon: Wallet,
      label: "Which pack is best value?",
      sublabel: bestValue
        ? `${bestValue.pack.name} · PVI ${bestValue.pvi.total}/100`
        : "Highest PVI pack",
      onClick: () =>
        onApply({
          packSlug: bestValue?.pack.id as PackSlug,
          metric: "epicPlus",
        }),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {scenarios.map((scenario) => {
        const Icon = scenario.icon;
        return (
          <button
            key={scenario.label}
            type="button"
            onClick={scenario.onClick}
            className="group cyber-glass-sub flex items-start gap-3 px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/20">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">
                {scenario.label}
              </span>
              <span className="cyber-mono mt-0.5 block truncate text-[10px] uppercase tracking-wider text-slate-500">
                {scenario.sublabel}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
