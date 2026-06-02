import type { Metadata } from "next";
import { Suspense } from "react";
import { siteName, siteUrl } from "@/lib/site";
import RarityQuizGame from "@/components/games/RarityQuizGame";

export const metadata: Metadata = {
  title: "Rarity Quiz — Blooket Mini Game",
  description:
    "A blook image appears — pick the correct rarity as fast as you can! 15 rounds, 8 seconds each. Test your Blooket rarity knowledge.",
  alternates: {
    canonical: `${siteUrl}/games/rarity-quiz`,
    languages: {
      "en-US": `${siteUrl}/games/rarity-quiz`,
      "x-default": `${siteUrl}/games/rarity-quiz`,
    },
  },
  openGraph: {
    title: `Rarity Quiz | ${siteName}`,
    description: "Can you name the rarity of every blook? Speed quiz!",
    type: "website",
    url: `${siteUrl}/games/rarity-quiz`,
  },
};

export default function RarityQuizPage() {
  return (
    <Suspense>
      <RarityQuizGame />
    </Suspense>
  );
}
