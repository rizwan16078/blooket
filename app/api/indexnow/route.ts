import { NextResponse } from "next/server";

// IndexNow — instant URL submission to Bing (and Yandex via Bing relay).
//
// Usage:
//   POST /api/indexnow
//   Body: { "urls": ["https://www.calculatorblooket.com/space-box-odds", ...] }
//   Header: Authorization: Bearer <INDEXNOW_SECRET>
//
// Or call with no body to submit the full priority URL list automatically.
//
// Bing docs: https://www.bing.com/indexnow/getstarted

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "d82b9999b0764464854cadc2d1c140dc";
const INDEXNOW_SECRET = process.env.INDEXNOW_SECRET ?? "blooket2026";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.calculatorblooket.com";
const BING_ENDPOINT = "https://api.indexnow.org/indexnow";

// Priority URLs submitted when no body is provided — the pages most important
// to have indexed quickly: calculators, pack pages, guides, and rarity hubs.
const PRIORITY_URLS = [
  "/",
  "/packs",
  "/blooks",
  "/blooks/chroma",
  "/blooks/legendary",
  "/blooks/epic",
  "/calculators",
  "/calculators/pack-odds",
  "/calculators/chase",
  "/calculators/roi",
  "/calculators/token-converter",
  "/calculators/value",
  "/space-box-odds",
  "/medieval-box-odds",
  "/aquatic-box-odds",
  "/lunch-box-odds",
  "/bug-box-odds",
  "/pirate-box-odds",
  "/breakfast-box-odds",
  "/bot-box-odds",
  "/safari-box-odds",
  "/dino-box-odds",
  "/wonderland-box-odds",
  "/outback-box-odds",
  "/ice-monster-box-odds",
  "/faq",
  "/guides",
  "/guides/how-to-get-chroma-blooket",
  "/guides/how-to-get-legendary-blooket",
  "/guides/best-blooket-pack-to-open",
  "/guides/blooket-hack-alternative",
  "/blog",
  "/unblocked",
  "/methodology",
  "/about",
].map((path) => `${SITE_URL}${path}`);

export async function POST(request: Request) {
  // Simple shared-secret auth — set INDEXNOW_SECRET in your env vars.
  const authHeader = request.headers.get("authorization");
  if (!INDEXNOW_SECRET || authHeader !== `Bearer ${INDEXNOW_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY env var not set" },
      { status: 500 },
    );
  }

  // Parse optional URL list from body; fall back to priority list.
  let urls: string[] = PRIORITY_URLS;
  try {
    const body = await request.json();
    if (Array.isArray(body.urls) && body.urls.length > 0) {
      urls = body.urls;
    }
  } catch {
    // No body or invalid JSON — use priority list.
  }

  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch(BING_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Bing rejected submission", status: res.status, detail: text },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    submitted: urls.length,
    urls,
  });
}
