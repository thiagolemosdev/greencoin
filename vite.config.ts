import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";
  const isBundleStats = env.ANALYZE === "true";

  return {
    plugins: [
      TanStackRouterVite({ routesDirectory: "src/routes", generatedRouteTree: "src/routeTree.gen.ts" }),
      react(),
      tailwindcss(),
      ...(isBundleStats
        ? [import("vite-bundle-visualizer").then((m) => m.default())]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@core": path.resolve(__dirname, "src/core"),
        "@ui": path.resolve(__dirname, "src/ui"),
        "@pattern": path.resolve(__dirname, "src/pattern"),
        "@features": path.resolve(__dirname, "src/features"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
        "@routes": path.resolve(__dirname, "src/routes"),
        "@mocks": path.resolve(__dirname, "src/mocks"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom"],
            "vendor-router": ["@tanstack/react-router"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-form": ["@tanstack/react-form"],
            "vendor-table": ["@tanstack/react-table", "@tanstack/react-virtual"],
            "vendor-ui": ["motion", "sonner"],
          },
        },
      },
    },
    define: {
      __DEV__: isDev,
    },
  };
});
