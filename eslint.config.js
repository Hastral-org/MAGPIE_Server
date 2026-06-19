const js = require("@eslint/js");
// The '/flat' suffix is required for the new ESLint engine format
const eslintConfigPrettier = require("eslint-config-prettier/flat");
const globals = require("globals");

module.exports = [
  // 1. Tell ESLint to check for standard code bugs
  js.configs.recommended,

  // 2. FORCE ESLint to turn off ALL rules that clash with Prettier style
  eslintConfigPrettier,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  {
    ignores: ["**/node_modules/**", "**/playground/**", "**/ShelderEvo/**"],
  },
];
