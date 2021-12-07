/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    node: false,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:css-import-order/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'off', // TODO: wtf
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',

    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function' },
    ],
    'react/no-array-index-key': 'error',
    'react/no-multi-comp': 'error',
    'react/jsx-fragments': 'error',
    'react/jsx-no-comment-textnodes': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
