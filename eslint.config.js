const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const prettier = require('eslint-plugin-prettier'); // Add Prettier plugin

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parser, // Use languageOptions.parser for TypeScript
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'simple-import-sort': simpleImportSort,
      prettier, // Add Prettier to plugins
    },
    rules: {
      // TypeScript and Import Sort Rules
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

     

      // Add other rules as necessary:
      // 'semi': ['error', 'always'],
    },
  },
];
