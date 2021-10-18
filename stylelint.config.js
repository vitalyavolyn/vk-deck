module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-idiomatic-order',
  ],
  rules: {
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }],
  },
}
