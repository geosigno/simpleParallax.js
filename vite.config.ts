import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => {
  if (mode === "react") {
    return {
      plugins: [
        react({
          jsxRuntime: "classic",
        }),
        dts({
          include: ["src/react", "src/core", "src/shared"],
        }),
      ],
      build: {
        outDir: "dist/react",
        lib: {
          entry: path.resolve(import.meta.dirname, "src/react/index.tsx"),
          name: "SimpleParallax",
          formats: ["es", "umd"],
          fileName: (format) => `simpleParallax.${format}.js`,
        },
        rollupOptions: {
          external: ["react", "react-dom"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
            },
          },
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "src"),
        },
      },
    };
  }
  if (mode === "vanilla") {
    return {
      plugins: [
        dts({
          include: ["src/vanilla", "src/core", "src/shared"],
        }),
      ],
      build: {
        outDir: "dist/vanilla",
        lib: {
          entry: path.resolve(import.meta.dirname, "src/vanilla/index.ts"),
          name: "SimpleParallax",
          formats: ["es", "umd"],
          fileName: (format) => `simpleParallaxVanilla.${format}.js`,
        },
        rollupOptions: {
          // No external dependencies for vanilla JS plugin
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "src"),
        },
      },
    };
  }
  return {};
});
