import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// SmartQuoteAi Pro Vite configuration
// - base: "./" ensures Electron can load dist/index.html with relative asset paths
// - outDir: "dist" keeps build output where Electron expects it
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist"
  }
});
