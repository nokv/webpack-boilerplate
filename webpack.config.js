const isProd = process.env.NODE_ENV === 'production';
const pages = require('./conf/pages');

const path = require('path');

// plugins
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/js/[name].js',
    },
    module: {
        rules: [
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
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new WebpackBar(),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css',
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
    ],
    optimization: {
        minimize: isProd,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: false,
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
            inject: false,
            chunks: page.key,
            filename: page.htmlPath,
            template: path.resolve(__dirname, `src/pages/${page.htmlPath}`),
        })
    );
});

module.exports = webpackConfig;
