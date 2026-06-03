"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Command } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchItem = {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
};

const SEARCH_INDEX: SearchItem[] = [
  // Calculators
  { title: "Main Calculator", description: "All-in-one interactive pack odds tool", href: "/", icon: "🎯", category: "Calculators" },
  { title: "Pack Odds", description: "Live drop rates for every pack", href: "/calculators/pack-odds", icon: "📊", category: "Calculators" },
  { title: "ROI Calculator", description: "Best value pack per token spent", href: "/calculators/roi", icon: "💰", category: "Calculators" },
  { title: "Token Converter", description: "How many packs your tokens buy", href: "/calculators/token-converter", icon: "🪙", category: "Calculators" },
  { title: "Blook Value Calculator", description: "Sell values for every blook", href: "/calculators/value", icon: "💎", category: "Calculators" },
  { title: "Chase Calculator", description: "Tokens needed for any blook", href: "/calculators/chase", icon: "👑", category: "Calculators" },
  { title: "Token Grinder", description: "Fastest way to earn daily tokens", href: "/calculators/token-grinder", icon: "⚡", category: "Calculators" },

  // Games
  { title: "Guess the Blook", description: "Blur reveal — name the blook", href: "/games/guess-the-blook", icon: "🔍", category: "Games" },
  { title: "Blookle", description: "Wordle-style blook guessing game", href: "/games/blookle", icon: "🟩", category: "Games" },
  { title: "Rarity Quiz", description: "Speed quiz — pick the right rarity", href: "/games/rarity-quiz", icon: "⚡", category: "Games" },

  // Packs
  { title: "All Packs", description: "Browse every Blooket pack", href: "/packs", icon: "📦", category: "Packs" },
  { title: "Space Pack", description: "20 tokens — Astronaut, Colored Astronauts", href: "/?pack=space", icon: "🚀", category: "Packs" },
  { title: "Medieval Pack", description: "20 tokens — King, Unicorn, Dragon", href: "/?pack=medieval", icon: "⚔️", category: "Packs" },
  { title: "Aquatic Pack", description: "20 tokens — Megalodon, Baby Shark, Dolphin", href: "/?pack=aquatic", icon: "🐠", category: "Packs" },
  { title: "Blizzard Pack", description: "25 tokens — Santa Claus, Peppermint Bark (seasonal)", href: "/?pack=blizzard", icon: "❄️", category: "Packs" },
  { title: "Lunch Pack", description: "25 tokens — Sandwich, Half a Sandwich", href: "/?pack=lunch", icon: "🥪", category: "Packs" },
  { title: "Bug Pack", description: "25 tokens — Blue Butterfly, Butterfly", href: "/?pack=bug", icon: "🐛", category: "Packs" },
  { title: "Pirate Pack", description: "25 tokens — Captain Blackbeard, Pirate Pufferfish", href: "/?pack=pirate", icon: "🏴‍☠️", category: "Packs" },
  { title: "Breakfast Pack", description: "20 tokens — French Toast, Pizza", href: "/?pack=breakfast", icon: "🥞", category: "Packs" },
  { title: "Bot Pack", description: "20 tokens — Mega Bot, Brainy Bot", href: "/?pack=bot", icon: "🤖", category: "Packs" },
  { title: "Safari Pack", description: "20 tokens — Rainbow Panda, Lion", href: "/?pack=safari", icon: "🦁", category: "Packs" },
  { title: "Dino Pack", description: "25 tokens — T-Rex, Triceratops", href: "/?pack=dino", icon: "🦕", category: "Packs" },
  { title: "Spooky Pack", description: "25 tokens — Ghost, Skeleton Fish (seasonal)", href: "/?pack=spooky", icon: "👻", category: "Packs" },
  { title: "Wonderland Pack", description: "20 tokens — King of Hearts, Mad Hatter", href: "/?pack=wonderland", icon: "🎩", category: "Packs" },
  { title: "Outback Pack", description: "25 tokens — Sugar Glider, Teal Platypus", href: "/?pack=outback", icon: "🐨", category: "Packs" },
  { title: "Ice Monster Pack", description: "25 tokens — Yeti, Ice Slime, Frozen Fossil", href: "/?pack=ice-monster", icon: "🧊", category: "Packs" },
  { title: "Autumn Pack", description: "25 tokens — Turkey, Goldfinch (seasonal)", href: "/?pack=autumn", icon: "🍂", category: "Packs" },

  // Blooks (top chase blooks)
  { title: "All Blooks", description: "Browse every blook by pack and rarity", href: "/blooks", icon: "🎭", category: "Blooks" },
  { title: "Rainbow Panda", description: "Chroma — Safari Pack — 0.02%", href: "/blooks/safari-rainbow-panda", icon: "🌈", category: "Blooks" },
  { title: "Megalodon", description: "Legendary — Aquatic Pack — 0.2% (sells 250!)", href: "/blooks/aquatic-megalodon", icon: "🦈", category: "Blooks" },
  { title: "Astronaut", description: "Legendary — Space Pack — 0.45%", href: "/blooks/space-astronaut", icon: "👨‍🚀", category: "Blooks" },
  { title: "King", description: "Legendary — Medieval Pack — 1%", href: "/blooks/medieval-king", icon: "👑", category: "Blooks" },
  { title: "Mega Bot", description: "Legendary — Bot Pack — 0.3%", href: "/blooks/bot-mega-bot", icon: "🤖", category: "Blooks" },
  { title: "Santa Claus", description: "Legendary — Blizzard Pack — 1%", href: "/blooks/blizzard-santa-claus", icon: "🎅", category: "Blooks" },
  { title: "Ghost", description: "Legendary — Spooky Pack — 0.65%", href: "/blooks/spooky-ghost", icon: "👻", category: "Blooks" },
  { title: "Lion", description: "Legendary — Safari Pack — 0.5%", href: "/blooks/safari-lion", icon: "🦁", category: "Blooks" },
  { title: "Tyrannosaurus Rex", description: "Legendary — Dino Pack — 0.3%", href: "/blooks/dino-tyrannosaurus-rex", icon: "🦖", category: "Blooks" },
  { title: "Yeti", description: "Legendary — Ice Monster Pack — 0.35%", href: "/blooks/ice-monster-yeti", icon: "🧊", category: "Blooks" },
  { title: "Pink Astronaut", description: "Chroma — Space Pack — 0.05% (rotating)", href: "/blooks/space-pink-astronaut", icon: "🩷", category: "Blooks" },
  { title: "Blue Butterfly", description: "Chroma — Bug Pack — 0.03%", href: "/blooks/bug-blue-butterfly", icon: "🦋", category: "Blooks" },
  { title: "Peppermint Bark", description: "Chroma — Blizzard Pack — 0.03%", href: "/blooks/blizzard-peppermint-bark", icon: "🍬", category: "Blooks" },
  { title: "Half a Sandwich", description: "Chroma — Lunch Pack — 0.04%", href: "/blooks/lunch-half-a-sandwich", icon: "🥪", category: "Blooks" },
  { title: "Pirate Pufferfish", description: "Chroma — Pirate Pack — 0.03%", href: "/blooks/pirate-pirate-pufferfish", icon: "🐡", category: "Blooks" },
  { title: "Teal Platypus", description: "Chroma — Outback Pack — 0.03%", href: "/blooks/outback-teal-platypus", icon: "🦆", category: "Blooks" },
  { title: "Goldfinch", description: "Chroma — Autumn Pack — 0.05%", href: "/blooks/autumn-goldfinch", icon: "🐦", category: "Blooks" },
  { title: "Skeleton Fish", description: "Chroma — Spooky Pack — 0.04%", href: "/blooks/spooky-skeleton-fish", icon: "💀", category: "Blooks" },
  { title: "Ice Slime", description: "Chroma — Ice Monster Pack — 0.08%", href: "/blooks/ice-monster-ice-slime", icon: "🧊", category: "Blooks" },
  { title: "Frozen Fossil", description: "Chroma — Ice Monster Pack — 0.05%", href: "/blooks/ice-monster-frozen-fossil", icon: "🦴", category: "Blooks" },
  { title: "Ice Crab", description: "Chroma — Ice Monster Pack — 0.02%", href: "/blooks/ice-monster-ice-crab", icon: "🦀", category: "Blooks" },
  { title: "Super Glider", description: "Chroma — Spooky Pack — 0.02%", href: "/blooks/spooky-super-glider", icon: "🪂", category: "Blooks" },
  { title: "Chilly Chameleon", description: "Chroma — Blizzard Pack — 0.02%", href: "/blooks/blizzard-chilly-chameleon", icon: "🦎", category: "Blooks" },
  { title: "Captain Blackbeard", description: "Legendary — Pirate Pack — 0.3%", href: "/blooks/pirate-captain-blackbeard", icon: "🏴‍☠️", category: "Blooks" },
  { title: "Sugar Glider", description: "Legendary — Outback Pack — 0.37%", href: "/blooks/outback-sugar-glider", icon: "🐿️", category: "Blooks" },
  { title: "Turkey", description: "Legendary — Autumn Pack — 1%", href: "/blooks/autumn-turkey", icon: "🦃", category: "Blooks" },
  { title: "Sandwich", description: "Legendary — Lunch Pack — 0.65%", href: "/blooks/lunch-sandwich", icon: "🥪", category: "Blooks" },
  { title: "Butterfly", description: "Legendary — Bug Pack — 0.5%", href: "/blooks/bug-butterfly", icon: "🦋", category: "Blooks" },
  { title: "King of Hearts", description: "Legendary — Wonderland Pack — 0.3%", href: "/blooks/wonderland-king-of-hearts", icon: "🃏", category: "Blooks" },

  // Value Guide
  { title: "Value Guide", description: "Trade values for every blook", href: "/value-guide", icon: "📈", category: "Resources" },

  // Resources
  { title: "Guides", description: "Blooket strategy guides and tutorials", href: "/guides", icon: "📖", category: "Resources" },
  { title: "Blog", description: "Latest Blooket news and updates", href: "/blog", icon: "📝", category: "Resources" },
  { title: "FAQ", description: "Common questions about Blooket", href: "/faq", icon: "❓", category: "Resources" },
  { title: "Glossary", description: "Blooket terms explained", href: "/glossary", icon: "📚", category: "Resources" },
  { title: "How It Works", description: "How our calculator math works", href: "/how-it-works", icon: "⚙️", category: "Resources" },
  { title: "Methodology", description: "Our probability methodology", href: "/methodology", icon: "🔬", category: "Resources" },

  // Info
  { title: "About", description: "About Blooket Calculator", href: "/about", icon: "ℹ️", category: "Info" },
  { title: "Contact", description: "Get in touch with us", href: "/contact", icon: "✉️", category: "Info" },
  { title: "Blooket Unblocked", description: "How to access Blooket anywhere", href: "/unblocked", icon: "🔓", category: "Info" },
  { title: "Is Blooket Plus Worth It?", description: "Blooket Plus subscription review", href: "/is-blooket-plus-worth-it", icon: "⭐", category: "Info" },
];

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  // Direct substring match
  if (t.includes(q)) return true;
  // Fuzzy: each char of query appears in order in text
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim()
    ? SEARCH_INDEX.filter(
        (item) =>
          fuzzyMatch(query, item.title) ||
          fuzzyMatch(query, item.description) ||
          fuzzyMatch(query, item.category),
      )
    : SEARCH_INDEX.slice(0, 8); // Show popular items when empty

  // Group results by category
  const grouped = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatResults = results;

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatResults[selectedIndex]) {
        e.preventDefault();
        router.push(flatResults[selectedIndex].href);
        setOpen(false);
      }
    },
    [flatResults, selectedIndex, router],
  );

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/40 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white/60"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-4 hidden items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/30 xl:flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition hover:text-white/60 lg:hidden"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Overlay — CSS opacity transition, no framer-motion */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in duration-100"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed left-1/2 top-[15%] z-[61] w-[calc(100vw-32px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0f1629] shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-150"
          >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-white/30" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search packs, blooks, calculators..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                />
                {query && (
                  <button
                    onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                    className="text-white/30 hover:text-white/60"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/30 sm:flex">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
                {flatResults.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-white/30">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                        {category}
                      </p>
                      {items.map((item) => {
                        const flatIndex = flatResults.indexOf(item);
                        const isSelected = flatIndex === selectedIndex;
                        return (
                          <Link
                            key={item.href + item.title}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            onMouseEnter={() => setSelectedIndex(flatIndex)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                              isSelected
                                ? "bg-violet-500/10 text-white"
                                : "text-white/70 hover:bg-white/[0.03]"
                            }`}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-semibold truncate ${isSelected ? "text-violet-200" : "text-white/80"}`}>
                                {item.title}
                              </p>
                              <p className="text-[11px] text-white/35 truncate">{item.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2 text-[10px] text-white/20">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">↵</kbd>
                  open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">esc</kbd>
                  close
                </span>
              </div>
          </div>
          </>
        )}
    </>
  );
}
