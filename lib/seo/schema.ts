import {
  DATASET_CSV_PATH,
  DATASET_JSON_PATH,
  DATASET_LICENSE_URL,
} from "@/lib/dataset";
import type { Blook, PackRecord } from "@/types";

type BuildPacksPageSchemaOptions = {
  packs: PackRecord[];
  packBlooksMap: Record<string, Blook[]>;
  siteName: string;
  siteUrl: string;
};

function buildPackBreadcrumbSchema(pack: PackRecord, siteUrl: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/packs#${pack.id}-breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": siteUrl,
          name: "Home",
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@id": `${siteUrl}/packs`,
          name: "Packs",
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@id": `${siteUrl}/packs#${pack.id}`,
          name: `${pack.name} Pack`,
        },
      },
    ],
  };
}

function buildPackTableSchema(
  pack: PackRecord,
  blooks: Blook[],
  siteUrl: string,
  siteName: string,
  catalogId: string,
) {
  return {
    "@type": ["Dataset", "ItemList"],
    "@id": `${siteUrl}/packs#${pack.id}-table`,
    includedInDataCatalog: {
      "@id": catalogId,
    },
    name: `${pack.name} Pack drop rates table`,
    description: pack.description,
    url: `${siteUrl}/packs#${pack.id}`,
    image: `${siteUrl}${pack.imageUrl}`,
    creator: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    // These tables are the same figures published at /dataset, so they carry
    // the same CC BY 4.0 licence rather than the site's general terms page.
    // distribution is what turns a Dataset block from a description of data
    // into something a crawler can actually fetch and cite.
    license: DATASET_LICENSE_URL,
    isAccessibleForFree: true,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${siteUrl}${DATASET_CSV_PATH}`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${siteUrl}${DATASET_JSON_PATH}`,
      },
    ],
    numberOfItems: blooks.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    keywords: [
      `${pack.name} Pack`,
      "Blooket calculator",
      "drop rates",
      "sell values",
      pack.isLocked ? "locked pack" : "live pack",
    ],
    variableMeasured: [
      {"@type": "PropertyValue", name: "Cost Per Pull", value: pack.costPerPull, unitText: "tokens" },
      {"@type": "PropertyValue", name: "Effective Cost", value: pack.effectiveCost, unitText: "tokens" },
      {"@type": "PropertyValue", name: "Blooks Count", value: blooks.length },
    ],
    itemListElement: blooks.map((blook, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        "@id": `${siteUrl}/blooks/${blook.id}`,
        name: blook.name,
        image: `${siteUrl}${blook.imageUrl}`,
        description: `${blook.rarity} blook in the ${pack.name} Pack with a ${(
          blook.dropRate * 100
        ).toFixed(2)}% drop rate and ${blook.sellValue} token sell value.`,
        url: `${siteUrl}/blooks/${blook.id}`,
      },
    })),
  };
}

export function buildPacksPageSchema({
  packs,
  packBlooksMap,
  siteName,
  siteUrl,
}: BuildPacksPageSchemaOptions) {
  const catalogId = `${siteUrl}/packs#pack-data-catalog`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/packs`,
        name: "Blooket Pack Drop Rates & Odds Tables",
        description:
          "Structured pack tables, drop rates, sell values, and simulator launch paths for the Blooket Calculator.",
        url: `${siteUrl}/packs`,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          name: siteName,
          url: siteUrl,
        },
        mainEntity: {
          "@id": catalogId,
        },
        hasPart: packs.map((pack) => ({
          "@id": `${siteUrl}/packs#${pack.id}-table`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/packs#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": siteUrl,
              name: "Home",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@id": `${siteUrl}/packs`,
              name: "Packs",
            },
          },
        ],
      },
      {
        "@type": "DataCatalog",
        "@id": catalogId,
        name: "Blooket Pack Data Catalog",
        description:
          "Indexed pack datasets used by the Blooket Calculator authority hub.",
        url: `${siteUrl}/packs`,
        dataset: packs.map((pack) => ({
          "@id": `${siteUrl}/packs#${pack.id}-table`,
        })),
      },
      ...packs.flatMap((pack) => [
        buildPackBreadcrumbSchema(pack, siteUrl),
        buildPackTableSchema(pack, packBlooksMap[pack.id] ?? [], siteUrl, siteName, catalogId),
      ]),
    ],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
