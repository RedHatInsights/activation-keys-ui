/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require("eslint/config");
const fecPlugin = require("@redhat-cloud-services/eslint-config-redhat-cloud-services");

module.exports = defineConfig(
  fecPlugin,
  {
    languageOptions: {
      globals: {
        insights: "readonly",
      },
    },
    ignores: ["node_modules/*", "dist/*", "static/*"],
    rules: {
      "react/prop-types": "off",
      requireConfigFile: "off",
      "sort-imports": [
        "error",
        {
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  {
    files: ["src/**/*.js", "src/**/*.jsx"],
  },
);
