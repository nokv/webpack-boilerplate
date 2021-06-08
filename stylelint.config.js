/** @type {import('@types/stylelint').Configuration} */
const config = {
    extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
    plugins: ['stylelint-scss'],
    // https://stylelint.io/user-guide/configuration
    rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'no-invalid-position-at-import-rule': null,
    },
};
module.exports = config;
