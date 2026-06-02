import type { Pack } from "@/lib/packs";
import { siteUrl } from "@/lib/site";

export type FaqEntry = {
  question: string;
  answer: string;
};

export function buildFaqSchema(faqs: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildSoftwareSchema(pack: Pack) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${pack.name} Blooket Calculator`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    description:
      "Interactive Blooket calculator with exact probability math, dupe refund modeling, and pack-specific drop rate tables.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Exact binomial probability calculations",
      "Pack-specific legendary and chroma odds",
      "Precomputed duplicate refund effective costs",
      "Client-side full simulation in a web worker",
    ],
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Blooket Calculator",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: "Production-grade Blooket pack odds calculator with exact probability math.",
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Blooket Calculator",
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/packs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildSiteNavigationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Calculator",
        url: `${siteUrl}/`
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Packs",
        url: `${siteUrl}/packs`
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Blook Library",
        url: `${siteUrl}/blooks`
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Guides",
        url: `${siteUrl}/guides`
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "Methodology",
        url: `${siteUrl}/methodology`
      }
    ]
  };
}

export function buildPersonSchema(person: {
  name: string;
  jobTitle: string;
  url: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    description: person.description,
    worksFor: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export const TEAM_MEMBERS = [
  {
    name: "Alex M.",
    jobTitle: "Lead Developer & Mathematician",
    url: `${siteUrl}/team#alex`,
    description:
      "Alex handles the core probability engine and ensures all drop rates reflect accurate binomial distributions.",
  },
  {
    name: "Sam T.",
    jobTitle: "UI/UX Designer",
    url: `${siteUrl}/team#sam`,
    description:
      "Sam focuses on making the calculator intuitive and visually appealing, bringing the glassmorphic design to life.",
  },
] as const;

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export type BreadcrumbItem = {
  name: string;
  item: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
