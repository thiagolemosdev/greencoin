import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";
import oxlint from "eslint-plugin-oxlint";

const LAYERS = ["core", "ui", "pattern", "layouts", "features", "routes", "mocks"];

export default tseslint.config(
  {
    ignores: ["dist/**", "src/routeTree.gen.ts", "**/*.gen.ts"],
  },
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.app.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": LAYERS.map((layer) => ({
        type: layer,
        pattern: `src/${layer}/**`,
      })),
      "boundaries/ignore": ["src/main.tsx", "src/query-client.ts", "src/routeTree.gen.ts"],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "core", allow: ["core"] },
            { from: "ui", allow: ["ui"] },
            { from: "pattern", allow: ["core", "ui", "pattern"] },
            { from: "layouts", allow: ["core", "ui", "layouts"] },
            { from: "features", allow: ["core", "ui", "pattern", "features"] },
            { from: "routes", allow: ["core", "ui", "pattern", "layouts", "features"] },
            { from: "mocks", allow: ["core", "mocks", "features"] },
          ],
        },
      ],
      "boundaries/no-unknown": "error",
    },
  },
  oxlint.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration",
          message: "Barrel exports (export * from) are not allowed.",
        },
      ],
    },
  },
);
