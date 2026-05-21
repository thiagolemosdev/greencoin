import { defineConfig } from "vitest/config";
import path from "node:path";

const alias = {
  "@": path.resolve(__dirname, "src"),
  "@core": path.resolve(__dirname, "src/core"),
  "@ui": path.resolve(__dirname, "src/ui"),
  "@pattern": path.resolve(__dirname, "src/pattern"),
  "@features": path.resolve(__dirname, "src/features"),
  "@layouts": path.resolve(__dirname, "src/layouts"),
  "@routes": path.resolve(__dirname, "src/routes"),
  "@mocks": path.resolve(__dirname, "src/mocks"),
};

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        name: "unit",
        test: {
          include: ["src/core/**/__specs__/**/*.test.ts", "src/features/**/__specs__/**/*.test.ts"],
          environment: "node",
          globals: true,
        },
        resolve: { alias },
      },
      {
        name: "browser",
        test: {
          include: ["src/ui/**/__specs__/**/*.test.tsx", "src/pattern/**/__specs__/**/*.test.tsx"],
          browser: {
            enabled: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["src/mocks/setup-specs.ts"],
          globals: true,
        },
        resolve: { alias },
      },
      {
        name: "integration",
        test: {
          include: ["src/routes/**/__specs__/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["src/mocks/setup-specs.ts"],
          globals: true,
        },
        resolve: { alias },
      },
    ],
  },
});
