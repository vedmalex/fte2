module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: false,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: [
    '**/dist/**',
    '**/build/**',
    '**/node_modules/**',
    'demo/**',
    'examples/**',
    // Legacy snapshots/backup sources not linted
    'packages/fte.js-templates/src.backup.before-regeneration/**',
    'packages/fte.js-templates/src.compare/**',
    // Runtime bins and generated artifacts
    'packages/**/bin/**',
    'failed.js',
    '**/*.d.ts',
    'packages/**/dist/**',
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
