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

  return null;
}
