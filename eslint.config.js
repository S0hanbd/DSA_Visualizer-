import js from "@eslint/js";
import globals from "globals";
import hooks from "eslint-plugin-react-hooks";

const jsxUsage = {
  meta: { type: "problem", schema: [] },
  create(context) {
    return {
      JSXIdentifier(node) {
        context.sourceCode.markVariableAsUsed(node.name, node);
      },
    };
  },
};
export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".cache/**",
      "test-results/**",
      "playwright-report/**",
      "inspiration/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": hooks,
      local: { rules: { "jsx-usage": jsxUsage } },
    },
    rules: {
      "local/jsx-usage": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
