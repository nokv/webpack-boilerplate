const isProd = process.env.NODE_ENV === 'production';

const path = require('path');

// plugins
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');

/**
 * @type import('webpack').Configuration
 */
module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: !isProd ? 'source-map' : false,
    entry: {
        index: './src/assets/scripts/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
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
        ],
    },
    plugins: [new WebpackBar()],
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
