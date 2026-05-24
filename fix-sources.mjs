import fs from 'fs';

const path = 'data/blog.tsx';
let c = fs.readFileSync(path, 'utf8');

// Pool of authoritative sources by topic
const extra = {
  default: [
    { label: "Blooket Help: How to Earn Tokens/XP", href: "https://help.blooket.com/hc/en-us/articles/16293484738839-Earning-Tokens-XP" },
    { label: "Blooket Help: How to Collect Blooks", href: "https://help.blooket.com/hc/en-us/articles/16620639672599-How-to-Collect-Blooks" },
    { label: "Blooket Wiki: Blooks", href: "https://blooket.fandom.com/wiki/Blooks" },
  ],
  rarity: [
    { label: "Blooket Wiki: Rarity", href: "https://blooket.fandom.com/wiki/Rarity" },
    { label: "Blooket Help: Blooks Page Overview", href: "https://help.blooket.com/hc/en-us/articles/31595510812183-Blooks-Page-Overview" },
  ],
  modes: [
    { label: "Blooket Help: Game Modes", href: "https://help.blooket.com/hc/en-us/categories/16204982432791-Game-Modes" },
    { label: "Blooket Wiki: Game Modes", href: "https://blooket.fandom.com/wiki/Game_Modes" },
  ],
  calculator: [
    { label: "Blooket Calculator Methodology", href: "https://www.calculatorblooket.com/methodology" },
    { label: "Blooket Calculator: Pack Center", href: "https://www.calculatorblooket.com/packs" },
  ],
};

function picker(slug, category) {
  const lc = slug.toLowerCase();
  const pool = [];
  if (/chroma|legendary|mystical|epic|rare|uncommon|common|odds|drop|deceptive/.test(lc)) {
    pool.push(...extra.rarity);
  }
  if (/cafe|factory|gold-quest|racing|battle|fishing|crypto|tower|host|class-setup|mode/.test(lc)) {
    pool.push(...extra.modes);
  }
  if (/calculator|simulator|saving|odds-comparison/.test(lc)) {
    pool.push(...extra.calculator);
  }
  // Always add defaults
  pool.push(...extra.default);
  // De-duplicate
  const seen = new Set();
  return pool.filter(s => {
    if (seen.has(s.href)) return false;
    seen.add(s.href);
    return true;
  });
}

// Match each post's sources block and the surrounding metadata to identify slug
const postBlocks = [...c.matchAll(/(\{\s*slug:\s*"([^"]+)"[\s\S]*?sources:\s*)\[([\s\S]*?)\]/g)];

let edits = 0;
for (const m of postBlocks) {
  const fullMatch = m[0];
  const slug = m[2];
  const inner = m[3];
  
  // Parse existing sources
  const existing = [...inner.matchAll(/\{\s*label:\s*"([^"]+)"\s*,\s*href:\s*"([^"]+)"\s*\}/g)]
    .map(e => ({ label: e[1], href: e[2] }));
  
  if (existing.length >= 3) continue;
  
  const candidates = picker(slug);
  const seenHrefs = new Set(existing.map(e => e.href));
  const toAdd = [];
  for (const cand of candidates) {
    if (seenHrefs.has(cand.href)) continue;
    toAdd.push(cand);
    seenHrefs.add(cand.href);
    if (existing.length + toAdd.length >= 3) break;
  }
  
  if (!toAdd.length) continue;
  
  const all = [...existing, ...toAdd];
  const formatted = all
    .map(s => `      { label: "${s.label}", href: "${s.href}" }`)
    .join(',\n');
  
  const newSources = `[\n${formatted},\n    ]`;
  const oldSources = `[${inner}]`;
  
  c = c.replace(oldSources, newSources);
  edits++;
}

fs.writeFileSync(path, c);
console.log(`Updated sources in ${edits} posts`);
