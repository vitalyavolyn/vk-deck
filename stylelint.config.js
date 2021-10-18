module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-idiomatic-order',
    'stylelint-config-prettier',
  ],
  rules: {
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }],
  },
}
