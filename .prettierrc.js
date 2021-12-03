/** @type {import('prettier').Config} */
const config = {
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    overrides: [
        {
            files: ['*.{json,yml,yaml}'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
module.exports = config;
