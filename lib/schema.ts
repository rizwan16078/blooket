import type { Pack } from "@/lib/packs";

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
    name: "Blooket Calculator",
    url: "https://calculatorblooket.com",
    logo: "https://calculatorblooket.com/icon.svg",
    description: "Production-grade Blooket pack odds calculator with exact probability math.",
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Blooket Calculator",
    url: "https://calculatorblooket.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://calculatorblooket.com/packs?search={search_term_string}"
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
        url: "https://calculatorblooket.com/"
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Packs",
        url: "https://calculatorblooket.com/packs"
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Blook Library",
        url: "https://calculatorblooket.com/blooks"
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "How It Works",
        url: "https://calculatorblooket.com/how-it-works"
      }
    ]
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
