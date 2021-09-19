module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'standard',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/**',
    '**/dist/**',
  ],
  rules: {
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',

    'no-multiple-empty-lines': ['error', { max: 1 }],
    'comma-dangle': ['error', 'always-multiline'],

    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],

    // TODO: remove this
    '@typescript-eslint/no-non-null-assertion': 'off',
    // TODO: я очень хочу, но vite ругается на протокол
    'unicorn/prefer-node-protocol': 'off',

    'import/order': 'error',

    // unicorn - душнила
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/numeric-separators-style': 'off', // gross
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-process-exit': 'off',
    'unicorn/import-style': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'error',
        'no-unused-vars': 'error',
        'no-use-before-define': 'error',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
}
