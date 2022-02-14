/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
const config = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        quotes: ['error', 'single'],
        'no-unused-vars': 'warn',
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        'import/no-unresolved': 'off',
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
module.exports = config;
