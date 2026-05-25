/**
 * Golden dataset — deterministic reference values for all math functions.
 *
 * Every value was hand-computed from the raw pack data in lib/constants.ts
 * using the formulas in lib/math.ts. These serve as the source of truth
 * for regression testing.
 *
 * Formulas:
 *   calculateAtLeastOneSuccess(rate, n) = 1 - (1 - rate)^n
 *   calculateOpenCount(tokens, pack, dupes) = tokens / (dupes ? effectiveCost : costPerPull)
 *   getRarityRate(packId, rarity) = sum of dropRate for that rarity (rotation groups counted once)
 *   getMetricRate(pack, metric) = sum of relevant rarity rates
 */

import type { OddsMetric } from "@/lib/math";
import type { PackSlug } from "@/lib/packs";

/* ─── Scoring functions ─── */

export type ScoreResult = "pass" | "warn" | "fail";

export function scoreExact(actual: number, expected: number): ScoreResult {
  const diff = Math.abs(actual - expected);
  if (diff < 1e-10) return "pass";
  if (diff < 1e-6) return "warn";
  return "fail";
}

export function scoreTolerance(actual: number, expected: number, tolerance = 0.02): ScoreResult {
  const diff = Math.abs(actual - expected);
  if (diff < tolerance) return "pass";
  if (diff < tolerance * 2) return "warn";
  return "fail";
}

/* ─── Golden test cases ─── */

export interface GoldenCase {
  pack: PackSlug;
  tokens: number;
  dupesEnabled: boolean;
  metric: OddsMetric;
  expected: {
    opens: number;
    metricRate: number;
    probability: number;
  };
}

/**
 * Space pack golden values (costPerPull=20, effectiveCost≈16.484):
 *
 * Rates (with rotation group dedup):
 *   Uncommon: 0.1875*4 = 0.75
 *   Rare:     0.10*2   = 0.20
 *   Epic:     0.045    = 0.045
 *   Legendary:0.0045   = 0.0045
 *   Chroma:   0.0005   = 0.0005  (one astronaut from rotation group)
 *
 * 500 tokens, no dupes:
 *   opens = 500/20 = 25
 *   legendary rate = 0.0045
 *   P(legendary) = 1 - (1-0.0045)^25 = 1 - 0.9955^25 ≈ 0.10567
 *   epicPlus rate = 0.045 + 0.0045 + 0.0005 = 0.05
 *   P(epicPlus) = 1 - (1-0.05)^25 = 1 - 0.95^25 ≈ 0.72261
 *   chroma rate = 0.0005
 *   P(chroma) = 1 - (1-0.0005)^25 ≈ 0.01247
 *
 * 500 tokens, dupes enabled (effectiveCost ≈ 16.484):
 *   opens = 500/16.484 ≈ 30.33
 *   P(legendary) = 1 - (1-0.0045)^30.33 ≈ 0.12725
 *
 * 1000 tokens, no dupes:
 *   opens = 50
 *   P(legendary) = 1 - 0.9955^50 ≈ 0.20051
 *
 * 0 tokens:
 *   opens = 0, P = 0
 *
 * 1 token:
 *   opens = 0 (can't afford), P = 0
 */

export const GOLDEN: GoldenCase[] = [
  // Space pack — baseline
  {
    pack: "space",
    tokens: 500,
    dupesEnabled: false,
    metric: "legendary",
    expected: {
      opens: 25,
      metricRate: 0.0045,
      probability: 1 - Math.pow(0.9955, 25),
    },
  },
  {
    pack: "space",
    tokens: 500,
    dupesEnabled: false,
    metric: "epicPlus",
    expected: {
      opens: 25,
      metricRate: 0.05,
      probability: 1 - Math.pow(0.95, 25),
    },
  },
  {
    pack: "space",
    tokens: 500,
    dupesEnabled: false,
    metric: "chroma",
    expected: {
      opens: 25,
      metricRate: 0.0005,
      probability: 1 - Math.pow(0.9995, 25),
    },
  },

  // Space pack — dupes enabled (effectiveCost computed at runtime)
  // avgSellValue = 0.75*2 + 0.20*20 + 0.045*75 + 0.0045*200 + 0.0005*300 = 9.925
  // effectiveCost = 20 - 9.925 = 10.075
  {
    pack: "space",
    tokens: 500,
    dupesEnabled: true,
    metric: "legendary",
    expected: {
      opens: 500 / 10.075,
      metricRate: 0.0045,
      probability: 1 - Math.pow(1 - 0.0045, 500 / 10.075),
    },
  },

  // Space pack — 1000 tokens
  {
    pack: "space",
    tokens: 1000,
    dupesEnabled: false,
    metric: "legendary",
    expected: {
      opens: 50,
      metricRate: 0.0045,
      probability: 1 - Math.pow(0.9955, 50),
    },
  },

  // Space pack — boundary: 0 tokens
  {
    pack: "space",
    tokens: 0,
    dupesEnabled: false,
    metric: "legendary",
    expected: { opens: 0, metricRate: 0.0045, probability: 0 },
  },

  // Space pack — boundary: 1 token (can't afford 20-tkn pack)
  {
    pack: "space",
    tokens: 1,
    dupesEnabled: false,
    metric: "legendary",
    expected: { opens: 0.05, metricRate: 0.0045, probability: 1 - Math.pow(0.9955, 0.05) },
  },

  // Medieval pack — no chroma
  {
    pack: "medieval",
    tokens: 500,
    dupesEnabled: false,
    metric: "legendary",
    expected: {
      opens: 25,
      metricRate: 0.01,
      probability: 1 - Math.pow(0.99, 25),
    },
  },
  {
    pack: "medieval",
    tokens: 500,
    dupesEnabled: false,
    metric: "chroma",
    expected: { opens: 25, metricRate: 0, probability: 0 },
  },

  // Aquatic pack — two legendaries
  {
    pack: "aquatic",
    tokens: 500,
    dupesEnabled: false,
    metric: "legendary",
    expected: {
      opens: 25,
      metricRate: 0.007,
      probability: 1 - Math.pow(1 - 0.007, 25),
    },
  },

  // Blizzard pack — 25-tkn cost, seasonal
  {
    pack: "blizzard",
    tokens: 500,
    dupesEnabled: false,
    metric: "chroma",
    expected: {
      opens: 20,
      metricRate: 0.0005,
      probability: 1 - Math.pow(1 - 0.0005, 20),
    },
  },

  // Lunch pack — 25-tkn cost, Legendary Sandwich at 0.65%
  {
    pack: "lunch",
    tokens: 500,
    dupesEnabled: false,
    metric: "legendary",
    expected: {
      opens: 20,
      metricRate: 0.0065,
      probability: 1 - Math.pow(1 - 0.0065, 20),
    },
  },
];

/* ─── Per-rarity golden data ─── */

export interface RarityGoldenCase {
  pack: PackSlug;
  rarity: string;
  expectedRate: number;
}

export const RARITY_GOLDEN: RarityGoldenCase[] = [
  // Space pack
  { pack: "space", rarity: "Uncommon", expectedRate: 0.75 },
  { pack: "space", rarity: "Rare", expectedRate: 0.20 },
  { pack: "space", rarity: "Epic", expectedRate: 0.045 },
  { pack: "space", rarity: "Legendary", expectedRate: 0.0045 },
  { pack: "space", rarity: "Chroma", expectedRate: 0.0005 },

  // Medieval pack
  { pack: "medieval", rarity: "Uncommon", expectedRate: 0.67 },
  { pack: "medieval", rarity: "Rare", expectedRate: 0.27 },
  { pack: "medieval", rarity: "Epic", expectedRate: 0.05 },
  { pack: "medieval", rarity: "Legendary", expectedRate: 0.01 },
  { pack: "medieval", rarity: "Chroma", expectedRate: 0 },

  // Aquatic pack
  { pack: "aquatic", rarity: "Uncommon", expectedRate: 0.75 },
  { pack: "aquatic", rarity: "Rare", expectedRate: 0.183 },
  { pack: "aquatic", rarity: "Epic", expectedRate: 0.06 },
  { pack: "aquatic", rarity: "Legendary", expectedRate: 0.007 },
  { pack: "aquatic", rarity: "Chroma", expectedRate: 0 },
];

/* ─── LLM-as-judge test cases ─── */

export interface LLMJudgeCase {
  question: string;
  goldenAnswer: string | number;
  contextPages: string[];
  category: "numerical" | "factual" | "comparative";
}

export const LLM_JUDGE_CASES: LLMJudgeCase[] = [
  {
    question: "How many Space packs can I open with 500 tokens?",
    goldenAnswer: 25,
    contextPages: ["/", "/calculators/token-converter"],
    category: "numerical",
  },
  {
    question: "What is the drop rate for Legendary in the Space pack?",
    goldenAnswer: "0.45%",
    contextPages: ["/space-box-odds", "/calculators/pack-odds"],
    category: "numerical",
  },
  {
    question: "What is the chance of getting at least one Legendary from 500 tokens in Space pack?",
    goldenAnswer: "10.57%",
    contextPages: ["/", "/calculators/chase"],
    category: "numerical",
  },
  {
    question: "Does the Medieval pack have any Chroma blooks?",
    goldenAnswer: "No",
    contextPages: ["/medieval-box-odds"],
    category: "factual",
  },
  {
    question: "How much does the Blizzard pack cost per open?",
    goldenAnswer: 25,
    contextPages: ["/blizzard-box-odds", "/packs"],
    category: "numerical",
  },
  {
    question: "Which pack has the best ROI for Legendary hunting?",
    goldenAnswer: "Medieval (1%/20tkn = 0.05% per token)",
    contextPages: ["/calculators/roi"],
    category: "comparative",
  },
  {
    question: "How many Colored Astronauts are in the Space pack rotation?",
    goldenAnswer: 7,
    contextPages: ["/space-box-odds", "/blooks/chroma"],
    category: "numerical",
  },
  {
    question: "What is the Chroma drop rate in the Space pack?",
    goldenAnswer: "0.05%",
    contextPages: ["/space-box-odds"],
    category: "numerical",
  },
  {
    question: "How many tokens do I need for a 90% chance at a Chroma from Space pack?",
    goldenAnswer: "9210",
    contextPages: ["/calculators/chase"],
    category: "numerical",
  },
  {
    question: "What is the sell value of a Legendary blook?",
    goldenAnswer: 200,
    contextPages: ["/value-guide", "/calculators/value"],
    category: "numerical",
  },
];
