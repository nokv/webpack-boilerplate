module.exports = {
    plugins: [
        require('autoprefixer')({
            grid: 'autoplace',
            cascade: false,
        }),
        require('postcss-custom-properties')({}),
    ],
};
