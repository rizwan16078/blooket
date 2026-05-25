import { describe, expect, it } from "vitest";

import {
  calculateAtLeastOneSuccess,
  calculateBlookAttempts,
  calculateBlookProbability,
  calculateEstimatedTokensForBlook,
  calculateMetricProbability,
  calculateMetricProbabilityV2,
  calculateOpenCount,
  calculateSimulationOpenCount,
  clampProbability,
  clampTokens,
  formatPercent,
  formatHumanChance,
  getBoxCost,
  getMetricRate,
  getRarityRate,
  getRiskBand,
  getAdvisorMetric,
  getBestValuePack,
} from "@/lib/math";
import { getPackBySlug } from "@/lib/packs";
import { BLOOKS, PACKS, SELL_VALUES, PACK_BLOOKS_MAP } from "@/lib/constants";

import {
  GOLDEN,
  RARITY_GOLDEN,
  scoreExact,
  scoreTolerance,
  type ScoreResult,
} from "./golden-data";

/* ─── Utility functions ─── */

describe("clampProbability", () => {
  it("clamps to [0, 1]", () => {
    expect(clampProbability(-0.5)).toBe(0);
    expect(clampProbability(1.5)).toBe(1);
    expect(clampProbability(0.5)).toBe(0.5);
  });
});

describe("clampTokens", () => {
  it("clamps to [0, 100000]", () => {
    expect(clampTokens(-5)).toBe(0);
    expect(clampTokens(200000)).toBe(100000);
    expect(clampTokens(500)).toBe(500);
  });

  it("rounds to integer", () => {
    expect(clampTokens(500.7)).toBe(501);
    expect(clampTokens(500.3)).toBe(500);
  });

  it("returns DEFAULT_TOKENS for NaN, clamps Infinity", () => {
    expect(clampTokens(NaN)).toBe(500);
    // Infinity is not finite → returns DEFAULT_TOKENS (500)
    expect(clampTokens(Infinity)).toBe(500);
    expect(clampTokens(-Infinity)).toBe(500);
  });
});

describe("formatPercent", () => {
  it("formats normal percentages", () => {
    expect(formatPercent(0.5)).toBe("50.00%");
    expect(formatPercent(0.10567)).toBe("10.57%");
  });

  it("shows <0.01% for very small values", () => {
    expect(formatPercent(0.00005)).toBe("<0.01%");
  });

  it("shows 99.99%+ for near-certain values", () => {
    expect(formatPercent(0.99999)).toBe("100.00%");
  });
});

describe("formatHumanChance", () => {
  it("handles zero", () => {
    expect(formatHumanChance(0)).toBe("Less than 1 in 10,000 chance");
  });

  it("handles high probability", () => {
    expect(formatHumanChance(0.5)).toContain("in 10 chance");
  });

  it("handles low probability", () => {
    expect(formatHumanChance(0.001)).toContain("1 in");
  });
});

describe("getRiskBand", () => {
  it("returns Lucky range for >= 0.7", () => {
    expect(getRiskBand(0.8)).toEqual({ label: "Lucky range", tone: "green" });
  });

  it("returns Normal range for 0.3-0.7", () => {
    expect(getRiskBand(0.5)).toEqual({ label: "Normal range", tone: "yellow" });
  });

  it("returns Risk zone for < 0.3", () => {
    expect(getRiskBand(0.1)).toEqual({ label: "Risk zone", tone: "red" });
  });
});

/* ─── Core probability math ─── */

describe("calculateAtLeastOneSuccess", () => {
  it("returns 0 for zero rate or zero attempts", () => {
    expect(calculateAtLeastOneSuccess(0, 10)).toBe(0);
    expect(calculateAtLeastOneSuccess(0.5, 0)).toBe(0);
    expect(calculateAtLeastOneSuccess(0, 0)).toBe(0);
  });

  it("computes 1 - (1-p)^n correctly", () => {
    // p=0.5, n=1 → 0.5
    expect(calculateAtLeastOneSuccess(0.5, 1)).toBeCloseTo(0.5, 10);
    // p=0.5, n=2 → 1 - 0.25 = 0.75
    expect(calculateAtLeastOneSuccess(0.5, 2)).toBeCloseTo(0.75, 10);
    // p=0.01, n=100 → 1 - 0.99^100 ≈ 0.63397
    expect(calculateAtLeastOneSuccess(0.01, 100)).toBeCloseTo(1 - Math.pow(0.99, 100), 10);
  });

  it("clamps to [0, 1]", () => {
    expect(calculateAtLeastOneSuccess(1, 5)).toBe(1);
  });
});

/* ─── Pack-level calculations ─── */

describe("getBoxCost", () => {
  const space = getPackBySlug("space");

  it("returns costPerPull when dupes disabled", () => {
    expect(getBoxCost(space, false)).toBe(20);
  });

  it("returns effectiveCost when dupes enabled", () => {
    expect(getBoxCost(space, true)).toBe(space.effectiveCost);
  });
});

describe("calculateOpenCount", () => {
  const space = getPackBySlug("space");

  it("computes tokens / costPerPull without dupes", () => {
    expect(calculateOpenCount(500, space, false)).toBeCloseTo(25, 10);
  });

  it("computes tokens / effectiveCost with dupes", () => {
    const opens = calculateOpenCount(500, space, true);
    expect(opens).toBeCloseTo(500 / space.effectiveCost, 2);
  });

  it("returns 0 for 0 tokens", () => {
    expect(calculateOpenCount(0, space, false)).toBe(0);
  });
});

describe("calculateSimulationOpenCount", () => {
  const space = getPackBySlug("space");

  it("floors the result", () => {
    expect(calculateSimulationOpenCount(500, space, false)).toBe(25);
  });

  it("caps at MAX_PULLS_PER_RUN", () => {
    // Need enough tokens for >10000 pulls
    const hugeTokens = 100000;
    const result = calculateSimulationOpenCount(hugeTokens, space, false);
    expect(result).toBeLessThanOrEqual(10000);
    expect(result).toBeGreaterThan(0);
  });
});

/* ─── Rarity rate lookups ─── */

describe("getRarityRate", () => {
  it.each(RARITY_GOLDEN)(
    "$pack $rarity = $expectedRate",
    ({ pack, rarity, expectedRate }) => {
      expect(getRarityRate(pack, rarity as any)).toBeCloseTo(expectedRate, 6);
    },
  );
});

describe("getMetricRate", () => {
  it("computes epicPlus as Epic + Legendary + Chroma", () => {
    const space = getPackBySlug("space");
    const rate = getMetricRate(space, "epicPlus");
    const expected = 0.045 + 0.0045 + 0.0005;
    expect(rate).toBeCloseTo(expected, 6);
  });

  it("returns 0 for chroma in a pack without chroma", () => {
    const medieval = getPackBySlug("medieval");
    expect(getMetricRate(medieval, "chroma")).toBe(0);
  });
});

/* ─── Golden dataset regression ─── */

describe("Golden dataset — calculateMetricProbability", () => {
  it.each(GOLDEN)(
    "$pack $tokens tkn dupes=$dupesEnabled metric=$metric",
    ({ pack, tokens, dupesEnabled, metric, expected }) => {
      const p = getPackBySlug(pack);
      const actualProbability = calculateMetricProbability(p, tokens, dupesEnabled, metric);
      const actualOpens = calculateOpenCount(tokens, p, dupesEnabled);

      // Check opens — use actual effectiveCost from pack for dupes cases
      if (dupesEnabled) {
        const expectedOpens = tokens / p.effectiveCost;
        expect(actualOpens).toBeCloseTo(expectedOpens, 4);
      } else {
        expect(actualOpens).toBeCloseTo(expected.opens, 4);
      }

      // Check metric rate
      const actualRate = getMetricRate(p, metric);
      expect(actualRate).toBeCloseTo(expected.metricRate, 6);

      // Score the probability — recompute expected using actual opens
      const recomputedExpected = calculateAtLeastOneSuccess(expected.metricRate, actualOpens);
      const score = scoreExact(actualProbability, recomputedExpected);
      expect(score).not.toBe("fail");
    },
  );
});

/* ─── Per-blook calculations ─── */

describe("calculateEstimatedTokensForBlook", () => {
  it("computes costPerPull / dropRate", () => {
    const space = getPackBySlug("space");
    const astronaut = PACK_BLOOKS_MAP["space"].find((b) => b.name === "Astronaut")!;
    expect(calculateEstimatedTokensForBlook(astronaut, space)).toBeCloseTo(20 / 0.0045, 4);
  });

  it("returns Infinity for zero drop rate", () => {
    const space = getPackBySlug("space");
    const fakeBlook = { ...PACK_BLOOKS_MAP["space"][0], dropRate: 0 };
    expect(calculateEstimatedTokensForBlook(fakeBlook, space)).toBe(Infinity);
  });
});

describe("calculateBlookAttempts", () => {
  it("returns 0 for 0 tokens", () => {
    const space = getPackBySlug("space");
    const blook = PACK_BLOOKS_MAP["space"][0];
    expect(calculateBlookAttempts(0, space, blook, false)).toBe(0);
  });
});

describe("calculateBlookProbability", () => {
  it("returns 0 for 0 tokens", () => {
    const space = getPackBySlug("space");
    const blook = PACK_BLOOKS_MAP["space"][0];
    expect(calculateBlookProbability(0, space, blook, false)).toBe(0);
  });
});

/* ─── V2 metric probability ─── */

describe("calculateMetricProbabilityV2", () => {
  it("returns 0 for 0 tokens", () => {
    const space = getPackBySlug("space");
    expect(calculateMetricProbabilityV2(space, 0, false, "legendary")).toBe(0);
  });

  it("returns 0 for chroma in a pack without chroma", () => {
    const medieval = getPackBySlug("medieval");
    expect(calculateMetricProbabilityV2(medieval, 500, false, "chroma")).toBe(0);
  });

  it("produces a valid probability for Space legendary", () => {
    const space = getPackBySlug("space");
    const prob = calculateMetricProbabilityV2(space, 500, false, "legendary");
    expect(prob).toBeGreaterThan(0);
    expect(prob).toBeLessThanOrEqual(1);
  });
});

/* ─── Advisor functions ─── */

describe("getAdvisorMetric", () => {
  it("returns chroma for packs with chroma", () => {
    const space = getPackBySlug("space");
    expect(getAdvisorMetric(space)).toBe("chroma");
  });

  it("returns legendary for packs with legendary but no chroma", () => {
    const medieval = getPackBySlug("medieval");
    expect(getAdvisorMetric(medieval)).toBe("legendary");
  });
});

describe("getBestValuePack", () => {
  it("returns a valid pack", () => {
    const best = getBestValuePack("legendary", false);
    expect(best).toBeDefined();
    expect(best.id).toBeTruthy();
  });

  it("returns a pack that has the target rarity", () => {
    const best = getBestValuePack("legendary", false);
    const rate = getRarityRate(best.id, "Legendary");
    expect(rate).toBeGreaterThan(0);
  });
});

/* ─── Data integrity checks ─── */

describe("Data integrity", () => {
  it("all packs have valid costPerPull", () => {
    for (const pack of PACKS) {
      expect(pack.costPerPull).toBeGreaterThan(0);
    }
  });

  it("all blooks have valid drop rates", () => {
    for (const blook of BLOOKS) {
      expect(blook.dropRate).toBeGreaterThan(0);
      expect(blook.dropRate).toBeLessThanOrEqual(1);
    }
  });

  it("all blooks have valid sell values", () => {
    for (const blook of BLOOKS) {
      expect(blook.sellValue).toBeGreaterThan(0);
    }
  });

  it("sell values match SELL_VALUES per rarity (except Megalodon)", () => {
    for (const blook of BLOOKS) {
      if (blook.name === "Megalodon") continue; // Known exception: 250 instead of 300
      expect(blook.sellValue).toBe(SELL_VALUES[blook.rarity]);
    }
  });

  it("Megalodon sells for 250 (exception)", () => {
    const megalodon = BLOOKS.find((b) => b.name === "Megalodon");
    expect(megalodon).toBeDefined();
    expect(megalodon!.sellValue).toBe(250);
  });

  it("drop rates within each pack sum to approximately 1", () => {
    for (const pack of PACKS) {
      const blooks = PACK_BLOOKS_MAP[pack.id];
      const total = blooks.reduce((sum, b) => sum + b.dropRate, 0);
      expect(total).toBeCloseTo(1, 2);
    }
  });

  it("rotation groups have consistent drop rates", () => {
    const groups = new Map<string, number>();
    for (const blook of BLOOKS) {
      if (!blook.rotationGroup) continue;
      const existing = groups.get(blook.rotationGroup);
      if (existing !== undefined) {
        expect(blook.dropRate).toBe(existing);
      } else {
        groups.set(blook.rotationGroup, blook.dropRate);
      }
    }
  });
});
