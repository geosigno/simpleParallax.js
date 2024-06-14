import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ command, mode }) => {
  if (mode === "react") {
    return {
      plugins: [
        react({
          jsxRuntime: 'classic'
        }
          
        ),
        dts({
          rollupTypes: true,
          include: "src/react",
        }),
      ],
      build: {
        outDir: "dist/react",
        lib: {
          entry: path.resolve(__dirname, "src/react/index.tsx"),
          name: "MyReactLibrary",
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
          "@": path.resolve(__dirname, "src"),
        },
      },
    };
  } else if (mode === "vanilla") {
    return {
      build: {
        outDir: "dist/vanilla",
        lib: {
          entry: path.resolve(__dirname, "src/vanilla/index.js"),
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
          "@": path.resolve(__dirname, "src"),
        },
      },
    };
  }
  return {};
});
