module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: false
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  ignorePatterns: [
    'node_modules/**',
    '**/dist/**'
  ],
  rules: {
    'no-undef': 'off',
    'no-use-before-define': 'off',

    'linebreak-style': ['error', 'unix'],
    'no-multiple-empty-lines': ['error', { max: 1 }],

    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
    '@typescript-eslint/no-use-before-define': 'error',

    // TODO: remove this
    '@typescript-eslint/no-non-null-assertion': 'off',

    'import/order': 'error'
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'error',
        'no-use-before-define': 'error'
      }
    }
  ]
}
