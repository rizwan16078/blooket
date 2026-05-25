import type { Metadata } from "next";
import Link from "next/link";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Mini Games — Guess the Blook, Blookle & More",
  description:
    "Free Blooket mini games: Guess the Blook (blur reveal), Blookle (Wordle-style), and Rarity Quiz. No signup needed.",
  openGraph: {
    title: `Mini Games | ${siteName}`,
    description: "Free Blooket mini games — test your knowledge!",
    type: "website",
    url: `${siteUrl}/games`,
  },
};

const games = [
  {
    title: "Guess the Blook",
    description:
      "A blurred blook image is shown — type the name to guess. Harder difficulty = more blur. Track your streak!",
    href: "/games/guess-the-blook",
    icon: "🔍",
    tag: "Blur Reveal",
    tagColor: "text-teal-300 bg-teal-500/10 border-teal-400/20",
  },
  {
    title: "Blookle",
    description:
      "Guess the mystery blook in 6 tries! Each guess reveals clues about rarity, pack, drop rate, and sell value — like Wordle for Blooket.",
    href: "/games/blookle",
    icon: "🟩",
    tag: "Wordle-Style",
    tagColor: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
  },
  {
    title: "Rarity Quiz",
    description:
      "A blook image appears — pick the correct rarity as fast as you can! 15 rounds, 8 seconds each. Beat your high score!",
    href: "/games/rarity-quiz",
    icon: "⚡",
    tag: "Speed Quiz",
    tagColor: "text-amber-300 bg-amber-500/10 border-amber-400/20",
  },
];

export default function GamesHubPage() {
  return (
    <main className="mx-auto flex-1 w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Mini Games
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blooket Mini Games
          <span className="mt-2 block text-xl font-medium text-violet-300">
            Test your Blooket knowledge
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          Free mini games built for Blooket fans. No signup, no ads — just
          quick fun between pack opens.
        </p>
      </section>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg transition hover:border-violet-500/25 hover:bg-white/[0.04]"
          >
            <span className="text-3xl">{game.icon}</span>
            <div className="mt-4 flex items-center gap-2">
              <h2 className="text-lg font-bold text-white group-hover:text-violet-300">
                {game.title}
              </h2>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${game.tagColor}`}
              >
                {game.tag}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/50">
              {game.description}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
        <h2 className="text-2xl font-bold text-white">More coming soon</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">
          We are building more mini games for Blooket fans. Have an idea?{" "}
          <Link href="/team" className="text-emerald-400 hover:text-emerald-300">
            Let us know
          </Link>
          . In the meantime, check out the{" "}
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">
            main calculator
          </Link>{" "}
          for serious pack strategy.
        </p>
      </section>
    </main>
  );
}
