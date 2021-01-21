const path = require('path');
const { srcPath } = require('./paths');

const pages = [
    {
        key: 'index',
        filePath: path.resolve(srcPath, 'assets/scripts/index.ts'),
        htmlPath: 'index.html',
    },
    {
        key: 'about',
        filePath: path.resolve(srcPath, 'assets/scripts/about.ts'),
        htmlPath: 'about/index.html',
    },
];

module.exports = pages;
