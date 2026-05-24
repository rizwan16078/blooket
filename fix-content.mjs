import fs from 'fs';
const path = 'data/blog.tsx';
let c = fs.readFileSync(path, 'utf8');

// Standard FAQ + Pro Tip helpers as rendered JSX strings
const proTip = (text) => `
        <div className="bg-slate-800/50 border-l-4 border-emerald-500 p-6 rounded-r-xl my-8">
          <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
            <span className="bg-emerald-500/20 px-2 py-1 rounded text-xs">PRO TIP</span>
            The Trench Truth
          </h4>
          <p className="text-slate-300 text-sm m-0">${text}</p>
        </div>`;

const faqBlock = (faqs) => `
        <h3 className="text-xl font-bold mt-6 mb-3">FAQ</h3>
        <div className="space-y-4">
${faqs.map(([q, a]) => `          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <p className="font-bold text-white">${q}</p>
            <p className="text-sm text-slate-300 mt-1">${a}</p>
          </div>`).join('\n')}
        </div>`;

// Map: slug => { content: full JSX }
// Each post's new full content (replaces from `content:` open paren/JSX to closing of div before })
const replacements = {};

// 1. blooket-update-may-2026
replacements["blooket-update-may-2026"] = `(
      <div className="prose prose-invert prose-emerald max-w-none">
        <p>
          You logged in this week and your old farming routine suddenly felt off. Drop rates moved, two new packs landed, and the calculator numbers you memorized last month are now stale. Updates are stressful when you have a token budget. Here is exactly what shipped in the May 2026 patch and how to adjust your spending without wasting a single token.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-emerald-400">The New Packs</h2>
        <p>
          Two new boxes joined the rotation: the <strong>Aurora Pack</strong> at 25 tokens and the <strong>Cyber Pack</strong> at 30 tokens. Both contain new exclusive Legendaries and one new Chroma each. The headline change is that Aurora's Legendary rate sits at 0.08% &mdash; the highest of any current pack.
        </p>

        <table className="w-full text-left border-collapse my-6">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3 px-4 font-bold text-slate-200">Pack</th>
              <th className="py-3 px-4 font-bold text-slate-200">Cost</th>
              <th className="py-3 px-4 font-bold text-slate-200">Legendary Rate</th>
              <th className="py-3 px-4 font-bold text-slate-200">Verdict</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800">
              <td className="py-3 px-4">Aurora (NEW)</td>
              <td className="py-3 px-4">25</td>
              <td className="py-3 px-4 text-emerald-400">0.08%</td>
              <td className="py-3 px-4 text-emerald-400">Best Legendary value</td>
            </tr>
            <tr className="border-b border-slate-800">
              <td className="py-3 px-4">Cyber (NEW)</td>
              <td className="py-3 px-4">30</td>
              <td className="py-3 px-4 text-amber-400">0.05%</td>
              <td className="py-3 px-4 text-amber-400">Cool Blooks, mid value</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Space (Buffed)</td>
              <td className="py-3 px-4">20</td>
              <td className="py-3 px-4 text-amber-400">0.06%</td>
              <td className="py-3 px-4 text-amber-400">Now competitive again</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-emerald-400">Drop Rate Adjustments</h2>
        <p>
          The Space Pack received a <strong>+0.01% Legendary buff</strong>, putting it back into the conversation. The Medieval Pack lost 0.5% on Rares. Common rates were unchanged across the board. None of the changes are huge in isolation, but compounded over thousands of pulls they shift which packs are mathematically optimal.
        </p>
${proTip(`Aurora is now the cheapest path to a Legendary by token count. If you are saving for any Legendary (not a specific one), switch your farming target to Aurora. Old Space Pack calculations are obsolete &mdash; refresh the math on the <Link href="/" className="text-emerald-400 hover:text-emerald-300">calculator</Link> before you spend.`)}

        <p className="mt-6">
          Compare every pack with the <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300">ROI tool</Link>, look up exact tokens with the <Link href="/" className="text-emerald-400 hover:text-emerald-300">calculator</Link>, browse the <Link href="/packs" className="text-emerald-400 hover:text-emerald-300">pack hub</Link>, plan farming with the <Link href="/guides/blooket-tokens" className="text-emerald-400 hover:text-emerald-300">token guide</Link>, or read the <Link href="/methodology" className="text-emerald-400 hover:text-emerald-300">methodology</Link> for how we source rates.
        </p>
${faqBlock([
  ["Did all pack drop rates change in May 2026?", "No &mdash; only Space (buffed) and Medieval (slightly nerfed). All other packs kept their pre-update rates. Aurora and Cyber are entirely new additions."],
  ["Is the Aurora Pack worth opening?", "Yes, if you want any Legendary. At 0.08% Legendary rate and 25-token cost, it is the most token-efficient Legendary pack right now. Use the <Link href=\\\"/calculators/chase\\\" className=\\\"text-emerald-400 hover:text-emerald-300\\\">chase calculator</Link> for exact numbers."],
  ["Will the old packs come back to old rates?", "Unlikely. Blooket rebalances rather than reverts. Treat the new rates as the new normal."],
  ["How do I know the calculator uses the latest rates?", "Our drop rates are updated within 24 hours of every patch. See the <Link href=\\\"/methodology\\\" className=\\\"text-emerald-400 hover:text-emerald-300\\\">methodology</Link> page for the source-of-truth."],
  ["Should I dump my Space Pack tokens to chase Aurora?", "If your goal is any Legendary, yes. If you are chasing a specific Space-only Blook, keep farming Space. The buff makes it more efficient than before."],
])}
      </div>
    )`;

// 2. blooket-quiz-import-tricks
replacements["blooket-quiz-import-tricks"] = `(
      <div className="prose prose-invert prose-emerald max-w-none">
        <p>
          You loaded into Cafe mode with a 50-question Spanish vocab set and earned 30 tokens before your hand cramped. Question difficulty directly throttles your tokens-per-minute. The fix is not playing harder &mdash; it is importing a smarter quiz set. Here is how to stack the deck legally.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-emerald-400">Why Quiz Imports Matter</h2>
        <p>
          Token earnings in farming modes scale with the number of correct answers per round. A 50-question set with multi-step math reduces your answer rate. A 50-question set of <strong>1+1, 1+2, 1+3</strong> triples your tokens-per-minute because every answer takes one second to recognize.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-3">The Quizlet Pipeline</h3>
        <p>
          Blooket lets you import any Quizlet set with a single URL paste. Build or copy a Quizlet set with trivial questions, paste the URL into Blooket's import modal, and host a Cafe game using that set. Your earnings will jump immediately.
        </p>

        <table className="w-full text-left border-collapse my-6">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-3 px-4 font-bold text-slate-200">Quiz Type</th>
              <th className="py-3 px-4 font-bold text-slate-200">Avg Time/Q</th>
              <th className="py-3 px-4 font-bold text-slate-200">Tokens/Min</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-800">
              <td className="py-3 px-4">Basic math (1+1)</td>
              <td className="py-3 px-4 text-emerald-400">~1s</td>
              <td className="py-3 px-4 text-emerald-400">~13</td>
            </tr>
            <tr className="border-b border-slate-800">
              <td className="py-3 px-4">Vocabulary</td>
              <td className="py-3 px-4 text-amber-400">~3s</td>
              <td className="py-3 px-4 text-amber-400">~7</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Multi-step math</td>
              <td className="py-3 px-4 text-red-400">~10s</td>
              <td className="py-3 px-4 text-red-400">~3</td>
            </tr>
          </tbody>
        </table>
${proTip(`Search Quizlet for "Blooket farming" and you will find dozens of pre-built basic-math sets created by other players. Save five of them to your account so you can rotate without manually building anything. The whole setup takes under 2 minutes.`)}

        <p className="mt-6">
          For more farming optimization, read the <Link href="/guides/blooket-tokens" className="text-emerald-400 hover:text-emerald-300">token guide</Link>, compare modes in the <Link href="/blog/blooket-cafe-mode-guide" className="text-emerald-400 hover:text-emerald-300">Cafe mode guide</Link>, or check the <Link href="/blog/blooket-best-class-setup" className="text-emerald-400 hover:text-emerald-300">class setup post</Link>. Then plan spending with the <Link href="/" className="text-emerald-400 hover:text-emerald-300">calculator</Link>, <Link href="/calculators/token-converter" className="text-emerald-400 hover:text-emerald-300">token converter</Link>, or <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300">ROI tool</Link>.
        </p>
${faqBlock([
  ["Is importing a basic-math Quizlet set against the rules?", "No. Quizlet imports are a built-in Blooket feature. You are using the platform as designed."],
  ["What is the best quiz set for farming?", "Any 50-question set of single-digit addition. Search Quizlet for \"Blooket farming math\" to find pre-made options."],
  ["Does this work in every game mode?", "Cafe and Factory work best. Tower Defense and Fishing Frenzy do not benefit because their token output is not tied to answer speed."],
  ["Will I get banned for using easy quiz sets?", "No. Blooket has no rule against quiz difficulty. Teachers see flagged events only when accounts trigger automated systems."],
  ["How many tokens can I earn per hour with this trick?", "Around 500 tokens, which is the daily cap. You will hit the limit in roughly 30 minutes of focused play."],
])}
      </div>
    )`;

// Helper to replace a post's content. Find slug then replace content from `content:` to next `\n  },`
function replaceContent(c, slug, newContent) {
  const slugIdx = c.indexOf(`slug: "${slug}"`);
  if (slugIdx < 0) {
    console.warn(`SLUG NOT FOUND: ${slug}`);
    return c;
  }
  const contentIdx = c.indexOf('content:', slugIdx);
  if (contentIdx < 0) {
    console.warn(`CONTENT NOT FOUND: ${slug}`);
    return c;
  }
  // Find the closing of this post: search for "\n  },\n  {" or "\n  }\n];" after contentIdx
  let depth = 0;
  let i = contentIdx + 'content:'.length;
  // Skip whitespace
  while (i < c.length && /\s/.test(c[i])) i++;
  // The content can start with `(` (parenthesized JSX) or `<` (direct JSX)
  // We'll find the matching end by tracking paren / angle / brace depth carefully
  // Simpler: find next "\n  },\n" after content start where the brace closes the post object
  // The post object structure:  { slug: ..., content: <jsx> } or { ..., content: (...) }
  // Find the first "\n  },\n  {" or "\n  }\n];" after contentIdx
  const reEnd = /\r?\n  \},\r?\n  \{|\r?\n  \}\r?\n\];/g;
  reEnd.lastIndex = contentIdx;
  const m = reEnd.exec(c);
  const endIdx = m ? m.index : -1;
  if (endIdx < 0) {
    console.warn(`END NOT FOUND: ${slug}`);
    return c;
  }
  // Replace from contentIdx to endIdx with new content
  const before = c.slice(0, contentIdx);
  const after = c.slice(endIdx);
  return before + `content: ${newContent}` + after;
}

let count = 0;
for (const [slug, content] of Object.entries(replacements)) {
  const before = c.length;
  c = replaceContent(c, slug, content);
  if (c.length !== before) count++;
}

fs.writeFileSync(path, c);
console.log(`Replaced content for ${count} posts`);
