const path = require('path');

module.exports = {
    srcPath: path.resolve(__dirname, '../src'), // source files
    buildPath: path.resolve(__dirname, '../dist'), // production build files
    staticPath: path.resolve(__dirname, '../src/static'), // static files to copy to build folder
};
