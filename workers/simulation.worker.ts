import {
  MAX_RERUNS_PER_SESSION,
  MONTE_CARLO_ITERATIONS,
  calculateSimulationOpenCount,
} from "@/lib/math";
import type {
  Blook,
  SimulatedLootItem,
  SimulationWorkerInput,
  SimulationWorkerOutput,
} from "@/types";

let hasSimulatedAtLeastOnce = false;
let sessionRerunCount = 0;

function quantile(sortedValues: number[], percentile: number) {
  if (sortedValues.length === 0) {
    return 0;
  }

  const index = Math.max(
    0,
    Math.min(sortedValues.length - 1, Math.floor(percentile * (sortedValues.length - 1))),
  );

  return sortedValues[index];
}

function weightedPick(blooks: Blook[]) {
  const roll = Math.random();
  let cumulativeWeight = 0;

  for (const blook of blooks) {
    cumulativeWeight += blook.dropRate;

    if (roll <= cumulativeWeight) {
      return blook;
    }
  }

  return blooks[blooks.length - 1];
}

function createSimulatedRun(blooks: Blook[], pullCount: number) {
  const run: SimulatedLootItem[] = [];

  for (let index = 0; index < pullCount; index += 1) {
    const selectedBlook = weightedPick(blooks);

    run.push({
      id: selectedBlook.id,
      name: selectedBlook.name,
      rarity: selectedBlook.rarity,
      imageUrl: selectedBlook.imageUrl,
    });
  }

  return run;
}

self.onmessage = (event: MessageEvent<SimulationWorkerInput>) => {
  const { pack, blooks, tokens, dupesEnabled, targetRarity } = event.data;
  const pullCount = Math.max(
    0,
    calculateSimulationOpenCount(tokens, pack, dupesEnabled),
  );
  const outcomes: number[] = [];
  let totalRefundTokens = 0;
  let totalTargetHits = 0;

  for (let iteration = 0; iteration < MONTE_CARLO_ITERATIONS; iteration += 1) {
    let refundTokens = 0;
    let targetHits = 0;

    for (let pullIndex = 0; pullIndex < pullCount; pullIndex += 1) {
      const selectedBlook = weightedPick(blooks);
      refundTokens += selectedBlook.sellValue;

      if (selectedBlook.rarity === targetRarity) {
        targetHits += 1;
      }
    }

    totalRefundTokens += refundTokens;
    totalTargetHits += targetHits;
    outcomes.push(refundTokens);
  }

  if (hasSimulatedAtLeastOnce) {
    sessionRerunCount += 1;
  } else {
    hasSimulatedAtLeastOnce = true;
  }

  outcomes.sort((left, right) => left - right);
  const simulatedRun = createSimulatedRun(blooks, pullCount);
  const result: SimulationWorkerOutput = {
    expectedTokens: totalRefundTokens / MONTE_CARLO_ITERATIONS,
    p10BestCase: quantile(outcomes, 0.9),
    p90WorstCase: quantile(outcomes, 0.1),
    simulatedRun,
    rerunAllowed: sessionRerunCount < MAX_RERUNS_PER_SESSION,
    rerunCount: sessionRerunCount,
  };

  void totalTargetHits;
  self.postMessage(result);
};

export {};
