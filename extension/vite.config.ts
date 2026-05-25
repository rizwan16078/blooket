import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        "popup/index": resolve(__dirname, "popup.html"),
        "content/content": resolve(__dirname, "src/content/content.ts"),
        "background/background": resolve(__dirname, "src/background/service-worker.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    copyPublicDir: true,
    // Force CSS inlining into JS for popup (no separate CSS file)
    cssCodeSplit: false,
  },
});
