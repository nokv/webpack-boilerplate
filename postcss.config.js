/** @type {import('postcss').Postcss} */
const config = {
    plugins: [
        require('autoprefixer')({
            grid: 'autoplace',
            cascade: false,
        }),
        require('postcss-custom-properties')({}),
    ],
};
module.exports = config;
