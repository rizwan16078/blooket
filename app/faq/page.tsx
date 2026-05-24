import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket FAQ — Every Question Answered",
  description:
    "Frequently asked questions about Blooket: who made it, how tokens work, how to get Chroma and Legendary blooks, trading, and more. Complete FAQ with calculator links.",
  keywords: [
    "blooket faq",
    "blooket questions",
    "who made blooket",
    "when was blooket created",
    "blooket trading",
    "what is blooket",
    "blooket explained",
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
    languages: {
      "en-US": `${siteUrl}/faq`,
      "x-default": `${siteUrl}/faq`,
    },
  },
  openGraph: {
    title: `Blooket FAQ | ${siteName}`,
    description: "Every question about Blooket answered — tokens, packs, rarities, and more.",
    type: "website",
    url: `${siteUrl}/faq`,
  },
};

const faqEntries = [
  {
    question: "What is Blooket?",
    answer:
      "Blooket is an educational gaming platform where students answer questions to earn tokens, then spend those tokens opening packs to collect blooks of different rarities — Common, Uncommon, Rare, Epic, Legendary, and Chroma. It is used in classrooms as a review tool and has a collection mechanic similar to gacha games.",
    link: "/about",
  },
  {
    question: "Who made Blooket?",
    answer:
      "Blooket was created by Tom Stewart (also known as Tom/BlooketDev). The platform launched in 2020 and has grown into one of the most popular classroom review games in the United States, competing with platforms like Kahoot and Gimkit.",
    link: "/about",
  },
  {
    question: "When was Blooket created?",
    answer:
      "Blooket was founded in 2020. It has since undergone multiple major updates, adding new packs, blooks, game modes, and the Blooket Plus subscription. The pack drop rates and blook roster are updated periodically by the Blooket team.",
    link: "/about",
  },
  {
    question: "How do Blooket tokens work?",
    answer:
      "Tokens are the in-game currency earned by playing Blooket game modes. You spend tokens to open packs, which contain blooks of varying rarity. Each pack costs 20 or 25 tokens per pull. The Blooket Calculator on this site shows the exact probability of pulling each rarity tier for any token budget.",
    link: "/guides/blooket-tokens",
  },
  {
    question: "How do I get free tokens in Blooket?",
    answer:
      "You earn tokens by playing Blooket game modes — the more questions you answer correctly, the more tokens you earn. There is no legitimate way to get infinite or free tokens outside of gameplay. Any 'token hack' is against Blooket's terms of service and risks your account. The best strategy is to play efficiently and spend tokens wisely using probability tools.",
    link: "/guides/blooket-tokens",
  },
  {
    question: "How do I get a Chroma in Blooket?",
    answer:
      "Chroma blooks are the rarest tier in Blooket, with drop rates between 0.01% and 0.08% per pull. To get one, you need to open packs that contain Chromas and have a large token budget. The Chase Calculator shows exactly how many tokens you need for a 50%, 90%, or 99% chance of pulling any specific Chroma.",
    link: "/blooks/chroma",
  },
  {
    question: "How do I get a Legendary in Blooket?",
    answer:
      "Legendary blooks have drop rates between 0.3% and 0.45% per pull. They appear in most packs and are significantly easier to obtain than Chromas. The main calculator shows your cumulative probability of pulling a Legendary for any token budget and pack.",
    link: "/blooks/legendary",
  },
  {
    question: "Is trading coming to Blooket?",
    answer:
      "As of 2026, Blooket does not have a trading system. The Blooket Market allows you to sell duplicate blooks for tokens, but you cannot trade blooks with other players. There is no official announcement about when or if trading will be added.",
    link: "/guides/how-the-blooket-market-works",
  },
  {
    question: "What is the rarest blook in Blooket?",
    answer:
      "The rarest blooks in Blooket are Chromas with a 0.01% drop rate per pull, including the Megalodon (Aquatic Pack) and Tim the Alien (Space Pack rotation). At 0.01%, you need approximately 69,000 tokens for a 50% chance and 230,000 tokens for a 99% chance of pulling one.",
    link: "/blooks/chroma",
  },
  {
    question: "How do drop rates work in Blooket?",
    answer:
      "Each blook in a pack has a fixed drop rate — a percentage chance of being pulled when you open the pack. Drop rates are determined by rarity: Common blooks have the highest rates (50%+), while Chromas have the lowest (0.01–0.08%). The cumulative probability formula (1 - (1 - rate)^attempts) calculates your chance of pulling at least one blook of a given rarity across multiple opens.",
    link: "/guides/blooket-drop-rates",
  },
  {
    question: "What is duplicate resell in Blooket?",
    answer:
      "When you open a pack and pull a blook you already own, you can sell the duplicate for tokens based on its rarity sell value (Common: 2, Uncommon: 5, Rare: 20, Epic: 75, Legendary: 200, Chroma: 300). This refund reduces your effective cost per pull, giving you more opens for the same token budget. The calculator has a 'Dupe Refund' toggle that accounts for this.",
    link: "/glossary",
  },
  {
    question: "What is Blooket Plus and is it worth it?",
    answer:
      "Blooket Plus is a paid subscription that offers cosmetic benefits like custom blook skins, question set folders, and enhanced game reports. It does NOT give you better drop rates, more tokens, or exclusive blooks. Whether it is worth it depends on whether you value the cosmetic and organizational features.",
    link: "/is-blooket-plus-worth-it",
  },
  {
    question: "Which Blooket pack is the best to open?",
    answer:
      "It depends on your goal. For Chroma hunting, the Ice Monster Pack has the highest combined Chroma rate. For Legendary hunting, packs without Chromas (like Bot or Dino) concentrate more probability into Legendary. For overall value, the ROI Calculator ranks every pack by probability per token spent.",
    link: "/guides/best-blooket-pack-to-open",
  },
  {
    question: "How many blooks are in Blooket?",
    answer:
      "There are 172 indexed blooks across 15+ packs, spanning six rarity tiers: Common, Uncommon, Rare, Epic, Legendary, and Chroma. The Blook Library on this site lists every blook with its drop rate, sell value, and pack.",
    link: "/blooks",
  },
];

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "FAQ", item: `${siteUrl}/faq` },
]);

const faqSchema = buildFaqSchema(
  faqEntries.map((entry) => ({
    question: entry.question,
    answer: entry.answer,
  })),
);

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            FAQ
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket FAQ
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Every question answered
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Common questions about Blooket — tokens, packs, rarities, trading,
            and how the math works. Each answer links to a detailed guide or calculator.
          </p>
        </section>

        <div className="mt-10 space-y-6">
          {faqEntries.map((entry, index) => (
            <article
              key={index}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg"
            >
              <h2 className="text-lg font-bold text-white">{entry.question}</h2>
              <p className="mt-3 text-sm leading-7 text-white/60">{entry.answer}</p>
              <div className="mt-4">
                <Link
                  href={entry.link}
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  Learn more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Calculator
          </Link>
          <Link href="/guides" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Guides
          </Link>
          <Link href="/glossary" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Glossary
          </Link>
          <Link href="/about" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            About
          </Link>
        </aside>
      </main>
    </>
  );
}
