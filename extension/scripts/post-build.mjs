import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "fs";
import { resolve } from "path";

const distDir = resolve(import.meta.dirname, "..", "dist");

// 1. Remove old src/ directory if present
const srcDir = resolve(distDir, "src");
if (existsSync(srcDir)) rmSync(srcDir, { recursive: true, force: true });

// 2. Fix popup.html — convert absolute paths to relative for Chrome extension
const htmlPath = resolve(distDir, "popup.html");
if (existsSync(htmlPath)) {
  let html = readFileSync(htmlPath, "utf-8");
  // Replace absolute paths with relative
  html = html.replace(/src="\/popup\/index\.js"/, 'src="./popup/index.js"');
  html = html.replace(/href="\/chunks\//g, 'href="./chunks/');
  html = html.replace(/href="\/style\.css"/, 'href="./style.css"');
  html = html.replace(/href="\/index\.css"/, 'href="./style.css"');
  // Remove modulepreload links (not needed in extension)
  html = html.replace(/<link rel="modulepreload"[^>]*>\n?/g, "");
  writeFileSync(htmlPath, html);
}

// 3. Create placeholder PNG icons
// Chrome MV3 requires PNG icons. We generate minimal valid PNGs.
const iconsDir = resolve(distDir, "icons");
if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

function createMinimalPNG(size) {
  // Create a minimal valid PNG with a purple background
  // Using raw PNG encoding: signature + IHDR + IDAT + IEND
  const { createCanvas } = (() => {
    try { return require("canvas"); } catch { return { createCanvas: null }; }
  })();

  if (createCanvas) {
    // If canvas module is available, use it for proper icons
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.15);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = `900 ${Math.round(size * 0.55)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("B", size / 2, size * 0.55);
    return canvas.toBuffer("image/png");
  }

  // Fallback: generate a minimal 1x1 purple PNG and note that
  // proper icons should be added before publishing
  const buf = Buffer.from(
    "89504e470d0a1a0a0000000d494844520000000100000001080200000190770" +
    "30000000c4944415408d76360076006000800002000c0a010000000049454e44ae426082",
    "hex"
  );
  return buf;
}

for (const size of [16, 32, 48, 128]) {
  const iconPath = resolve(iconsDir, `icon-${size}.png`);
  if (!existsSync(iconPath)) {
    writeFileSync(iconPath, createMinimalPNG(size));
  }
}

// 4. Clean up any SVG icons from previous builds
for (const size of [16, 32, 48, 128]) {
  const svgPath = resolve(iconsDir, `icon-${size}.svg`);
  if (existsSync(svgPath)) rmSync(svgPath);
}

console.log("Post-build cleanup complete.");
