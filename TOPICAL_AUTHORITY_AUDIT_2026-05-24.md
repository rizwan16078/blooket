# Blooket Calculator Topical Authority Audit

Date: 2026-05-24

## Verdict

The site has strong programmatic coverage for one narrow topic: **Blooket pack odds, pack pages, and individual blook pages**.

It does **not** yet have complete topical authority for the wider Blooket ecosystem.

Right now the site looks like:

- Strong on calculator intent
- Decent on pack and blook entity coverage
- Thin on editorial breadth
- Weak on trust/supporting topical clusters
- Behind competitors on taxonomy depth, glossary coverage, rarity hubs, and current-feature documentation

## Current Coverage Snapshot

From the repo:

- 16 pack datasets in [lib/constants.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/lib/constants.ts)
- 174 blook entries generated from those datasets in [lib/constants.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/lib/constants.ts)
- 5 published blog posts in [data/blog.tsx](/Users/Rizwan/Documents/Documents/GitHub/blooket/data/blog.tsx)
- Core evergreen pages:
  - `/`
  - `/packs`
  - `/blooks`
  - pack detail pages
  - blook detail pages
  - `/how-it-works`
  - `/about`
  - `/team`
  - `/editorial-guidelines`
  - `/unblocked`

Topical clusters currently covered:

- Blooket calculator
- Pack odds
- Blook drop rates
- Blook library
- A small blog cluster on:
  - farming tokens
  - tower defense strategy
  - rarest blooks
  - calculator accuracy
  - how to use the calculator

## Where You Are Strong

- Programmatic SEO foundation is good. Pack pages and blook pages create real indexable depth.
- The site has clear positioning around exact probability math.
- `/packs` and `/blooks` give you useful entity coverage many simple calculator sites do not have.
- The brand angle is differentiated: math-first, probability-first, not just “simulator.”

## Why This Is Not Complete Topical Authority Yet

Complete topical authority in this niche would usually mean coverage across:

- Core entities: packs, blooks, rarities, drop rates, sell values
- Supporting concepts: tokens, Blook Score, market changes, weekly shop, seasonal availability, event-only content
- Intent variants: “what is,” “how to get,” “best,” “rarest,” “worth it,” “calculator,” “odds,” “guide,” “list,” “ranking”
- Taxonomy pages: Chromas, Legendaries, Mysticals, Uniques, Hidden Blooks, seasonal packs, unreleased content
- Current product reality: market flow, pack-opening flow, multi-pack buying, blook selling, Blook Score, custom blooks, weekly shop
- Trust assets: methodology, sourcing policy, update logs, author proof, transparent change tracking

You cover only part of that map today.

## Biggest Local SEO / Authority Gaps

### 1. Blog posts are missing from the XML sitemap

[app/sitemap.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/app/sitemap.ts) includes the home page, packs, blooks, pack detail pages, and a few core pages, but it does **not** include `/blog` or any `/blog/[slug]` URLs.

Impact:

- Slower discovery of editorial content
- Weaker freshness signaling
- Lower chance that blog content supports the calculator cluster effectively

### 2. RSS feed ignores the real editorial inventory

[app/rss.xml/route.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/app/rss.xml/route.ts) publishes only a few static core pages and excludes the actual blog posts from [data/blog.tsx](/Users/Rizwan/Documents/Documents/GitHub/blooket/data/blog.tsx).

Impact:

- Weak syndication and freshness signals
- Missed supporting signal for content publishing cadence

### 3. `llms.txt` advertises pages that do not exist

[app/llms.txt/route.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/app/llms.txt/route.ts) references:

- `/blog/blooket-drop-rates-calculator`
- `/blog/top-10-rarest-blooks`
- `/guides/understanding-blooket-box-costs`
- a `/guides` section that does not exist

Impact:

- Weakens machine-readable trust
- Creates inconsistency between claimed site structure and actual site structure
- Makes the site look unfinished or synthetic to AI consumers and auditors

### 4. Internal linking inside editorial content is extremely thin

Search across the blog/content surfaces shows almost no contextual internal links beyond basic nav and “back to blog” behavior.

Impact:

- Your editorial pages are not pushing enough relevance into key money pages
- You are not building clear topic clusters
- Crawl paths between related concepts are weak

### 5. Trust pages overclaim and feel generic in places

[app/about/page.tsx](/Users/Rizwan/Documents/Documents/GitHub/blooket/app/about/page.tsx) contains broad claims like serving thousands of users and being recognized as a trusted authority, plus placeholder-style content and imagery.

Impact:

- EEAT-style trust signals feel weaker, not stronger, when claims are not evidenced
- The page reads more like a template than a verified brand story

## Competitor Landscape

## 1. Official Blooket Help

Primary strength:

- Current product reality

What they cover that you do not:

- Updated Market flow
- Weekly Shop
- Blook Score
- Multi-pack buying
- Selling blooks
- Ban Blooks feature
- current token/XP guidance

Useful reference URLs:

- https://help.blooket.com/hc/en-us/articles/16620639672599-How-to-Collect-Blooks
- https://help.blooket.com/hc/en-us/articles/31595510812183-Blooks-Page-Overview
- https://help.blooket.com/hc/en-us/articles/16310268634519-Selling-Blooks
- https://help.blooket.com/hc/en-us/articles/16293484738839-Earning-Tokens-XP

Takeaway:

You should not try to outrank official help on official product instructions, but you **should** build complementary pages that translate those official mechanics into player-facing strategy and calculator use cases.

## 2. BlooketIQ

Primary strength:

- Tight semantic cluster around the calculator

What they have:

- Calculator page
- “How odds work” explainer
- methodology page
- glossary hub
- term-level glossary pages like tokens and packs

Useful reference URLs:

- https://blooketiq.com/blooket-calculator/
- https://blooketiq.com/how-blooket-odds-work/
- https://blooketiq.com/methodology/
- https://blooketiq.com/glossary/
- https://blooketiq.com/glossary/blooket-tokens/
- https://blooketiq.com/glossary/blooket-packs/

What they do well:

- They surround the main calculator with supporting educational pages
- They explain assumptions and limitations
- They target adjacent exact-match keywords without leaving the main niche

Takeaway:

This is the cleanest competitor model for your current positioning. They are not broader than the wiki sites, but they are stronger than you on semantic support pages.

## 3. BlooketSimulator

Primary strength:

- Breadth and taxonomy depth

What they have:

- very large blook database
- rarity hubs
- individual rarity pages
- pack pages
- broader availability/status coverage
- guide content layered on top

Useful reference URLs:

- https://blooketsimulator.com/blooks
- https://blooketsimulator.com/blooks/chroma
- https://blooketsimulator.com/packs/space
- https://blooketsimulator.com/guides/blooket-chroma-guide

What they do well:

- They create many more indexable topic-entry points
- They cover rarity-level intent, not just pack-level intent
- They capture informational searches like “all chroma blooks” and “space pack drop rates”

Takeaway:

They are ahead of you on topical breadth and “wiki-style” discovery intent.

## 4. Blooket Wiki / Fandom

Primary strength:

- Community encyclopedia depth

What they have:

- Packs
- Blooks
- Chromas
- Legendaries
- Mysticals
- Uniques
- Hidden Blooks
- pack categories
- event and unreleased context
- deep cross-linking

Useful reference URLs:

- https://blooket.fandom.com/wiki/Blooks
- https://blooket.fandom.com/wiki/Packs
- https://blooket.fandom.com/wiki/Chromas
- https://blooket.fandom.com/wiki/Mysticals
- https://blooket.fandom.com/wiki/Uniques
- https://blooket.fandom.com/wiki/Hidden_Blooks

Takeaway:

You probably will not beat Fandom on raw breadth alone. The opportunity is to beat them on:

- accuracy
- clarity
- calculator integration
- cleaner UX
- current pack math

## Topics Competitors Have That You Do Not

These are the clearest content gaps:

- All Chroma Blooks
- All Legendary Blooks
- All Mystical Blooks
- All Unique Blooks
- Hidden Blooks
- Seasonal Packs
- Event-only / retired / unreleased blooks
- Blook Score explained
- Weekly Shop explained
- How to sell blooks
- How to collect blooks with the new Market flow
- Best pack to open for X goal
- Best pack for Chroma hunting
- Best pack for beginners
- Pack comparison pages
- “How many tokens do I need for X” pages
- glossary pages for core terms
- pack schedule / day-based availability pages
- rarity hubs and comparison pages

## Best Opportunity Clusters

### Cluster 1: Rarity Authority

Build:

- `/chroma-blooks`
- `/legendary-blooks`
- `/mystical-blooks`
- `/unique-blooks`
- `/hidden-blooks`
- `/rarest-blooks`

Why this matters:

- High informational demand
- Strong internal linking potential into pack and blook pages
- Competitors already prove this demand exists

### Cluster 2: Pack Strategy

Build:

- best Blooket pack to open
- best pack for legendary odds
- best pack for chroma odds
- best pack by token budget
- pack comparison pages
- seasonal pack strategy pages

Why this matters:

- Very close to calculator intent
- Naturally converts readers into tool usage

### Cluster 3: Current Blooket Mechanics

Build:

- Blook Score guide
- how the new Market works
- how to sell blooks
- how to collect blooks
- weekly shop guide
- how tokens and XP work

Why this matters:

- Helps you align with current Blooket reality
- Lets you cite official help while adding independent strategy/value

### Cluster 4: Glossary / Definitions

Build:

- Blooket tokens
- Blooket packs
- Blooket drop rates
- Blooket chroma
- Blooket legendary
- Blooket mystical
- Blooket unique
- Blooket sell values
- Blooket Blook Score

Why this matters:

- Easy to produce
- Excellent internal linking hubs
- Directly mirrors the cluster BlooketIQ is already using successfully

## Highest-Priority Actions

### Tier 1: Fix immediately

1. Add `/blog` and all blog posts to [app/sitemap.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/app/sitemap.ts).
2. Make [app/rss.xml/route.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/app/rss.xml/route.ts) publish real blog posts.
3. Rewrite [app/llms.txt/route.ts](/Users/Rizwan/Documents/Documents/GitHub/blooket/app/llms.txt/route.ts) so it reflects real URLs only.
4. Add contextual internal links from every blog post into:
   - relevant pack pages
   - relevant blook pages
   - `/packs`
   - `/blooks`
   - `/how-it-works`
   - the homepage calculator

### Tier 2: Build the missing authority pages

1. Create rarity hub pages first:
   - Chromas
   - Legendaries
   - Mysticals
   - Uniques
   - Hidden Blooks
2. Create 5 to 10 glossary pages.
3. Create 3 to 5 “best pack” comparison pages.

### Tier 3: Strengthen trust

1. Replace generic About copy with verifiable details.
2. Add “last updated” and sourcing notes to major editorial pages.
3. Publish a visible methodology page linked from nav/footer and calculator pages.
4. Add update logs or changelogs for pack-table changes.

## Recommended 30-Day Content Plan

Week 1:

- Fix sitemap, RSS, `llms.txt`, and internal linking
- Publish `methodology`
- Publish `blooket-drop-rates`
- Publish `blooket-tokens`

Week 2:

- Publish `chroma-blooks`
- Publish `legendary-blooks`
- Publish `mystical-blooks`
- Publish `unique-blooks`

Week 3:

- Publish `best-blooket-pack-to-open`
- Publish `best-pack-for-chromas`
- Publish `best-pack-for-legendaries`
- Publish `blook-score-explained`

Week 4:

- Publish `how-to-sell-blooks`
- Publish `how-the-blooket-market-works`
- Publish `hidden-blooks`
- Refresh existing rarest-blook article with stronger links and updated entity coverage

## Bottom Line

You already have the bones of a strong authority site because the calculator, pack pages, and blook pages are real assets.

But today you are still closer to a **solid niche tool site** than a **complete Blooket authority site**.

The fastest way to close the gap is:

1. Fix discovery and trust inconsistencies
2. Build rarity and glossary hubs
3. Add current-feature strategy content based on official Blooket help
4. Use internal linking to connect editorial content back into pack and blook entities
