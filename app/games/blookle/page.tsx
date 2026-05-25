import type { Metadata } from "next";
import { Suspense } from "react";
import { siteName, siteUrl } from "@/lib/site";
import BlookleGame from "@/components/games/BlookleGame";

export const metadata: Metadata = {
  title: "Blookle — Blooket Wordle-Style Game",
  description:
    "Guess the mystery blook in 6 tries! Each guess reveals clues about rarity, pack, drop rate, and sell value. A Wordle-style Blooket mini game.",
  openGraph: {
    title: `Blookle | ${siteName}`,
    description: "Guess the blook in 6 tries with clue-based feedback!",
    type: "website",
    url: `${siteUrl}/games/blookle`,
  },
};

export default function BlooklePage() {
  return (
    <Suspense>
      <BlookleGame />
    </Suspense>
  );
}
