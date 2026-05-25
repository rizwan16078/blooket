import type { Blook, Pack, PackRecord, Rarity, RarityKey } from "@/types";

/* ─── Sell values ──────────────────────────────────────────────── */

export const SELL_VALUES: Record<Rarity, number> = {
  Common: 2,
  Uncommon: 5,
  Rare: 20,
  Epic: 75,
  Legendary: 200,
  Chroma: 300,
};

/* ─── Blook seeds (raw data from main site) ────────────────────── */

type BlookSeed = {
  name: string;
  rarity: Rarity;
  dropRatePercent: number;
  sellValue?: number;
  rotationGroup?: string;
};

type PackSeed = {
  id: string;
  name: string;
  themeColor: string;
  accent: PackRecord["accent"];
  costPerPull: number;
  isLocked: boolean;
  blooks: BlookSeed[];
};

const PACK_SEEDS: PackSeed[] = [
  {
    id: "space",
    name: "Space",
    themeColor: "#38bdf8",
    accent: { from: "#38bdf8", to: "#8b5cf6", glow: "#60a5fa" },
    costPerPull: 20,
    isLocked: false,
    blooks: [
      { name: "Earth", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Meteor", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Stars", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Alien", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Planet", rarity: "Rare", dropRatePercent: 10 },
      { name: "UFO", rarity: "Rare", dropRatePercent: 10 },
      { name: "Spaceship", rarity: "Epic", dropRatePercent: 4.5 },
      { name: "Astronaut", rarity: "Legendary", dropRatePercent: 0.45 },
      { name: "Pink Astronaut", rarity: "Chroma", dropRatePercent: 0.05, rotationGroup: "space-colored-astronaut" },
      { name: "Yellow Astronaut", rarity: "Chroma", dropRatePercent: 0.05, rotationGroup: "space-colored-astronaut" },
      { name: "Black Astronaut", rarity: "Chroma", dropRatePercent: 0.05, rotationGroup: "space-colored-astronaut" },
      { name: "Orange Astronaut", rarity: "Chroma", dropRatePercent: 0.05, rotationGroup: "space-colored-astronaut" },
      { name: "Red Astronaut", rarity: "Chroma", dropRatePercent: 0.05, rotationGroup: "space-colored-astronaut" },
      { name: "Brown Astronaut", rarity: "Chroma", dropRatePercent: 0.05, rotationGroup: "space-colored-astronaut" },
      { name: "Green Astronaut", rarity: "Chroma", dropRatePercent: 0.05, rotationGroup: "space-colored-astronaut" },
    ],
  },
  {
    id: "medieval",
    name: "Medieval",
    themeColor: "#f59e0b",
    accent: { from: "#f59e0b", to: "#ef4444", glow: "#fb923c" },
    costPerPull: 20,
    isLocked: false,
    blooks: [
      { name: "Witch", rarity: "Uncommon", dropRatePercent: 13.4 },
      { name: "Wizard", rarity: "Uncommon", dropRatePercent: 13.4 },
      { name: "Elf", rarity: "Uncommon", dropRatePercent: 13.4 },
      { name: "Fairy", rarity: "Uncommon", dropRatePercent: 13.4 },
      { name: "Slime Monster", rarity: "Uncommon", dropRatePercent: 13.4 },
      { name: "Jester", rarity: "Rare", dropRatePercent: 9 },
      { name: "Dragon", rarity: "Rare", dropRatePercent: 9 },
      { name: "Queen", rarity: "Rare", dropRatePercent: 9 },
      { name: "Unicorn", rarity: "Epic", dropRatePercent: 5 },
      { name: "King", rarity: "Legendary", dropRatePercent: 1 },
    ],
  },
  {
    id: "aquatic",
    name: "Aquatic",
    themeColor: "#14b8a6",
    accent: { from: "#22d3ee", to: "#14b8a6", glow: "#2dd4bf" },
    costPerPull: 20,
    isLocked: false,
    blooks: [
      { name: "Old Boot", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Jellyfish", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Clownfish", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Frog", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Crab", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Pufferfish", rarity: "Rare", dropRatePercent: 6.1 },
      { name: "Blobfish", rarity: "Rare", dropRatePercent: 6.1 },
      { name: "Octopus", rarity: "Rare", dropRatePercent: 6.1 },
      { name: "Narwhal", rarity: "Epic", dropRatePercent: 3 },
      { name: "Dolphin", rarity: "Epic", dropRatePercent: 3 },
      { name: "Baby Shark", rarity: "Legendary", dropRatePercent: 0.5 },
      { name: "Megalodon", rarity: "Legendary", dropRatePercent: 0.2, sellValue: 250 },
    ],
  },
  {
    id: "blizzard",
    name: "Blizzard",
    themeColor: "#93c5fd",
    accent: { from: "#93c5fd", to: "#c4b5fd", glow: "#bfdbfe" },
    costPerPull: 25,
    isLocked: true,
    blooks: [
      { name: "Snow Globe", rarity: "Uncommon", dropRatePercent: 14.5 },
      { name: "Holiday Gift", rarity: "Uncommon", dropRatePercent: 14.5 },
      { name: "Hot Chocolate", rarity: "Uncommon", dropRatePercent: 14.5 },
      { name: "Holiday Wreath", rarity: "Uncommon", dropRatePercent: 14.5 },
      { name: "Stocking", rarity: "Uncommon", dropRatePercent: 14.5 },
      { name: "Gingerbread Man", rarity: "Rare", dropRatePercent: 5.55 },
      { name: "Gingerbread House", rarity: "Rare", dropRatePercent: 5.55 },
      { name: "Reindeer", rarity: "Rare", dropRatePercent: 5.55 },
      { name: "Santa's Sleigh", rarity: "Rare", dropRatePercent: 5.55 },
      { name: "Snowman", rarity: "Epic", dropRatePercent: 4.25 },
      { name: "Santa Claus", rarity: "Legendary", dropRatePercent: 1 },
      { name: "Peppermint Bark", rarity: "Chroma", dropRatePercent: 0.03 },
      { name: "Chilly Chameleon", rarity: "Chroma", dropRatePercent: 0.02 },
    ],
  },
  {
    id: "lunch",
    name: "Lunch",
    themeColor: "#fb7185",
    accent: { from: "#fb7185", to: "#f59e0b", glow: "#fda4af" },
    costPerPull: 25,
    isLocked: false,
    blooks: [
      { name: "Bananas", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Watermelon", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Cheese", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Doughnut", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Taco", rarity: "Rare", dropRatePercent: 7 },
      { name: "Bao", rarity: "Rare", dropRatePercent: 7 },
      { name: "Sushi", rarity: "Rare", dropRatePercent: 7 },
      { name: "Cheeseburger", rarity: "Epic", dropRatePercent: 3.31 },
      { name: "Sandwich", rarity: "Legendary", dropRatePercent: 0.65 },
      { name: "Half a Sandwich", rarity: "Chroma", dropRatePercent: 0.04 },
    ],
  },
  {
    id: "bug",
    name: "Bug",
    themeColor: "#84cc16",
    accent: { from: "#84cc16", to: "#22c55e", glow: "#a3e635" },
    costPerPull: 25,
    isLocked: false,
    blooks: [
      { name: "Ant", rarity: "Uncommon", dropRatePercent: 19.625 },
      { name: "Rhino Beetle", rarity: "Uncommon", dropRatePercent: 19.625 },
      { name: "Ladybug", rarity: "Uncommon", dropRatePercent: 19.625 },
      { name: "Fly", rarity: "Uncommon", dropRatePercent: 19.625 },
      { name: "Worm", rarity: "Rare", dropRatePercent: 9 },
      { name: "Bee", rarity: "Rare", dropRatePercent: 9 },
      { name: "Mantis", rarity: "Epic", dropRatePercent: 2.97 },
      { name: "Butterfly", rarity: "Legendary", dropRatePercent: 0.5 },
      { name: "Blue Butterfly", rarity: "Chroma", dropRatePercent: 0.03 },
    ],
  },
  {
    id: "pirate",
    name: "Pirate",
    themeColor: "#f97316",
    accent: { from: "#f97316", to: "#dc2626", glow: "#fb923c" },
    costPerPull: 25,
    isLocked: false,
    blooks: [
      { name: "Deckhand", rarity: "Uncommon", dropRatePercent: 16 },
      { name: "Buccaneer", rarity: "Uncommon", dropRatePercent: 16 },
      { name: "Swashbuckler", rarity: "Uncommon", dropRatePercent: 16 },
      { name: "Treasure Map", rarity: "Uncommon", dropRatePercent: 16 },
      { name: "Seagull", rarity: "Uncommon", dropRatePercent: 16 },
      { name: "Jolly Pirate", rarity: "Rare", dropRatePercent: 8 },
      { name: "Pirate Ship", rarity: "Rare", dropRatePercent: 8 },
      { name: "Kraken", rarity: "Epic", dropRatePercent: 3.67 },
      { name: "Captain Blackbeard", rarity: "Legendary", dropRatePercent: 0.3 },
      { name: "Pirate Pufferfish", rarity: "Chroma", dropRatePercent: 0.03 },
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast",
    themeColor: "#fbbf24",
    accent: { from: "#fbbf24", to: "#f97316", glow: "#fde68a" },
    costPerPull: 20,
    isLocked: false,
    blooks: [
      { name: "Toast", rarity: "Uncommon", dropRatePercent: 12.5 },
      { name: "Cereal", rarity: "Uncommon", dropRatePercent: 12.5 },
      { name: "Yogurt", rarity: "Uncommon", dropRatePercent: 12.5 },
      { name: "Breakfast Combo", rarity: "Uncommon", dropRatePercent: 12.5 },
      { name: "Orange Juice", rarity: "Uncommon", dropRatePercent: 12.5 },
      { name: "Milk", rarity: "Uncommon", dropRatePercent: 12.5 },
      { name: "Waffle", rarity: "Rare", dropRatePercent: 9 },
      { name: "Pancakes", rarity: "Rare", dropRatePercent: 9 },
      { name: "French Toast", rarity: "Epic", dropRatePercent: 5 },
      { name: "Pizza", rarity: "Epic", dropRatePercent: 2 },
    ],
  },
  {
    id: "bot",
    name: "Bot",
    themeColor: "#60a5fa",
    accent: { from: "#60a5fa", to: "#6366f1", glow: "#93c5fd" },
    costPerPull: 20,
    isLocked: false,
    blooks: [
      { name: "Lil Bot", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Lovely Bot", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Angry Bot", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Happy Bot", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Watson", rarity: "Rare", dropRatePercent: 9 },
      { name: "Buddy Bot", rarity: "Rare", dropRatePercent: 9 },
      { name: "Brainy Bot", rarity: "Epic", dropRatePercent: 3.7 },
      { name: "Mega Bot", rarity: "Legendary", dropRatePercent: 0.3 },
    ],
  },
  {
    id: "safari",
    name: "Safari",
    themeColor: "#facc15",
    accent: { from: "#facc15", to: "#84cc16", glow: "#fde047" },
    costPerPull: 20,
    isLocked: false,
    blooks: [
      { name: "Panda", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Sloth", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Tenrec", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Flamingo", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Zebra", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Elephant", rarity: "Rare", dropRatePercent: 7 },
      { name: "Lemur", rarity: "Rare", dropRatePercent: 7 },
      { name: "Peacock", rarity: "Rare", dropRatePercent: 7 },
      { name: "Chameleon", rarity: "Epic", dropRatePercent: 3.48 },
      { name: "Lion", rarity: "Legendary", dropRatePercent: 0.5 },
      { name: "Rainbow Panda", rarity: "Chroma", dropRatePercent: 0.02 },
    ],
  },
  {
    id: "dino",
    name: "Dino",
    themeColor: "#65a30d",
    accent: { from: "#65a30d", to: "#f59e0b", glow: "#a3e635" },
    costPerPull: 25,
    isLocked: false,
    blooks: [
      { name: "Amber", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Dino Egg", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Dino Fossil", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Stegosaurus", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Velociraptor", rarity: "Rare", dropRatePercent: 9 },
      { name: "Brontosaurus", rarity: "Rare", dropRatePercent: 9 },
      { name: "Triceratops", rarity: "Epic", dropRatePercent: 3.7 },
      { name: "Tyrannosaurus Rex", rarity: "Legendary", dropRatePercent: 0.3 },
    ],
  },
  {
    id: "spooky",
    name: "Spooky",
    themeColor: "#a855f7",
    accent: { from: "#a855f7", to: "#f97316", glow: "#c084fc" },
    costPerPull: 25,
    isLocked: true,
    blooks: [
      { name: "Pumpkin", rarity: "Uncommon", dropRatePercent: 15.2 },
      { name: "Swamp Monster", rarity: "Uncommon", dropRatePercent: 15.2 },
      { name: "Frankenstein", rarity: "Uncommon", dropRatePercent: 15.2 },
      { name: "Vampire", rarity: "Uncommon", dropRatePercent: 15.2 },
      { name: "Zombie", rarity: "Uncommon", dropRatePercent: 15.2 },
      { name: "Mummy", rarity: "Rare", dropRatePercent: 4 },
      { name: "Caramel Apple", rarity: "Rare", dropRatePercent: 4 },
      { name: "Candy Corn", rarity: "Rare", dropRatePercent: 4 },
      { name: "Crow", rarity: "Rare", dropRatePercent: 4 },
      { name: "Vampire Bat", rarity: "Rare", dropRatePercent: 4 },
      { name: "Werewolf", rarity: "Epic", dropRatePercent: 3.29 },
      { name: "Ghost", rarity: "Legendary", dropRatePercent: 0.65 },
      { name: "Skeleton Fish", rarity: "Chroma", dropRatePercent: 0.04 },
      { name: "Super Glider", rarity: "Chroma", dropRatePercent: 0.02 },
    ],
  },
  {
    id: "wonderland",
    name: "Wonderland",
    themeColor: "#ec4899",
    accent: { from: "#ec4899", to: "#8b5cf6", glow: "#f9a8d4" },
    costPerPull: 20,
    isLocked: false,
    blooks: [
      { name: "Two of Spades", rarity: "Uncommon", dropRatePercent: 15.2 },
      { name: "Eat Me", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Drink Me", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Alice", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Queen of Hearts", rarity: "Uncommon", dropRatePercent: 15 },
      { name: "Dormouse", rarity: "Rare", dropRatePercent: 6.5 },
      { name: "White Rabbit", rarity: "Rare", dropRatePercent: 6.5 },
      { name: "Cheshire Cat", rarity: "Rare", dropRatePercent: 6.5 },
      { name: "Caterpillar", rarity: "Epic", dropRatePercent: 2.5 },
      { name: "Mad Hatter", rarity: "Epic", dropRatePercent: 2.5 },
      { name: "King of Hearts", rarity: "Legendary", dropRatePercent: 0.3 },
    ],
  },
  {
    id: "outback",
    name: "Outback",
    themeColor: "#f97316",
    accent: { from: "#f97316", to: "#eab308", glow: "#fdba74" },
    costPerPull: 25,
    isLocked: false,
    blooks: [
      { name: "Dingo", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Echidna", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Koala", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Kookaburra", rarity: "Uncommon", dropRatePercent: 18.75 },
      { name: "Platypus", rarity: "Rare", dropRatePercent: 7 },
      { name: "Joey", rarity: "Rare", dropRatePercent: 7 },
      { name: "Kangaroo", rarity: "Rare", dropRatePercent: 7 },
      { name: "Crocodile", rarity: "Epic", dropRatePercent: 3.6 },
      { name: "Sugar Glider", rarity: "Legendary", dropRatePercent: 0.37 },
      { name: "Teal Platypus", rarity: "Chroma", dropRatePercent: 0.03 },
    ],
  },
  {
    id: "ice-monster",
    name: "Ice Monster",
    themeColor: "#67e8f9",
    accent: { from: "#67e8f9", to: "#60a5fa", glow: "#a5f3fc" },
    costPerPull: 25,
    isLocked: false,
    blooks: [
      { name: "Ice Bat", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Ice Bug", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Ice Elemental", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Rock Monster", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Dink", rarity: "Rare", dropRatePercent: 8.5 },
      { name: "Donk", rarity: "Rare", dropRatePercent: 8.5 },
      { name: "Bush Monster", rarity: "Epic", dropRatePercent: 4.5 },
      { name: "Yeti", rarity: "Legendary", dropRatePercent: 0.35 },
      { name: "Ice Slime", rarity: "Chroma", dropRatePercent: 0.08 },
      { name: "Frozen Fossil", rarity: "Chroma", dropRatePercent: 0.05 },
      { name: "Ice Crab", rarity: "Chroma", dropRatePercent: 0.02 },
    ],
  },
  {
    id: "autumn",
    name: "Autumn",
    themeColor: "#f59e0b",
    accent: { from: "#f59e0b", to: "#b45309", glow: "#fdba74" },
    costPerPull: 25,
    isLocked: true,
    blooks: [
      { name: "Black Bear", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Pumpkin Pie", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Chipmunk", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Cornucopia", rarity: "Uncommon", dropRatePercent: 19.5 },
      { name: "Autumn Cat", rarity: "Rare", dropRatePercent: 6 },
      { name: "Pumpkin Puppy", rarity: "Rare", dropRatePercent: 6 },
      { name: "Red Squirrel", rarity: "Rare", dropRatePercent: 6 },
      { name: "Autumn Crow", rarity: "Epic", dropRatePercent: 2.95 },
      { name: "Turkey", rarity: "Legendary", dropRatePercent: 1 },
      { name: "Goldfinch", rarity: "Chroma", dropRatePercent: 0.05 },
    ],
  },
];

/* ─── Build runtime data ───────────────────────────────────────── */

const RARITY_KEY_MAP: Record<Rarity, RarityKey> = {
  Common: "common",
  Uncommon: "uncommon",
  Rare: "rare",
  Epic: "epic",
  Legendary: "legendary",
  Chroma: "chroma",
};

function makeBlookId(packId: string, name: string) {
  return `${packId}-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
}

function toProbability(pct: number) {
  return Number((pct / 100).toFixed(6));
}

function getEffectiveBlooks(blooks: Blook[]) {
  const seen = new Set<string>();
  return blooks.filter((b) => {
    if (!b.rotationGroup) return true;
    if (seen.has(b.rotationGroup)) return false;
    seen.add(b.rotationGroup);
    return true;
  });
}

function buildDropRates(blooks: Blook[]): Record<RarityKey, number> {
  const rates: Record<RarityKey, number> = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, chroma: 0 };
  for (const b of getEffectiveBlooks(blooks)) {
    rates[RARITY_KEY_MAP[b.rarity]] += b.dropRate;
  }
  return rates;
}

function buildAvgSellValue(blooks: Blook[]) {
  return Number(getEffectiveBlooks(blooks).reduce((s, b) => s + b.dropRate * b.sellValue, 0).toFixed(3));
}

function calcEffectiveCost(costPerPull: number, blooks: Blook[]) {
  return Number((costPerPull - buildAvgSellValue(blooks)).toFixed(3));
}

function buildBlooksForPack(pack: PackSeed): Blook[] {
  return pack.blooks.map((b) => ({
    id: makeBlookId(pack.id, b.name),
    packId: pack.id,
    name: b.name,
    rarity: b.rarity,
    dropRate: toProbability(b.dropRatePercent),
    sellValue: b.sellValue ?? SELL_VALUES[b.rarity],
    rotationGroup: b.rotationGroup,
  }));
}

// Build all packs with computed fields
const BLOOKS_BY_PACK: Record<string, Blook[]> = {};
for (const seed of PACK_SEEDS) {
  BLOOKS_BY_PACK[seed.id] = buildBlooksForPack(seed);
}

export const PACKS: Pack[] = PACK_SEEDS.map((seed) => {
  const blooks = BLOOKS_BY_PACK[seed.id];
  return {
    id: seed.id,
    name: seed.name,
    costPerPull: seed.costPerPull,
    effectiveCost: calcEffectiveCost(seed.costPerPull, blooks),
    isLocked: seed.isLocked,
    themeColor: seed.themeColor,
    accent: seed.accent,
    featuredBlooks: blooks,
    dropRates: buildDropRates(blooks),
    avgSellValue: buildAvgSellValue(blooks),
  };
});

export const PACK_MAP: Record<string, Pack> = Object.fromEntries(PACKS.map((p) => [p.id, p]));

export const BLOOKS: Blook[] = PACK_SEEDS.flatMap((s) => BLOOKS_BY_PACK[s.id]);

export const UNLOCKED_PACKS = PACKS.filter((p) => !p.isLocked);
