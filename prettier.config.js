/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  semi: true,
  singleQuote: false,
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxSingleQuote: false,
};

export default config;
