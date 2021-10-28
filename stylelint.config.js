/* eslint-disable unicorn/no-null */

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-idiomatic-order',
    'stylelint-config-prettier',
  ],
  rules: {
    'length-zero-no-unit': [true, { ignore: ['custom-properties'] }],
    'selector-class-pattern': null,
    'custom-property-pattern': null,
  },
}
