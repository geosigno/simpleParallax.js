import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  pluginReactConfig,
];