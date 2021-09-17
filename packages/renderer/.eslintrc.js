/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    node: false
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}

