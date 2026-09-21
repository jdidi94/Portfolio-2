import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.glb"],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@core": path.resolve(__dirname, "src/core"),
      "@experience": path.resolve(__dirname, "src/experience"),
      "@interaction": path.resolve(__dirname, "src/interaction"),
      "@scene": path.resolve(__dirname, "src/scene"),
      "@audio": path.resolve(__dirname, "src/audio"),
      "@renderer": path.resolve(__dirname, "src/renderer"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@store": path.resolve(__dirname, "src/store"),
      "@config": path.resolve(__dirname, "src/config"),
      "@data": path.resolve(__dirname, "src/data"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@shared-types": path.resolve(__dirname, "src/types"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
  build: {
    // Three.js alone is ~900KB minified — expected for a WebGL portfolio.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        /**
         * Split heavy libs only. Avoid catch-all vendor buckets —
         * they create circular chunk graphs with Three / R3F.
         */
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (
            id.includes(`${path.sep}three${path.sep}`) ||
            id.includes("/three/")
          ) {
            return "vendor-three";
          }
          if (id.includes("@react-three")) {
            return "vendor-r3f";
          }
          if (id.includes("gsap")) {
            return "vendor-gsap";
          }
          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }
          if (id.includes("howler")) {
            return "vendor-audio";
          }

          return undefined;
        },
      },
    },
  },
});
