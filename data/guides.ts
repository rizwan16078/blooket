export type GuideCategory =
  | "Glossary"
  | "Rarity Hub"
  | "Pack Strategy"
  | "Game Mechanics";

export type GuideEntry = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: GuideCategory;
  publishedAt: string;
  updatedAt: string;
  priority: "high" | "medium" | "low";
  keywords: string[];
};

export const guideEntries: GuideEntry[] = [
  {
    slug: "blooket-drop-rates",
    title: "Blooket Drop Rates Explained",
    excerpt:
      "Understand how single-pull odds turn into real token budgets, pack comparisons, and better decisions before you spend.",
    description:
      "A plain-English guide to Blooket drop rates, pack odds, and the exact math behind at-least-one success probability.",
    category: "Glossary",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "blooket drop rates",
      "blooket odds",
      "blooket probability",
      "blooket calculator",
    ],
  },
  {
    slug: "blooket-tokens",
    title: "Blooket Tokens Guide",
    excerpt:
      "Token budgets decide how many real shots you get at a Legendary or Chroma, so this guide turns coins into useful planning math.",
    description:
      "Learn how Blooket tokens, pack prices, daily caps, and duplicate refunds affect your real collecting strategy.",
    category: "Glossary",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "blooket tokens",
      "blooket token guide",
      "blooket daily token cap",
      "blooket pack costs",
    ],
  },
  {
    slug: "blooket-packs",
    title: "Blooket Packs Guide",
    excerpt:
      "A clean map of how Blooket packs differ by price, rarity ladder, seasonal status, and top-end chase value.",
    description:
      "Browse the main Blooket pack concepts, including live packs, seasonal packs, costs, odds, and how pack structure affects value.",
    category: "Glossary",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "medium",
    keywords: [
      "blooket packs",
      "blooket boxes",
      "blooket pack guide",
    ],
  },
  {
    slug: "blooket-sell-values",
    title: "Blooket Sell Values Guide",
    excerpt:
      "Sell values quietly change the real cost of opening packs, especially once duplicates start piling up.",
    description:
      "See how Blooket sell values work, why duplicate refunds matter, and how to think about effective pack cost.",
    category: "Glossary",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "medium",
    keywords: [
      "blooket sell values",
      "blooket duplicate refund",
      "blooket pack effective cost",
    ],
  },
  {
    slug: "chroma-blooks",
    title: "All Chroma Blooks in Blooket",
    excerpt:
      "The calculator site needs a serious Chroma hub, so this page pulls the full Chroma layer into one crawlable reference.",
    description:
      "Browse Chroma Blooks, their packs, their listed drop rates, and the best packs to target if you are hunting ultra-rare pulls.",
    category: "Rarity Hub",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "chroma blooks",
      "all chroma blooks",
      "blooket chroma",
      "rarest blooks",
    ],
  },
  {
    slug: "legendary-blooks",
    title: "All Legendary Blooks in Blooket",
    excerpt:
      "Legendary intent deserves its own hub because players often search by rarity first and pack name second.",
    description:
      "A central list of Legendary Blooks with their packs, drop rates, and pack-level context for collectors and strategy-minded players.",
    category: "Rarity Hub",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "legendary blooks",
      "all legendary blooks",
      "blooket legendary",
    ],
  },
  {
    slug: "mystical-blooks",
    title: "Mystical Blooks Explained",
    excerpt:
      "Mysticals are one of the biggest confusion points in the Blooket collector vocabulary, so this page clarifies what the calculator can and cannot model.",
    description:
      "Learn what Mystical Blooks are, why they differ from pack pulls, and how they fit into the wider Blooket rarity conversation.",
    category: "Rarity Hub",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "medium",
    keywords: [
      "mystical blooks",
      "blooket mysticals",
      "what is a mystical in blooket",
    ],
  },
  {
    slug: "unique-blooks",
    title: "Unique Blooks Explained",
    excerpt:
      "Unique Blooks sit outside the normal pack-opening loop, which is exactly why they need a dedicated explainer page.",
    description:
      "Understand how Unique Blooks differ from standard pack pulls and why collector terminology matters when you compare rarity pages.",
    category: "Rarity Hub",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "medium",
    keywords: [
      "unique blooks",
      "blooket unique blooks",
      "blooket rarity guide",
    ],
  },
  {
    slug: "hidden-blooks",
    title: "Hidden Blooks Explained",
    excerpt:
      "Hidden Blooks create a lot of search demand and a lot of misinformation, so this page gives the topic a clear, conservative explanation.",
    description:
      "A practical guide to Hidden Blooks, collector terminology, and where they fit relative to pack-based Blook pages.",
    category: "Rarity Hub",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "medium",
    keywords: [
      "hidden blooks",
      "blooket hidden blooks",
      "secret blooks",
    ],
  },
  {
    slug: "best-blooket-pack-to-open",
    title: "Best Blooket Pack to Open",
    excerpt:
      "There is no single best pack for every goal, so this page ranks the best options based on whether you care about Chromas, Legendaries, or steady value.",
    description:
      "Compare the best Blooket packs to open based on top-end rarity odds, token efficiency, and the type of collection goal you actually have.",
    category: "Pack Strategy",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "best blooket pack",
      "best pack to open in blooket",
      "blooket pack comparison",
    ],
  },
  {
    slug: "best-pack-for-chromas",
    title: "Best Blooket Pack for Chromas",
    excerpt:
      "If your only mission is Chroma hunting, the right question is not hype but probability per token.",
    description:
      "See which Blooket packs give you the best Chroma odds and how to compare ultra-rare pulls by budget instead of vibes.",
    category: "Pack Strategy",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "best pack for chromas",
      "blooket chroma odds",
      "chroma hunting blooket",
    ],
  },
  {
    slug: "best-pack-for-legendaries",
    title: "Best Blooket Pack for Legendaries",
    excerpt:
      "Legendary chasing is much more practical than Chroma chasing, but the pack choice still matters a lot.",
    description:
      "Compare the best Blooket packs for Legendary odds using pack-level probability and realistic token budgets.",
    category: "Pack Strategy",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "best pack for legendaries",
      "blooket legendary odds",
      "best legendary pack blooket",
    ],
  },
  {
    slug: "blook-score-explained",
    title: "Blook Score Explained",
    excerpt:
      "Blook Score changes how many players think about collecting, so this page translates the feature into plain collector strategy.",
    description:
      "A player-focused explainer on Blook Score, what it measures, and how it fits into collecting decisions around packs and duplicates.",
    category: "Game Mechanics",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "blook score explained",
      "what is blook score",
      "blooket blook score",
    ],
  },
  {
    slug: "how-to-sell-blooks",
    title: "How to Sell Blooks",
    excerpt:
      "Selling duplicates is a simple action with huge math consequences, because it changes the effective cost of every future pull.",
    description:
      "Learn how selling Blooks works, when duplicate refunds matter most, and how our calculator models that effect.",
    category: "Game Mechanics",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "how to sell blooks",
      "sell blooks",
      "blooket duplicate refund",
    ],
  },
  {
    slug: "how-the-blooket-market-works",
    title: "How the Blooket Market Works",
    excerpt:
      "The Market is where official product reality meets collector strategy, which makes it a critical support page for the calculator cluster.",
    description:
      "Understand how the Blooket Market works, how packs fit into it, and how to use that knowledge to plan your token spending.",
    category: "Game Mechanics",
    publishedAt: "2026-05-24",
    updatedAt: "2026-05-24",
    priority: "high",
    keywords: [
      "blooket market",
      "how the blooket market works",
      "blooket weekly shop",
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guideEntries.find((guide) => guide.slug === slug);
}

