import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("refractor")) {
              return "vendor-refractor";
            }
            if (
              id.includes("react-syntax-highlighter") ||
              id.includes("prismjs") ||
              id.includes("highlight.js")
            ) {
              return "vendor-syntax";
            }
            if (
              id.includes("react-markdown") ||
              id.includes("remark-gfm") ||
              id.includes("micromark") ||
              id.includes("mdast") ||
              id.includes("unist") ||
              id.includes("vfile") ||
              id.includes("bail") ||
              id.includes("is-plain-obj") ||
              id.includes("trough")
            ) {
              return "vendor-markdown";
            }
            if (id.includes("firebase")) {
              return "vendor-firebase";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            if (
              id.includes("react-redux") ||
              id.includes("@reduxjs/toolkit") ||
              id.includes("immer") ||
              id.includes("redux")
            ) {
              return "vendor-redux";
            }
            if (
              id.includes("@base-ui") ||
              id.includes("@shadcn") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "vendor-ui";
            }
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("scheduler")
            ) {
              return "vendor-react";
            }
            return "vendor-core";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
