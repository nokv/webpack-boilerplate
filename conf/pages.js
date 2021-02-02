const path = require('path');
const { srcPath } = require('./paths');

const pages = [
    {
        key: 'index',
        filePath: path.resolve(srcPath, 'assets/scripts/pages/index.ts'),
        htmlPath: 'index.html',
    },
    {
        key: 'about',
        filePath: path.resolve(srcPath, 'assets/scripts/pages/about.ts'),
        htmlPath: 'about/index.html',
    },
];

module.exports = pages;
