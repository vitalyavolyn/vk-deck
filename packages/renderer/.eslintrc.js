/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    node: false,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/no-array-index-key': 'error',
    'react/no-multi-comp': 'error',
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-curly-newline': 'error',
    'react/jsx-equals-spacing': 'error',
    'react/jsx-curly-spacing': 'error',
    'react/jsx-fragments': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-wrap-multilines': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}

