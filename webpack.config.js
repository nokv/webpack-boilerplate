const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const pages = require('./config/pages');

const path = require('path');

// plugins
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Sass = require('sass');
const Fiber = require('fibers');
const StylelintPlugin = require('stylelint-webpack-plugin');

const { srcPath, buildPath, staticPath } = require('./config/paths');

const entries = {};
pages.forEach((page) => (entries[page.key] = page.filePath));

const generateHTMLPlugins = () =>
    pages
        .filter((page) => !!page.htmlPath)
        .map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: 'head',
                    scriptLoading: 'defer',
                    chunks: [page.key],
                    filename: page.htmlPath,
                    hash: false,
                    template: path.resolve(srcPath, `pages/${page.htmlPath}`),
                })
        );

/**
 * @type import('webpack').WebpackOptionsNormalized
 */
const webpackConfig = {
    mode: process.env.NODE_ENV || 'development',
    devtool: !isProd ? 'source-map' : false,
    target: isDev ? 'web' : 'browserslist',
    entry: entries,
    output: {
        path: buildPath,
        filename: 'assets/js/[name].js?[chunkhash:7]',
    },
    devServer: {
        hot: true,
        contentBase: buildPath,
        watchContentBase: true,
        port: 3000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|ts|tsx)$/,
                exclude: /(node_modules|dist)/,
                loader: 'eslint-loader',
            },
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        useBuiltIns: 'usage',
                                        corejs: '3.16',
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /(\.s[ac]ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false } },
                    { loader: 'postcss-loader' },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: Sass,
                            sassOptions: {
                                fiber: Fiber,
                            },
                        },
                    },
                ],
            },
        ],
    },
    watchOptions: {
        poll: 1000,
        ignored: /node_modules/,
    },
    plugins: [
        new WebpackBar(),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css?[chunkhash:7]',
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: staticPath,
                    to: buildPath,
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', '**/.keep'],
                    },
                },
                {
                    from: path.resolve(srcPath, 'assets', 'img'),
                    to: path.resolve(buildPath, 'assets', 'img'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', '**/.keep'],
                    },
                },
            ],
        }),
        ...generateHTMLPlugins(),
        new StylelintPlugin(),
    ],
    optimization: {
        minimize: isProd,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: {
                    filename: 'LICENSES',
                },
            }),
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendor',
                    chunks: 'initial',
                    enforce: true,
                },
            },
        },
        runtimeChunk: { name: 'vendor' },
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
};

module.exports = webpackConfig;
