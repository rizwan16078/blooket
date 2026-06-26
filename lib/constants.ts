import type { Blook, PackRecord, Rarity } from "@/types";

export const LAST_UPDATED = "2026-06-15";

export const SELL_VALUES: Record<Rarity, number> = {
  Common: 2,
  Uncommon: 5,
  Rare: 20,
  Epic: 75,
  Legendary: 200,
  Chroma: 300,
};

export const RARITY_DESIGN = {
  Common: { color: "slate", glow: false },
  Uncommon: { color: "emerald", glow: false },
  Rare: { color: "sky", glow: false },
  Epic: { color: "violet", glow: true },
  Legendary: { color: "amber", glow: true },
  Chroma: { color: "teal", glow: true },
} as const satisfies Record<Rarity, { color: string; glow: boolean }>;

type BlookSeed = {
  name: string;
  rarity: Rarity;
  dropRatePercent: number;
  sellValue?: number;
  imageUrl?: string;
  rotationGroup?: string;
};

type PackSeed = {
  id: string;
  name: string;
  route: string;
  themeColor: string;
  accent: PackRecord["accent"];
  costPerPull: number;
  isLocked: boolean;
  summary: string;
  description: string;
  blooks: BlookSeed[];
};

const PACK_SEEDS: PackSeed[] = [
  {
    id: "space",
    name: "Space",
    route: "/space-box-odds",
    themeColor: "#38bdf8",
    accent: { from: "#38bdf8", to: "#8b5cf6", glow: "#60a5fa" },
    costPerPull: 20,
    isLocked: false,
    summary:
      "The Space Pack is a full-time 20-token market pack with seven rotating Colored Astronaut chromas, with only one active astronaut color available at a time.",
    description:
      "Space is one of the signature Blooket packs. It mixes four uncommons, two rares, one epic, one legendary, and seven rotating Colored Astronaut chromas. Only one Colored Astronaut is active on a given day, so pack-level chroma math is capped at the live 0.05% rotation rate.",
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
    route: "/medieval-box-odds",
    themeColor: "#f59e0b",
    accent: { from: "#f59e0b", to: "#ef4444", glow: "#fb923c" },
    costPerPull: 20,
    isLocked: false,
    summary:
      "The Medieval Pack is a full-time 20-token market pack built around fantasy blooks and one unicorn-to-king chase ladder.",
    description:
      "Medieval includes five uncommons, three rares, one epic, and one legendary. It does not currently include an obtainable Chroma.",
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
    route: "/aquatic-box-odds",
    themeColor: "#14b8a6",
    accent: { from: "#22d3ee", to: "#14b8a6", glow: "#2dd4bf" },
    costPerPull: 20,
    isLocked: false,
    summary:
      "The Aquatic Pack is a full-time 20-token market pack with two legendary shark pulls at the top of the table.",
    description:
      "Aquatic includes five uncommons, three rares, two epics, and two legendaries. Megalodon keeps its higher 250-token sell value.",
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
    route: "/blizzard-box-odds",
    themeColor: "#93c5fd",
    accent: { from: "#93c5fd", to: "#c4b5fd", glow: "#bfdbfe" },
    costPerPull: 25,
    isLocked: true,
    summary:
      "The Blizzard Pack is a seasonal 25-token pack with two obtainable chromas in the current table.",
    description:
      "Blizzard includes five uncommons, four rares, one epic, one legendary, and two chromas. Retired holiday pulls are excluded from the current obtainable lineup.",
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
    route: "/lunch-box-odds",
    themeColor: "#fb7185",
    accent: { from: "#fb7185", to: "#f59e0b", glow: "#fda4af" },
    costPerPull: 25,
    isLocked: false,
    summary:
      "The Lunch Pack is a full-time 25-token market pack with one chroma and one legendary hidden inside the cafeteria lineup.",
    description:
      "Lunch includes four uncommons, three rares, one epic, one legendary, and one chroma. Half a Sandwich is the pack's Chroma pull.",
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
    route: "/bug-box-odds",
    themeColor: "#84cc16",
    accent: { from: "#84cc16", to: "#22c55e", glow: "#a3e635" },
    costPerPull: 25,
    isLocked: false,
    summary:
      "The Bug Pack is a full-time 25-token market pack with one chroma butterfly at the top of the bug ladder.",
    description:
      "Bug includes four uncommons, two rares, one epic, one legendary, and one chroma. The Blue Butterfly is the rarest pull in the pack.",
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
    route: "/pirate-box-odds",
    themeColor: "#f97316",
    accent: { from: "#f97316", to: "#dc2626", glow: "#fb923c" },
    costPerPull: 25,
    isLocked: false,
    summary:
      "The Pirate Pack is a full-time 25-token market pack with one chroma pirate fish and a deep uncommon pool.",
    description:
      "Pirate includes five uncommons, two rares, one epic, one legendary, and one chroma. Captain Blackbeard is the main legendary chase.",
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
    route: "/breakfast-box-odds",
    themeColor: "#fbbf24",
    accent: { from: "#fbbf24", to: "#f97316", glow: "#fde68a" },
    costPerPull: 20,
    isLocked: false,
    summary:
      "The Breakfast Pack is a full-time 20-token market pack with a broad uncommon pool and no obtainable Chroma.",
    description:
      "Breakfast includes six uncommons, two rares, and two epics. It does not currently have a legendary or chroma pull in the obtainable lineup.",
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
    route: "/bot-box-odds",
    themeColor: "#60a5fa",
    accent: { from: "#60a5fa", to: "#6366f1", glow: "#93c5fd" },
    costPerPull: 20,
    isLocked: false,
    summary:
      "The Bot Pack is a full-time 20-token market pack with one legendary robot at the top and no obtainable Chroma.",
    description:
      "Bot includes four uncommons, two rares, one epic, and one legendary. Mega Bot is the top pull in the current lineup.",
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
    route: "/safari-box-odds",
    themeColor: "#facc15",
    accent: { from: "#facc15", to: "#84cc16", glow: "#fde047" },
    costPerPull: 20,
    isLocked: false,
    summary:
      "The Safari Pack is a full-time 20-token market pack with one chroma panda and a wide animal roster.",
    description:
      "Safari includes five uncommons, three rares, one epic, one legendary, and one chroma. Rainbow Panda is the top collector chase.",
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
    route: "/dino-box-odds",
    themeColor: "#65a30d",
    accent: { from: "#65a30d", to: "#f59e0b", glow: "#a3e635" },
    costPerPull: 25,
    isLocked: false,
    summary:
      "The Dino Pack is a full-time 25-token market pack with one legendary dinosaur and no obtainable Chroma.",
    description:
      "Dino includes four uncommons, two rares, one epic, and one legendary. Tyrannosaurus Rex is the rarest obtainable pull in the current lineup.",
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
    route: "/spooky-box-odds",
    themeColor: "#a855f7",
    accent: { from: "#a855f7", to: "#f97316", glow: "#c084fc" },
    costPerPull: 25,
    isLocked: true,
    summary:
      "The Spooky Pack is a seasonal 25-token pack with two obtainable chromas in the current Halloween lineup.",
    description:
      "Spooky includes five uncommons, five rares, one epic, one legendary, and two chromas. Retired Halloween exclusives are not included in the current obtainable lineup.",
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
    route: "/wonderland-box-odds",
    themeColor: "#ec4899",
    accent: { from: "#ec4899", to: "#8b5cf6", glow: "#f9a8d4" },
    costPerPull: 20,
    isLocked: false,
    summary:
      "The Wonderland Pack is a full-time 20-token market pack with one legendary and no obtainable Chroma.",
    description:
      "Wonderland includes five uncommons, three rares, two epics, and one legendary. King of Hearts is the top obtainable pull.",
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
    route: "/outback-box-odds",
    themeColor: "#f97316",
    accent: { from: "#f97316", to: "#eab308", glow: "#fdba74" },
    costPerPull: 25,
    isLocked: false,
    summary:
      "The Outback Pack is a full-time 25-token market pack with one chroma platypus and a strong legendary sugar glider chase.",
    description:
      "Outback includes four uncommons, three rares, one epic, one legendary, and one chroma. Teal Platypus is the rarest pull in the pack.",
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
    route: "/ice-monster-box-odds",
    themeColor: "#67e8f9",
    accent: { from: "#67e8f9", to: "#60a5fa", glow: "#a5f3fc" },
    costPerPull: 25,
    isLocked: false,
    summary:
      "The Ice Monster Pack is a full-time 25-token market pack with three obtainable chromas in the current lineup.",
    description:
      "Ice Monster includes four uncommons, two rares, one epic, one legendary, and three chromas. The pack has one of the widest top-end seasonal-style chase ladders in the shop.",
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
    route: "/autumn-box-odds",
    themeColor: "#f59e0b",
    accent: { from: "#f59e0b", to: "#b45309", glow: "#fdba74" },
    costPerPull: 25,
    isLocked: true,
    summary:
      "The Autumn Pack is a seasonal 25-token pack with one current chroma and one retired chroma excluded from the obtainable lineup.",
    description:
      "Autumn includes four uncommons, three rares, one epic, one legendary, and one chroma in the current lineup. Golden Pumpkin Pie is retired and not counted in the active drop table.",
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

function makeBlookId(packId: string, name: string) {
  return `${packId}-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;
}

function toProbability(dropRatePercent: number) {
  return Number((dropRatePercent / 100).toFixed(6));
}

function resolveSellValue(blook: BlookSeed) {
  return blook.sellValue ?? SELL_VALUES[blook.rarity];
}

function getBlookImageUrl(name: string) {
  if (name === "Two of Spades") return "/packs/twoOfSpades.svg";
  if (name === "UFO") return "/packs/UFO.svg";
  if (name === "Black Bear") return "/packs/bear.svg";
  if (name === "Half a Sandwich") return "/packs/halfasandwich.svg";
  if (name === "Rhino Beetle") return "/packs/rhinobeetle.svg";
  if (name === "Treasure Map") return "/packs/treasuremap.svg";
  if (name === "Santa's Sleigh") return "/packs/santassleigh.svg";
  if (name === "Peppermint Bark") return "/packs/peppermintbark.svg";
  if (name === "Chilly Chameleon") return "/packs/chillychameleon.svg";
  if (name === "Blue Butterfly") return "/packs/bluebutterfly.svg";
  if (name === "Tyrannosaurus Rex") return "/packs/tyrannosaurusrex.svg";
  if (name === "Vampire Bat") return "/packs/vampirebat.svg";
  if (name === "Skeleton Fish") return "/packs/skeletonfish.svg";
  if (name === "Super Glider") return "/packs/superglider.svg";
  if (name === "Sugar Glider") return "/packs/sugarGlider.svg";
  if (name === "Teal Platypus") return "/packs/tealPlatypus.svg";
  if (name === "Rainbow Panda") return "/packs/rainbowPanda.svg";
  if (name === "Dino Egg") return "/packs/dinoEgg.svg";
  if (name === "Dino Fossil") return "/packs/dinoFossil.svg";
  if (name === "Caramel Apple") return "/packs/caramelApple.svg";
  if (name === "Candy Corn") return "/packs/candyCorn.svg";
  if (name === "Ice Bat") return "/packs/iceBat.svg";
  if (name === "Ice Bug") return "/packs/iceBug.svg";
  if (name === "Ice Elemental") return "/packs/iceElemental.svg";
  if (name === "Rock Monster") return "/packs/rockMonster.svg";
  if (name === "Bush Monster") return "/packs/bushMonster.svg";
  if (name === "Ice Slime") return "/packs/iceSlime.svg";
  if (name === "Frozen Fossil") return "/packs/frozenFossil.svg";
  if (name === "Ice Crab") return "/packs/iceCrab.svg";
  if (name === "Autumn Cat") return "/packs/autumncat.svg";
  if (name === "Pumpkin Puppy") return "/packs/pumpkinPuppy.svg";
  if (name === "Red Squirrel") return "/packs/redsquirrel.svg";
  if (name === "Autumn Crow") return "/packs/autumnCrow.svg";
  if (name === "Captain Blackbeard") return "/packs/captainBlackbeard.svg";
  if (name === "Jolly Pirate") return "/packs/jollyPirate.svg";
  if (name === "Pirate Ship") return "/packs/pirateShip.svg";
  if (name === "Polar Bear") return "/packs/polarBear.svg";
  if (name === "Pumpkin Pie") return "/packs/pumpkin.svg";
  if (name === "Spooky Pumpkin") return "/packs/spookyPumpkin.svg";
  if (name === "Spooky Ghost") return "/packs/spookyGhost.svg";
  if (name === "Spooky Mummy") return "/packs/spookyMummy.svg";
  if (name === "White Rabbit") return "/packs/whiteRabbit.svg";
  if (name === "Breakfast Combo") return "/packs/breakfastCombo.svg";
  if (name === "French Toast") return "/packs/frenchToast.svg";
  if (name === "Hot Chocolate") return "/packs/hotChocolate.svg";
  if (name === "Orange Juice") return "/packs/orangeJuice.svg";
  if (name === "Holiday Gift") return "/packs/holidayGift.svg";
  if (name === "Holiday Wreath") return "/packs/holidayWreath.svg";
  if (name === "Snow Globe") return "/packs/snowGlobe.svg";
  if (name === "Tropical Globe") return "/packs/tropicalGlobe.svg";
  if (name === "Gingerbread House") return "/packs/gingerbreadHouse.svg";
  if (name === "Gingerbread Man") return "/packs/gingerbreadMan.svg";
  if (name === "Frost Wreath") return "/packs/frostWreath.svg";
  if (name === "Lime Astronaut") return "/packs/limeAstronaut.svg";
  if (name === "Captain Blackbeard") return "/packs/captainBlackbeard.svg";
  if (name === "Pirate Pufferfish") return "/packs/pufferfish.svg";
  if (name === "Mega Bot") return "/packs/megaBot.svg";
  if (name === "Megalodon") return "/packs/megalodon.svg";
  if (name === "Slime Monster") return "/packs/slimeMonster.svg";
  if (name === "Swamp Monster") return "/packs/swampMonster.svg";
  if (name === "King of Hearts") return "/packs/kingOfHearts.svg";
  if (name === "Queen of Hearts") return "/packs/queenOfHearts.svg";
  if (name === "Cheshire Cat") return "/packs/cheshireCat.svg";
  if (name === "Mad Hatter") return "/packs/madHatter.svg";
  if (name === "Drink Me") return "/packs/drinkMe.svg";
  if (name === "Eat Me") return "/packs/eatMe.svg";
  if (name === "Old Boot") return "/packs/oldBoot.svg";
  if (name === "Baby Shark") return "/packs/babyShark.svg";
  if (name === "Happy Bot") return "/packs/happyBot.svg";
  if (name === "Lil Bot") return "/packs/lilBot.svg";
  if (name === "Lovely Bot") return "/packs/lovelyBot.svg";
  if (name === "Brainy Bot") return "/packs/brainyBot.svg";
  if (name === "Buddy Bot") return "/packs/buddyBot.svg";
  if (name === "Angry Bot") return "/packs/angryBot.svg";
  
  const camelCase = name
    .replace(/[']/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");

  return `/packs/${camelCase}.svg`;
}

function buildBlooksForPack(pack: PackSeed) {
  return pack.blooks.map((blook) => {
    const sellValue = resolveSellValue(blook);

    return {
      id: makeBlookId(pack.id, blook.name),
      packId: pack.id,
      name: blook.name,
      rarity: blook.rarity,
      dropRate: toProbability(blook.dropRatePercent),
      imageUrl: blook.imageUrl ?? getBlookImageUrl(blook.name),
      sellValue,
      description: `${blook.name} is an official ${blook.rarity.toLowerCase()} ${pack.name} Pack blook with a ${blook.dropRatePercent}% drop rate and ${sellValue} token sell value.`,
      rotationGroup: blook.rotationGroup,
    } satisfies Blook;
  });
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

function calculateAverageSellValue(blooks: Blook[]) {
  return Number(
    getEffectiveBlooks(blooks)
      .reduce((sum, blook) => sum + blook.dropRate * blook.sellValue, 0)
      .toFixed(3),
  );
}

function calculateEffectiveCost(costPerPull: number, blooks: Blook[]) {
  return Number((costPerPull - calculateAverageSellValue(blooks)).toFixed(3));
}

const PACK_IMAGE_MAP: Record<string, string> = {
  space: "/images/spacepack.webp",
  medieval: "/images/medievalpack.webp",
  aquatic: "/images/aquaticpack.webp",
  blizzard: "/images/blizzard.webp",
  lunch: "/images/lunchpack.webp",
  bug: "/images/bugpack.webp",
  pirate: "/icon.svg",
  breakfast: "/images/breakfastpack.webp",
  bot: "/images/botpack.webp",
  safari: "/images/safaripack.webp",
  dino: "/images/dinopack.webp",
  spooky: "/icon.svg",
  wonderland: "/images/wonderlandpack.webp",
  outback: "/images/outbackpack.webp",
  "ice-monster": "/images/icepack.webp",
  autumn: "/icon.svg",
};

const BLOOKS_BY_PACK = Object.fromEntries(
  PACK_SEEDS.map((pack) => [pack.id, buildBlooksForPack(pack)]),
) as Record<string, Blook[]>;

export const PACKS: PackRecord[] = PACK_SEEDS.map((pack) => {
  const blooks = BLOOKS_BY_PACK[pack.id];

  return {
    id: pack.id,
    name: pack.name,
    imageUrl: PACK_IMAGE_MAP[pack.id] ?? "/icon.svg",
    themeColor: pack.themeColor,
    costPerPull: pack.costPerPull,
    effectiveCost: calculateEffectiveCost(pack.costPerPull, blooks),
    route: pack.route,
    isLocked: pack.isLocked,
    lastUpdated: LAST_UPDATED,
    source: "iBlooket calculator + Blooket Wiki",
    summary: pack.summary,
    description: pack.description,
    accent: pack.accent,
  };
});

export const BLOOKS: Blook[] = PACK_SEEDS.flatMap(
  (pack) => BLOOKS_BY_PACK[pack.id],
);

export const PACK_MAP = Object.fromEntries(
  PACKS.map((pack) => [pack.id, pack]),
) as Record<(typeof PACKS)[number]["id"], PackRecord>;

export const BLOOK_MAP = Object.fromEntries(
  BLOOKS.map((blook) => [blook.id, blook]),
) as Record<(typeof BLOOKS)[number]["id"], Blook>;

export const PACK_BLOOKS_MAP = Object.fromEntries(
  PACKS.map((pack) => [pack.id, BLOOKS_BY_PACK[pack.id]]),
) as Record<(typeof PACKS)[number]["id"], Blook[]>;

export const UNLOCKED_PACKS = PACKS.filter((pack) => !pack.isLocked);
export const LOCKED_PACKS = PACKS.filter((pack) => pack.isLocked);
