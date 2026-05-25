// Background service worker — handles calculation requests from content script
// NOTE: Chrome MV3 service workers cannot use ES module imports from shared chunks.
// All calculation logic is self-contained here.

/* ─── Inline pack data (minimal subset needed for widget) ─── */
const PACK_MAP: Record<string, { id: string; costPerPull: number; effectiveCost: number; featuredBlooks: { id: string; name: string; rarity: string; dropRate: number; sellValue: number; rotationGroup?: string }[] }> = {
  space:       { id: "space",       costPerPull: 20, effectiveCost: 17, featuredBlooks: [
    { id: "purple-slime", name: "Purple Slime", rarity: "Uncommon", dropRate: 0.15, sellValue: 5 },
    { id: "pink-slime", name: "Pink Slime", rarity: "Uncommon", dropRate: 0.15, sellValue: 5 },
    { id: "lime-slime", name: "Lime Slime", rarity: "Uncommon", dropRate: 0.15, sellValue: 5 },
    { id: "red-slime", name: "Red Slime", rarity: "Uncommon", dropRate: 0.15, sellValue: 5 },
    { id: "cyan-slime", name: "Cyan Slime", rarity: "Rare", dropRate: 0.1, sellValue: 5 },
    { id: "blue-slime", name: "Blue Slime", rarity: "Rare", dropRate: 0.1, sellValue: 5 },
    { id: "yellow-slime", name: "Yellow Slime", rarity: "Rare", dropRate: 0.1, sellValue: 5 },
    { id: "orange-slime", name: "Orange Slime", rarity: "Rare", dropRate: 0.1, sellValue: 5 },
    { id: "black-slime", name: "Black Slime", rarity: "Epic", dropRate: 0.05, sellValue: 20 },
    { id: "alien", name: "Alien", rarity: "Epic", dropRate: 0.05, sellValue: 20 },
    { id: "astronaut", name: "Astronaut", rarity: "Legendary", dropRate: 0.03, sellValue: 200 },
    { id: "chroma-astronaut", name: "Chroma Astronaut", rarity: "Chroma", dropRate: 0.03, sellValue: 300, rotationGroup: "astronaut" },
  ]},
  medieval:    { id: "medieval",    costPerPull: 20, effectiveCost: 17, featuredBlooks: [
    { id: "wizard", name: "Wizard", rarity: "Legendary", dropRate: 0.03, sellValue: 200 },
  ]},
  aquatic:     { id: "aquatic",     costPerPull: 20, effectiveCost: 17, featuredBlooks: [
    { id: "megladon", name: "Megalodon", rarity: "Legendary", dropRate: 0.03, sellValue: 250 },
  ]},
  lunch:       { id: "lunch",       costPerPull: 25, effectiveCost: 21, featuredBlooks: [] },
  bug:         { id: "bug",         costPerPull: 25, effectiveCost: 21, featuredBlooks: [] },
  pirate:      { id: "pirate",      costPerPull: 25, effectiveCost: 21, featuredBlooks: [] },
  breakfast:   { id: "breakfast",   costPerPull: 20, effectiveCost: 17, featuredBlooks: [] },
  bot:         { id: "bot",         costPerPull: 20, effectiveCost: 17, featuredBlooks: [] },
  safari:      { id: "safari",      costPerPull: 20, effectiveCost: 17, featuredBlooks: [] },
  dino:        { id: "dino",        costPerPull: 25, effectiveCost: 21, featuredBlooks: [] },
  wonderland:  { id: "wonderland",  costPerPull: 20, effectiveCost: 17, featuredBlooks: [] },
  outback:     { id: "outback",     costPerPull: 25, effectiveCost: 21, featuredBlooks: [] },
  "ice-monster": { id: "ice-monster", costPerPull: 25, effectiveCost: 21, featuredBlooks: [] },
};

/* ─── Inline calculation helpers ─── */
function clampProbability(v: number) { return Math.min(1, Math.max(0, v)); }

function formatPercent(probability: number): string {
  const pct = clampProbability(probability) * 100;
  if (pct >= 99.995) return `${pct.toFixed(2)}%`;
  if (pct > 0 && pct < 0.01) return "<0.01%";
  return `${pct.toFixed(2)}%`;
}

interface BlookEntry { id: string; name: string; rarity: string; dropRate: number; sellValue: number; rotationGroup?: string }

function getEffectiveBlooks(blooks: BlookEntry[]) {
  const seen = new Set<string>();
  return blooks.filter((b) => {
    if (!b.rotationGroup) return true;
    if (seen.has(b.rotationGroup)) return false;
    seen.add(b.rotationGroup);
    return true;
  });
}

function getRarityRate(packId: string, rarity: string): number {
  const pack = PACK_MAP[packId];
  if (!pack) return 0;
  return getEffectiveBlooks(pack.featuredBlooks)
    .filter((b) => b.rarity === rarity)
    .reduce((s, b) => s + b.dropRate, 0);
}

type OddsMetric = "epicPlus" | "legendary" | "chroma";

function getMetricRate(pack: { id: string; costPerPull: number }, metric: OddsMetric): number {
  if (metric === "epicPlus") return getRarityRate(pack.id, "Epic") + getRarityRate(pack.id, "Legendary") + getRarityRate(pack.id, "Chroma");
  if (metric === "legendary") return getRarityRate(pack.id, "Legendary");
  return getRarityRate(pack.id, "Chroma");
}

function calculateOpenCount(tokens: number, costPerPull: number): number {
  return Math.max(0, tokens) / costPerPull;
}

function calculateMetricProbability(pack: { id: string; costPerPull: number }, tokens: number, metric: OddsMetric): number {
  const rate = getMetricRate(pack, metric);
  const attempts = calculateOpenCount(tokens, pack.costPerPull);
  if (rate <= 0 || attempts <= 0) return 0;
  return clampProbability(1 - Math.pow(1 - rate, attempts));
}

/* ─── Message handler ─── */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "calc") {
    const { tokens, packId, metric } = message as {
      tokens: number;
      packId: string;
      metric: string;
    };

    const pack = PACK_MAP[packId];
    if (!pack) {
      sendResponse({ pct: "\u2014", pulls: 0 });
      return;
    }

    const pulls = Math.floor(calculateOpenCount(tokens, pack.costPerPull));
    const probability = calculateMetricProbability(
      pack,
      tokens,
      (metric || "legendary") as OddsMetric,
    );

    sendResponse({
      pct: formatPercent(probability),
      pulls,
    });
  }

  // Return true to indicate async response (not needed here but good practice)
  return false;
});

/* ─── Extension installed/updated handler ─── */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    defaultPack: "space",
    defaultTokens: 500,
    defaultMetric: "legendary",
  });
});
