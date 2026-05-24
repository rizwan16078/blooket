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
        ],
      },
    ];
  },
  async redirects() {
    return [
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
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 192, 256],
  },
};

export default nextConfig;
