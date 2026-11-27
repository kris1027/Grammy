// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', 'ios/*', 'android/*', '.expo/*', '.claude/*', 'coverage/*'],
  },
  {
    rules: {
      // Named exports only (AGENTS.md), except route files Expo Router loads by default export.
      'import/no-default-export': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}', '*.config.js'],
    rules: { 'import/no-default-export': 'off' },
  },
]);
