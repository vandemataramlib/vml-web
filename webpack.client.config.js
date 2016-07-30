var webpack = require("webpack");
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");

var WebpackHashPlugin = require("./WebpackHashPlugin");

var envConfig = dotenv.config();

module.exports = {
    entry: './src/client/index.tsx',

    output: {
        filename: 'bundle.[chunkhash].js',
        publicPath: 'static',
        path: 'public'
    },

    resolve: {
        extensions: ["", ".tsx", ".ts", ".js", ".jsx"]
    },

    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.EnvironmentPlugin(Object.keys(envConfig)),
    ] : [
            new webpack.EnvironmentPlugin(Object.keys(envConfig)),
            new WebpackHashPlugin()
        ],

    module: {
        loaders: [
            {
                test: /\.[jt]?sx?$/,
                exclude: /node_modules/,
                loaders: ['awesome-typescript']
            }
        ]
    }
};
