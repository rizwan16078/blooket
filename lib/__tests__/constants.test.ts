import { describe, expect, it } from "vitest";

import { BLOOKS, PACKS, PACK_BLOOKS_MAP, SELL_VALUES, LAST_UPDATED } from "@/lib/constants";
import type { Rarity } from "@/types";

/* ─── Snapshot tests — catches unexpected data changes ─── */

describe("Constants snapshots", () => {
  it("pack IDs are stable", () => {
    const ids = PACKS.map((p) => p.id);
    expect(ids).toMatchSnapshot("pack-ids");
  });

  it("pack costs are stable", () => {
    const costs = Object.fromEntries(PACKS.map((p) => [p.id, p.costPerPull]));
    expect(costs).toMatchSnapshot("pack-costs");
  });

  it("SELL_VALUES are stable", () => {
    expect(SELL_VALUES).toMatchSnapshot("sell-values");
  });

  it("blook count is stable", () => {
    expect(BLOOKS.length).toMatchSnapshot("blook-count");
  });

  it("pack blook counts are stable", () => {
    const counts = Object.fromEntries(
      PACKS.map((p) => [p.id, PACK_BLOOKS_MAP[p.id].length]),
    );
    expect(counts).toMatchSnapshot("pack-blook-counts");
  });
});

/* ─── Structural invariants ─── */

describe("Constants structural invariants", () => {
  it("every pack has at least one blook", () => {
    for (const pack of PACKS) {
      expect(PACK_BLOOKS_MAP[pack.id].length).toBeGreaterThan(0);
    }
  });

  it("every blook references a valid pack", () => {
    const packIds = new Set(PACKS.map((p) => p.id));
    for (const blook of BLOOKS) {
      expect(packIds.has(blook.packId)).toBe(true);
    }
  });

  it("no duplicate blook IDs", () => {
    const ids = BLOOKS.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("LAST_UPDATED is a valid ISO date", () => {
    expect(() => new Date(LAST_UPDATED)).not.toThrow();
    expect(new Date(LAST_UPDATED).getFullYear()).toBeGreaterThanOrEqual(2024);
  });

  it("all rarities in SELL_VALUES are covered", () => {
    const rarities: Rarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Chroma"];
    for (const r of rarities) {
      expect(SELL_VALUES[r]).toBeDefined();
      expect(SELL_VALUES[r]).toBeGreaterThan(0);
    }
  });

  it("sell values increase with rarity", () => {
    expect(SELL_VALUES.Common).toBeLessThan(SELL_VALUES.Uncommon);
    expect(SELL_VALUES.Uncommon).toBeLessThan(SELL_VALUES.Rare);
    expect(SELL_VALUES.Rare).toBeLessThan(SELL_VALUES.Epic);
    expect(SELL_VALUES.Epic).toBeLessThan(SELL_VALUES.Legendary);
    expect(SELL_VALUES.Legendary).toBeLessThan(SELL_VALUES.Chroma);
  });
});
