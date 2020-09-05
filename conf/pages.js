const path = require('path');
const { src } = require('./paths');

const pages = [
    {
        key: 'index',
        filePath: path.resolve(src, 'assets/scripts/index.ts'),
        htmlPath: 'index.html',
    },
    {
        key: 'about',
        filePath: path.resolve(src, 'assets/scripts/about.ts'),
        htmlPath: 'about/index.html',
    },
];

module.exports = pages;
