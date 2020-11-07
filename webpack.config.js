const isProd = process.env.NODE_ENV === 'production';
const pages = require('./conf/pages');

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

const { src, build, static } = require('./conf/paths');

const entries = {};
pages.forEach((page) => (entries[page.key] = page.filePath));

/**
 * @type import('webpack').Configuration
 */
const webpackConfig = {
    mode: process.env.NODE_ENV || 'development',
    devtool: !isProd ? 'source-map' : false,
    entry: entries,
    output: {
        path: build,
        filename: 'assets/js/[name].js?[hash:7]',
    },
    devServer: {
        hot: true,
        contentBase: build,
        watchContentBase: true,
        port: 3000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: [/\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/],
                exclude: /(node_modules|dist)/,
                loader: 'eslint-loader',
            },
            {
                test: [/\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/],
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
                                        corejs: 3,
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
            {
                test: [/\.ts$/, /\.tsx$/],
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
            filename: 'assets/css/[name].css?[hash:7]',
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: static,
                    to: build,
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', '**/.keep'],
                    },
                },
                {
                    from: path.resolve(src, 'assets', 'img'),
                    to: path.resolve(build, 'assets', 'img'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', '**/.keep'],
                    },
                },
            ],
        }),
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
        // runtimeChunk: 'single',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
};

pages.forEach((page) => {
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            inject: 'head',
            scriptLoading: 'defer',
            chunks: [page.key],
            filename: page.htmlPath,
            hash: false,
            template: path.resolve(src, `pages/${page.htmlPath}`),
        })
    );
});

module.exports = webpackConfig;
