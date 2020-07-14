const webpack = require('webpack');
const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig.json',
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [new CheckerPlugin()],
};
