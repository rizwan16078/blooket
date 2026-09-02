import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Security + baseline caching for every response (HTML pages,
        // API routes, etc.). s-maxage lets Vercel's edge CDN cache pages
        // for 5 minutes; stale-while-revalidate serves stale content while
        // a background revalidation runs for up to 10 minutes. Browsers
        // treat s-maxage as private and will still revalidate normally.
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            // HSTS — tells browsers to always use HTTPS for 2 years and
            // requests preload-list inclusion. Combined with the CSP
            // upgrade-insecure-requests directive, this eliminates the
            // class of "HTTPS not evaluated" warnings caused by mixed
            // content or first-visit HTTP attempts.
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        // Next.js static bundles are content-hashed (chunk.abc123.js) so
        // they are safe to cache in browsers and CDNs for 1 year. This
        // overrides the wildcard Cache-Control above for this path prefix.
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Next.js Image Optimisation responses include an Etag but no
        // long-lived cache header by default. Cache for 24 h at the edge
        // and serve stale for up to 7 days while revalidating.
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Public-folder static assets (icons, images, font files, txt
        // verification files). 24-hour TTL with 7-day stale window.
        source: '/(.*\\.(?:ico|png|jpg|jpeg|svg|webp|avif|woff|woff2|ttf|otf|xml|txt))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Force HTTPS on any host that forwards a request with
        // x-forwarded-proto=http (Vercel, Netlify, most CDNs). On hosts
        // that already terminate TLS at the edge this rule is a no-op.
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://www.calculatorblooket.com/:path*',
        permanent: true,
      },
      {
        // Canonicalize non-www -> www. Without this, Google sees both
        // calculatorblooket.com and www.calculatorblooket.com as separate
        // URLs serving the same content, which causes "Crawled - currently
        // not indexed" because canonical signals are split. The site's
        // canonical tags all point to www, so this redirect aligns the
        // host with the canonical and consolidates link equity.
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'calculatorblooket.com',
          },
        ],
        destination: 'https://www.calculatorblooket.com/:path*',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      // Low-volume misspelling redirects → home page (calculator)
      { source: '/bloket', destination: '/', permanent: true },
      { source: '/bloklet', destination: '/', permanent: true },
      { source: '/blloket', destination: '/', permanent: true },
      { source: '/blooekt', destination: '/', permanent: true },
      { source: '/blookef', destination: '/', permanent: true },
      { source: '/blookwt', destination: '/', permanent: true },
      { source: '/bloolet', destination: '/', permanent: true },
      { source: '/blookst', destination: '/', permanent: true },
      { source: '/bloojet', destination: '/', permanent: true },
      { source: '/blookte', destination: '/', permanent: true },
      { source: '/blpoket', destination: '/', permanent: true },
      { source: '/blopket', destination: '/', permanent: true },
      { source: '/bloolket', destination: '/', permanent: true },
      { source: '/blookert', destination: '/', permanent: true },
      { source: '/bloooket', destination: '/', permanent: true },
      { source: '/blooklet', destination: '/', permanent: true },
      { source: '/bllokke', destination: '/', permanent: true },
      { source: '/blooked', destination: '/', permanent: true },
      { source: '/blookeg', destination: '/', permanent: true },
      { source: '/blook3t', destination: '/', permanent: true },
      { source: '/blooke5', destination: '/', permanent: true },
      { source: '/blook4t', destination: '/', permanent: true },
      { source: '/bl00ket', destination: '/', permanent: true },
      { source: '/b!ooket', destination: '/', permanent: true },
      { source: '/bl0oket', destination: '/', permanent: true },
      { source: '/blook3', destination: '/', permanent: true },
      // Common alternate spellings that users type directly
      { source: '/blooket-calculator', destination: '/', permanent: true },
      { source: '/blooket-pack-calculator', destination: '/', permanent: true },
      { source: '/blooket-odds', destination: '/', permanent: true },
      { source: '/blooket-pack-odds', destination: '/', permanent: true },
      { source: '/blooket-drop-rates', destination: '/calculators/pack-odds', permanent: true },
      { source: '/blooket-chase-calculator', destination: '/calculators/chase', permanent: true },
      { source: '/blooket-roi-calculator', destination: '/calculators/roi', permanent: true },
      { source: '/blooket-value-calculator', destination: '/calculators/value', permanent: true },
      { source: '/blooket-token-calculator', destination: '/calculators/token-converter', permanent: true },
      { source: '/blooket-simulator', destination: '/', permanent: true },
      { source: '/blooket-pack-simulator', destination: '/', permanent: true },
      // Removed 2026-07-30: four blog posts describing fabricated Blooket
      // "updates" (non-existent Aurora/Cyber packs, fictional rate rebalances
      // that contradicted the verified drop-rate data). 301 to the real
      // changelog so any inbound links / crawler references land on live content.
      { source: '/blog/blooket-update-may-2026', destination: '/updates', permanent: true },
      { source: '/blog/blooket-april-2026-update', destination: '/updates', permanent: true },
      { source: '/blog/blooket-march-2026-update', destination: '/updates', permanent: true },
      { source: '/blog/blooket-february-2026-update', destination: '/updates', permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 192, 256],
  },
  // Hide the floating Next.js dev indicator ("N" / Compiling…) that
  // overlaps the calculator in the bottom-left corner during dev.
  devIndicators: false,
};

export default nextConfig;
