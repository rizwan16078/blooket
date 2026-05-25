import type { Metadata } from "next";
import { Suspense } from "react";
import { siteName, siteUrl } from "@/lib/site";
import GuessTheBlookGame from "@/components/games/GuessTheBlookGame";

export const metadata: Metadata = {
  title: "Guess the Blook! — Blooket Mini Game",
  description:
    "A blurred blook image is shown — can you guess which blook it is? Test your Blooket knowledge with this fun mini game.",
  openGraph: {
    title: `Guess the Blook! | ${siteName}`,
    description: "Can you identify the blurred blook? Test your knowledge!",
    type: "website",
    url: `${siteUrl}/games/guess-the-blook`,
  },
};

export default function GuessTheBlookPage() {
  return (
    <Suspense>
      <GuessTheBlookGame />
    </Suspense>
  );
}
