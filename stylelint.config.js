/** @type {import('stylelint').Config} */
const config = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-standard-scss',
        'stylelint-config-prettier',
    ],
    plugins: ['stylelint-scss'],
    // https://stylelint.io/user-guide/configuration
    rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'no-invalid-position-at-import-rule': null,
        'media-feature-name-no-vendor-prefix': null,
        'value-keyword-case': [
            'lower',
            {
                camelCaseSvgKeywords: true,
            },
        ],
    },
};
module.exports = config;
