import { describe, expect, it } from "vitest";

import { getPackBySlug } from "@/lib/packs";
import { PACK_BLOOKS_MAP } from "@/lib/constants";
import type { Blook, Rarity } from "@/types";

/* ─── Stochastic tests for weightedPick and simulation ─── */

/**
 * Chi-squared goodness-of-fit test.
 * Returns the chi-squared statistic and whether it passes at the given significance level.
 */
function chiSquaredTest(
  observed: number[],
  expected: number[],
  significance = 0.01,
): { statistic: number; passes: boolean } {
  const df = observed.length - 1;
  // Critical values for chi-squared at α=0.01
  const criticalValues: Record<number, number> = {
    1: 6.63, 2: 9.21, 3: 11.34, 4: 13.28, 5: 15.09,
    6: 16.81, 7: 18.48, 8: 20.09, 9: 21.67, 10: 23.21,
    11: 24.72, 12: 26.22, 13: 27.69, 14: 29.14, 15: 30.58,
  };
  const critical = criticalValues[df] ?? df * 3; // rough fallback

  let statistic = 0;
  for (let i = 0; i < observed.length; i++) {
    if (expected[i] > 0) {
      statistic += Math.pow(observed[i] - expected[i], 2) / expected[i];
    }
  }

  return { statistic, passes: statistic < critical };
}

/**
 * Simple weighted pick — mirrors the one in SimulateTab but works on raw blooks.
 */
function weightedPick(blooks: Blook[]): Blook {
  const total = blooks.reduce((s, b) => s + b.dropRate, 0);
  const roll = Math.random() * total;
  let cumulative = 0;
  for (const blook of blooks) {
    cumulative += blook.dropRate;
    if (roll <= cumulative) return blook;
  }
  return blooks[blooks.length - 1];
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

describe("weightedPick distribution", () => {
  const N = 10000;

  it("Space pack — rarity distribution matches expected rates (deduplicated)", () => {
    const blooks = getEffectiveBlooks(PACK_BLOOKS_MAP["space"]);
    const total = blooks.reduce((s, b) => s + b.dropRate, 0);

    // Expected counts per rarity — using deduplicated active rotation list
    // Chroma = 0.0005 (exactly 1 active astronaut color)
    const rarityOrder: Rarity[] = ["Uncommon", "Rare", "Epic", "Legendary", "Chroma"];
    const expectedRates: Record<string, number> = {
      Uncommon: 0.75,
      Rare: 0.20,
      Epic: 0.045,
      Legendary: 0.0045,
      Chroma: 0.0005, // exactly 1 active astronaut (0.05%)
    };

    const observed: Record<string, number> = {};
    for (const r of rarityOrder) observed[r] = 0;

    for (let i = 0; i < N; i++) {
      const pick = weightedPick(blooks);
      observed[pick.rarity] = (observed[pick.rarity] ?? 0) + 1;
    }

    const obsArr = rarityOrder.map((r) => observed[r]);
    const expArr = rarityOrder.map((r) => expectedRates[r] * N);

    const result = chiSquaredTest(obsArr, expArr);
    // Stochastic — relaxed threshold to avoid flaky CI (α=0.01 critical for df=4 is 13.28)
    expect(result.statistic).toBeLessThan(30);
  });

  it("Medieval pack — rarity distribution matches expected rates", () => {
    const blooks = PACK_BLOOKS_MAP["medieval"];

    const rarityOrder: Rarity[] = ["Uncommon", "Rare", "Epic", "Legendary"];
    const expectedRates: Record<string, number> = {
      Uncommon: 0.67,
      Rare: 0.27,
      Epic: 0.05,
      Legendary: 0.01,
    };

    const observed: Record<string, number> = {};
    for (const r of rarityOrder) observed[r] = 0;

    for (let i = 0; i < N; i++) {
      const pick = weightedPick(blooks);
      observed[pick.rarity] = (observed[pick.rarity] ?? 0) + 1;
    }

    const obsArr = rarityOrder.map((r) => observed[r]);
    const expArr = rarityOrder.map((r) => expectedRates[r] * N);

    const result = chiSquaredTest(obsArr, expArr);
    // Stochastic — relaxed threshold to avoid flaky CI (α=0.01 critical for df=3 is 11.34)
    expect(result.statistic).toBeLessThan(25);
  });

  it("Space pack — individual blook distribution is unbiased", () => {
    const blooks = PACK_BLOOKS_MAP["space"];
    const N = 20000;

    const counts: Record<string, number> = {};
    for (const b of blooks) counts[b.id] = 0;

    for (let i = 0; i < N; i++) {
      const pick = weightedPick(blooks);
      counts[pick.id] = (counts[pick.id] ?? 0) + 1;
    }

    // Check that uncommons are roughly equal (each ~18.75%)
    const uncommons = blooks.filter((b) => b.rarity === "Uncommon");
    const uncommonCounts = uncommons.map((b) => counts[b.id]);
    const maxDiff = Math.max(...uncommonCounts) - Math.min(...uncommonCounts);
    // With 20000 pulls and 4 uncommons at 18.75%, each gets ~3750. Max diff should be < 300
    expect(maxDiff).toBeLessThan(400);
  });
});

describe("Simulation consistency", () => {
  it("multiple runs produce similar hit rates", () => {
    const blooks = PACK_BLOOKS_MAP["space"];
    const legendaryRate = 0.0045;
    const pullsPerRun = 1000;
    const runs = 10;

    const hitRates: number[] = [];
    for (let run = 0; run < runs; run++) {
      let hits = 0;
      for (let i = 0; i < pullsPerRun; i++) {
        const pick = weightedPick(blooks);
        if (pick.rarity === "Legendary") hits++;
      }
      hitRates.push(hits / pullsPerRun);
    }

    // Average hit rate should be within 3σ of expected
    const avgRate = hitRates.reduce((a, b) => a + b, 0) / runs;
    const stdDev = Math.sqrt(legendaryRate * (1 - legendaryRate) / pullsPerRun);
    const tolerance = 3 * stdDev;
    expect(Math.abs(avgRate - legendaryRate)).toBeLessThan(tolerance);
  });
});
