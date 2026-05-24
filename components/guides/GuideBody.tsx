import Link from "next/link";

import {
  formatRateLabel,
  getBlooksByRarity,
  getLivePacks,
  getPackForBlook,
  getPackMetricRankings,
  getRaritySummary,
  getSeasonalPacks,
} from "@/lib/authority";
import {
  calculateEstimatedTokensForBlook,
  formatPercent,
  formatTokenLabel,
} from "@/lib/math";
import { RARITY_SELL_VALUES } from "@/lib/packs";
import type { Rarity } from "@/types";

export type GuideSource = {
  label: string;
  href: string;
};

export type GuidePageContent = {
  body: React.ReactNode;
  note: string;
  relatedLinks: Array<{ href: string; label: string }>;
  sources: GuideSource[];
};

const OFFICIAL_COLLECT = {
  label: "Blooket Help: How to Collect Blooks",
  href: "https://help.blooket.com/hc/en-us/articles/16620639672599-How-to-Collect-Blooks",
};

const OFFICIAL_BLOOKS_PAGE = {
  label: "Blooket Help: Blooks Page Overview",
  href: "https://help.blooket.com/hc/en-us/articles/31595510812183-Blooks-Page-Overview",
};

const OFFICIAL_SELL = {
  label: "Blooket Help: How to Sell Blooks",
  href: "https://help.blooket.com/hc/en-us/articles/16310268634519-How-to-Sell-Blooks",
};

const OFFICIAL_TOKENS = {
  label: "Blooket Help: How to Earn Tokens/XP in Blooket",
  href: "https://help.blooket.com/hc/en-us/articles/16293484738839-Earning-Tokens-XP",
};

const COMMUNITY_WIKI_BLOOKS = {
  label: "Blooket Wiki: Blooks",
  href: "https://blooket.fandom.com/wiki/Blooks",
};

const COMMUNITY_WIKI_PACKS = {
  label: "Blooket Wiki: Packs",
  href: "https://blooket.fandom.com/wiki/Packs",
};

function BodyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-emerald-400 transition hover:text-emerald-300">
      {children}
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="space-y-4 text-base leading-8 text-white/70">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function RarityTable({ rarity }: { rarity: Rarity }) {
  const blooks = getBlooksByRarity(rarity);

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/75">
        <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.22em] text-white/35">
          <tr>
            <th className="px-4 py-3">Blook</th>
            <th className="px-4 py-3">Pack</th>
            <th className="px-4 py-3">Drop rate</th>
            <th className="px-4 py-3">Sell value</th>
            <th className="px-4 py-3">Estimated tokens</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {blooks.map((blook) => {
            const pack = getPackForBlook(blook);

            return (
              <tr key={blook.id}>
                <td className="px-4 py-3 font-semibold text-white">
                  <BodyLink href={`/blooks/${blook.id}`}>{blook.name}</BodyLink>
                </td>
                <td className="px-4 py-3">
                  <BodyLink href={pack.route}>{pack.name} Pack</BodyLink>
                </td>
                <td className="px-4 py-3">{formatRateLabel(blook.dropRate)}</td>
                <td className="px-4 py-3">{formatTokenLabel(blook.sellValue)}</td>
                <td className="px-4 py-3">
                  {formatTokenLabel(calculateEstimatedTokensForBlook(blook, pack))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PackRankingTable({
  metric,
  heading,
}: {
  metric: "legendary" | "chroma" | "epicPlus";
  heading: string;
}) {
  const rankings = getPackMetricRankings(metric);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-white">{heading}</h3>
      <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/75">
          <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.22em] text-white/35">
            <tr>
              <th className="px-4 py-3">Pack</th>
              <th className="px-4 py-3">Single-pull rate</th>
              <th className="px-4 py-3">Chance at 500 tokens</th>
              <th className="px-4 py-3">Chance at 1,000 tokens</th>
              <th className="px-4 py-3">Packs opened at 500</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rankings.map((ranking) => (
              <tr key={ranking.pack.id}>
                <td className="px-4 py-3 font-semibold text-white">
                  <BodyLink href={ranking.pack.route}>{ranking.pack.name} Pack</BodyLink>
                </td>
                <td className="px-4 py-3">{formatPercent(ranking.rate)}</td>
                <td className="px-4 py-3">{formatPercent(ranking.probabilityAt500)}</td>
                <td className="px-4 py-3">{formatPercent(ranking.probabilityAt1000)}</td>
                <td className="px-4 py-3">{ranking.opensAt500.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PackCatalogList() {
  const livePacks = getLivePacks();
  const seasonalPacks = getSeasonalPacks();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-xl font-black text-white">Live packs</h3>
        <ul className="mt-4 space-y-2 text-white/70">
          {livePacks.map((pack) => (
            <li key={pack.id}>
              <BodyLink href={pack.route}>{pack.name} Pack</BodyLink>
              {" "}
              <span className="text-white/45">({formatTokenLabel(pack.costPerPull)})</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-xl font-black text-white">Seasonal or archived references</h3>
        <ul className="mt-4 space-y-2 text-white/70">
          {seasonalPacks.map((pack) => (
            <li key={pack.id}>
              <BodyLink href={pack.route}>{pack.name} Pack</BodyLink>
              {" "}
              <span className="text-white/45">({formatTokenLabel(pack.costPerPull)})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SellValueGrid() {
  const rows = [
    ["Common", RARITY_SELL_VALUES.common],
    ["Uncommon", RARITY_SELL_VALUES.uncommon],
    ["Rare", RARITY_SELL_VALUES.rare],
    ["Epic", RARITY_SELL_VALUES.epic],
    ["Legendary", RARITY_SELL_VALUES.legendary],
    ["Chroma", RARITY_SELL_VALUES.chroma],
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
            {label}
          </p>
          <p className="mt-2 text-xl font-black text-white">
            {formatTokenLabel(value)}
          </p>
        </div>
      ))}
    </div>
  );
}

export function getGuidePageContent(slug: string): GuidePageContent | null {
  if (slug === "blooket-drop-rates") {
    return {
      note:
        "This page uses the same pack data and probability engine that power the calculator, plus official Blooket help articles for the current Market flow.",
      relatedLinks: [
        { href: "/", label: "Open the calculator" },
        { href: "/methodology", label: "Read the methodology" },
        { href: "/packs", label: "Browse all pack tables" },
      ],
      sources: [OFFICIAL_COLLECT, OFFICIAL_TOKENS, COMMUNITY_WIKI_PACKS],
      body: (
        <>
          <Section title="What a drop rate actually means">
            <p>
              A drop rate is the chance that one single pack opening lands on a given
              Blook or rarity bucket. That sounds simple, but most players mix up
              single-pull odds with budget odds. A 0.05% Chroma chance is not the same
              thing as your chance after spending 500 or 1,000 tokens.
            </p>
            <p>
              That is why the core calculator on <BodyLink href="/">the homepage</BodyLink>
              {" "}does not stop at the raw pack table. It turns token budget into
              estimated opens, then calculates your at-least-one probability for the
              target outcome.
            </p>
          </Section>

          <Section title="Why token budget changes the conversation">
            <p>
              Pack rates are fixed, but your number of attempts is not. A 20-token pack
              gives you more tries per 500-token day than a 25-token pack, so cheaper
              packs can outperform more exciting packs when your goal is probability per
              token instead of pure aesthetics.
            </p>
            <BulletList
              items={[
                "Single-pull rate tells you how rare one result is.",
                "Budget probability tells you your real chance after a set spend.",
                "Duplicate refunds matter because they reduce effective cost over time.",
              ]}
            />
          </Section>

          <Section title="Where to go next">
            <p>
              If you want pack-level detail, jump into the full{" "}
              <BodyLink href="/packs">pack hub</BodyLink>. If you want the exact model,
              read the <BodyLink href="/methodology">methodology page</BodyLink>. If you
              care about the collector side of the topic, the{" "}
              <BodyLink href="/guides/chroma-blooks">Chroma hub</BodyLink> and{" "}
              <BodyLink href="/guides/legendary-blooks">Legendary hub</BodyLink> are the
              best follow-up reads.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "blooket-tokens") {
    return {
      note:
        "As of the official Blooket Help article available on May 24, 2026, players can earn up to 500 tokens and 300 XP per day, with an extra Daily Wheel spin for bonus tokens.",
      relatedLinks: [
        { href: "/", label: "Use the token calculator" },
        { href: "/guides/best-blooket-pack-to-open", label: "Compare the best packs" },
        { href: "/guides/how-to-sell-blooks", label: "Understand duplicate refunds" },
      ],
      sources: [OFFICIAL_TOKENS, OFFICIAL_COLLECT, OFFICIAL_SELL],
      body: (
        <>
          <Section title="Tokens are really just attempts">
            <p>
              The cleanest way to think about Blooket tokens is to treat them as future
              pack openings. Every token decision becomes more rational once you stop
              thinking in coins and start thinking in attempts.
            </p>
            <p>
              Official Blooket help currently says players can earn up to 500 tokens and
              300 XP per day, plus one Daily Wheel spin for bonus tokens. That means a
              typical day translates into 25 attempts on a 20-token pack or 20 attempts
              on a 25-token pack.
            </p>
          </Section>

          <Section title="What tokens should influence">
            <BulletList
              items={[
                "Which pack you choose first",
                "Whether you should wait for a bigger savings buffer",
                "How many real attempts you can afford today",
                "Whether duplicate sell-back changes the effective cost enough to matter",
              ]}
            />
          </Section>

          <Section title="Use token math, not collector panic">
            <p>
              If you only have one day&apos;s cap saved, you should usually favor packs that
              give you more meaningful attempts. That is why pages like{" "}
              <BodyLink href="/guides/best-pack-for-legendaries">
                best pack for Legendaries
              </BodyLink>{" "}
              and{" "}
              <BodyLink href="/guides/best-pack-for-chromas">
                best pack for Chromas
              </BodyLink>{" "}
              are more useful than generic “rarest Blook” hype.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "blooket-packs") {
    return {
      note:
        "This guide is anchored to the live pack catalog indexed in the site data layer and cross-checked against community pack references.",
      relatedLinks: [
        { href: "/packs", label: "Open the full pack hub" },
        { href: "/guides/blooket-drop-rates", label: "Learn how rates work" },
        { href: "/guides/best-blooket-pack-to-open", label: "See strategy rankings" },
      ],
      sources: [OFFICIAL_COLLECT, COMMUNITY_WIKI_PACKS],
      body: (
        <>
          <Section title="Packs are the real topic center of this site">
            <p>
              Most Blooket searches eventually collapse back into packs. Players may
              start with a Blook name, a rarity name, or a budgeting question, but the
              actionable step is almost always the same: which pack should I open, and
              how many attempts can I afford?
            </p>
          </Section>

          <Section title="Live vs seasonal pack coverage">
            <PackCatalogList />
          </Section>

          <Section title="How to compare packs correctly">
            <BulletList
              items={[
                "Price per open changes your attempt count.",
                "Top-end rarity distribution changes your collector upside.",
                "Duplicate sell-back value changes long-run effective cost.",
                "Seasonal status changes whether a pack is useful now or mainly archival.",
              ]}
            />
            <p>
              The fastest way to compare them is to use the{" "}
              <BodyLink href="/packs">pack hub</BodyLink> for raw tables and the{" "}
              <BodyLink href="/">calculator</BodyLink> for budget-specific odds.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "blooket-sell-values") {
    return {
      note:
        "Sell values are modeled directly in the site constants so the duplicate refund mode and content pages stay aligned.",
      relatedLinks: [
        { href: "/guides/how-to-sell-blooks", label: "See the selling flow" },
        { href: "/methodology", label: "See how effective cost is modeled" },
        { href: "/", label: "Toggle duplicate refunds in the calculator" },
      ],
      sources: [OFFICIAL_SELL, OFFICIAL_BLOOKS_PAGE, COMMUNITY_WIKI_BLOOKS],
      body: (
        <>
          <Section title="Why sell values matter more than most players think">
            <p>
              Sell values do not just matter after the fact. They change how expensive a
              pack really is once duplicates start showing up. That is why our calculator
              has a duplicate refund mode instead of treating every open as a flat,
              permanent spend.
            </p>
          </Section>

          <Section title="Current rarity sell values in the site model">
            <SellValueGrid />
          </Section>

          <Section title="The practical takeaway">
            <p>
              A pack with strong duplicate sell-back is effectively a little cheaper than
              the sticker price suggests. That does not mean refunds erase bad luck. It
              means they soften the long-run cost and slightly improve the number of
              attempts you can fund.
            </p>
            <p>
              The methodology write-up explains that adjustment in more detail, and the{" "}
              <BodyLink href="/">calculator</BodyLink> lets you compare standard cost
              against refund-aware cost instantly.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "chroma-blooks") {
    const summary = getRaritySummary("Chroma");

    return {
      note:
        "This page only covers Chroma Blooks represented in the current site data. Rotation groups, like the Colored Astronaut set, are still called out separately in the pack-specific notes.",
      relatedLinks: [
        { href: "/guides/best-pack-for-chromas", label: "Compare Chroma packs" },
        { href: "/guides/legendary-blooks", label: "Browse Legendary blooks" },
        { href: "/packs", label: "Open pack-by-pack tables" },
      ],
      sources: [COMMUNITY_WIKI_BLOOKS, COMMUNITY_WIKI_PACKS],
      body: (
        <>
          <Section title="What this Chroma hub covers">
            <p>
              We currently index {summary.count} Chroma entries across {summary.packCount}
              {" "}packs. These are the Blooks most players have in mind when they search
              for the rarest pulls in Blooket.
            </p>
            <p>
              Chroma hunts are brutal because the top-end rates are microscopic, and the
              emotional difference between a 0.02% pull and a 0.05% pull is easy to miss
              until you convert both into token budget.
            </p>
          </Section>

          <Section title="All indexed Chroma Blooks">
            <RarityTable rarity="Chroma" />
          </Section>

          <Section title="What to do with this information">
            <p>
              Use this list to identify the pack first, then shift into a budget view.
              The pack table tells you the raw rate. The{" "}
              <BodyLink href="/">calculator</BodyLink> tells you what that rate means for
              your actual token stash.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "legendary-blooks") {
    const summary = getRaritySummary("Legendary");

    return {
      note:
        "Legendary pages are useful because Legendary intent is much broader than any single pack query. This hub turns that demand into a crawlable index.",
      relatedLinks: [
        { href: "/guides/best-pack-for-legendaries", label: "Compare Legendary packs" },
        { href: "/guides/chroma-blooks", label: "See the Chroma layer" },
        { href: "/blooks", label: "Browse the full library" },
      ],
      sources: [COMMUNITY_WIKI_BLOOKS, COMMUNITY_WIKI_PACKS],
      body: (
        <>
          <Section title="Legendary Blooks are where strategy gets practical">
            <p>
              We currently index {summary.count} Legendary entries across {summary.packCount}
              {" "}packs. Unlike Chroma chasing, Legendary hunting can often be planned in
              a way that feels realistic for normal token budgets.
            </p>
          </Section>

          <Section title="All indexed Legendary Blooks">
            <RarityTable rarity="Legendary" />
          </Section>

          <Section title="How to use the list">
            <p>
              If you care about one specific Legendary, start from the Blook row above,
              jump to the pack page, then run a budget test in the calculator. If you
              only care about maximizing your Legendary chance in general, the{" "}
              <BodyLink href="/guides/best-pack-for-legendaries">
                best-pack ranking
              </BodyLink>{" "}
              is the faster path.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "mystical-blooks") {
    return {
      note:
        "Mysticals are not modeled in the pack calculator because they are not standard pack pulls in the indexed site dataset.",
      relatedLinks: [
        { href: "/guides/chroma-blooks", label: "See pack-based rarest pulls" },
        { href: "/guides/hidden-blooks", label: "Read the Hidden Blooks guide" },
        { href: "/blooks", label: "Browse indexed pack blooks" },
      ],
      sources: [OFFICIAL_BLOOKS_PAGE, COMMUNITY_WIKI_BLOOKS],
      body: (
        <>
          <Section title="What Mystical usually means">
            <p>
              In the collector vocabulary, Mystical refers to a special top-end class
              that sits outside normal pack grinding. That makes Mysticals a real search
              topic, but not a calculator target in the same way a Chroma or Legendary
              is.
            </p>
          </Section>

          <Section title="Why the calculator does not model Mysticals">
            <p>
              The site calculator models outcomes you can chase through indexed pack
              openings. Mysticals do not fit that workflow, so pretending we can assign
              them a normal pack probability would make the site less trustworthy, not
              more useful.
            </p>
          </Section>

          <Section title="The practical replacement">
            <p>
              If what you really mean is “rarest pack pull,” you probably want the{" "}
              <BodyLink href="/guides/chroma-blooks">Chroma hub</BodyLink>. If you mean
              “highest realistic rarity I can grind for,” the{" "}
              <BodyLink href="/guides/legendary-blooks">Legendary hub</BodyLink> is the
              better starting point.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "unique-blooks") {
    return {
      note:
        "This page explains the collector term and how it differs from the pack-focused data represented on this site.",
      relatedLinks: [
        { href: "/guides/mystical-blooks", label: "See the Mystical guide" },
        { href: "/guides/hidden-blooks", label: "See the Hidden Blooks guide" },
        { href: "/packs", label: "Return to pack data" },
      ],
      sources: [OFFICIAL_BLOOKS_PAGE, COMMUNITY_WIKI_BLOOKS],
      body: (
        <>
          <Section title="Unique is a collector label, not a pack strategy">
            <p>
              Unique Blooks matter in the wider Blooket taxonomy because they help
              collectors talk precisely about what is normal pack content and what is not.
              For this site, that distinction matters because the calculator only works
              when the route to acquisition is a measurable pack-opening process.
            </p>
          </Section>

          <Section title="How to think about it on this site">
            <p>
              Use Unique as a taxonomy concept, not as a budget-planning target. If you
              are here to plan token spending, the useful pages are still{" "}
              <BodyLink href="/packs">pack tables</BodyLink>, the{" "}
              <BodyLink href="/">calculator</BodyLink>, and the rarity hubs for pack-based
              pulls.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "hidden-blooks") {
    return {
      note:
        "Hidden Blooks are treated here as a taxonomy explainer topic. We avoid making acquisition claims that are not represented in the indexed pack data.",
      relatedLinks: [
        { href: "/guides/unique-blooks", label: "Read the Unique guide" },
        { href: "/guides/mystical-blooks", label: "Read the Mystical guide" },
        { href: "/blooks", label: "Browse indexed blooks" },
      ],
      sources: [OFFICIAL_BLOOKS_PAGE, COMMUNITY_WIKI_BLOOKS],
      body: (
        <>
          <Section title="Why Hidden Blooks need a careful explanation">
            <p>
              Hidden Blooks generate a lot of curiosity and a lot of bad information.
              The safest, most useful way to handle the topic is to separate collector
              taxonomy from pack math. Hidden Blooks may matter in community discussions,
              but they are not something this calculator can responsibly model as a normal
              pack chase.
            </p>
          </Section>

          <Section title="What the page is for">
            <p>
              This page exists to intercept that search intent and route it toward better
              next steps. If you are researching rarity labels, stay in the guide hub. If
              you are planning your next token spend, go back to{" "}
              <BodyLink href="/guides/chroma-blooks">Chromas</BodyLink>,{" "}
              <BodyLink href="/guides/legendary-blooks">Legendaries</BodyLink>, or the{" "}
              <BodyLink href="/packs">pack center</BodyLink>.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "best-blooket-pack-to-open") {
    return {
      note:
        "There is no universal best pack. This page ranks packs by goal so the recommendation matches the player’s real intent.",
      relatedLinks: [
        { href: "/guides/best-pack-for-chromas", label: "See the Chroma ranking" },
        { href: "/guides/best-pack-for-legendaries", label: "See the Legendary ranking" },
        { href: "/packs", label: "Open full pack tables" },
      ],
      sources: [OFFICIAL_COLLECT, OFFICIAL_TOKENS, COMMUNITY_WIKI_PACKS],
      body: (
        <>
          <Section title="The best pack depends on what you are chasing">
            <p>
              “Best pack” is a trap query because it sounds singular. In practice, there
              are at least three different questions hiding inside it: best for Chromas,
              best for Legendaries, and best for steady top-end value.
            </p>
          </Section>

          <Section title="Best packs by goal">
            <PackRankingTable metric="epicPlus" heading="Best overall top-end odds" />
            <PackRankingTable metric="legendary" heading="Best Legendary-focused odds" />
            <PackRankingTable metric="chroma" heading="Best Chroma-focused odds" />
          </Section>

          <Section title="How to use the ranking without fooling yourself">
            <p>
              Rankings help you choose direction. They do not erase variance. The next
              step is always to plug your actual token budget into the{" "}
              <BodyLink href="/">calculator</BodyLink>, because 500 tokens and 5,000 tokens
              are two completely different planning environments.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "best-pack-for-chromas") {
    return {
      note:
        "This ranking is built from pack-level Chroma rate and a fixed 500-token / 1,000-token comparison so players can compare budget outcomes directly.",
      relatedLinks: [
        { href: "/guides/chroma-blooks", label: "Browse all indexed Chromas" },
        { href: "/guides/blooket-tokens", label: "Read the token guide" },
        { href: "/", label: "Run your own budget" },
      ],
      sources: [COMMUNITY_WIKI_PACKS, COMMUNITY_WIKI_BLOOKS],
      body: (
        <>
          <Section title="Chroma hunting is all about rate per token">
            <p>
              Chroma searches are where player emotion and math fight the hardest. The
              only sane comparison is chance per budget, not “which pack feels rare.”
            </p>
          </Section>

          <Section title="Current Chroma pack ranking">
            <PackRankingTable metric="chroma" heading="Best packs for Chroma odds" />
          </Section>

          <Section title="One important caution">
            <p>
              Rotation mechanics matter. A pack like Space can include multiple famous
              Chroma names in the broader collector conversation, but only one rotation
              target may be active at a time. Always read the pack note before assuming
              a pack table means every named Chroma is simultaneously live.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "best-pack-for-legendaries") {
    return {
      note:
        "Legendary ranking is usually the most useful strategy page for everyday players because the goal is aspirational but still realistically budgetable.",
      relatedLinks: [
        { href: "/guides/legendary-blooks", label: "Browse Legendary blooks" },
        { href: "/guides/best-blooket-pack-to-open", label: "See the overall pack guide" },
        { href: "/", label: "Test your token budget" },
      ],
      sources: [COMMUNITY_WIKI_PACKS, COMMUNITY_WIKI_BLOOKS],
      body: (
        <>
          <Section title="Legendary chasing is the sweet spot">
            <p>
              For most players, Legendaries are where the game still feels exciting
              without becoming mathematically absurd. That is why a dedicated Legendary
              ranking matters: it aligns with a goal many players can actually plan for.
            </p>
          </Section>

          <Section title="Current Legendary pack ranking">
            <PackRankingTable metric="legendary" heading="Best packs for Legendary odds" />
          </Section>

          <Section title="How to pick between two close packs">
            <BulletList
              items={[
                "Use the higher 500-token chance if your budget is small.",
                "Use theme preference only after the probability gap is small.",
                "Check the Blook list if you care about a specific target, not just any Legendary.",
              ]}
            />
          </Section>
        </>
      ),
    };
  }

  if (slug === "blook-score-explained") {
    return {
      note:
        "According to Blooket’s help documentation visible on May 24, 2026, Blook Score reflects both rarity and variety, and duplicate Blooks do not count toward the score.",
      relatedLinks: [
        { href: "/guides/how-to-sell-blooks", label: "Understand duplicate selling" },
        { href: "/guides/chroma-blooks", label: "See high-rarity blooks" },
        { href: "/blooks", label: "Browse your next collection targets" },
      ],
      sources: [OFFICIAL_BLOOKS_PAGE, OFFICIAL_SELL],
      body: (
        <>
          <Section title="What Blook Score is actually measuring">
            <p>
              Official Blooket help says Blook Score reflects the diversity and rarity of
              your collection. That means the score is not just counting how many Blooks
              you own. It is trying to reward breadth and valuable rarity coverage.
            </p>
          </Section>

          <Section title="Why duplicates matter less for score">
            <p>
              Blooket’s help page explicitly says duplicate Blooks do not count toward
              Blook Score. That is a major strategic clue. If your goal is improving score
              rather than farming raw collection value, owning one copy of a new rarity
              target often matters more than stacking copies of the same card.
            </p>
          </Section>

          <Section title="How to use that insight">
            <p>
              Use the score system as a reason to diversify targets instead of tunneling
              on one pack forever. The <BodyLink href="/blooks">Blook library</BodyLink>
              helps you see what exists, while the <BodyLink href="/packs">pack hub</BodyLink>
              and <BodyLink href="/">calculator</BodyLink> help you plan how to chase the
              missing pieces.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "how-to-sell-blooks") {
    return {
      note:
        "Official Blooket Help says players can sell one Blook, batches of duplicates, or use the One Left option. It also notes that selling the last copy requires a confirmation step and cannot be undone.",
      relatedLinks: [
        { href: "/guides/blooket-sell-values", label: "Read the sell value guide" },
        { href: "/guides/blook-score-explained", label: "Read the Blook Score guide" },
        { href: "/", label: "Compare refund-aware odds" },
      ],
      sources: [OFFICIAL_SELL, OFFICIAL_BLOOKS_PAGE],
      body: (
        <>
          <Section title="The official selling flow">
            <BulletList
              items={[
                'Go to the "My Blooks" page.',
                "Click the Blook you want to sell.",
                "Review the sell price and quantity tools in the modal.",
                "Use +1, +5, +10, One Left, or a custom quantity when selling duplicates.",
              ]}
            />
            <p>
              Blooket also shows a confirmation prompt before you sell your last copy, so
              accidental clean-outs are harder to trigger.
            </p>
          </Section>

          <Section title="Why selling matters to the calculator">
            <p>
              Duplicate selling is not just a housekeeping action. It changes the real
              economics of pack openings. That is why our calculator has a duplicate
              refund mode and why the <BodyLink href="/methodology">methodology page</BodyLink>
              {" "}talks about effective cost instead of only sticker price.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "cumulative-probability") {
    return {
      note:
        "Cumulative probability is the core math behind every calculator on this site. This guide explains it in plain language so you can reason about your own budgets.",
      relatedLinks: [
        { href: "/calculators/chase", label: "Chase Calculator" },
        { href: "/guides/blooket-drop-rates", label: "Drop Rates guide" },
        { href: "/methodology", label: "Read the methodology" },
      ],
      sources: [COMMUNITY_WIKI_PACKS, OFFICIAL_COLLECT],
      body: (
        <>
          <Section title="The formula that matters">
            <p>
              Cumulative probability answers one question: &quot;If I open n packs, what is
              the chance I get at least one of my target?&quot; The formula is{" "}
              <strong className="text-white">P = 1 - (1 - p)^n</strong>, where p is the
              single-pull rate and n is the number of opens.
            </p>
            <p>
              This is not additive. A 1% rate over 100 pulls is not 100%. It is about
              63.4%. Over 200 pulls it is about 86.6%. The curve rises quickly at first,
              then slows down forever without ever reaching 100%.
            </p>
          </Section>

          <Section title="Why most players get this wrong">
            <BulletList
              items={[
                "Adding rates together (1% × 100 = 100%) — this is wrong and leads to guaranteed-expectation thinking.",
                "Assuming that if you miss 50 times, the next pull is more likely — each pull is independent. The rate does not change.",
                "Treating expected value as a guarantee — an expected 100 opens for one hit means on average, not in your specific session.",
              ]}
            />
          </Section>

          <Section title="How to use cumulative probability for budgeting">
            <p>
              The <BodyLink href="/calculators/chase">Chase Calculator</BodyLink> uses
              this exact formula to show you the token budget needed for 50%, 90%, and 99%
              probability. That gives you three planning anchors: the optimistic budget,
              the realistic budget, and the &quot;almost certain&quot; budget.
            </p>
            <p>
              If the 99% budget feels unreachable, that is useful information. It means
              your target is rare enough that you should consider a different goal or a
              different pack.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "blooket-pack-set") {
    return {
      note:
        "Pack sets define the rarity ladder inside each pack. This guide explains how sets are structured and why structure matters for strategy.",
      relatedLinks: [
        { href: "/packs", label: "Browse all pack tables" },
        { href: "/guides/best-blooket-pack-to-open", label: "Best pack rankings" },
        { href: "/calculators/roi", label: "ROI Calculator" },
      ],
      sources: [COMMUNITY_WIKI_PACKS, OFFICIAL_COLLECT],
      body: (
        <>
          <Section title="What a pack set is">
            <p>
              Every Blooket pack contains a fixed set of blooks arranged in a rarity
              ladder: Common, Uncommon, Rare, Epic, Legendary, and sometimes Chroma.
              The set determines which blooks you can possibly pull from that pack, and
              the drop rates determine how likely each one is.
            </p>
          </Section>

          <Section title="How sets differ">
            <BulletList
              items={[
                "Some packs stop at Legendary (Bot, Dino, Breakfast) — these are the best for pure Legendary hunters.",
                "Some packs include a Chroma (Space, Ice, Spooky) — these split the top-end budget between Legendary and Chroma.",
                "Seasonal packs rotate in and out — their Chromas are only available while the pack is live.",
                "Packs with rotation groups (like Space) cycle through multiple Chromas in one slot — only one is active at a time.",
              ]}
            />
          </Section>

          <Section title="Why set structure matters for strategy">
            <p>
              If you only care about Legendaries, a pack without a Chroma gives you a
              higher relative share of the top-end probability. If you want a specific
              Chroma, you need to check whether that pack is currently live and which
              rotation variant is active.
            </p>
            <p>
              The <BodyLink href="/calculators/roi">ROI Calculator</BodyLink> accounts
              for set structure by comparing the probability per token for each rarity
              target across all packs.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "blooket-rookie-mistakes") {
    return {
      note:
        "These are the most common strategic errors new Blooket players make, based on community patterns and the probability math this site models.",
      relatedLinks: [
        { href: "/guides/blooket-tokens", label: "Token guide" },
        { href: "/guides/best-blooket-pack-to-open", label: "Best pack guide" },
        { href: "/calculators", label: "All calculators" },
      ],
      sources: [OFFICIAL_COLLECT, OFFICIAL_TOKENS, COMMUNITY_WIKI_PACKS],
      body: (
        <>
          <Section title="Mistake 1: Chasing the rarest pack by name, not by rate">
            <p>
              New players hear &quot;Space Pack has the rarest blook&quot; and open Space
              exclusively. But the Space Pack Chroma rate is split across rotation
              variants. A pack with a single Chroma at 0.05% may give you a better chance
              at <em>some</em> Chroma than Space does at the one you want.
            </p>
          </Section>

          <Section title="Mistake 2: Ignoring duplicate refunds">
            <p>
              Every duplicate you sell reduces the effective cost of future opens. If you
              ignore refunds, you overestimate how many tokens you need. The{" "}
              <BodyLink href="/calculators/token-converter">Token Converter</BodyLink>{" "}
              shows the difference between standard and refund-aware cost.
            </p>
          </Section>

          <Section title="Mistake 3: Spending tokens the moment you earn them">
            <p>
              Opening packs one at a time as tokens trickle in feels exciting but prevents
              you from comparing options. Saving up 200-500 tokens and then choosing the
              best pack for your goal gives you a better outcome on average.
            </p>
          </Section>

          <Section title="Mistake 4: Assuming more expensive means better">
            <p>
              25-token packs are not automatically better than 20-token packs. The extra
              5 tokens per open means fewer attempts per budget. If the top-end rate is
              similar, the cheaper pack gives you more chances.
            </p>
          </Section>

          <Section title="Mistake 5: Trusting &quot;hot pack&quot; superstitions">
            <p>
              Pack openings are independent events. A &quot;lucky streak&quot; does not
              mean a pack is running hot. A &quot;cold streak&quot; does not mean a
              hit is due. Each pull has the exact same probability regardless of what
              happened before. See the{" "}
              <BodyLink href="/guides/blooket-streak-myths">Streak Myths guide</BodyLink>{" "}
              for the full breakdown.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "blooket-badge-roadmap") {
    return {
      note:
        "Badges track collection milestones in Blooket. This page maps the badge system to rarity tiers and pack data so you can plan your route.",
      relatedLinks: [
        { href: "/blooks", label: "Browse the Blook library" },
        { href: "/guides/blook-score-explained", label: "Blook Score guide" },
        { href: "/value-guide", label: "Value guide" },
      ],
      sources: [OFFICIAL_BLOOKS_PAGE, OFFICIAL_COLLECT],
      body: (
        <>
          <Section title="How badges work">
            <p>
              Blooket awards badges for collection milestones — owning your first
              Legendary, first Chroma, completing a pack set, and reaching Blook Score
              thresholds. Badges are visible on your profile and serve as collection
              goals.
            </p>
          </Section>

          <Section title="Badge milestones by rarity tier">
            <BulletList
              items={[
                "First Epic — achievable within a few sessions on any pack with Epic+ rates.",
                "First Legendary — requires focused token spending. Use the Chase Calculator for budget planning.",
                "First Chroma — the hardest standard badge. Requires significant token investment or luck.",
                "Pack completion — owning every blook in a pack set. Easier on small packs like Breakfast.",
                "Blook Score thresholds — based on rarity diversity, not raw count. Duplicates do not count.",
              ]}
            />
          </Section>

          <Section title="Planning your badge route">
            <p>
              If badges are your goal, prioritize breadth over depth. Owning one blook
              from each rarity tier across multiple packs advances your score faster than
              grinding one pack for duplicates. The{" "}
              <BodyLink href="/blooks">Blook library</BodyLink> and{" "}
              <BodyLink href="/value-guide">Value Guide</BodyLink> help you identify
              the cheapest path to each rarity tier.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "blooket-streak-myths") {
    return {
      note:
        "Pack openings are independent random events. Streaks exist in hindsight but have no predictive power. This guide explains why.",
      relatedLinks: [
        { href: "/guides/cumulative-probability", label: "Cumulative probability" },
        { href: "/guides/blooket-rookie-mistakes", label: "Rookie mistakes" },
        { href: "/methodology", label: "Methodology" },
      ],
      sources: [COMMUNITY_WIKI_PACKS],
      body: (
        <>
          <Section title="Myth: A pack gets &quot;hot&quot; after several misses">
            <p>
              This is the classic gambler&apos;s fallacy. Each pack opening is an
              independent event. The drop rate does not change based on previous results.
              If you missed a Chroma 50 times in a row, the 51st open still has the same
              Chroma rate as the first.
            </p>
          </Section>

          <Section title="Myth: Opening packs fast increases your odds">
            <p>
              The speed of opening packs has zero effect on probability. Whether you open
              25 packs in 5 seconds or 25 packs over 25 minutes, the cumulative
              probability is identical. The math only cares about the number of opens,
              not the timing.
            </p>
          </Section>

          <Section title="Myth: Some accounts are luckier than others">
            <p>
              There is no evidence that Blooket assigns different probability tables to
              different accounts. The drop rates are per-pack, not per-player. Any
              perceived &quot;luck&quot; is normal variance across a small sample size.
            </p>
          </Section>

          <Section title="What is actually real">
            <p>
              Streaks <em>do</em> happen — but only in hindsight. Over thousands of
              opens, you will see clusters of hits and long dry spells. That is normal
              statistical variance, not a pattern you can exploit. The{" "}
              <BodyLink href="/guides/cumulative-probability">
                Cumulative Probability guide
              </BodyLink>{" "}
              explains the real math behind multi-pull odds.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "sell-or-keep-blooks") {
    return {
      note:
        "This guide covers the strategic decision of selling vs keeping blooks, including duplicate economics and Blook Score impact.",
      relatedLinks: [
        { href: "/guides/how-to-sell-blooks", label: "How to sell" },
        { href: "/guides/blook-score-explained", label: "Blook Score guide" },
        { href: "/calculators/value", label: "Value Calculator" },
      ],
      sources: [OFFICIAL_SELL, OFFICIAL_BLOOKS_PAGE],
      body: (
        <>
          <Section title="The easy case: duplicate selling">
            <p>
              If you have more than one copy of a blook, selling duplicates is almost
              always correct. Duplicates do not count toward Blook Score, and the tokens
              from selling reduce your effective cost on future opens. The only exception
              is if you expect the blook to become tradeable in a future update — but
              currently, trading does not exist.
            </p>
          </Section>

          <Section title="The hard case: selling your last copy">
            <p>
              Selling your last copy of a blook removes it from your collection. This
              affects your Blook Score and your pack completion progress. The tokens you
              get back are fixed by rarity:
            </p>
            <BulletList
              items={[
                "Common: 0 tokens (not worth selling)",
                "Uncommon: 5 tokens",
                "Rare: 10 tokens",
                "Epic: 75 tokens",
                "Legendary: 200 tokens",
                "Chroma: 300 tokens (250 for Megalodon)",
              ]}
            />
            <p>
              Ask yourself: is 200 tokens worth losing a Legendary from your collection?
              If you are chasing Blook Score or pack completion badges, the answer is
              usually no. If you are purely token-optimizing for more pulls, it can be
              yes — but only if you have a clear plan for those tokens.
            </p>
          </Section>

          <Section title="The decision framework">
            <BulletList
              items={[
                "If you have duplicates → sell them. No downside.",
                "If you care about Blook Score → keep your last copy. Score rewards diversity.",
                "If you care about pack completion → keep your last copy. You need it for the badge.",
                "If you only care about token efficiency → selling a last-copy Epic (75 tokens) funds 3-4 more opens on a 20-token pack, which may yield something better.",
                "If the blook is Chroma → almost never sell your last copy. 300 tokens is not worth losing the rarest tier from your collection.",
              ]}
            />
            <p>
              The <BodyLink href="/calculators/value">Value Calculator</BodyLink> shows
              you the exact sell value and expected token cost for every blook, so you
              can make this decision with real numbers instead of gut feelings.
            </p>
          </Section>
        </>
      ),
    };
  }

  if (slug === "how-the-blooket-market-works") {
    return {
      note:
        "As described in the official Blooket Help article available on May 24, 2026, the Market includes Blook Packs at the top, a Weekly Shop below, and support for buying multiple packs at once.",
      relatedLinks: [
        { href: "/guides/blooket-packs", label: "Read the packs guide" },
        { href: "/guides/blook-score-explained", label: "Read the Blook Score guide" },
        { href: "/packs", label: "Open the pack data center" },
      ],
      sources: [OFFICIAL_COLLECT, OFFICIAL_BLOOKS_PAGE, OFFICIAL_TOKENS],
      body: (
        <>
          <Section title="What the official Market flow looks like">
            <p>
              Blooket’s help center describes the Market as the place where you spend
              earned tokens on Blook Packs and browse the Weekly Shop for banners, titles,
              limited-time content, and seasonal items. It also confirms that the updated
              Market allows multiple pack purchases in one flow.
            </p>
          </Section>

          <Section title="Why the Market matters for topical authority">
            <p>
              A Blooket calculator site cannot look complete if it only talks about math
              and ignores the current collection interface. The Market is where pack odds,
              token budgets, Blook Score, and sell-back behavior all connect.
            </p>
          </Section>

          <Section title="How to use the Market with less regret">
            <BulletList
              items={[
                "Check the pack table before you buy.",
                "Translate your token stash into attempts, not hype.",
                "Use duplicate selling to understand your real long-run cost.",
                "Treat Weekly Shop spending as a separate goal from pack chasing.",
              ]}
            />
          </Section>
        </>
      ),
    };
  }

  if (slug === "rarest-blook") {
    const chromaSummary = getRaritySummary("Chroma");
    const legendarySummary = getRaritySummary("Legendary");

    return {
      note:
        "The rarest standard-pull Blook is a Chroma at 0.02% drop rate. Some rotated-out event Blooks are now functionally unobtainable and sit above Chromas in true rarity, but they are not indexed here because they cannot be pulled from any current pack.",
      relatedLinks: [
        { href: "/guides/chroma-blooks", label: "All Chroma Blooks" },
        { href: "/guides/legendary-blooks", label: "All Legendary Blooks" },
        { href: "/calculators/chase", label: "Chase Calculator" },
        { href: "/", label: "Open the calculator" },
      ],
      sources: [COMMUNITY_WIKI_BLOOKS, OFFICIAL_BLOOKS_PAGE, OFFICIAL_COLLECT],
      body: (
        <>
          <Section title="The rarest Blook in Blooket (short answer)">
            <p>
              The rarest pullable Blook is a <strong className="text-white">Chroma</strong>,
              and Chromas drop at roughly <strong className="text-white">0.02% per pull</strong>.
              That works out to about 1 in 5,000 pack openings for a specific Chroma at the
              90% confidence threshold. We currently index {chromaSummary.count} Chroma entries
              across {chromaSummary.packCount} packs.
            </p>
            <p>
              Several Chromas, including the rainbow Astronaut and Megalodon, are the
              flagship trophies of the entire game. They are the single hardest standard
              pulls a Blooket player can chase.
            </p>
          </Section>

          <Section title="Full rarity ranking — from common to rarest">
            <BulletList
              items={[
                "Common — the floor of every pack, expected on almost every pull",
                "Uncommon — frequent but already collectible",
                "Rare — meaningful pulls, often the first “wow” moment",
                "Epic — the achievable luxury tier, around 1% per pull",
                `Legendary — ${legendarySummary.count} indexed entries across ${legendarySummary.packCount} packs, drops at roughly 0.05% per pull`,
                `Chroma — ${chromaSummary.count} indexed entries, drops at roughly 0.02% per pull (the rarest standard pull)`,
              ]}
            />
            <p>
              See the <BodyLink href="/guides/chroma-blooks">Chroma hub</BodyLink> and{" "}
              <BodyLink href="/guides/legendary-blooks">Legendary hub</BodyLink> for the full
              tables with drop rates per Blook.
            </p>
          </Section>

          <Section title="All indexed Chroma Blooks (the rarest tier)">
            <RarityTable rarity="Chroma" />
          </Section>

          <Section title={`Why "rarest" is more complicated than one number`}>
            <p>
              Drop rate is only half the story. Some Blooks that look common on paper are
              functionally rarer than Chromas because their pack rotated out and is no
              longer available for purchase. Event Blooks from limited-time seasonal packs
              fall into this category &mdash; they are not in the standard pull pool at all,
              so their current acquisition rate is effectively zero.
            </p>
            <p>
              For that reason, this site separates &ldquo;rarest standard pull&rdquo;
              (Chromas) from &ldquo;rarest in absolute terms&rdquo; (rotated event Blooks).
              The calculator only models live, pullable inventory.
            </p>
          </Section>

          <Section title="What this means for your token budget">
            <p>
              A 0.02% Chroma drop rate means you need to plan in the thousands of pulls,
              not the dozens. To reach a 90% probability of pulling one specific Chroma,
              you need roughly <strong className="text-white">11,500 attempts</strong>,
              which translates to about <strong className="text-white">287,500 tokens</strong>
              at a 25-token pack. That is multiple months of capped farming.
            </p>
            <p>
              Run the exact math for your target in the{" "}
              <BodyLink href="/calculators/chase">chase calculator</BodyLink>, compare
              pack efficiency in the <BodyLink href="/guides/best-pack-for-chromas">best Chroma pack guide</BodyLink>,
              and read the <BodyLink href="/guides/cumulative-probability">cumulative probability guide</BodyLink>
              before you commit a single token to a Chroma chase.
            </p>
          </Section>
        </>
      ),
    };
  }

  return null;
}
