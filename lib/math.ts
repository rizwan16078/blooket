import { PACKS, PACK_BLOOKS_MAP } from "@/lib/constants";
import { getPackBySlug, type Pack, type PackSlug } from "@/lib/packs";
import type { Blook, Rarity, SimulationWorkerOutput } from "@/types";

export const DEFAULT_PACK_SLUG: PackSlug = "space";
export const DEFAULT_TOKENS = 500;
export const DEFAULT_DUPE_REFUND = false;
export const SLIDER_MAX_TOKENS = 5000;
export const MAX_TOKENS = 100000;
export const MAX_PULLS_PER_RUN = 10000;
export const MONTE_CARLO_ITERATIONS = 5000;
export const CONFETTI_THRESHOLD = 0.999;
export const MAX_RERUNS_PER_SESSION = 5;

export type OddsMetric = "epicPlus" | "legendary" | "chroma";

export type CalculatorProbabilities = Record<OddsMetric, number>;

export type RiskBand = {
  label: "Lucky range" | "Normal range" | "Risk zone";
  tone: "green" | "yellow" | "red";
};

export const METRIC_LABELS: Record<OddsMetric, string> = {
  epicPlus: "Epic+",
  legendary: "Legendary",
  chroma: "Chroma",
};

export const SIMULATION_TARGET_BY_METRIC: Record<OddsMetric, Rarity> = {
  epicPlus: "Epic",
  legendary: "Legendary",
  chroma: "Chroma",
};

export function clampProbability(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function clampTokens(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_TOKENS;
  }

  return Math.min(MAX_TOKENS, Math.max(0, Math.round(value)));
}

export function getPackBlooks(packId: PackSlug) {
  return PACK_BLOOKS_MAP[packId];
}

function getEffectiveBlooks(blooks: Blook[]) {
  const seenRotationGroups = new Set<string>();

  return blooks.filter((blook) => {
    if (!blook.rotationGroup) {
      return true;
    }

    if (seenRotationGroups.has(blook.rotationGroup)) {
      return false;
    }

    seenRotationGroups.add(blook.rotationGroup);
    return true;
  });
}

export function getRarityRate(packId: PackSlug, rarity: Rarity) {
  return getEffectiveBlooks(getPackBlooks(packId))
    .filter((blook) => blook.rarity === rarity)
    .reduce((sum, blook) => sum + blook.dropRate, 0);
}

export function getMetricRate(pack: Pack, metric: OddsMetric) {
  if (metric === "epicPlus") {
    return (
      getRarityRate(pack.id, "Epic") +
      getRarityRate(pack.id, "Legendary") +
      getRarityRate(pack.id, "Chroma")
    );
  }

  if (metric === "legendary") {
    return getRarityRate(pack.id, "Legendary");
  }

  return getRarityRate(pack.id, "Chroma");
}

export function getBoxCost(pack: Pick<Pack, "costPerPull" | "effectiveCost">, dupesEnabled: boolean) {
  return dupesEnabled ? pack.effectiveCost : pack.costPerPull;
}

export function calculateOpenCount(
  tokens: number,
  pack: Pick<Pack, "costPerPull" | "effectiveCost">,
  dupesEnabled: boolean,
) {
  return clampTokens(tokens) / getBoxCost(pack, dupesEnabled);
}

export function calculateSimulationOpenCount(
  tokens: number,
  pack: Pick<Pack, "costPerPull" | "effectiveCost">,
  dupesEnabled: boolean,
) {
  return Math.min(
    MAX_PULLS_PER_RUN,
    Math.floor(calculateOpenCount(tokens, pack, dupesEnabled)),
  );
}

export function calculateAtLeastOneSuccess(rate: number, attempts: number) {
  if (rate <= 0 || attempts <= 0) {
    return 0;
  }

  return clampProbability(1 - Math.pow(1 - rate, attempts));
}

export function calculateMetricProbability(
  pack: Pack,
  tokens: number,
  dupesEnabled: boolean,
  metric: OddsMetric,
) {
  return calculateAtLeastOneSuccess(
    getMetricRate(pack, metric),
    calculateOpenCount(tokens, pack, dupesEnabled),
  );
}

/**
 * iBlooket-compatible per-blook attempt count.
 *
 * iBlooket uses: attempts = tokens / (packPrice + sellValue * dropRate)
 * When dupes/resell is on: attempts = tokens / ((packPrice - avgSellValue) + sellValue * dropRate)
 *
 * This accounts for the sell-back value of each specific blook, giving a
 * per-blook effective cost that differs from the simple tokens/packPrice model.
 */
export function calculateBlookAttempts(
  tokens: number,
  pack: Pack,
  blook: Blook,
  dupesEnabled: boolean,
): number {
  if (tokens <= 0) return 0;
  const baseCost = dupesEnabled ? pack.effectiveCost : pack.costPerPull;
  const effectiveCost = baseCost + blook.sellValue * blook.dropRate;
  if (effectiveCost <= 0) return Infinity;
  return tokens / effectiveCost;
}

/**
 * iBlooket-compatible per-blook probability.
 * P = 1 - (1 - dropRate)^(tokens / effectiveCost)
 */
export function calculateBlookProbability(
  tokens: number,
  pack: Pack,
  blook: Blook,
  dupesEnabled: boolean,
): number {
  const attempts = calculateBlookAttempts(tokens, pack, blook, dupesEnabled);
  return calculateAtLeastOneSuccess(blook.dropRate, attempts);
}

/**
 * iBlooket-compatible aggregate metric probability.
 *
 * Instead of using a single aggregate rate with a single attempt count,
 * this computes per-blook attempt counts and uses the product formula:
 *   P = 1 - ∏(1 - p_i)^(attempts_i)
 *
 * This matches iBlooket's approach where each blook has its own effective
 * cost based on its sell value.
 */
export function calculateMetricProbabilityV2(
  pack: Pack,
  tokens: number,
  dupesEnabled: boolean,
  metric: OddsMetric,
): number {
  const blooks = getEffectiveBlooks(getPackBlooks(pack.id));
  const rarities = metricToRarities(metric);
  const targetBlooks = blooks.filter((b) => rarities.has(b.rarity));

  if (targetBlooks.length === 0 || tokens <= 0) return 0;

  let product = 1;
  for (const blook of targetBlooks) {
    const attempts = calculateBlookAttempts(tokens, pack, blook, dupesEnabled);
    product *= Math.pow(1 - blook.dropRate, attempts);
  }

  return clampProbability(1 - product);
}

function metricToRarities(metric: OddsMetric): Set<Rarity> {
  if (metric === "epicPlus") {
    return new Set(["Epic", "Legendary", "Chroma"] as Rarity[]);
  }
  if (metric === "legendary") {
    return new Set(["Legendary"] as Rarity[]);
  }
  return new Set(["Chroma"] as Rarity[]);
}

export function calculatePackProbabilities(
  pack: Pack,
  tokens: number,
  dupesEnabled: boolean,
): CalculatorProbabilities {
  return {
    epicPlus: calculateMetricProbability(pack, tokens, dupesEnabled, "epicPlus"),
    legendary: calculateMetricProbability(pack, tokens, dupesEnabled, "legendary"),
    chroma: calculateMetricProbability(pack, tokens, dupesEnabled, "chroma"),
  };
}

export function calculateEstimatedTokensForBlook(
  blook: Blook,
  pack: Pick<Pack, "costPerPull">,
) {
  if (blook.dropRate <= 0) {
    return Infinity;
  }

  return pack.costPerPull / blook.dropRate;
}

export function formatPercent(probability: number) {
  const percent = clampProbability(probability) * 100;

  if (percent >= 99.995) {
    return `${percent.toFixed(2)}%`;
  }

  if (percent > 0 && percent < 0.01) {
    return "<0.01%";
  }

  return `${percent.toFixed(2)}%`;
}

export function formatHumanChance(probability: number) {
  const safeProbability = clampProbability(probability);

  if (safeProbability <= 0) {
    return "Less than 1 in 10,000 chance";
  }

  if (safeProbability >= 0.1) {
    const numerator = Math.max(1, Math.min(10, Math.round(safeProbability * 10)));
    return `${numerator} in 10 chance`;
  }

  return `1 in ${Math.max(1, Math.round(1 / safeProbability))} chance`;
}

export function getRiskBand(probability: number): RiskBand {
  const safeProbability = clampProbability(probability);

  if (safeProbability >= 0.7) {
    return { label: "Lucky range", tone: "green" };
  }

  if (safeProbability >= 0.3) {
    return { label: "Normal range", tone: "yellow" };
  }

  return { label: "Risk zone", tone: "red" };
}

export function formatTokenLabel(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value))} tokens`;
}

export function getAdvisorMetric(pack: Pack): OddsMetric {
  if (getRarityRate(pack.id, "Chroma") > 0) {
    return "chroma";
  }

  if (getRarityRate(pack.id, "Legendary") > 0) {
    return "legendary";
  }

  return "epicPlus";
}

export function getSimulationTargetRarity(pack: Pack, blook?: Blook | null): Rarity {
  if (blook && blook.packId === pack.id) {
    return blook.rarity;
  }

  return SIMULATION_TARGET_BY_METRIC[getAdvisorMetric(pack)];
}

export function getBestValuePack(metric: OddsMetric, dupesEnabled: boolean) {
  return PACKS.reduce((bestPack, candidatePack) => {
    const bestScore = getMetricRate(bestPack as Pack, metric) / getBoxCost(bestPack, dupesEnabled);
    const candidateScore =
      getMetricRate(candidatePack as Pack, metric) / getBoxCost(candidatePack, dupesEnabled);

    return candidateScore > bestScore ? (candidatePack as Pack) : (bestPack as Pack);
  }, PACKS[0] as Pack);
}

export function buildAdvisorLine(packSlug: PackSlug, dupesEnabled: boolean) {
  const selectedPack = getPackBySlug(packSlug);
  const targetMetric = getAdvisorMetric(selectedPack);
  const bestValuePack = getBestValuePack(targetMetric, dupesEnabled);

  return `Best value: ${bestValuePack.name} Packs for ${METRIC_LABELS[targetMetric]} efficiency`;
}

export function canRerun(result: Pick<SimulationWorkerOutput, "rerunAllowed"> | null) {
  return Boolean(result?.rerunAllowed);
}
