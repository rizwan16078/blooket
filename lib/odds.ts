import { PACKS, getPackBySlug, type PackSlug } from "@/lib/packs";

export const MAX_TOKENS = 100000;
export const DEFAULT_TOKENS = 500;
export const DEFAULT_PACK_SLUG: PackSlug = "space";
export const DEFAULT_DUPE_REFUND = false;
export const SIMULATIONS_TODAY = 18240;
export const DEFAULT_SIMULATION_ITERATIONS = 5000;

export type CalculatorMetricKey = "epicPlus" | "legendary" | "chroma";

export type CalculatorSnapshot = {
  attempts: number;
  costsPerBox: number;
  probabilities: Record<CalculatorMetricKey, number>;
};

type PackMathEngine = {
  costsPerBox: number;
  attempts(tokens: number): number;
  epicPlus(tokens: number): number;
  legendary(tokens: number): number;
  chroma(tokens: number): number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function clampTokens(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_TOKENS;
  }

  return clamp(Math.round(value), 0, MAX_TOKENS);
}

export function atLeastOneSuccess(perTryRate: number, attempts: number) {
  if (perTryRate <= 0 || attempts <= 0) {
    return 0;
  }

  return clamp(1 - Math.pow(1 - perTryRate, attempts));
}

function createPackMath(packSlug: PackSlug, dupeRefund: boolean) {
  const pack = getPackBySlug(packSlug);
  const costsPerBox = dupeRefund ? pack.effectiveCost : pack.costPerPull;
  const epicPlusRate =
    pack.dropRates.epic + pack.dropRates.legendary + pack.dropRates.chroma;

  return {
    costsPerBox,
    attempts(tokens: number) {
      return clampTokens(tokens) / costsPerBox;
    },
    epicPlus(tokens: number) {
      return atLeastOneSuccess(epicPlusRate, this.attempts(tokens));
    },
    legendary(tokens: number) {
      return atLeastOneSuccess(pack.dropRates.legendary, this.attempts(tokens));
    },
    chroma(tokens: number) {
      return atLeastOneSuccess(pack.dropRates.chroma, this.attempts(tokens));
    },
  };
}

export const PRECOMPUTED_PACK_MATH: Record<
  PackSlug,
  {
    standard: PackMathEngine;
    refunded: PackMathEngine;
  }
> = Object.fromEntries(
  PACKS.map((pack) => [
    pack.slug,
    {
      standard: createPackMath(pack.slug, false),
      refunded: createPackMath(pack.slug, true),
    },
  ]),
) as Record<
  PackSlug,
  {
    standard: PackMathEngine;
    refunded: PackMathEngine;
  }
>;

export function getCalculatorSnapshot(
  packSlug: PackSlug,
  tokens: number,
  dupeRefund: boolean,
): CalculatorSnapshot {
  const engine = dupeRefund
    ? PRECOMPUTED_PACK_MATH[packSlug].refunded
    : PRECOMPUTED_PACK_MATH[packSlug].standard;

  return {
    attempts: engine.attempts(tokens),
    costsPerBox: engine.costsPerBox,
    probabilities: {
      epicPlus: engine.epicPlus(tokens),
      legendary: engine.legendary(tokens),
      chroma: engine.chroma(tokens),
    },
  };
}

export function formatPercent(value: number) {
  const safeValue = clamp(value);
  const percent = safeValue * 100;

  if (safeValue > 0 && percent < 0.01) {
    return "<0.01%";
  }

  if (percent >= 99.995) {
    return "100%";
  }

  if (percent >= 10) {
    return `${percent.toFixed(1)}%`;
  }

  return `${percent.toFixed(2)}%`;
}

export function formatCompactNumber(value: number, digits = 1) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatTokens(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function probabilityOneIn(rate: number) {
  if (rate <= 0) {
    return "N/A";
  }

  return `1 in ${formatCompactNumber(1 / rate, 0)}`;
}
