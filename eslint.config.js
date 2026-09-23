import js from "@eslint/js";
import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.turbo/**", "**/coverage/**"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      boundaries
    },
    settings: {
      "boundaries/elements": [
        {
          type: "core",
          pattern: "packages/media-core/src/**"
        },
        {
          type: "react-wrapper",
          pattern: "packages/media-react/src/**"
        },
        {
          type: "native-wrapper",
          pattern: "packages/media-native/src/**"
        },
        {
          type: "ui-react",
          pattern: "packages/media-ui-react/src/**"
        },
        {
          type: "ui-native",
          pattern: "packages/media-ui-native/src/**"
        },
        {
          type: "app-web",
          pattern: "apps/web/src/**"
        }
      ],
      "boundaries/ignore": ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**"]
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "allow",
          checkAllOrigins: true,
          policies: [
            // media-core imports NOTHING from workspace, React, React Native, or UI
            {
              from: { element: { type: "core" } },
              disallow: [
                { to: { module: { source: ["@media/*", "react", "react-dom", "react-native", "@types/react", "@types/react-native"] } } }
              ]
            },
            // media-react imports ONLY @media/core and React
            {
              from: { element: { type: "react-wrapper" } },
              disallow: [
                { to: { module: { source: ["@media/native", "@media/ui-react", "@media/ui-native", "react-native"] } } }
              ]
            },
            // media-native imports ONLY @media/core and React/React-Native
            {
              from: { element: { type: "native-wrapper" } },
              disallow: [
                { to: { module: { source: ["@media/react", "@media/ui-react", "@media/ui-native"] } } }
              ]
            },
            // media-ui-react imports NOTHING from @media/core, @media/react, or @media/native
            {
              from: { element: { type: "ui-react" } },
              disallow: [
                { to: { module: { source: ["@media/core", "@media/react", "@media/native", "@media/ui-native", "react-native"] } } }
              ]
            },
            // media-ui-native imports NOTHING from @media/core, @media/react, or @media/native
            {
              from: { element: { type: "ui-native" } },
              disallow: [
                { to: { module: { source: ["@media/core", "@media/react", "@media/native", "@media/ui-react"] } } }
              ]
            },
            // apps/web may import ONLY from @media/react and @media/ui-react
            {
              from: { element: { type: "app-web" } },
              disallow: [
                { to: { module: { source: ["@media/core", "@media/native", "@media/ui-native"] } } }
              ]
            }
          ]
        }
      ]
    }
  }
);
