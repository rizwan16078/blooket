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

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
