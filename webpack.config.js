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
        filename: 'assets/js/[name].js?[hash:7]',
    },
    devServer: {
        hot: true,
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        port: 3000,
        historyApiFallback: true,
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
                    from: path.resolve(__dirname, 'src', 'static'),
                    to: path.resolve(__dirname, 'dist'),
                    toType: 'dir',
                },
                {
                    from: path.resolve(__dirname, 'src', 'assets', 'img'),
                    to: path.resolve(__dirname, 'dist', 'assets', 'img'),
                    toType: 'dir',
                },
            ],
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
            inject: 'head',
            scriptLoading: 'defer',
            chunks: [page.key],
            filename: page.htmlPath,
            hash: false,
            template: path.resolve(__dirname, `src/pages/${page.htmlPath}`),
        })
    );
});

module.exports = webpackConfig;
