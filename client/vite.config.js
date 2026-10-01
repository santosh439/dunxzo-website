import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

// "demo" mode builds one self contained HTML file (hash routing, offline plan engine)
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "demo" ? [viteSingleFile()] : [])],
  resolve: { alias: { "@shared": path.resolve(__dirname, "../shared") } },
  server: {
    port: 5173,
    fs: { allow: [".."] },
    proxy: { "/api": "http://localhost:4000" },
  },
  build: { outDir: mode === "demo" ? "dist-demo" : "dist" },
}));
